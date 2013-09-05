var Parser = require('../parser.js');

exports.parser = {
	instanciate: function (test) {
		var parser = new Parser();
		test.equal(typeof parser, "object", "should instanciate parser object");
		test.done();
	},
	getActiveClass: function (test) {
		var parser = new Parser();
		parser.getActiveClass();
		test.equal(parser.Classes.length, 1, "should add a class object to classes array");
		test.done();
	},
	parseLine: function (test) {
		var parser = new Parser();
		test.ok(parser.parseLine("DEFINE CLASS Mop"), "should parse class declaration");
		test.equal(parser.Classes[0].name, "Mop", "should extract proper class name");
		test.ok(parser.parseLine("RETURN"), "should return true");
		test.ok(parser.parseLine("FUNCTION test"), "should return true");
		test.equal(parser.Classes[0].methods.length, 1, "should fetch methods array");
		test.ok(parser.parseLine("FOR M.nI = 1 TO 3 STEP 1"), "should return true");
		test.equal(parser.Classes[0].methods[0].assignments[0], "nI", "should find variable assignment");
		test.ok(parser.parseLine("STORE 0 TO M.nI"), "should return true");
		test.done();
	},
	report: function (test) {
		var parser = new Parser();
		test.equal(typeof parser.report(), "string", "should return a serialized object");
		test.done();
	}
};