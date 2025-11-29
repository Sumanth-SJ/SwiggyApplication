package com.shivu.swiggy_api.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "restaurants")
@Data
public class Restaurant {
	
	@Id
	@GeneratedValue(strategy =  GenerationType.SEQUENCE)
	private int restaurantId;
	
	private String name;
	
	private String address;
	
	private String phoneNumber;
	
	private String password;
	
	private String email;
	
	private Double rating;
	
	private Integer reviewsCount;
	
	@CreatedDate
	private LocalDateTime createdAt;
	
	@JsonIgnore //To ignore this field from being converting to json
	@OneToMany(mappedBy = "restaurant",cascade = CascadeType.ALL ,fetch = FetchType.LAZY )
	private List<MenuItem> menuItems;
	
}
