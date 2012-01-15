Vendor JS
=========

Adding the current browser's prefix for CSS Backgrounds and Borders, 2D Transforms and Animations

#### Usage


##### 1. Internal

	<style type="text/vendor">
	#button {
	  -vendor-transition: opacity 1s linear;
	}
	.block{
	  -vendor-border-radius: 5px;
	}
	</style>
	

##### 2. External File

	<link href="css3.css" rel="stylesheet" type="text/vendor" />


#### Integration

	<script src="vendor.min.js"></script>
