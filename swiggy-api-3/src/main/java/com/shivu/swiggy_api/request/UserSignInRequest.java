package com.shivu.swiggy_api.request;

import lombok.Data;

@Data
public class UserSignInRequest 
{
  private String email;
  private String password;
}
