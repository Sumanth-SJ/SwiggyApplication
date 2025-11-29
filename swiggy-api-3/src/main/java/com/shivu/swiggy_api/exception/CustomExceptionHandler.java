package com.shivu.swiggy_api.exception;

import java.security.SignatureException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class CustomExceptionHandler {

    @ExceptionHandler(UserException.class)
    public ResponseEntity<Map<String, String>> userExceptionHandler(UserException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "User Exception");
        response.put("message", ex.getMessage());
        response.put("status", "failed");
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(RestaurantException.class)
    public ResponseEntity<Map<String, String>> restaurantExceptionHandler(RestaurantException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Restaurant Exception");
        response.put("message", ex.getMessage());
        response.put("status", "failed");
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    
    @ExceptionHandler(DeliveryException.class)
    public ResponseEntity<Map<String, String>> deliveryExceptionHandler(DeliveryException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Delivery Exception");
        response.put("message", ex.getMessage());
        response.put("status", "failed");
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(CartException.class)
    public ResponseEntity<Map<String, String>> cartExceptionHandler(CartException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Cart Exception");
        response.put("message", ex.getMessage());
        response.put("status", "failed");
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(EmailException.class)
    public ResponseEntity<Map<String, String>> emailExceptionHandler(EmailException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Email Exception");
        response.put("message", ex.getMessage());
        response.put("status", "failed");
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(PaymentException.class)
    public ResponseEntity<Map<String, String>> paymentExceptionHandler(PaymentException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Payment Exception");
        response.put("message", ex.getMessage());
        response.put("status", "failed");
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(OrderException.class)
    public ResponseEntity<Map<String, String>> orderExceptionHandler(OrderException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Order Exception");
        response.put("message", ex.getMessage());
        response.put("status", "failed");
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> invalidDataExceptionHandler(HttpMessageNotReadableException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Input Exception");
        response.put("message", "Invalid Data");
        response.put("status", "failed");
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(CustomAuthenticationException.class)
    public ResponseEntity<Map<String, String>> authenticationExceptionHandler(CustomAuthenticationException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Authentication Exception");
        response.put("message", ex.getMessage());
        response.put("status", "failed");
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<Map<String, String>> usernameNotFoundExceptionHandler(UsernameNotFoundException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Authentication Exception");
        response.put("message", ex.getMessage());
        response.put("status", "failed");
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(SignatureException.class)
    public ResponseEntity<Map<String, String>> signatureExceptionHandler(SignatureException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Authentication Exception");
        response.put("message", "Invalid Token");
        response.put("status", "failed");
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }
}

