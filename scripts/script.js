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

	//Member function of Tablist prototype
	//Gets called when a Tablist child element is clicked
	Tablist.prototype.handleClick = function($item) {
		this.$children.each(function() {				//Iterates through the children of the parent Tablist
			$(this).attr("tabindex", "-1");				//Set the tabindex of the current item iteration to -1
		});
		this.$focusedChild = $item;						//Store a jQuery object of the clicked item
		this.$focusedChild.focus();						//Set the focus to the clicked item
	};

	Tablist.prototype.handleKeydown = function($item, e) {
		switch (e.which) {

			//TODO
			//$focusedChild.focus() is not working properly
			//Tab key without/with shift key causes the document's focus to move to the next/previous Tablist
			case keys.tab: {
				if (!e.shiftKey) {		//If only pressing tab, set the document's focus to the next Tablist's $focusedChild
					//Store a variable with the next Tablist in the tablistArray
					var nextTablist = tablistArray[tablistArray.moveThroughTabOrder(false)];
					if (nextTablist.$focusedChild === null) {						//If this Tablist has not been focused on yet
						nextTablist.$focusedChild = nextTablist.$children[0];		//Set the $focusedChild to be the first child anchor element
					}
					nextTablist.$focusedChild.focus();								//Set the focus to the $focusedChild
					nextTablist.handleFocus($(nextTablist.$focusedChild));			//Call handleFocus to set tabindex to 0
				} else {				//If pressing shift + tab, set the document's focus to the previous Tablist's $focusedChild					
					//Store a variable with the previous Tablist in the tablistArray
					var nextTablist = tablistArray[tablistArray.moveThroughTabOrder(true)];
					if (nextTablist.$focusedChild === null) {						//If this Tablist has not been focused on yet
						nextTablist.$focusedChild = nextTablist.$children[0];		//Set the $focusedChild to be the first child anchor element
					}
					nextTablist.$focusedChild.focus();								//Set the focus to the $focusedChild
					nextTablist.handleFocus($(nextTablist.$focusedChild));			//Call handleFocus to set tabindex to 0
				}
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
				//Click element
			}
			default: {
				//do nothing
			}
		}
	};

	//Member function of Tablist prototype
	//Sets the tabindex of the focused item to 0
	Tablist.prototype.handleFocus = function($item) {
		$item.attr("tabindex", "0");					//Set the tabindex of the focused item to 0
		//Add focus styling to $item
	};

	Tablist.prototype.handleBlur = function($item) {
		$item.attr("tabindex", "-1");					//Set the tabindex of the focused item to 0
		//Remove focus styling from $item
	};

	//Member function of Tablist prototype
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


	//TODO
	//Make this prototype inherit from Array and use the Array.length property
	//Create an array and instantiate an object for each of the tablists on the page
 	function TablistArray() {
 		this.currentTablistIndex = 0;			//Stores the index of the currently focused Tablist
 		this.length = 3;
 	};
	

	//Member function of TablistArray prototype
	//Used to move to the next or previous Tablist on the page, depending on whether tab or shift + tab was pressed
	TablistArray.prototype.moveThroughTabOrder = function(shiftPressed) {
		var firstIndex = null;		//Stores the first index in the TablistArray (relative to the direction of movement)
		var lastIndex = null;		//Stores the last index in the TablistArray (relative to the direction of movement)
		var increment = null;		//Stores the increment, dependant on the direction of movement

		if (!shiftPressed) {				//If only pressing tab
			firstIndex = 0;					//The firstIndex is the first Tablist in the array
			lastIndex = this.length - 1;	//The lastIndex is the last Tablist in the array
			increment = 1;					//Move to the next Tablist in the array
		} else {							//If pressing shift + tab
			firstIndex = this.length - 1;	//The firstIndex is the last Tablist in the array
			lastIndex = 0;					//The lastIndex is the first Tablist in the array
			increment = -1;					//Move to the previous Tablist in the array
		}


		if (this.currentTablistIndex === lastIndex) {				//If at the last Tablist (relative to direction)
			this.currentTablistIndex = firstIndex;					//Move to the first Tablist (relative to direction)
		} else {
			this.currentTablistIndex += increment;					//Otherwise, move to the next Tablist (relative to direction)
		}

		return this.currentTablistIndex;							//Return the index of this Tablist
	};




	//Create a TablistArray to keep track of the page's Tablists
	var tablistArray = new TablistArray();
	tablistArray[0] = new Tablist("address");								//The main header navigation
	tablistArray[1] = new Tablist("nav#pageNav ul");						//The main page navigation
	tablistArray[2] = new Tablist("aside#resume div[role = 'tablist']");	//The resume section navigation







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