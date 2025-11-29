package com.shivu.swiggy_api.request;

import lombok.Data;

@Data
public class UserSignUpRequest
{
  private String name;
  private String email;
  private String address;
  private String phoneNumber;
  private String password;
}
