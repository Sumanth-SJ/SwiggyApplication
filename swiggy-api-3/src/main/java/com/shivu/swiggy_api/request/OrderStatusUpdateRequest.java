package com.shivu.swiggy_api.request;

import lombok.Data;

@Data
public class OrderStatusUpdateRequest 
{
	private Integer orderId;
	private String status;
}
