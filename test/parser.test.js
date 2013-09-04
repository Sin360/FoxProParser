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
		test.done();
	},
	report: function (test) {
		var parser = new Parser();
		test.equal(typeof parser.report(), "string", "should return a serialized object");
		test.done();
	}
};