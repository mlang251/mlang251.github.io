var main = function() {



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



	//Create variable for a jQuery selector
	var $landingNav = $("section#landing ul"); 

	var navigationLayout = function() {
		$landingNav.removeClass("windowLarge windowSmall");		//Remove classes initially so that both don't appear at same time
		if ($(window).width() >= 975) {
			$landingNav.addClass("windowLarge");				//On medium and large viewports, landing navigation appears with inline-block list items
		} else {
			$landingNav.addClass("windowSmall");				//Otherwise it appears with block list items
		}
	};

	navigationLayout();						//Call function as part of main so that the navigation responds to the intial viewport width


	$(window).resize(function() {			//Call function whenever the window gets resized
		navigationLayout();
	})




	//SMOOTH SCROLL FUNCTION
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

}

$(document).ready(main);