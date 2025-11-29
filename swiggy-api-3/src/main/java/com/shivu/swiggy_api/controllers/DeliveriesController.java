package com.shivu.swiggy_api.controllers;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shivu.swiggy_api.entity.Deliveries;
import com.shivu.swiggy_api.entity.DeliveryPartner;
import com.shivu.swiggy_api.entity.Order;
import com.shivu.swiggy_api.exception.DeliveryException;
import com.shivu.swiggy_api.request.DeliveryStatusAndCodeVerifyRequest;
import com.shivu.swiggy_api.services.IDeliveriesServices;
import com.shivu.swiggy_api.services.IOrderService;
import com.shivu.swiggy_api.services.PaginationService;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveriesController {
	
	@Autowired
	private IDeliveriesServices deliveriesServices;
	
	@Autowired
	private IOrderService orderService;

	@GetMapping("/")
	public ResponseEntity<?> getDeliveries(
			@RequestParam( required = false , defaultValue = "") String status,
			@RequestParam Integer deliveryPartnerId , 
			@RequestParam(required = false ,defaultValue = "1") Integer page,
			@RequestParam(required = false , defaultValue = "10") Integer limit ){
		
		Map<String, Object> response =   new HashMap<>();
		
		page= page-1;
		
		Pageable pageable =  PageRequest.of(page, limit, Sort.by("deliveryId").descending());
		
		Page<Deliveries> deliveries = deliveriesServices.getDeliveriesByDeliveryPartnerId(deliveryPartnerId, status, pageable);
		
		response.put("pagination", PaginationService.getPageData(deliveries));
		response.put("deliveries", getDeliveriesInfo(deliveries));
		
		
		return ResponseEntity.ok(response);
		 
	}
	
	@PutMapping("/order/verify/status")
	public ResponseEntity<?> checkForDeliveryCodeAndMarkAsDelivered(@RequestBody DeliveryStatusAndCodeVerifyRequest request)
	{
		
		Deliveries delivery = deliveriesServices.getById(request.getDeliveryId());
		
		if(!delivery.getDeliver_code().equals(request.getDeliveryCode()))
		{
			throw new DeliveryException("Invalid Delivery Code");
		}
		
		Order order = delivery.getOrder();
		order.setStatus("delivered");
		
		orderService.updateOrder(order);
		delivery.setDeliveryStatus("delivered");
		delivery.setDeliveredAt(LocalDateTime.now());
		deliveriesServices.update(delivery);
		
		Map<String, Object> response =  new HashMap<>();
		response.put("stauts", "success");
		response.put("message", "Order Delivered Successfully");
		return ResponseEntity.ok(response);
		
	}
	
    
	
	private List<Map<String, Object>> getDeliveriesInfo(Page<Deliveries> deliveriesPage)
	{
		List<Map<String , Object>> deliveryList = deliveriesPage.stream().map((delivery)->{
			Map<String,Object> deliveryMap = new HashMap<>();
			deliveryMap.put("deliveryId", delivery.getDeliveryId());
			deliveryMap.put("deliveryStatus", delivery.getDeliveryStatus());
			deliveryMap.put("assignedAt", delivery.getAssignedAt());
			deliveryMap.put("deliveryCode", delivery.getDeliver_code());
			
            //Delivery Partner info
			
			Map<String, Object> deliveryPartnerInfo =  new HashMap<>();
			DeliveryPartner deliveryPartner =  delivery.getDeliveryPartner();
 			
			deliveryPartnerInfo.put("Name", deliveryPartner.getName());
			deliveryPartnerInfo.put("phoneNumber", deliveryPartner.getPhoneNumber());
			deliveryPartnerInfo.put("vehicleNumber", deliveryPartner.getVehicleDetails());
			
			deliveryMap.put("deliveryPartner", deliveryPartnerInfo);
			
			//Order Info
			
			Order order = delivery.getOrder();
			
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
			
			deliveryMap.put("order", orderMap);
			
			return deliveryMap;
		}).collect(Collectors.toList());
		
		return deliveryList;
	}
	
//	private List<Map<String, Object>> getDeliveriesInfo(Page<Deliveries> deliveriesPage) {
//	    return deliveriesPage.getContent().stream().map(delivery -> {
//	        Map<String, Object> deliveryMap = new HashMap<>();
//	        deliveryMap.put("deliveryId", delivery.getDeliveryId());
//	        deliveryMap.put("deliveryStatus", delivery.getDeliveryStatus());
//	        deliveryMap.put("assignedAt", delivery.getAssignedAt());
//	        deliveryMap.put("deliveryCode", delivery.getDeliver_code());
//
//	        // Delivery Partner info
//	        DeliveryPartner deliveryPartner = delivery.getDeliveryPartner();
//	        Map<String, Object> deliveryPartnerInfo = Optional.ofNullable(deliveryPartner)
//	            .map(dp -> {
//	                Map<String, Object> dpMap = new HashMap<>();
//	                dpMap.put("Name", dp.getName());
//	                dpMap.put("phoneNumber", dp.getPhoneNumber());
//	                dpMap.put("vehicleNumber", dp.getVehicleDetails());
//	                return dpMap;
//	            }).orElse(new HashMap<>());
//	        
//	        deliveryMap.put("deliveryPartner", deliveryPartnerInfo);
//
//	        // Order Info
//	        Order order = delivery.getOrder();
//	        Map<String, Object> orderMap = Optional.ofNullable(order)
//	            .map(o -> {
//	                Map<String, Object> oMap = new HashMap<>();
//	                oMap.put("orderId", o.getOrderId());
//	                oMap.put("deliveryAddress", o.getDeliveryAddress());
//	                oMap.put("totalAmount", o.getTotalAmount());
//	                oMap.put("status", o.getStatus());
//	                oMap.put("reviewed", o.getReviewed());
//	                oMap.put("orderDate", o.getCreatedAt());
//	                oMap.put("payMode", o.getPayMode());
//
//	                // OrderedBy (User info)
//	                Optional.ofNullable(o.getUser()).ifPresent(user -> {
//	                    Map<String, Object> userInfo = new HashMap<>();
//	                    userInfo.put("id", user.getId());
//	                    userInfo.put("name", user.getName());
//	                    oMap.put("OrderedBy", userInfo);
//	                });
//
//	                // Restaurant Info
//	                Optional.ofNullable(o.getRestaurant()).ifPresent(restaurant -> {
//	                    Map<String, Object> restaurantInfo = new HashMap<>();
//	                    restaurantInfo.put("id", restaurant.getId());
//	                    restaurantInfo.put("name", restaurant.getName());
//	                    oMap.put("Restaurant", restaurantInfo);
//	                });
//
//	                // Order Items
//	                List<Map<String, Object>> orderItemsList = Optional.ofNullable(o.getOrderItems())
//	                    .map(orderItems -> orderItems.stream().map(orderItem -> {
//	                        Map<String, Object> orderItemMap = new HashMap<>();
//	                        orderItemMap.put("orderDetails", orderItem);
//	                        orderItemMap.put("MenuItem", orderItem.getMenuItem());
//	                        return orderItemMap;
//	                    }).collect(Collectors.toList())).orElse(Collections.emptyList());
//
//	                oMap.put("orderItem", orderItemsList);
//	                return oMap;
//	            }).orElse(new HashMap<>());
//
//	        deliveryMap.put("order", orderMap);
//	        return deliveryMap;
//	    }).collect(Collectors.toList());
//	}

	
	
	
	
}

