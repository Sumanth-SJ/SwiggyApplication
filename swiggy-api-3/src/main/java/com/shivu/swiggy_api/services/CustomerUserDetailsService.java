package com.shivu.swiggy_api.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shivu.swiggy_api.entity.DeliveryPartner;
import com.shivu.swiggy_api.entity.Restaurant;
import com.shivu.swiggy_api.entity.User;
import com.shivu.swiggy_api.repository.UserRepository;


@Service
public class CustomerUserDetailsService implements UserDetailsService{

	@Autowired
	private UserRepository userRepository;
	
	
	@Autowired
	private IRestaurantService restaurantService;
	
	@Autowired
	private IDeliveryPartnerService deliveryPartnerService;
	
	
	@Override 
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		return null;
	}
	
	@Transactional
	public RestaurantDetails loadRestaurantUser(String email) throws UsernameNotFoundException{
		
		Restaurant restaurant = restaurantService.findByEmail(email);
		if(restaurant ==null)
		{
			throw new UsernameNotFoundException("User Not Found");
		}
		return new RestaurantDetails(restaurant);
		
	}
	
	
	@Transactional
	public CustomerDetails loadCustomer(String email) {
		
		User user = userRepository.findByEmail(email).orElse(null);
		if(user == null)
		{
			throw new UsernameNotFoundException("User Not Found");
		}
		return new  CustomerDetails(user);
		
		
	}
	
	@Transactional
	public DeliveryDetails loadDeliveryPartner(String email)
	{
		DeliveryPartner deliveryPartner = deliveryPartnerService.getByEmail(email);

		if(deliveryPartner ==null)
		{
			throw new UsernameNotFoundException("User Not Found");
		}
		
		return new DeliveryDetails(deliveryPartner);
	}

}
