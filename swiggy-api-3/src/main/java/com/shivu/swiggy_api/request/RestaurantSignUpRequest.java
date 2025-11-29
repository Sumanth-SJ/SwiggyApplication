package com.shivu.swiggy_api.request;

import lombok.Data;

@Data
public class RestaurantSignUpRequest 
{
  private String name;
  private String email;
  private String password;
  private String address;
  private String phoneNumber;
  
}
