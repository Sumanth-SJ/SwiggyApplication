package com.shivu.swiggy_api.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.shivu.swiggy_api.entity.Cart;

import lombok.Data;


@Data
public class UserDTO {
	private int user_id;

	private String name;

	private String email;

	private String phone_number;

	private String address;

	private LocalDateTime created_at;
	
	private String password;

	List<Cart> cartItems;

}
