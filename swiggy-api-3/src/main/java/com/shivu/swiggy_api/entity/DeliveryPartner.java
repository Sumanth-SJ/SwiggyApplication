package com.shivu.swiggy_api.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "delivery_partners")
@Data
public class DeliveryPartner 
{
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE)
  private Integer partnerId;
  
  private String name;
  
  private String phoneNumber;
  
  private String vehicleDetails;
  
  @CreatedDate
  private LocalDateTime createdAt;
  
  private String email;
  
  private String password;
  
  @JsonIgnore
  @OneToMany(mappedBy = "deliveryPartner")
  List<Deliveries> deliveries ;
  
  @JsonIgnore
  @OneToMany(mappedBy = "pickedBy")
  List<Order> orders;
  
  
  
}
