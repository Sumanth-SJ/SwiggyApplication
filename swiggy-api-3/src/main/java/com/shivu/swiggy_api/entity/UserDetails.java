package com.shivu.swiggy_api.entity;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;

public class UserDetails implements org.springframework.security.core.userdetails.UserDetails {

	
	private static final long serialVersionUID = 1L;
	private Object userObject ;
	
	public UserDetails(Object userObject) {
		this.userObject = userObject;
	}
	
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getPassword() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return null;
	}
	
	public Object getUser()
	{
		return userObject;
	}
	
	

}
