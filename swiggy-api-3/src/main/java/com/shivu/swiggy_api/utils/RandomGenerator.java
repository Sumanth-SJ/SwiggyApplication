package com.shivu.swiggy_api.utils;

import java.security.SecureRandom;

public class RandomGenerator {
	private static final String NUMBER = "0123456789";
	private static final String CHARACTERS = "QWETYUIOPLKJHGFDSAZXCVBNMmnbvcxzasdfghjklpoiuytrewq";
    private static final SecureRandom RANDOM = new SecureRandom();

    public static String generateNumberString(int length) {
        StringBuilder stringBuilder = new StringBuilder(length);

        for (int i = 0; i < length; i++) {
            int randomIndex = RANDOM.nextInt(NUMBER.length());
            stringBuilder.append(NUMBER.charAt(randomIndex));
        }

        return stringBuilder.toString();
    }
    
    
    public static String generateCharacterString(int length) {
        StringBuilder stringBuilder = new StringBuilder(length);

        for (int i = 0; i < length; i++) {
            int randomIndex = RANDOM.nextInt(CHARACTERS.length());
            stringBuilder.append(CHARACTERS.charAt(randomIndex));
        }

        return stringBuilder.toString();
    }
    
    
    
}