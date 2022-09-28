/**
 * Constructor
 *
 * @param {[type]}   data     [description]
 * @param {[type]}   options  [description]
 * @param {Function} callback [description]
 */
 function Snackbar(data, options, callback){
	if (data !== "") {
		this.options = this.activateOptions(options);
		this.data = data;
		this.callback = callback;
		this.start();
		this.snackbar();
	} else {
		console.warn("SnackbarLight: You can not create a empty snackbar please give it a string.");
	}
}


Snackbar.prototype = {

	/**
	 * Default options
	 *
	 * @type {Object}
	 */
	options: {
		// How long it takes for the snackbar to disappear
		timeout: 5000,
		// Wich class is used to tell that the snackbar is active
		activeClass: "active",
		// Name of the link or action if specified
		link: false,
		// If not used clicking will activate the callback or do nothing
		url: "#",
	},


	/**
	 * Create container for the snackbar
	 *
	 * @return {void}
	 */
	 start: function() {
		if (!document.getElementById("snackbar-container")) {
			var snackbarContainer = document.createElement("div");
			
			snackbarContainer.setAttribute("id", "snackbar-container");
			
			document.body.appendChild(snackbarContainer);
		}
	},

	/**
	 * Timer
	 *
	 * @param  {Function} callback
	 * @param  {int}   delay
	 * @return {void}
	 */
	 timer: function(callback, delay) {
	    var remaining = delay;

	    this.timer = {
	    	// Create random timer id
	    	timerId: Math.round(Math.random()*1000),

		    pause: function() {
		        // Clear the timeout
		        window.clearTimeout(this.timerId);
		        // Set the remaining to what time remains
		        remaining -= new Date() - start;
		    },

		    resume: function() {
		        start = new Date();
		        // Clear the timeout
		        window.clearTimeout(this.timerId);
		        // Set the timeout again
		        this.timerId = window.setTimeout(callback, remaining);
		    },	
	    };
	    // Start the timer
	    this.timer.resume();
	},

	/**
	 * snackbar
	 *
	 * @return {void}
	 */
	 snackbar: function() {
		var __self = this,
			snackbar = document.createElement("div");
		
		// Put the snackbar inside the snackbar container
		document.getElementById("snackbar-container").appendChild(snackbar);

	  	// Set the html inside the snackbar
	  	snackbar.innerHTML = this.getData();
		
		// Set the class of the snackbar
		snackbar.setAttribute("class", "snackbar");

		// Wait to set the active class so animations will be activated
		setTimeout(function() {
			snackbar.setAttribute("class","snackbar " + __self.options.activeClass);
		}, 50);

		// If the timeout is false the snackbar will not be destroyed after some time
		// only when the user clicks on it
		if (this.options.timeout !== false) {
			// Start the timer
			this.timer(function() {
				snackbar.setAttribute("class", "snackbar");
				__self.destroy(snackbar);
			}, this.options.timeout);
		}

		// Add the event listeners
		this.listeners(snackbar);
	},

	/**
	 * Get the data/ message to display in the snackbar
	 *
	 * @return {string}
	 */
	 getData: function() {
		if (this.options.link !== false) {
			return "<span>" + this.data + "</span><a href='" + this.options.url + "'>" + this.options.link + "</a>";
		}
		return "<span>" + this.data + "</span>";
	},