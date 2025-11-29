package com.shivu.swiggy_api.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class DeliveriesDTO
{
  private Integer delivery_id;
  
  private String delivery_status;
  
  private LocalDateTime assigned_at;
  
  private LocalDateTime delivered_at;
  
  private String deliver_code;
  
  private Integer order_id;
  
  private Integer partner_id ;
  
}
