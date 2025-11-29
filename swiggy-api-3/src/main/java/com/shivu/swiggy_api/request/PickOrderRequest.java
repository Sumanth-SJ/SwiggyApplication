package com.shivu.swiggy_api.request;

import lombok.Data;

@Data
public class PickOrderRequest
{
   private Integer orderId;
   private Integer deliveryPartnerId;
}
