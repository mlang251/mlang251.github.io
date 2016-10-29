var main = function() {



	//---VARIABLES---//

	//Dictionary of keys that will be used for keydown event handlers
	var keys = {
          	tab:      9,
          	shift:    16, 
          	enter:    13,
          	space:    32,
          	left:     37,
          	up:       38,
          	right:    39,
          	down:     40
 	};


 	//Constructor to work with interactive tablists with ARIA enabled navigation
 	//The Tablists are container widgets that contain children that either are anchor elements, or have their own children that are anchor elements
	function Tablist(selector) {
		this.$id = $(selector);									//jQuery element for the tablist being constructed
		this.$children = this.$id.find("a");					//jQuery object that contains child elements - the elements themselves are jQuery objects
		this.$focusedChild = null;								//Keeps track of the currently focused child
		this.orientation = this.$id.attr("aria-orientation");	//Either horizontal or vertical depending on the list

		this.bindHandlers();
	};

	//Member function of Tablist constructor
	//Gets called when a Tablist child element is clicked
	Tablist.prototype.handleClick = function($item) {
		this.$children.each(function() {				//Iterates through the siblings of the clicked item
			$(this).attr("tabindex", "-1");				//Set the tabindex of the current item iteration to -1
		}
		this.$focusedChild = $item;						//Store a jQuery object of the clicked item
		this.$focusedChild.focus();						//Set the focus to the clicked item
	};

	Tablist.prototype.handleKeydown = function($item, e) {
		switch (e.which) {
			case keys.tab: {
				//Move to next Tablist on page
			}
			case (keys.tab && keys.shift): {
				//Move to previous Tablist on page 
			}
			case keys.up: {
				//If orientation === vertical move focus to previous sibling
			}
			case keys.right: {
				//If orientation === horizontal move focus to next sibling
			}
			case keys.down: {
				//If orientation === vertical move focus to next sibling
			}
			case keys.left: {
				//If orientation === horizontal move focus to previous sibling
			}
			case (keys.enter || keys.space): {
				//If current item is not an anchor, drill down to anchor child element
				//Click element
			}
			default: {
				//do nothing
			}
		}
	};

	Tablist.prototype.handleFocus = function($item) {
		//if $focusedChild === null, set $focusedChild = $item
		//Set tabindex of $item to 0
		//Add focus styling to $item
	};

	Tablist.prototype.handleBlur = function($item) {
		//Remove focus styling from $item
	};

	//Member function of Tablist constructor
	//Binds event handlers to the children of each constructed Tablist
	Tablist.prototype.bindHandlers = function() {
		var self = this;								//To avoid confusion with this, set "self" equal to the Tablist that is currently being constructed

		this.$children.click(function() {				//In Tablist that is currently being constructed, create event handler for each event.
			return self.handleClick($(this));			//When a child item of the Tablist that is currently being constructed is the target of an event,
		});												//call the necessary event handler from that same Tablist.
														//Pass a jQuery element that points to the clicked child element
		this.$children.keydown(function(e) {
			return self.handleKeydown($(this), e);		//Inside the event handlers, the scope of "this" is equal to the specific element that fired the event
		});												//This is why self = this at the beginning, so that a reference to the parent Tablist is not lost

		this.$children.focus(function() {				//Pass the event as a second parameter for keydown handler in order to tell which key is pressed
			return self.handleFocus($(this));
		});

		this.$children.blur(function() {
			return self.handleBlur($(this));
		});
	};







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




	//Need to write a function to detect and set aria-orientation of the pageNav Tablist


};

$(document).ready(main);