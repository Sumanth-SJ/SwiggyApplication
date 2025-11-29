package com.shivu.swiggy_api.controllers;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.mail.MessagingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shivu.swiggy_api.entity.Deliveries;
import com.shivu.swiggy_api.entity.DeliveryPartner;
import com.shivu.swiggy_api.entity.MenuItem;
import com.shivu.swiggy_api.entity.Order;
import com.shivu.swiggy_api.entity.OrderItem;
import com.shivu.swiggy_api.entity.Restaurant;
import com.shivu.swiggy_api.entity.User;
import com.shivu.swiggy_api.exception.CustomAuthenticationException;
import com.shivu.swiggy_api.exception.DeliveryException;
import com.shivu.swiggy_api.exception.OrderException;
import com.shivu.swiggy_api.exception.UserException;
import com.shivu.swiggy_api.request.OrderStatusUpdateRequest;
import com.shivu.swiggy_api.request.PickOrderRequest;
import com.shivu.swiggy_api.request.PlaceOrderRequest;
import com.shivu.swiggy_api.services.CustomerDetails;
import com.shivu.swiggy_api.services.DeliveryDetails;
import com.shivu.swiggy_api.services.ICartService;
import com.shivu.swiggy_api.services.IDeliveriesServices;
import com.shivu.swiggy_api.services.IDeliveryPartnerService;
import com.shivu.swiggy_api.services.IMenuItemService;
import com.shivu.swiggy_api.services.IOrderItemService;
import com.shivu.swiggy_api.services.IOrderService;
import com.shivu.swiggy_api.services.IRestaurantService;
import com.shivu.swiggy_api.services.IUserService;
import com.shivu.swiggy_api.services.PaginationService;
import com.shivu.swiggy_api.services.RestaurantDetails;
import com.shivu.swiggy_api.utils.RandomGenerator;

@RestController
@RequestMapping("/api/order")
public class OrderController {

	@Autowired
	private IOrderService orderService;

	@Autowired
	private IMenuItemService menuItemService;

	@Autowired
	private IRestaurantService restaurantService;

	@Autowired
	private IOrderItemService orderItemService;

	@Autowired
	private ICartService cartService;
	
	@Autowired
	private IDeliveryPartnerService deliveryPartnerService;
	
	@Autowired
	private IDeliveriesServices deliveriesServices;
	

	@Autowired
	private IUserService userService;

	@PostMapping("/")
	@Transactional
	@PreAuthorize("hasRole('CUSTOMER')")
	public ResponseEntity<?> createOrder(@AuthenticationPrincipal CustomerDetails customerDetails ,@RequestBody PlaceOrderRequest request) {
		if(customerDetails==null)
		{
			throw new UsernameNotFoundException("Unauthorized");
		}

		User user = userService.findById(request.getUserId());
		
		if(user ==null)
		{
			throw new UserException("User Not Found");
		}

		request.getItems().stream().forEach(o -> {

			MenuItem menuItem = menuItemService.findById(o.getItemId());

			Restaurant restaurant = restaurantService.findById(menuItem.getRestaurant().getRestaurantId());
			Order order = new Order();
			order.setCreatedAt(LocalDateTime.now());
			order.setDeliveryAddress(request.getDeliveryAddress());
			order.setPayMode(request.getMode());
			order.setRazorpayId(request.getRazorPayId());
			order.setRestaurant(restaurant);
			order.setReviewed(0);
			order.setStatus("Pending");
			order.setTotalAmount(menuItem.getDiscount() > 0
					? (menuItem.getPrice() - (menuItem.getPrice() * (menuItem.getDiscount() / 100)))
					: menuItem.getPrice());
			order.setUser(user);
			order = orderService.createOrder(order);

			OrderItem orderItem = new OrderItem();
			orderItem.setMenuItem(menuItem);
			orderItem.setOrder(order);
			orderItem.setPrice(menuItem.getDiscount() > 0
					? (menuItem.getPrice() - (menuItem.getPrice() * (menuItem.getDiscount() / 100)))
					: menuItem.getPrice());
			orderItem.setQuantity(o.getQuantity());
			orderItem = orderItemService.add(orderItem);

		});

		if (request.getSource().equals("cart")) {
			System.out.println("Cart here");
			cartService.deleteCartItemsByUserId(user.getUserId());
		}

		Map<String, String> response = new HashMap<>();
		response.put("status", "success");
		response.put("message", "Order Placed success");
		return ResponseEntity.ok(response);

	}

