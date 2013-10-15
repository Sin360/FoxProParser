'use strict';

var Parser = require('../parser.js');

exports['strings'] = {
	isNumber: function (test) {
		var chars = "0123456789";
		for (var i = 0; i < chars.length; i++) {
			test.ok(chars[i].isNumber(), "should return true");
		}
		chars = "abcdefghijklmnopqrstuvwxyz";
		for (var i = 0; i < chars.length; i++) {
			test.notEqual(chars[i].isNumber(), "should return false");
		}
		test.done();
	},
	isOperator: function (test) {
		var operators = ["and","or","<>","<",">","<=",">=","!=","=","=="];
		for (var i = 0; i < operators.length; i++) {
			test.ok(operators[i].isOperator(), "should return true");
		}
		test.notEqual("string".isOperator());
		test.done();
	},
	isProperty: function (test) {
		var properties = ["this.mop","thisform.mop",".mop"];
		for (var i = 0; i < properties.length; i++) {
			test.ok(properties[i].isProperty(), "should return true");
		}
		test.notEqual("mop".isProperty(), "should return false");
		test.done();
	}
};