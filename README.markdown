Vendor JS
=========

Adding the current browser's prefix for CSS Backgrounds and Borders, 2D Transforms and Animations

##  Usage

	.box {
	  -vendor-border-radius: 5px;
	}

	@-vendor-keyframes bounce { 
	  ...
	  100% { 
	    bottom: 0px;
	    -vendor-animation-timing-function: ease-out;
	  }
	} 


##  Internal Stylesheet

	<style type="text/vendor">
	...
	</style>
	

##  External Stylesheet

	<link href="my_vendor.css" rel="stylesheet" type="text/vendor" />


##  Script Integration

	<script src="vendor.min.js"></script>
