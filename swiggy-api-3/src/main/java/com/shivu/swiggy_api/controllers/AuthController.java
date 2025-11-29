package com.shivu.swiggy_api.controllers;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import javax.mail.MessagingException;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.shivu.swiggy_api.dto.RestaurantDTO;
import com.shivu.swiggy_api.entity.DeliveryPartner;
import com.shivu.swiggy_api.entity.Restaurant;
import com.shivu.swiggy_api.entity.User;
import com.shivu.swiggy_api.exception.DeliveryException;
import com.shivu.swiggy_api.exception.EmailException;
import com.shivu.swiggy_api.exception.RestaurantException;
import com.shivu.swiggy_api.exception.UserException;
import com.shivu.swiggy_api.request.CreateDeliveryPartnerRequest;
import com.shivu.swiggy_api.request.DeliveryPartnerSigninRequest;
import com.shivu.swiggy_api.request.OTPRequest;
import com.shivu.swiggy_api.request.OTPVerify;
import com.shivu.swiggy_api.request.RestauarantSignIn;
import com.shivu.swiggy_api.request.RestaurantSignUpRequest;
import com.shivu.swiggy_api.request.UserSignInRequest;
import com.shivu.swiggy_api.request.UserSignUpRequest;
import com.shivu.swiggy_api.services.IDeliveryPartnerService;
import com.shivu.swiggy_api.services.IRestaurantService;
import com.shivu.swiggy_api.services.IUserService;
import com.shivu.swiggy_api.utils.JwtUtil;


@RestController
@RequestMapping("/auth")
public class AuthController {

	private final IUserService userService;
	private final IRestaurantService restaurantService;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;
	private final IDeliveryPartnerService deliveryPartnerService;

	public AuthController(IUserService userService ,IRestaurantService restaurantService,PasswordEncoder passwordEncoder ,JwtUtil jwtUtil ,IDeliveryPartnerService deliveryPartnerService ) {
		this.userService = userService;
		this.restaurantService = restaurantService;
		this.passwordEncoder = passwordEncoder;
		this.jwtUtil = jwtUtil;
		this.deliveryPartnerService = deliveryPartnerService;
	}

	@PostMapping("/user/signup")
	public ResponseEntity<?> userSignUpHandler(@RequestBody UserSignUpRequest request) {

		// Checking for data
		if (request.getAddress().isEmpty() || request.getAddress() == null || request.getEmail().isEmpty()
				|| request.getEmail() == null || request.getName().isEmpty() || request.getName() == null
				|| request.getPassword().isEmpty() || request.getPassword() == null
				|| request.getPhoneNumber().isEmpty() || request.getPhoneNumber() == null) {
			throw new UserException("Invalid user Data");
		}

        //Check for email exists
		User userExists = userService.findByEmail(request.getEmail());
		if (userExists != null) {
			throw new UserException("Email Already Exists");
		}

		User user = new User();
		user.setAddress(request.getAddress());
		user.setCreatedAt(LocalDateTime.now());
		user.setEmail(request.getEmail());
		user.setName(request.getName());
		user.setPassword(request.getPassword());
		user.setPhoneNumber(request.getPhoneNumber());

		//save user
		User createdUser = userService.createUser(user);

		Map<String, Object> claims = new HashMap<>();
		claims.put("email", createdUser.getEmail());
	    claims.put("role","customer");
		
		String generatedToken = jwtUtil.generateToken(createdUser.getEmail(), claims );
		
		Map<String, String> response = new HashMap<>();
		response.put("status", "success");
		response.put("token", generatedToken);
		return ResponseEntity.ok(response);

	}
	
	
	@PostMapping("/user/signin")
	public Map<String, String> userSignInHandler(@RequestBody UserSignInRequest request)
	{
		if(request.getEmail()==null || request.getEmail().isEmpty()
		  || request.getPassword()==null || request.getPassword().isEmpty()	)
		{
			throw new UserException("Invalid Data");
		}
		
		System.out.println(request.getEmail());
		
		User findUser = userService.findByEmail(request.getEmail());
		if(findUser==null)
		{
			throw new UserException("Email Not Found");
		}
		if(!findUser.getPassword().equals(request.getPassword()))
		{
			throw new UserException("Incorrect password");
		}
		
		Map<String, Object> claims =  new HashMap<>();
		claims.put("role", "customer");
		claims.put("email", findUser.getEmail());
		
		Map<String, String> response = new HashMap<>();
		response.put("status", "success");
		response.put("token", jwtUtil.generateToken(findUser.getEmail(), claims));
		
		return response;
		
	}
	
