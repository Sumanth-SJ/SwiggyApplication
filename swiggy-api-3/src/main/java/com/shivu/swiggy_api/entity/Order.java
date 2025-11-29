package com.shivu.swiggy_api.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "orders")
@Data
public class Order
{

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	private Integer orderId;
	
	private Double totalAmount;
	
	private String status;
	
	private String payMode;
	
	private String deliveryAddress;
	
	private Integer reviewed;
	
	private String razorpayId;
	
	
	private LocalDateTime createdAt;
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "userId")
	private User user;
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "restaurantId")
	private Restaurant restaurant;
	
	@JsonIgnore
	@OneToMany(mappedBy = "order")
	private List<OrderItem> orderItems;
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "partnerId")
	private DeliveryPartner pickedBy;
}
