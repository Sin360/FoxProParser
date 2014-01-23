var Report = function (data) {

	var self = this;

	this.analyze = function () {

	};

	/**
	 * Returns variable type based on prefix
	 *
	 * @method getVarType
	 * @param {string} variable Name of the variable
	 * @return {string} Type of the variable
	 */
	this.getVarType = function (variable) {
		var type;
		switch (variable[0]) {
			case 'c': type = 'string'; break;
			case 'd': type = 'date'; break;
			case 'l': type = 'boolean'; break;
			case 'n': type = 'integer'; break;
			case 'o': type = 'object'; break;
			case 's': type = 'string'; break;
			case 't': type = 'datetime'; break;
			default: type = 'type';
		}
		return type;
	};

	this.build = function () {

		return ['<!DOCTYPE html>',
			'<head>',
				'<meta charset="utf-8">',
				'<meta http-equiv="X-UA-Compatible" content="IE=edge">',
				'<title>FoxProParser Report</title>',
			'</head>',
			'<body>',
			'<h1>FoxProParser Report</h1>',
			'</body>',
				'<script src="http://localhost:1337/livereload.js"></script>',
				'<script src="lib/jquery-2.0.3.min.js"></script>',
				'<script src="lib/underscore-min.js"></script>',
				'<script src="lib/backbone-min.js"></script>',
				'<script type="text/template" id="classesTemplate">',
				'<div><%= this.model.fileName %> (<%= this.model.currentLine %> lines)</div>',
				'<h2>Classes</h2>',
				'<ul>',
				'<% for (var i = 0; i < this.model.Classes.length; i++) { %>',
					'<li><%= this.model.Classes[i].name %>',
						'<ul>',
							'<% for (var j = 0; j < this.model.Classes[i].methods.length; j++) { %>',
								'<li><%= this.model.Classes[i].methods[j].name %></li>',
							'<% } %>',
						'</ul>',
					'</li>',
				'<% } %>',
				'</ul>',
				'</script>',
				'<script>',
				'(function () {',
					'var ReportView = Backbone.View.extend({',
						'template: _.template($("#classesTemplate").html()),',
						'initialize: function () {',
							'this.render();',
						'},',
						'render: function (data) {',
							'$("body").append(this.template(data));',
						'}',
					'});',
					'var report = new ReportView({ model: ' + data + ' });',
				'}());',
				'</script>',
			'</html>'
		].join('');
	};

	/**
	 * Generates yui documentation for classes and methods
	 *
	 * @method doc
	 * @return {string} Classes and methods documentation
	 */
	this.doc = function () {

		var report = JSON.parse(data);
		var stream = '';
		var header = '*<\n* description\n';
		var footer = '\n*>\n';

		// add class declaration
		for (var i = 0, classesLen = report.Classes.length, classObj; i < classesLen; i++) {
			classObj = report.Classes[i];
			stream = stream + header + '*\n* @class ' + classObj.name + '\n* @extends ' + classObj.parent + footer;

			// add method declaration
			for (var j = 0, methodsLen = classObj.methods.length, methObj; j < methodsLen; j++) {
				methObj = classObj.methods[j];
				stream = stream + '\n' + header + '*\n* @method ' + methObj.name;

				// add param declaration
				for (var k = 0, paramsLen = methObj.parameters.length, param; k < paramsLen; k++) {
					param = methObj.parameters[k];
					stream = stream + '\n* @param {' + this.getVarType(param) + '} ' + param + ' description';
				}

				// add return declaration
				if (methObj.returnCount) {
					stream = stream + '\n* @return {type} description';
				}

				stream = stream + footer;
			}
		}

		return stream;
	};
};

// expose report constructor
module.exports = Report;