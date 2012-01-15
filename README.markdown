Vendor JS
=========

### Write one prefix - and support all current devices.

Adding the current browser's prefix for CSS Backgrounds and Borders, 2D Transforms and Animations

## Sizes

3.0 KB - Original
1.2 KB - Minified
0.7 KB - Minified and Gzipped


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

.. and everything else happens automatically. ;)