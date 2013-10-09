'use strict';

var Parser = require('../parser.js');
var fs = require('fs');
var resources = {};

exports['arrays'] = {
	setUp: function (callback) {

		var self = this;

		if (resources.parser) {
			self.parser = resources.parser;
			callback();
		} else {
			fs.readFile('test/src/arrays.prg', "utf8", function (err, data) {
				// Catch error
				if (err) throw err;

				// Instanciate parser
				var parser = new Parser();

				// Set name of parsed file
				parser.fileName = 'arrays.prg';

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
		test.equal(this.parser.fileName, "arrays.prg", "should return filename");
		test.equal(this.parser.Classes.length, 1, "should return number of classes");
		test.equal(this.parser.currentLine, 47, "should return number of lines");
		test.done();
	},
	classes: function (test) {
		var classes = this.parser.Classes;
		test.expect(2);
		test.equal(classes[0].name, "Arrays", "should return class name");
		test.equal(classes.length, 1, "should return number of classes");
		test.done();
	},
	methods: function (test) {
		var methods = this.parser.Classes[0].methods;
		test.expect(4);
		test.equal(methods.length, 2, "should return number of methods");
		test.equal(methods[0].name, "Assignments", "should return proper method name");
		test.equal(methods[0].variables.length, 0, "should return no declarations");
		test.equal(methods[1].name, "Declarations", "should return proper method name");
		test.done();
	},
	assignments: function (test) {
		var assignments = this.parser.Classes[0].methods[0].assignments;
		test.expect(9);
		test.equal(assignments.length, 8, "should return number of assignments");
		test.equal(assignments[0], "aTab1", "should return proper assignment name");
		test.equal(assignments[1], "aTab2", "should return proper assignment name");
		test.equal(assignments[2], "aTab3", "should return proper assignment name");
		test.equal(assignments[3], "aTab4", "should return proper assignment name");
		test.equal(assignments[4], "aTab5", "should return proper assignment name");
		test.equal(assignments[5], "aTab6", "should return proper assignment name");
		test.equal(assignments[6], "aTab7", "should return proper assignment name");
		test.equal(assignments[7], "aTab8", "should return proper assignment name");
		test.done();
	},
	declarations: function (test) {
		var declarations = this.parser.Classes[0].methods[1].variables;
		test.expect(19);
		test.equal(declarations.length, 18, "should return number of declarations");
		test.equal(declarations[0], "aParSinOneTab1", "should return single one dimension declaration");
		test.equal(declarations[1], "aBraSinOneTab1", "should return single one dimension declaration");
		test.equal(declarations[2], "aParMulOneTab1", "should return multiple one dimension declarations");
		test.equal(declarations[3], "aParMulOneTab2", "should return multiple one dimension declarations");
		test.equal(declarations[4], "aParMulOneTab3", "should return multiple one dimension declarations");
		test.equal(declarations[5], "aBraMulOneTab1", "should return multiple one dimension declarations");
		test.equal(declarations[6], "aBraMulOneTab2", "should return multiple one dimension declarations");
		test.equal(declarations[7], "aBraMulOneTab3", "should return multiple one dimension declarations");
		test.equal(declarations[8], "aParSinTwoTab1", "should return single two dimension declaration");
		test.equal(declarations[9], "aBraSinTwoTab1", "should return single two dimension declaration");
		test.equal(declarations[10], "aParMulTwoTab1", "should return multiple two dimension declarations");
		test.equal(declarations[11], "aParMulTwoTab2", "should return multiple two dimension declarations");
		test.equal(declarations[12], "aParMulTwoTab3", "should return multiple two dimension declarations");
		test.equal(declarations[13], "aBraMulTwoTab1", "should return multiple two dimension declarations");
		test.equal(declarations[14], "aBraMulTwoTab2", "should return multiple two dimension declarations");
		test.equal(declarations[15], "aBraMulTwoTab3", "should return multiple two dimension declarations");
		test.equal(declarations[16], "aTab1", "should return two dimension declaration");
		test.equal(declarations[17], "aTab2", "should return two dimension declaration");
		test.done();
	}
};