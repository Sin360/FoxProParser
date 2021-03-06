(function () {

	var args = process.argv.splice(2);
	var fs = require('fs');
	var Parser = require('./parser.js');
	var Report = require('./report.js');
	var Doc = require('./doc.js');

	// Read File content
	fs.readFile(args[0], "utf8", function (err, data) {

		// Catch error
		if (err) {
			throw err;
		}

		// Instanciate parser
		var parser = new Parser();

		// Set name of parsed file
		parser.fileName = args[0];

		// Parse data
		parser.execute(data);

		var data = parser.report();
		var report = new Report(data);

		// write report file
		fs.writeFile('reports/report.json', data, function (err) {
			if (err) {
				throw err;
			}
		});

		// write html report file
		fs.writeFile('reports/report.html', report.build(), function (err) {
			if (err) {
				throw err;
			}
		});

		var doc = new Doc(data);

		// generates documentation
		fs.writeFile('reports/doc.prg', doc.run(), function (err) {
			if (err) {
				throw err;
			}
		});

	});

}());