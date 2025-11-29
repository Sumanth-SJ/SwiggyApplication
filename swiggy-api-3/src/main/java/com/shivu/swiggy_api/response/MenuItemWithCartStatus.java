package com.shivu.swiggy_api.response;


import com.shivu.swiggy_api.entity.MenuItem;

import lombok.Data;

@Data
public class MenuItemWithCartStatus extends MenuItem {
 
	private boolean saved;
}
