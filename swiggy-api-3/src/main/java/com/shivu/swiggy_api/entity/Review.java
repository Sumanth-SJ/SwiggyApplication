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
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "reviews")
@Data
public class Review {
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	private Integer reviewId;
	
	private Integer rating;
	
	private String comment;
	
	@CreatedDate
	private LocalDateTime createdAt;
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "menuId")
	private MenuItem menuItem;
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "userId")
	private  User user;
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "restaurantId")
	private Restaurant restaurant;

}
