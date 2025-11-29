package com.shivu.swiggy_api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.shivu.swiggy_api.entity.Restaurant;


public interface RestaurantRepository extends JpaRepository<Restaurant, Integer> {
	
	public static String TopFiveRestaurant ="/restaurant/top";
	
	
	
	public Optional<Restaurant>  findByEmail(String email);
	
	@Query("SELECT r FROM Restaurant r ORDER BY r.rating desc LIMIT 5")
	public List<Restaurant> topFiveRestaurant();

}
