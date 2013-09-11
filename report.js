var Report = function (data) {
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
				'<script src="http://code.jquery.com/jquery-2.0.3.min.js"></script>',
				'<script src="http://underscorejs.org/underscore-min.js"></script>',
				'<script src="http://backbonejs.org/backbone-min.js"></script>',
				'<script>',
				'(function () {',
					'var ReportView = Backbone.View.extend({',
						'initialize: function () {',
							'this.render();',
						'},',
						'render: function (data) {',
							'console.log(this.model);',
							'$("body").append(this.model.fileName + " (" + this.model.currentLine + " lines)");',
						'}',
					'});',
					'var report = new ReportView({ model: ' + data + ' });',
				'}());',
				'</script>',
			'</html>'
		].join('');
	}
};

// expose report constructor
module.exports = Report;