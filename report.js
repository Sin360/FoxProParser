var Report = function (data) {
	this.analyze = function () {

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
};

// expose report constructor
module.exports = Report;