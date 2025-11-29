package com.shivu.swiggy_api.jpa.specification;

import java.util.Arrays;

import org.springframework.data.jpa.domain.Specification;

import com.shivu.swiggy_api.entity.MenuItem;

import jakarta.persistence.criteria.Predicate;

public class MenuItemSpecification
{
  public static Specification<MenuItem> hasNameOrCategory(String q){
	 
	  return (root, query, criteriaBuilder) -> {
	        if (q == null || q.isEmpty() ) {
	            return criteriaBuilder.conjunction();  // No filtering if q is empty or null
	        }
	        String [] searchTerms = q.split(",");
	        Predicate[] namePredicates = Arrays.stream(searchTerms)
	            .map(term -> criteriaBuilder.like(root.get("name"), "%" + term + "%"))
	            .toArray(Predicate[]::new);
	        
	        Predicate[] categoryPredicates = Arrays.stream(searchTerms)
	            .map(term -> criteriaBuilder.like(root.get("category"),"%#" + term + "%"))
	            .toArray(Predicate[]::new);

	        // Combine predicates for name and category with OR logic
	        Predicate namePredicate = criteriaBuilder.or(namePredicates);
	        Predicate categoryPredicate = criteriaBuilder.or(categoryPredicates);
	        
	        return criteriaBuilder.or(namePredicate, categoryPredicate);
	    };  
  }
  
  public static Specification<MenuItem> ofRestaurant(Integer restaurantId)
  {
	  return (root, query, criteriaBuilder)->{	 
		  return criteriaBuilder.equal(root.get("restaurant").get("restaurantId"), restaurantId);
	  };
  }
  
  
}
