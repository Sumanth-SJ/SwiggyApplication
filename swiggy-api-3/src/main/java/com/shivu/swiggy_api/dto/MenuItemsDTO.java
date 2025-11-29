package com.shivu.swiggy_api.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class MenuItemsDTO
{
	private Integer item_id;
	
	private String name;
	
	private String description;
	
	private Double price;
	
	private Integer available;
	
	private String category;
	
	private String img;
	
	private Double rating;
	
	private Integer reviews_count;
	
	private LocalDateTime created_at;
	
	
	private Integer restaurant_id;
}
