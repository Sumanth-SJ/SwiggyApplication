package com.shivu.swiggy_api.request;

import lombok.Data;

@Data
public class OTPVerify 
{
  private String email;
  private String otp;
}
