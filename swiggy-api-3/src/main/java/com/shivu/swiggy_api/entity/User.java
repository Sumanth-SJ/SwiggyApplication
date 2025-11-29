package com.shivu.swiggy_api.entity;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.annotation.CreatedDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name = "users")
@Data
@ToString(exclude = "cartItems")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	private int userId;

	private String name;

	@Column(unique = true)
	private String email;

	private String phoneNumber;

	private String address;

	private String password;

	@CreatedDate
	private LocalDateTime createdAt;

	@JsonIgnore
	@OneToMany(mappedBy = "user")
	List<Cart> cartItems;
	

}
