package com.shivu.swiggy_api.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "deliveries")
@Data
public class Deliveries
{
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
  private Integer deliveryId;
  
  private String deliveryStatus;
  
  @CreatedDate
  private LocalDateTime assignedAt;
  
  private LocalDateTime deliveredAt;
  
  private String deliver_code;
  
  @JsonIgnore
  @OneToOne
  @JoinColumn(name = "orderId")
  private Order order;
  
  @JsonIgnore
  @ManyToOne
  @JoinColumn(name = "partnerId")
  private DeliveryPartner deliveryPartner ;
  
}
