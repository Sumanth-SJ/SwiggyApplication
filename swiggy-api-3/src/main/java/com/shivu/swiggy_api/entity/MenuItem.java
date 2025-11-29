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
@Table(name = "menu_items")
@Data
public class MenuItem {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	private Integer itemId;

	private String name;

	private String description;

	private Double price;

	private Integer available;

	private String category;

	private String img;

	private Double rating;
	
	private Integer discount;

	private Integer reviewsCount;

	@CreatedDate
	private LocalDateTime createdAt;

	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "restaurantId")
	private Restaurant restaurant;

}
