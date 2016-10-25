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
		this.$id = $(selector);						//jQuery element 
		this.childrenObject = this.$id.children();	//jQuery object that contains child elements - these are NOT jQuery elements
		this.$childList = new Array();				//Instantiate empty array - this gets filled with jQuery elements of children
		this.hasChildFocus = false;					//Boolean to keep track of whether or not a tablist has been focused yet
		this.orientation = this.$id.attr("aria-orientation");	//Either horizontal or vertical depending on the list


		//Create function to set the tabindex attribute because this command can get called in many different contexts
		this.setTabindex = function(listItemIndex, value) {
			this.$childList[listItemIndex].setAttribute("tabindex", value);
		}


		//Rove forwards through Tablist children
		//Remove focus from currently focused child, change tabindex to -1
		//Add focus to the next child, change tabindex to 0
		this.roveTabForward = function() {
			//These variable will store the indices of the list items to add/remove focus
			var addFocus = null;
			var removeFocus = null;

			//Iterate through the children from index 0 to length-1
			for (index = 0; i < this.$childList.length(); i++) {
				if (this.$childList[index].attr("tabindex") === 0) {
					this.setTabindex(index, -1);						//If child is currently focused, set tabindex to -1
					removeFocus = index;								//Store this child's index in removeFocus

					if (index === this.$childList.length() - 1) {		//If at the end of the list of children
						this.setTabindex(0, 0);							//Set tabindex of the first child to 0
						addFocus = 0;									//Store first child's index in addFocus
					} else {											//If not at the end of the list of children
						index++											//Fast-forward to the next child
						this.setTabindex(index, 0);						//Set tabindex to 0
						addFocus = index;								//Store this child's index in addFocus
					}
				}
			}

			//Remove focus from currently selected element, add focus to the next element in the list
			this.$childList[removeFocus].blur();
			this.$childList[addFocus].focus();
		}


		//When tablist is focused, and has no currently focused child list item, set the focus to the first child list item
		this.$id.focus(function() {
			if (this.hasChildFocus === false) {
				this.$childList[0].setAttribute("tabindex", 0);
				for (i = 1; i < this.$childList.length(); i++) {
					this.$childList[i].setAttribute("tabindex", -1);
				}
				this.$childList[0].focus();
				this.hasChildFocus = true;
			}
		});


		//Event handler for keydown - add case expressions for navigating through lists
		this.$id.keydown(function(key) {
			switch(key.which) {
				case(keys.left):
					if (this.orientation === "horizontal") {
						roveTabForward();
					}
					break;

				case(keys.right):
					if (this.orientation === "horizontal") {
						roveTabReverse();
					}
					break;

				case(keys.up):
					if (this.orientation === "vertical") {
						roveTabForward();
					}
					break;

				case(keys.down):
					if (this.orientation === "vertical") {
						roveTabReverse();
					}
					break;

				case(keys.enter || keys.space):
					//Click currently focused list item
					break;

				default:
					break;
			}
		});

		//Fill $childList with jQuery elements for each of the children, in the order they appear in the DOM
		for (i = 0; i < this.childrenObject.length; i++) {
			this.$childList[i] = this.childrenObject.eq(i);
		}

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