package com.shivu.swiggy_api.repository;


import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.shivu.swiggy_api.entity.MenuItem;


@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Integer>,JpaSpecificationExecutor<MenuItem> {
	
	@Query("SELECT m FROM MenuItem m WHERE  (:q is null or :q ='' or m.name LIKE CONCAT('%', :q, '%') OR m.category LIKE CONCAT('%', :q, '%')) AND  (m.restaurant.restaurantId is null or m.restaurant.restaurantId=0  or m.restaurant.restaurantId =:rId ) ORDER BY m.rating DESC, m.restaurant.restaurantId DESC ")
	Page<MenuItem> findMenuItems( @Param("q") String q, @Param("rId") Integer rid, Pageable pageable);
	
	
	@Query("SELECT m FROM MenuItem m WHERE (m.name LIKE CONCAT(:q,'%')) OR (m.category LIKE CONCAT('%#',:q,'%'))")
	List<MenuItem> searchText(@Param("q") String filter );
	
	
	@Query("SELECT m FROM MenuItem m WHERE  ((:q IS NULL OR :q = '') OR (m.name LIKE CONCAT(:q, '%')) OR (m.category LIKE CONCAT('%#', :q, '%'))) AND (:rid = 0 OR :rid IS NULL OR m.restaurant.restaurantId = :rid) AND (:minPrice = 0 OR m.price >= :minPrice)  AND (:maxPrice = 0 OR m.price <= :maxPrice)  AND (:rating = 0 OR m.rating >= :rating)")
		Page<MenuItem> getMenuItems(
		       @Param("q") String filter, 
		       @Param("rid") Integer rId, 
		       @Param("minPrice") Integer minPrice, 
		       @Param("maxPrice") Integer maxPrice, 
		       @Param("rating") Integer rating, 
		       Pageable pageable);

	
	@Query(value = "SELECT * FROM menu_items WHERE category REGEXP :regex", 
		       countQuery = "SELECT COUNT(*) FROM menu_items WHERE category REGEXP :regex", 
		       nativeQuery = true)
		Page<MenuItem> findByCategorysMatching(@Param("regex") String regex, Pageable pageable);


	
	
	
}

