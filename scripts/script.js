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
	function Tablist(selector, isResponsive) {
		this.$id = $(selector);					//jQuery element for the tablist being constructed
		this.$children = this.$id.find("a");	//jQuery object that contains child elements - the elements themselves are jQuery objects
		this.$focusedChild = null;				//Keeps track of the currently focused child
		this.isResponsive = isResponsive;		//Boolean to keep track of whether or not the Tablist orientation depends on viewport size
		this.vertical = null;					//Keeps track of aria-orientation
		this.horizontal = null;					//Keeps track of aria-orientation

		//Call initialization methods
		this.init();
		this.bindHandlers();
	};


	//Member function of Tablist prototype
	//Calculates the viewport width and sets the orientation parameters accordingly
	//During object construction, the horizontal and vertical properties are null, afterwards, they are either true or false
	//This function is intended to work during construction as well as in a window resize event handler
	Tablist.prototype.setOrientation = function() {
		if ($(window).width() >= 992) {							//If viewport is above the medium breakpoint
			if (this.horizontal != true) {						//And this.horizontal is false or null
				this.$id.attr("aria-orientation", "horizontal")	//Tablist is horizontal
				this.horizontal = true;
				this.vertical = false;
			}
		} else {												//If viewport is below the medium breakpoint
			if (this.vertical != true) {						//If this.vertical is false or null			
				this.$id.attr("aria-orientation", "vertical")	//Tablist is vertical
				this.horizontal = false;
				this.vertical = true;			
			}
		}
	};


	//Member function of Tablist prototype
	//Initializes properties upon construction of Tablist object
	Tablist.prototype.init = function() {
		if (!this.isResponsive) {		//If the tablist does not respond to viewport width	
			//Set this.vertical and this.horizontal properties depending on the aria-orientation
			if (this.$id.attr("aria-orientation") === "vertical") {
				this.vertical = true;
				this.horizontal = false;
			} else {
				this.vertical = false;
				this.horizontal = true;
			}
		} else {	//If the Tablist does respond to viewport width
			this.setOrientation();
		}

		this.$focusedChild = this.$children[0];		//Set this.$focusedChild to be the first child anchor element
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
			return self.handleKeydown(this, e);			//Inside the event handlers, the scope of "this" is equal to the specific element that fired the event
		});												//This is why self = this at the beginning, so that a reference to the parent Tablist is not lost

		this.$children.focus(function() {				//Pass the event as a second parameter for keydown handler in order to tell which key is pressed
			return self.handleFocus($(this));			
		});												//For handleKeydown, need to pass the clicked object by reference

		this.$children.blur(function() {
			return self.handleBlur($(this));
		});

		if (this.isResponsive) {						//If this Tablist responds to viewport width
			$(window).resize(function() {				//Bind a window resize handler
				return self.setOrientation();
			});
		}
	};


	//Member function of Tablist prototype
	//Sets the tabindex of all children to -1 and then sets the tabindex of the focused item to 0
	Tablist.prototype.handleFocus = function($item) {
		this.$children.each(function() {				//Iterates through the children of the parent Tablist
			$(this).attr("tabindex", "-1");				//Set the tabindex of the current item iteration to -1
		});

		$item.attr("tabindex", "0");					//Set the tabindex of the focused item to 0
		//OPTIONAL - Add focus styling to $item
	};


	Tablist.prototype.handleBlur = function($item) {
		//OPTIONAL - Remove focus styling from $item
	};


	//Member function of Tablist prototype
	//Gets called when a Tablist child element is clicked
	Tablist.prototype.handleClick = function($item) {
		this.$focusedChild = $item;						//Store a jQuery object of the clicked item
		this.$focusedChild.focus();						//Set the focus to the clicked item
	};


	//Member function of Tablist prototype
	//Used to move to the next or previous child element in the Tablist, depending on the direction the user intends
	Tablist.prototype.roveChildren = function(itemRef, moveDownList) {
		var firstIndex = null;		//Stores the first index in the Tablist children object (relative to the direction of movement)
		var lastIndex = null;		//Stores the last index in the Tablist children object (relative to the direction of movement)
		var increment = null;		//Stores the increment, dependant on the direction of movement
		var newIndex = null;		//Stores the target index in the Tablist children object
		//Access the Array.prototype indexOf function to get the index of the clicked item
		//The clicked item is passed by reference so that indexOf can compare objects for equality
		var currentIndex = Array.prototype.indexOf.call(this.$children, itemRef);

		if (moveDownList) {							//If user wants to move down the list
			firstIndex = 0;							//The firstIndex is the first element in this.$children
			lastIndex = this.$children.length - 1;	//The lastIndex is the last element in this.$children
			increment = 1;							//Move to the next element in tthis.$children
		} else {									//If pressing shift + tab
			firstIndex = this.$children.length - 1;	//The firstIndex is the last element in this.$children
			lastIndex = 0;							//The lastIndex is the first element in this.$children
			increment = -1;							//Move to the previous element in tthis.$children
		}


		if (currentIndex === lastIndex) {			//If at the last element (relative to direction)
			newIndex = firstIndex;					//Move to the first element (relative to direction)
		} else {
			newIndex = currentIndex + increment;	//Otherwise, move to the next element (relative to direction)
		}

		this.$focusedChild = this.$children[newIndex];		//Set $focusedChild to the new element
		this.$focusedChild.focus();							//Focus on the target child element
		this.handleFocus($(this.$focusedChild));			//Call handleFocus on this.$focusedChild
	};


	//Member function of Tablist prototype
	//When a key is pressed while focused on a Tablist child element, fulfill the appropriate function
	Tablist.prototype.handleKeydown = function(itemRef, e) {
		switch (e.which) {

			//Tab key without/with shift key causes the document's focus to move to the next/previous Tablist
			//TODO
			//Tab key should not iterate only through tablists, it should also move to browser default objects like address bar etc.
			//This might be handled by making tablistArray into an array that handles all items that are focusable
			case keys.tab:
				e.preventDefault();		//Stop default action from being carried out
				if (!e.shiftKey) {		//If only pressing tab, set the document's focus to the next Tablist's $focusedChild
					tablistArray.moveThroughTabOrder(false);
				} else {				//If pressing shift + tab, set the document's focus to the previous Tablist's $focusedChild					
					tablistArray.moveThroughTabOrder(true);
				}
				e.stopPropagation();
				break;

			//Up key - If orientation === vertical move focus to previous sibling
			case keys.up:
				e.preventDefault();		//Stop default action from being carried out
				if (this.vertical) {
					this.roveChildren(itemRef, false);
				}
				e.stopPropagation();
				break;

			//Right key - If orientation === horizontal move focus to next sibling
			case keys.right:
				e.preventDefault();		//Stop default action from being carried out
				if (this.horizontal) {
					this.roveChildren(itemRef, true);
				}
				e.stopPropagation();
				break;

			//Down key - If orientation === vertical move focus to next sibling
			case keys.down:
				e.preventDefault();		//Stop default action from being carried out
				if (this.vertical) {
					this.roveChildren(itemRef, true);
				}
				e.stopPropagation();
				break;

			//Left key - If orientation === horizontal move focus to previous sibling
			case keys.left:
				e.preventDefault();		//Stop default action from being carried out
				if (this.horizontal) {
					this.roveChildren(itemRef, false);
				}
				e.stopPropagation();
				break;

			//Space key || Enter key - click current item
			case keys.enter:
			case keys.space:
				e.preventDefault();		//Stop default action from being carried out
				$(itemRef).click();		//Click the item
				e.stopPropagation();
				break;

			default:		//If none of the important keys are pressed
				break;		//Do nothing
		}
	};


	//Instantiate a Tablist for each tablist on the page
	var headerNav = new Tablist("address", false);								//The main header navigation
	var pageNav = new Tablist("nav#pageNav ul", true);							//The main page navigation
	var resumeNav = new Tablist("aside#resume div[role = 'tablist']", false);	//The resume section navigation


	//Constructor to create an array and instantiate an object for each of the tablists on the page
 	function TablistArray(tablists) {
 		this.items = new Array();				//Array that stores the Tablists
 		this.currentTablistIndex = 0;			//Stores the index of the currently focused Tablist

 		//Call initialization methods
 		this.init(tablists);
 		this.bindHandlers();
 	};

 	//Member function of TablistArray prototype
 	//Fills the items array with the Tablists that are on the page
 	TablistArray.prototype.init = function(tablists) {
 		for (i = 0; i < tablists.length; i++) {		//Iterate through the list of Tablists on the page
 			this.items.push(tablists[i]);			//Push each one to this.items
 		}
 	};

	//Member function of TablistArray prototype
	//Binds event handlers to the TablistArray or document
	TablistArray.prototype.bindHandlers = function() {
		var self = this;	//Store this TablistArray in variable because scope of this inside handler is the object that fired event
 		$(document).keydown(function(e) {
 			//If the tab key is pressed while focused on the document, return focus to the most recently focused Tablist child element
 			if (e.which === keys.tab) {
				e.preventDefault();			//Stop the tab button from carrying out default action
				return self.returnFromDocument(e);
			}
		});
	};

	
	//Member function of TablistArray prototype
	//Used to move to the next or previous Tablist on the page, depending on whether tab or shift + tab was pressed
	TablistArray.prototype.moveThroughTabOrder = function(shiftPressed) {
		var firstIndex = null;		//Stores the first index in the TablistArray (relative to the direction of movement)
		var lastIndex = null;		//Stores the last index in the TablistArray (relative to the direction of movement)
		var increment = null;		//Stores the increment, dependant on the direction of movement
		var newTablist = null;

		if (!shiftPressed) {					//If only pressing tab
			firstIndex = 0;						//The firstIndex is the first Tablist in the array
			lastIndex = this.items.length - 1;	//The lastIndex is the last Tablist in the array
			increment = 1;						//Move to the next Tablist in the array
		} else {								//If pressing shift + tab
			firstIndex = this.items.length - 1;	//The firstIndex is the last Tablist in the array
			lastIndex = 0;						//The lastIndex is the first Tablist in the array
			increment = -1;						//Move to the previous Tablist in the array
		}


		if (this.currentTablistIndex === lastIndex) {				//If at the last Tablist (relative to direction)
			this.currentTablistIndex = firstIndex;					//Move to the first Tablist (relative to direction)
		} else {
			this.currentTablistIndex += increment;					//Otherwise, move to the next Tablist (relative to direction)
		}

		newTablist = this.items[this.currentTablistIndex];			//Store the new Tablist to move to
 		
		newTablist.$focusedChild.focus();							//Focus on the child element of the new Tablist
		newTablist.handleFocus($(newTablist.$focusedChild));		//Call handleFocus to set the tabindex to 0
	};


	//Member function of Tablist prototype
	//When focused on the document and tab is pressed, return focus to most recently focused item
	TablistArray.prototype.returnFromDocument = function(e) {
		//Store the most recently focused Tablist in a variable and return focus to it's $focusedChild
		var returnToTablist = this.items[this.currentTablistIndex];		
		returnToTablist.$focusedChild.focus();								//Focus on the item
		returnToTablist.handleFocus($(returnToTablist.$focusedChild));		//Call the tablist.handleFocus method
	};

	//Create a TablistArray to keep track of the page's Tablists
	var tablistArray = new TablistArray([headerNav, pageNav, resumeNav]);





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

};

$(document).ready(main);