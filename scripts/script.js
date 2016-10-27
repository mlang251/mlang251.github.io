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
		this.$id = $(selector);									//jQuery element for the tablist being constructed
		this.$children = this.$id.children();					//jQuery object that contains child elements - the elements themselves are jQuery objects
		this.$focusedChild = null;								//Keeps track of the currently focused child
		this.orientation = this.$id.attr("aria-orientation");	//Either horizontal or vertical depending on the list

		this.bindHandlers();
	}







	//Instantiate an object for each of the tablists on the page
	var headerNav = new Tablist("address");
	var pageNav = new Tablist("nav#pageNav ul");
	var resumeNav = new Tablist("aside#resume div[role = 'tablist']");




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