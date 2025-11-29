package com.shivu.swiggy_api.dto;

import java.time.LocalDateTime;
import com.shivu.swiggy_api.entity.MenuItem;
import com.shivu.swiggy_api.entity.Restaurant;
import com.shivu.swiggy_api.entity.User;
import lombok.Data;

@Data
public class ReviewDTO 
{
    private Integer review_id;
	
	private Integer rating;
	
	private String comment;
	
	private LocalDateTime created_at;
	
	private MenuItem menuItem;
	
	private  User user;
	
	private Restaurant restaurant;
}
