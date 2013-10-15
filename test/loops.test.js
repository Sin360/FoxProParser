'use strict';

var Parser = require('../parser.js');
var fs = require('fs');
var resources = {};

exports['loops'] = {
	setUp: function (callback) {

		var self = this;

		if (resources.parser) {
			self.parser = resources.parser;
			callback();
		} else {
			fs.readFile('test/src/loops.prg', "utf8", function (err, data) {
				// Catch error
				if (err) throw err;

				// Instanciate parser
				var parser = new Parser();

				// Set name of parsed file
				parser.fileName = 'loops.prg';

				// parse data
				parser.execute(data);

				self.parser = parser;
				resources.parser = parser;
				callback();
			});
		}
	},
	basic: function (test) {
		test.expect(4);
		test.equal(typeof this.parser, "object", "should be an object");
		test.equal(this.parser.fileName, "loops.prg", "should return filename");
		test.equal(this.parser.Classes.length, 1, "should return number of classes");
		test.equal(this.parser.currentLine, 25, "should return number of lines");
		test.done();
	},
	classes: function (test) {
		var classes = this.parser.Classes;
		test.expect(2);
		test.equal(classes[0].name, "Loops", "should return class name");
		test.equal(classes.length, 1, "should return number of classes");
		test.done();
	},
	methods: function (test) {
		var methods = this.parser.Classes[0].methods;
		test.expect(2);
		test.equal(methods.length, 1, "should return number of methods");
		test.equal(methods[0].name, "Scan", "should return proper method name");
		test.done();
	},
	scan: function (test) {
		var assignments = this.parser.Classes[0].methods[0].assignments;
		test.equal(assignments.length, 3, "should return number of assignments");
		test.equal(assignments[0], "nUpdated", "should return proper name of variable");
		test.equal(assignments[1], "nStatus", "should return proper name of variable");
		test.equal(assignments[2], "nId", "should return proper name of variable");
		test.done();
	}
};