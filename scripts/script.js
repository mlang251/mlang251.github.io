var main = function() {

	//---VARIABLES---//

	//Dictionary of keys that will be used for keydown event handlers
	var keys = {
          	tab:      9,
          	enter:    13,
          	space:    32,
          	left:     37,
          	up:       38,
          	right:    39,
          	down:     40,
 	};

 	//Constructor to work with interactive tablists with ARIA enabled navigation
	function Tablist(selector) {
		this.$id = $(selector);				//jQuery element 
		this.$childNodeList = {};			//Initialize with an empty array
		this.hasFocusedChild = false;

		//Fill the empty $childNodeList array with jquery handlers of the child nodes
		function() {
			var initialList = $id.childNodes();
			for (node in initialList) {
				$childNodeList[node] = $(selector + " li:nth-item(" + node + ")");
				node++;
			}
		}

		//When tablist is focused, and has no currently focused child list item, set the focus to the first child list item
		this.$id.focus(function() {
			if (hasFocusedChild === false) {
				$childNodeList(0).setAttribute("tabindex", 0);
				$childNodeList(0).focus();
				hasFocusedChild = true;
			} else {}
		})

		//Add case expressions for navigating through lists
		this.$id.keydown(function(key) {
			switch(key) {
				case(keys.tab):

				case(keys.left):

				case(keys.right):

				case(keys.up):

				case(keys.down):

				case(keys.enter || keys.space):

				default:
					break;
			}
		})

	}



	//---FUNCTIONS---//

	//Determines if the user's device has touch capability
	var isTouch = function(){
		if(("ontouchstart" in window) || (navigator.maxTouchPoints > 0)) {
			return true;		//if device has touch capability or supports multitouch
		} else {
			return false;		//otherwise return false, if OS is less than windows 8 the if statement is undefined,
		};						//function still returns false
	};

	//if device does not have touch capability, add a hover class to anchors and page header
	if(!isTouch()) {
		$("a").addClass("isHoverable");
		$("header#pageHeader").addClass("isHoverable");
	}



	//---EVENT HANDLERS---//

	//Smooth scroll function
	$(function() {
	  $('a[href*="#"]:not([href="#"])').click(function() {
	    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	      var target = $(this.hash);
	      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	      if (target.length) {
	        $('html, body').animate({
	          scrollTop: target.offset().top
	        }, 900);
	        return false;
	      }
	    }
	  });
	});




	//add handlers for managing focus with ARIA, also the landing page nav needs aria-orientation = vertical with small viewports"


}

$(document).ready(main);