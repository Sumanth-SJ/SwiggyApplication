package com.shivu.swiggy_api.services;

import com.shivu.swiggy_api.entity.DeliveryPartner;

public interface IDeliveryPartnerService
{
  public DeliveryPartner create(DeliveryPartner deliveryPartner);
  public DeliveryPartner update(DeliveryPartner deliveryPartner);
  public DeliveryPartner getByd(Integer deliveryPartnerId);
  public void deletById(Integer deliveryPartnerId);
  public DeliveryPartner getByEmail(String email);
  
  
}