	@GetMapping("/user")
	@PreAuthorize("hasRole('CUSTOMER')")
	public ResponseEntity<?> getAllOrdersByUser(
			@AuthenticationPrincipal CustomerDetails customerDetails ,
			@RequestParam( defaultValue = "1", required = false) Integer page,
			@RequestParam( defaultValue = "10", required = false) Integer limit,
			@RequestParam Integer userId) {
		if(customerDetails==null)
		{
			throw new UsernameNotFoundException("Unauthorized");
		}

		User user = userService.findById(userId);
		
		if(user ==null)
		{
			throw new UserException("User Not Found");
		}

		page = page - 1;
		Pageable pageable = PageRequest.of(page, limit, Sort.by("orderId").descending());

		Page<Order> orders = orderService.getAllOrdersByUserId(user.getUserId(), pageable);

		Map<String, Object> response = new HashMap<>();
		response.put("status", "success");

		List<Map<String, Object>> orderList = getOrderAllInfo(orders);

		response.put("orders", orderList);

		Map<String, Object> paginationMap = new HashMap<>();
		paginationMap.put("totalElements", orders.getTotalElements());
		paginationMap.put("hasNext", orders.hasNext());
		paginationMap.put("hasPrevious", orders.hasPrevious());
		paginationMap.put("isLast", orders.isLast());
		paginationMap.put("totalPages", orders.getTotalPages());

		response.put("pagination", paginationMap);

		return ResponseEntity.ok(response);

	}
	
	@GetMapping("/not-delivered")
	public ResponseEntity<?> getAllUndeliveredOrders(
			@RequestParam( defaultValue = "1", required = false) Integer page,
			@RequestParam( defaultValue = "10", required = false) Integer limit ,
			@RequestParam(required = false) String q)
	{
		
		Map<String, Object> response =  new HashMap<>();
		
		page = page-1;
		
		
		Pageable pageable = PageRequest.of(page, limit , Sort.by("orderId").descending());
		
		Page<Order> orders = orderService.getAllUndevlieredOrders(q,pageable);
		
		List<Map<String, Object>> orderList = getOrderAllInfo(orders);
		
		
		
		response.put("orders", orderList);
		response.put("pagination", PaginationService.getPageData(orders));
		
		return ResponseEntity.ok(response);
	}

	@GetMapping("/")
	public ResponseEntity<?> getOrderByOrderId(@RequestParam Integer orderId) {
		Map<String, Object> response = new HashMap<>();
		Order order = orderService.getOrderById(orderId);

		response.put("orderDetails", order);
		if (order.getUser() != null) {
			order.getUser().setPassword(null);
			response.put("OrderBy", order.getUser());
		}

		if (order.getRestaurant() != null) {
			order.getRestaurant().setPassword(null);
			response.put("restaurant", order.getRestaurant());
		}
		if (order.getOrderItems().size() > 0) {

			List<Map<String, Object>> orderItemMap = order.getOrderItems().stream().map(orderItem -> {
				Map<String, Object> orderItemAndMenuItemMap = new HashMap<>();
				orderItemAndMenuItemMap.put("orderItemDetails", orderItem);
				orderItemAndMenuItemMap.put("menuItem", orderItem.getMenuItem());
				return orderItemAndMenuItemMap;
			}).collect(Collectors.toList());

			response.put("orderItems", orderItemMap);

		}

		return ResponseEntity.ok(response);
	}

	@GetMapping("/restaurant")
	@PreAuthorize("hasRole('RESTAURANT')")
	public ResponseEntity<?> getOrdersByRestaurant(@AuthenticationPrincipal RestaurantDetails restaurantDetails,
			@RequestParam(required = false, defaultValue = "1") Integer page,
			@RequestParam(required = false, defaultValue = "10") Integer limit,
			@RequestParam(required = false, defaultValue = "pending") String statusFilter,
			@RequestParam Integer restaurantId) {
		
		if(restaurantDetails ==null)
		{
			throw new CustomAuthenticationException("Unauthorized");
		}
		
	
		page = page  -1;
		Restaurant restaurant = restaurantService.findById(restaurantId);
		
		if(restaurant ==null)
		{
			throw new OrderException("Restauarnt Not Found");
		}
		
		Pageable pageable = PageRequest.of(page, limit, Sort.by("orderId").descending());
		Page<Order> orderPage = orderService.getAllOrdersByRestaurant(restaurantId, statusFilter, pageable);
		Map<String, Object> response =  new HashMap<>();
		response.put("status", "success");
		response.put("totalPages", orderPage.getTotalPages());
		response.put("totalElements", orderPage.getTotalElements());
		response.put("currentPage", orderPage.getNumber());
		response.put("pageSize", orderPage.getSize());
		response.put("hasNext", orderPage.hasNext());
		response.put("hasPrevious", orderPage.hasPrevious());
		
		List<Map<String,Object>> ordersList = getOrderAllInfo(orderPage);
		
		response.put("orders", ordersList);
		
		return ResponseEntity.ok(response);
	}

