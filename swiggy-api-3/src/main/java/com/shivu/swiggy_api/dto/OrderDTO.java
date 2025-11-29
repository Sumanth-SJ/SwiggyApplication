package com.shivu.swiggy_api.dto;

import java.time.LocalDateTime;
import java.util.List;
import com.shivu.swiggy_api.entity.OrderItem;


import lombok.Data;

@Data
public class OrderDTO 
{
	private Integer order_id;
	
	private Double total_amount;
	
	private String status;
	
	private String pay_mode;
	
	private String delivery_address;
	
	private Integer reviewed;
	
	private String razorpay_id;
	
	
	private LocalDateTime created_at;
	
	private Integer user_id;
	
	private Integer restaurant_id;
	
	private List<OrderItem> orderItems;
}
