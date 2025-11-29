package com.shivu.swiggy_api.services;

import com.shivu.swiggy_api.entity.OrderItem;

public interface IOrderItemService
{
  public OrderItem add(OrderItem orderItem);
  public OrderItem update(OrderItem orderItem);
  public OrderItem getById(Integer id);
}
