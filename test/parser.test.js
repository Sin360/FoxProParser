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
		test.equal(parser.Classes[0].methods[0].assignments[0], "nI", "should find variable assignment in for loop");
		test.ok(parser.parseLine("STORE 0 TO M.nI"), "should return true");
		test.equal(parser.Classes[0].methods[0].assignments[1], "nI", "should find variable assignment in store command");
		test.ok(parser.parseLine("SCATTER NAME M.oObj"), "should return true");
		test.equal(parser.Classes[0].methods[0].assignments[2], "oObj", "should find variable assignment in scatter command");
		test.ok(parser.parseLine("COUNT TO M.nCount"), "should return true");
		test.equal(parser.Classes[0].methods[0].assignments[3], "nCount", "should find variable assignment in to command")
		test.ok(parser.parseLine("DO FORM 'mop.scx' WITH M.oReleve, M.cNumNda"), "should return true");
		test.ok(parser.Classes[0].methods[0].assignments[4], "oReleve", "should find variable assignment in do form command");
		test.ok(parser.Classes[0].methods[0].assignments[5], "cNumNda", "should find variable assignment in do form command");
		test.ok(parser.parseLine("DIMENSION M.aTab(1, 3)", "should return true"));
		test.equal(parser.Classes[0].methods[0].assignments[6], "aTab", "should find variable assignment in dimension command");
		test.ok(parser.parseLine("DIMENSION M.aArray(1)", "should return true"));
		test.equal(parser.Classes[0].methods[0].assignments[7], "aArray", "should find variable assignment in dimension command");
		test.ok(parser.parseLine("DIMENSION atest(1)", "should return true"));
		test.equal(parser.Classes[0].methods[0].assignments[8], "atest", "should find variable assignment in dimension command");
		test.ok(parser.parseLine("LOCAL ARRAY aCos(1), aSin(1)"), "should return true");
		test.equal(parser.Classes[0].methods[0].variables[0], "aCos", "should find array declaration");
		test.equal(parser.Classes[0].methods[0].variables[1], "aSin", "should find array declaration");
		test.done();
	},
	report: function (test) {
		var parser = new Parser();
		test.equal(typeof parser.report(), "string", "should return a serialized object");
		test.done();
	}
};