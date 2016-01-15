define(function(require, exports, module) {

	var ant = require('../../sdk/antBridge.min');
	ant.debugEnabled();
	ant.setOptionMenu('帮助');
	ant.showOptionMenu();
	ant.on('optionMenu', function() {
		ant.alert('Hello, antBridge!');
	});
});