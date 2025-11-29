package com.shivu.swiggy_api.request;

import lombok.Data;

@Data
public class AddReviewRequest 
{
    private Integer rating;
	private String comment;
	private Integer itemId;
	private Integer orderId;
	private Integer userId;
}
