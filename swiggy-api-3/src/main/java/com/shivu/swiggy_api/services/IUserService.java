package com.shivu.swiggy_api.services;

import java.util.List;

import com.shivu.swiggy_api.entity.User;

public interface IUserService
{
  public User createUser(User user);
  public User updateUser(User user);
  public User findById(Integer userId);
  public List<User> findAll();
  public User findByEmail(String email);
}
