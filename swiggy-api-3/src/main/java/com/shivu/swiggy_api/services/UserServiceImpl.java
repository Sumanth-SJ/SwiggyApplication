package com.shivu.swiggy_api.services;

import java.util.List;
import org.springframework.stereotype.Component;

import com.shivu.swiggy_api.entity.User;
import com.shivu.swiggy_api.exception.UserException;
import com.shivu.swiggy_api.repository.UserRepository;

@Component
public class UserServiceImpl implements IUserService {
	
	
	private UserRepository userRepository;
	
	public UserServiceImpl(UserRepository userRepository) {
		this.userRepository = userRepository;
	}
	

	@Override
	public User createUser(User user) {
		
		return userRepository.save(user);
	}

	@Override
	public User updateUser(User user) {
		
		return userRepository.save(user);
	}

	@Override
	public User findById(Integer userId) {
		
		return userRepository.findById(userId).orElseThrow(()->new UserException("User Not Found"));
	}

	@Override
	public List<User> findAll() {
		
		return userRepository.findAll();
	}

	@Override
	public User findByEmail(String email) {		
		return userRepository.findByEmail(email).orElse(null);
	}

}
