package com.shivu.swiggy_api.request;

import lombok.Data;

@Data
public class DeliveryPartnerSigninRequest
{
  private String email;
  private String password;
}
