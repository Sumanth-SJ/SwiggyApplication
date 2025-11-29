package com.shivu.swiggy_api.dto;

import java.time.LocalDateTime;
import java.util.List;


import com.shivu.swiggy_api.entity.MenuItem;


import lombok.Data;

@Data
public class RestaurantDTO 
{
	private int restaurant_id;
	
	private String name;
	
	private String address;
	
	private String phone_number;
	
	private String password;
	
	private String email;
	
	private Double rating;
	
	private Integer reviews_count;
	
	private LocalDateTime created_at;
	
	private List<MenuItem> menuItems;
}