	@PostMapping("/restaurant/singup")
	public Map<String, String> restaurantSignUp(@RequestBody RestaurantSignUpRequest request) {
		if (request.getAddress() == null || request.getEmail() == null || request.getName() == null
				|| request.getPassword() == null || request.getPhoneNumber() == null) {
			throw new RestaurantException("Invalid Input data");
		}

		Restaurant restaurantExists = restaurantService.findByEmail(request.getEmail());
		if (restaurantExists != null) {
			throw new RestaurantException("Email Already Exists");
		}

		Restaurant restaurant = new Restaurant();
		restaurant.setAddress(request.getAddress());
		restaurant.setCreatedAt(LocalDateTime.now());
		restaurant.setEmail(request.getEmail());
		restaurant.setName(request.getName());
		restaurant.setPassword(passwordEncoder.encode(request.getPassword()));
		restaurant.setPhoneNumber(request.getPhoneNumber());
		restaurant.setRating(0.0);
		restaurant.setReviewsCount(0);

		Restaurant createdRestauarnt = restaurantService.createRestaurant(restaurant);

		RestaurantDTO restaurantDTO = new RestaurantDTO();
		restaurantDTO.setAddress(createdRestauarnt.getAddress());
		restaurantDTO.setCreated_at(createdRestauarnt.getCreatedAt());
		restaurantDTO.setEmail(createdRestauarnt.getEmail());
		restaurantDTO.setMenuItems(createdRestauarnt.getMenuItems());
		restaurantDTO.setName(createdRestauarnt.getName());
		restaurantDTO.setPassword(null);
		restaurantDTO.setPhone_number(createdRestauarnt.getPhoneNumber());
		restaurantDTO.setRating(createdRestauarnt.getRating());
		restaurantDTO.setRestaurant_id(createdRestauarnt.getRestaurantId());
		restaurantDTO.setReviews_count(createdRestauarnt.getReviewsCount());

		Map<String, Object> claims =  new HashMap<>();
		claims.put("role", "restaurant");
		claims.put("email", createdRestauarnt.getEmail());
		
		
		
		Map<String, String> response = new HashMap<>();
		response.put("success", "true");
		response.put("token", jwtUtil.generateToken(createdRestauarnt.getEmail(),claims));
		return response;

	}
	
	
	@PostMapping("/restaurant/singin")
	public Map<String, String> restaurantSignIn(@RequestBody RestauarantSignIn request) {
		if (request.getEmail() == null || request.getEmail().isEmpty() || request.getPassword() == null
				|| request.getPassword().isEmpty()) {
			throw new UserException("Invalid Data");
		}
		Restaurant findRestaurant = restaurantService.findByEmail(request.getEmail());
		if(findRestaurant==null)
		{
			throw new RestaurantException("Email Not Found");
		}
		if(!passwordEncoder.matches(request.getPassword(), findRestaurant.getPassword()))
		{
			throw new RestaurantException("Incorrect password");
		}
		RestaurantDTO restaurantDTO = new RestaurantDTO();
		restaurantDTO.setAddress(findRestaurant.getAddress());
		restaurantDTO.setCreated_at(findRestaurant.getCreatedAt());
		restaurantDTO.setEmail(findRestaurant.getEmail());
		restaurantDTO.setMenuItems(findRestaurant.getMenuItems());
		restaurantDTO.setName(findRestaurant.getName());
		restaurantDTO.setPassword(null);
		restaurantDTO.setPhone_number(findRestaurant.getPhoneNumber());
		restaurantDTO.setRating(findRestaurant.getRating());
		restaurantDTO.setRestaurant_id(findRestaurant.getRestaurantId());
		restaurantDTO.setReviews_count(findRestaurant.getReviewsCount());
		Map<String, Object> claims =  new HashMap<>();
		claims.put("role", "restaurant");
		claims.put("email", findRestaurant.getEmail());
		Map<String, String> response = new HashMap<>();
		response.put("success", "true");
		response.put("token", jwtUtil.generateToken(findRestaurant.getEmail(),claims));
		return response;
	}
	
	@PostMapping("/delivery/signup")
	public ResponseEntity<?> createDeliveryPartner(@RequestBody CreateDeliveryPartnerRequest request)
	{
	  	if(request.getEmail() ==null || request.getName() ==null || request.getPassword() ==null || request.getPhoneNumber()==null ||
	  			request.getVehicleNumber() ==null)
	  	{
	  		throw new DeliveryException("Invalid input data");
	  	} 	
	  	if(deliveryPartnerService.getByEmail(request.getEmail())!=null)
	  	{
	  		throw new DeliveryException("Email Already exists");
	  	}

	  	DeliveryPartner deliveryPartner = new DeliveryPartner();
	  	deliveryPartner.setCreatedAt(LocalDateTime.now());
	  	deliveryPartner.setEmail(request.getEmail());
	  	deliveryPartner.setName(request.getName());
	  	deliveryPartner.setPassword(passwordEncoder.encode(request.getPassword()));
	  	deliveryPartner.setPhoneNumber(request.getPhoneNumber());
	  	deliveryPartner.setVehicleDetails(request.getVehicleNumber());
	  	
	  	deliveryPartner =  deliveryPartnerService.create(deliveryPartner);
	  	
	  	Map<String, Object> claims =  new HashMap<>();
		claims.put("role", "delivery");
		claims.put("email", deliveryPartner.getEmail());
	  	
	  	Map<String, Object> response  = new HashMap<>();
	  	
	  	response.put("status", "success");
	  	response.put("token",jwtUtil.generateToken(deliveryPartner.getEmail(), claims));
	  	response.put("userDetails", deliveryPartner);
	  	
	  	return ResponseEntity.ok(response);
	
	}
	
	
	@PostMapping("/delivery/signin")
	public ResponseEntity<?> deliveryPartnerSignIn(@RequestBody DeliveryPartnerSigninRequest request)
	{
	  	if(request.getEmail() ==null || request.getPassword() ==null)
	  	{
	  		throw new DeliveryException("Invalid input data");
	  	}
	  	
	  	
	  	DeliveryPartner findDeliveryPartner = deliveryPartnerService.getByEmail(request.getEmail());
	  	
	  	if(findDeliveryPartner == null)
	  	{
	  		throw new DeliveryException("Email not exists");
	  	}
	  	
	  	Map<String, Object> claims =  new HashMap<>();
		claims.put("role", "delivery");
		claims.put("email", findDeliveryPartner.getEmail());
	  	Map<String, Object> response  = new HashMap<>();
	  	response.put("status", "success");
	  	response.put("token",jwtUtil.generateToken(findDeliveryPartner.getEmail(), claims));
	  	response.put("userDetails", findDeliveryPartner);
	  	return ResponseEntity.ok(response);
	
	}
	
	
}
