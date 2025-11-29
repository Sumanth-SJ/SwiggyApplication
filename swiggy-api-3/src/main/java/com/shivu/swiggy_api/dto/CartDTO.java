package com.shivu.swiggy_api.dto;


import lombok.Data;

@Data
public class CartDTO 
{
	private Integer cart_id;
	
	private Integer user_id;
	
	private Integer menuItem_id;
}
