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