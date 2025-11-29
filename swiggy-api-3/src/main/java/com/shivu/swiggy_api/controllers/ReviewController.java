package com.shivu.swiggy_api.controllers;

import java.text.DecimalFormat;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shivu.swiggy_api.entity.MenuItem;
import com.shivu.swiggy_api.entity.Order;
import com.shivu.swiggy_api.entity.Restaurant;
import com.shivu.swiggy_api.entity.Review;
import com.shivu.swiggy_api.entity.User;
import com.shivu.swiggy_api.exception.CustomAuthenticationException;
import com.shivu.swiggy_api.exception.ReviewException;
import com.shivu.swiggy_api.request.AddReviewRequest;
import com.shivu.swiggy_api.services.CustomerDetails;
import com.shivu.swiggy_api.services.IMenuItemService;
import com.shivu.swiggy_api.services.IOrderService;
import com.shivu.swiggy_api.services.IRestaurantService;
import com.shivu.swiggy_api.services.IReviewService;
import com.shivu.swiggy_api.services.IUserService;
import com.shivu.swiggy_api.services.PaginationService;
import com.shivu.swiggy_api.services.RestaurantDetails;

@RestController
@RequestMapping("/api/review")
public class ReviewController {

	@Autowired
	private IReviewService reviewService;

	@Autowired
	private IMenuItemService menuItemService;

	@Autowired
	private IOrderService orderService;

	@Autowired
	private IRestaurantService restaurantService;
	
	@Autowired
	private IUserService userService;

	@PostMapping("/")
	@PreAuthorize("hasRole('CUSTOMER')")
	public ResponseEntity<?> addReview(@AuthenticationPrincipal CustomerDetails customerDetails ,@RequestBody AddReviewRequest request) {
		
		if(customerDetails ==null)
		{
			throw new CustomAuthenticationException("Unauthenticated");
		}
		
		User user = userService.findById(request.getUserId());
		
		if(user ==null)
		{
			throw new ReviewException("User Not Found");
		}

		Order order = orderService.getOrderById(request.getOrderId());
		
		if (order.getReviewed() == 1) {
			throw new ReviewException("Order Already reviewed");
		}
		
		DecimalFormat decimalFormat = new DecimalFormat("#.#");
		Map<String, String> response = new HashMap<>();

		Review review = new Review();
		review.setComment(request.getComment());
		review.setCreatedAt(LocalDateTime.now());
		review.setRating(request.getRating());

		MenuItem menuItem = menuItemService.findById(request.getItemId());
		Integer prevReviewCount = menuItem.getReviewsCount();
		Double prevRating = menuItem.getRating();
		Double newRating = (prevRating * prevReviewCount) / (prevReviewCount + 1);
		menuItem.setRating(Double.valueOf(decimalFormat.format(newRating)));
		menuItem.setReviewsCount(prevReviewCount + 1);
		menuItem = menuItemService.update(menuItem);
		review.setMenuItem(menuItem);

		Restaurant restaurant = restaurantService.findById(menuItem.getRestaurant().getRestaurantId());
		prevReviewCount = restaurant.getReviewsCount();
		prevRating = restaurant.getRating();
		newRating = (prevRating * prevReviewCount) / (prevReviewCount + 1);

		restaurant.setRating(Double.valueOf(decimalFormat.format(newRating)));
		restaurant.setReviewsCount(prevReviewCount + 1);

		restaurant = restaurantService.upadetRestaurant(restaurant);
		review.setRestaurant(restaurant);
		review.setUser(user);

		order.setReviewed(1);
		orderService.updateOrder(order);

		reviewService.add(review);

		response.put("status", "success");
		response.put("message", "Order Reviewed Successfully");

		return ResponseEntity.ok(response);

	}

	@GetMapping("/menuItem")
	public ResponseEntity<?> getAllReviewsByItemId(@RequestParam Integer id , @RequestParam Integer page , @RequestParam Integer limit)
	{
		
		try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		page = page - 1;
		Pageable pageable = PageRequest.of(page, limit,Sort.by("reviewId").descending());
		Map<String, Object> response =  new HashMap<>();
		response.put("status", "success");
		response.put("data", reviewService.getAllReviewsByItemId(id, pageable));
		return ResponseEntity.ok(response);		
	}

	@GetMapping("/restaurant")
	@PreAuthorize("hasRole('RESTAURANT')")
	public ResponseEntity<?> getAllReviewsOfRestaurant(
			@AuthenticationPrincipal RestaurantDetails restaurantDetails ,
			@RequestParam Integer restaurantId,
			@RequestParam(required = false , defaultValue="1" )Integer page,
			@RequestParam(required = false , defaultValue="10") Integer limit)
	{
		
		if(restaurantDetails ==null)
		{
			throw new CustomAuthenticationException("Unauthenticated");
		}
		
		Restaurant restaurant = restaurantService.findById(restaurantId);
		
		if(restaurant ==null)
		{
			throw new ReviewException("Restaurant Not Found");
		}
		
		
		page = page -1;
		
		Pageable pageable = PageRequest.of(page, limit, Sort.by("reviewId").descending());
		
		Page<Review> reviews = reviewService.getAllReviewsByRestaurantId(restaurantId, pageable);
		
		
		Map<String, Object> response = PaginationService.getPageData(reviews);
		
	   List<Map<String,Object>> reviewList =	reviews.stream().map((review)->{
			Map<String, Object> reviewMap =  new HashMap<>();
			reviewMap.put("review",review);
			reviewMap.put("reviewedBy", review.getUser());
			reviewMap.put("restaurant",review.getRestaurant());
			reviewMap.put("menuItem", review.getMenuItem());
			return reviewMap;
		}).collect(Collectors.toList());
	   
	   response.put("reviews", reviewList);
	   
	   return ResponseEntity.ok(response);
	
		
	}

}
