var main = function() {

	var $landingNav = $("section#landing ul"); 

	var navigationLayout = function() {
		$landingNav.removeClass("windowLarge windowSmall");
		if ($(window).width() >= 975) {
			$landingNav.addClass("windowLarge");
		} else {
			$landingNav.addClass("windowSmall");
		}
	}

	navigationLayout();


	$(window).resize(function() {
		navigationLayout();
	})


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