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

		const tabindexFocus = 0;	//For setting tabindex of a child to 0
		const tabindexBlur = -1;	//For setting tabindex of a child to -1

		//Create function to set the tabindex attribute - this command can get called in many different contexts
		this.setTabIndex = function(listItemIndex, value) {
			this.$childList[listItemIndex].setAttribute("tabindex", value);
		}


		//Rove forwards through Tablist children
		//Remove focus from currently focused child, change tabindex to -1
		//Add focus to the next child, change tabindex to 0
		this.roveTabs = function(directionForward) {
			var addFocus = null;		//Stores the index of the child to set focus to
			var removeFocus = null;		//Stores the index of the child to remove focus from
			var startIndex = null;		//Stores the index to start the loop from, either first child or last child in list, depending on direction
			var endIndex = null;		//Stores the index to end the loop on, either last child or first child in list, depending on direction
			var increment = null;		//Stores the value of the increment for the loop, either +1 or -1 depending on the direction
			const forward = 1;			//For roving through tablist children forwards
			const reverse = -1;			//For roving through tablist children in reverse

			if (directionForward) {		//If moving forwards through list, move from first child to last child with an increment
				startIndex = 0;
				endIndex = this.$childList.length() - 1;
				increment = forward;
			} else {					//If moving backwards through list, move from last child to first child with a decrement
				startIndex = this.$childList.length() - 1;
				endIndex = 0;
				increment = reverse;
			}

			for (index = startIndex; Math.abs(index - startIndex) < this.$childList.length(); index += increment) {
				if (this.$childList[index].attr("tabindex") === 0) {
					this.setTabIndex(index, tabindexBlur);				//If child is currently focused, set tabindex to -1
					removeFocus = index;								//Store this child's index in removeFocus

					if (index === endIndex) {							//If at the end/beginning for forwards/reverse roving of the list of children
						this.setTabIndex(startIndex, tabindexFocus);	//Set tabindex of the child at startIndex to 0
						addFocus = startIndex;							//Store startIndex in addFocus
					} else {											//If not at the end/beginning of the list of children
						index += increment;								//Fast-forward/reverse to the next/previous child for forwards/reverse roving
						this.setTabIndex(index, tabindexFocus);			//Set tabindex to 0
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
				this.setTabIndex(0, tabindexFocus);							//Set tabindex of first child to 0
				this.$childList[0].focus();			//Give focus to the first child
				this.hasChildFocus = true;			//Set to true so this function doesn't run again when tablist is focused
			}
		});


		//Event handler for keydown - add case expressions for navigating through lists
		this.$id.keydown(function(key) {
			switch(key.which) {
				case(keys.left):
					if (this.orientation === "horizontal") {		//If left key is pressed and list is horizontal, roveTabs in reverse
						roveTabs(false);
					}												//Otherwise do nothing
					break;

				case(keys.right):
					if (this.orientation === "horizontal") {		//If right key is pressed and list is horizontal, roveTabs forwards
						roveTabs(true);
					}												//Otherwise do nothing
					break;

				case(keys.up):
					if (this.orientation === "vertical") {			//If left up is pressed and list is vertical, roveTabs in reverse
						roveTabs(false);
					}												//Otherwise do nothing
					break;

				case(keys.down):
					if (this.orientation === "vertical") {			//If left down is pressed and list is vertical, roveTabs forwards
						roveTabs(true);
					}												//Otherwise do nothing
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