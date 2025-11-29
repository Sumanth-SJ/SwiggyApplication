package com.shivu.swiggy_api.dto;

import com.shivu.swiggy_api.entity.MenuItem;
import com.shivu.swiggy_api.entity.Order;

import lombok.Data;

@Data
public class OrderItemDTO
{
	private Integer order_item_id;

	private Integer quantity;

	private Double price;
	
	private Order order;
	
	private MenuItem menuItem;
}
