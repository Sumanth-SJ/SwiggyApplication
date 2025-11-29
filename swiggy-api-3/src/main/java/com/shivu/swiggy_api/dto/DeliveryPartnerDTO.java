package com.shivu.swiggy_api.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.shivu.swiggy_api.entity.Deliveries;

import lombok.Data;


@Data
public class DeliveryPartnerDTO
{
  private Integer partner_id;
  
  private String name;
  
  private String phone_number;
  
  private String vehicle_details;
  
  private LocalDateTime created_at;
  
  private String email;
  
  private String password;
  
  List<Deliveries> deliveries ;
}
