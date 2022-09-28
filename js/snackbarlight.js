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