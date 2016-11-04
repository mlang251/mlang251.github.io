var main = function() {



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

}

$(document).ready(main);