	@PutMapping("/status")
	@PreAuthorize("hasRole('RESTAURANT')")
	public  ResponseEntity<?> updateOrderStatus(@AuthenticationPrincipal RestaurantDetails restaurantDetails,@RequestBody OrderStatusUpdateRequest  request)
	{
		if(restaurantDetails ==null)
		{
			throw new CustomAuthenticationException("Unauthorized");
		}
		
		Order findOrder = orderService.getOrderById(request.getOrderId());
		if(findOrder ==null)
		{
			throw new OrderException("Order not found");
		}
		findOrder.setStatus(request.getStatus());
		findOrder = orderService.updateOrder(findOrder);
		Map<String, Object> response = new HashMap<>();
		response.put("status", "success");
		response.put("message", "Order Stauts updated");
		return ResponseEntity.ok(response);	
	}
	
	@PostMapping("/pick")
	@PreAuthorize("hasRole('DELIVERY')")
	public ResponseEntity<?> pickOrder(@AuthenticationPrincipal DeliveryDetails deliveryDetails, @RequestBody PickOrderRequest request){
		
		if(deliveryDetails==null)
		{
			throw new DeliveryException("Unauthenticated");
		}
       
		Order findOrder = orderService.getOrderById(request.getOrderId());
		if(findOrder ==null)
		{
			throw new DeliveryException("Order Not Found");
		}
		
		Map<String, Object> response =  new HashMap<>();
		
		DeliveryPartner deliveryPartner = deliveryPartnerService.getByd(request.getDeliveryPartnerId());
		
		if(deliveryPartner ==null)
		{
			throw new DeliveryException("Order Not Found");
		}
		
		findOrder.setStatus("out of delivery");
		findOrder.setPickedBy(deliveryPartner);
		orderService.updateOrder(findOrder);
		
		Deliveries deliveries = new Deliveries();
		deliveries.setDeliveryStatus("out of delivery");
		deliveries.setAssignedAt(LocalDateTime.now());
		deliveries.setDeliver_code(RandomGenerator.generateCharacterString(6));
		
		User user = userService.findById(findOrder.getUser().getUserId());
		
		
		deliveries.setDeliveryPartner(deliveryPartner);
		deliveries.setOrder(findOrder);
		
		deliveriesServices.create(deliveries);
	
		
		response.put("status", "success");
		response.put("message","Order Picked Successfully");
		
		return ResponseEntity.ok(response);
	}
	
	
	private List<Map<String, Object>> getOrderAllInfo (Page<Order> orders)
	{
		List<Map<String, Object>> orderList = orders.stream().map(order -> {
			Map<String, Object> orderMap = new HashMap<>();

			orderMap.put("orderId", order.getOrderId());
			orderMap.put("deliveryAddress", order.getDeliveryAddress());
			orderMap.put("totalAmount", order.getTotalAmount());
			orderMap.put("status", order.getStatus());
			orderMap.put("reviewed", order.getReviewed());
			orderMap.put("orderDate", order.getCreatedAt());
			orderMap.put("payMode", order.getPayMode());

			if (order.getUser() != null) {
				order.getUser().setPassword(null);
				order.getUser().setCreatedAt(null);
				order.getUser().setEmail(null);
				orderMap.put("OrderedBy", order.getUser());
			}

			if (order.getRestaurant() != null) {
				order.getRestaurant().setPassword(null);
				orderMap.put("Restauarnt", order.getRestaurant());
			}

			if (order.getOrderItems() != null) {
				List<Map<String, Object>> orderItemList = order.getOrderItems().stream().map(orderItem -> {

					Map<String, Object> orderItemMap = new HashMap<>();

					orderItemMap.put("orderDetails", orderItem);
					orderItemMap.put("MenuItem", orderItem.getMenuItem());
					return orderItemMap;

				}).collect(Collectors.toList());

				orderMap.put("orderItem", orderItemList);

			}

			return orderMap;

		}).collect(Collectors.toList());
		
		return orderList;
	}

}





