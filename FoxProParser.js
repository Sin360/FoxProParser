(function () {

	var args = process.argv.splice(2);
	var fs = require('fs');
	var Parser = require('./parser.js');

	// Read File content
	fs.readFile(args[0], "utf8", function (err, data) {

		// Catch error
		if (err) {
			throw err;
		}

		// Split strings to array
		var lines = data.split("\n");

		// Instanciate parser
		var parser = new Parser();

		// Set name of parsed file
		parser.fileName = args[0];

		// Parse each line
		for (var i = 0; i < lines.length; i++) {
			parser.parseLine(lines[i]);
		};
		
		// write report file
		fs.writeFile('reports/report.json', parser.report(), function (err) {
			if (err) {
				throw err;
			}
		});

	});

}());