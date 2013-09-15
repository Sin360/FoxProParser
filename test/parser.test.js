'use strict';

var Parser = require('../parser.js');

exports['parser'] = {
	setUp: function (callback) {
		// instantiate a new parser for each test
        this.parser = new Parser();
        callback();
    },
	instanciate: function (test) {
		test.equal(typeof this.parser, "object", "should instanciate parser object");
		test.done();
	},
	getActiveClass: function (test) {
		this.parser.getActiveClass();
		test.equal(this.parser.Classes.length, 1, "should add a class object to classes array");
		test.done();
	},
	getActiveMethod: function (test) {
		this.parser.parseLine("function mop");
		var meth = this.parser.getActiveMethod();
		test.ok(meth, "should return something");
		test.equal(typeof meth, "object", "should return an object");
		test.done();
	},
	parseLine: function (test) {
		test.ok(this.parser.parseLine("DEFINE CLASS Mop"), "should parse class declaration");
		test.equal(this.parser.Classes[0].name, "Mop", "should extract proper class name");
		test.ok(this.parser.parseLine("RETURN"), "should return true");
		test.ok(this.parser.parseLine("FUNCTION test"), "should return true");
		test.equal(this.parser.Classes[0].methods.length, 1, "should fetch methods array");
		test.equal(this.parser.Classes[0].methods[0].name, "test", "should return proper method name");
		test.ok(this.parser.parseLine("FOR M.nI = 1 TO 3 STEP 1"), "should return true");
		test.equal(this.parser.Classes[0].methods[0].assignments[0], "nI", "should find variable assignment in for loop");
		test.ok(this.parser.parseLine("STORE 0 TO M.nI"), "should return true");
		test.equal(this.parser.Classes[0].methods[0].assignments[1], "nI", "should find variable assignment in store command");
		test.ok(this.parser.parseLine("SCATTER NAME M.oObj"), "should return true");
		test.equal(this.parser.Classes[0].methods[0].assignments[2], "oObj", "should find variable assignment in scatter command");
		test.ok(this.parser.parseLine("COUNT TO M.nCount"), "should return true");
		test.equal(this.parser.Classes[0].methods[0].assignments[3], "nCount", "should find variable assignment in to command")
		test.ok(this.parser.parseLine("DO FORM 'mop.scx' WITH M.oReleve, M.cNumNda"), "should return true");
		test.ok(this.parser.Classes[0].methods[0].assignments[4], "oReleve", "should find variable assignment in do form command");
		test.ok(this.parser.Classes[0].methods[0].assignments[5], "cNumNda", "should find variable assignment in do form command");

		test.done();
	},
	report: function (test) {
		test.equal(typeof this.parser.report(), "string", "should return a serialized object");
		test.done();
	},
	test: function (test) {
		var fs = require('fs');

		fs.readFile('./test.prg', "utf8", function (err, data) {

			// Catch error
			if (err) {
				throw err;
			}

			// Split strings to array
			var lines = data.split("\n");

			// Instanciate parser
			var parser = new Parser();

			// Set name of parsed file
			parser.fileName = 'test.prg';

			// Parse each line
			for (var i = 0; i < lines.length; i++) {
				parser.parseLine(lines[i]);
			};

			test.equal(typeof parser, "object", "should be an object");
			test.equal(parser.fileName, "test.prg", "should return filename");
			test.equal(parser.Classes.length, 1, "should return number of classes");
			test.equal(parser.currentLine, lines.length, "should return number of lines");
			test.equal(parser.Classes[0].name, "Mop", "should return class name");
			test.equal(parser.Classes[0].properties.length, 2, "should return number of properties");

			// end of tests
			test.done();

		});
	}
};