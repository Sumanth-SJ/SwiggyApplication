package com.shivu.swiggy_api.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shivu.swiggy_api.entity.Restaurant;
import com.shivu.swiggy_api.repository.RestaurantRepository;

@Service
public class RestaurantServiceImpl implements IRestaurantService
{
	@Autowired
    private RestaurantRepository restaurantRepository;

	@Override
	public Restaurant createRestaurant(Restaurant restaurant) {
	   return restaurantRepository.save(restaurant);
	
	}

	@Override
	public Restaurant upadetRestaurant(Restaurant restaurant) {
		  return restaurantRepository.save(restaurant);
	}

	@Override
	public Restaurant findById(Integer restaurantId) {
		
		Optional<Restaurant>  restauraantOptional = restaurantRepository.findById(restaurantId);
		if(restauraantOptional.isEmpty())
		{
			return null;
		}
		return restauraantOptional.get();
		
	}

	
	@Override
	public Restaurant findByEmail(String email) {
		
		Optional<Restaurant>  restauraantOptional = restaurantRepository.findByEmail(email);
		if(restauraantOptional.isEmpty())
		{
			return null;
		}
		return restauraantOptional.get();
		
	}

	@Override
	public List<Restaurant> findAll() {
		return restaurantRepository.findAll();
	}
	
	@Override
	public List<Restaurant> getTopFiveRestaurants() {
		return restaurantRepository.topFiveRestaurant();
	}
	

	
	
	
}
