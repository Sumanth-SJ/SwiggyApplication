package com.shivu.swiggy_api.request;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class MenuUpdateRequest 
{
	  private Integer itemId;
	  private String name;
	  private String description;
	  private String category;
	  private Double price;
	  private Integer discount;
	  private String image;
	  private Integer available;
}
