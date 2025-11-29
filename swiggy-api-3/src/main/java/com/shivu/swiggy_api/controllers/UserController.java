package com.shivu.swiggy_api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shivu.swiggy_api.services.CustomerDetails;

@RestController
@RequestMapping("/api/user")
public class UserController
{
	@GetMapping("/profile")
	@PreAuthorize("hasRole('CUSTOMER')") // helps to check role
    public ResponseEntity<?> getProfileByToken(@AuthenticationPrincipal CustomerDetails customerDetails)
    {
//    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//    	
//    	if(authentication==null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser"))
//    	{
//    		throw new UsernameNotFoundException("Unauthenticated");
//    	}
//    	
//    	CustomerDetails customerDetails = (CustomerDetails) authentication.getPrincipal();
		
		if(customerDetails==null)
		{
			throw new UsernameNotFoundException("Unauthorized");
		}
    	
    	return ResponseEntity.ok(customerDetails.getUser());
    	
    }
}
