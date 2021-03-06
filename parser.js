var Parser = function () {

	this.Classes = [];
	this.fileName = "";
	this.currentLine = 0;
	this.multilines = [];

	this.execute = function (data) {
		// Split strings to array
		var lines = data.split("\n");

		// Parse each line
		for (var i = 0; i < lines.length; i++) {
			// set active line number
			this.currentLine = i + 1;

			this.parseLine(lines[i]);
		};
	};

	this.parseLine = function (line) {

		line = this.cleanUpLine(line);

		if (this.isIgnoredPattern(line)) {
			return true;
		}

		var pattern;

		// check for multiline
		pattern = /;$/gi;
		if (line.contains(pattern)) {
			this.multilines.push(line.remove(pattern));
			return true;
		}

		if (this.multilines.length) {
			line = this.multilines.join(" ") + line;
			this.multilines = [];
		}

		// check for class declaration
		pattern = /(^define +class)/gi;
		if (line.contains(pattern)) {
			// create new class item
			var activeClass = new Class();
			var words = line.remove(pattern).split(" ");
			// set name
			activeClass.name = words[0];
			// set parent
			activeClass.parent = words[2];
			// set begin line number
			activeClass.beginLine = this.currentLine;
			// add class to classes array
			this.Classes.push(activeClass);
			return true;
		}

		// check for class closure
		pattern = /^enddefine$/gi;
		if (line.contains(pattern)) {
			// get active class object
			var activeClass = this.getActiveClass();
			// set end line number
			activeClass.endLine = this.currentLine;
			return true;
		}

		// check for function closure
		pattern = /^endfunc$/gi;
		if (line.contains(pattern)) {
			// get active function object
			var func = this.getActiveMethod();
			// set end line number
			func.endLine = this.currentLine;
			return true;
		}

		// check for function declaration
		pattern = /^(protected )?(hidden )?(func(?:tion)?)/gi;
		if (line.contains(pattern)) {
			// get active class object
			var activeClass = this.getActiveClass();
			// create new function item
			var func = new Func();
			// set name
			func.name = line.remove(pattern);
			// function name (parameters) declaration
			this.searchInlineParametersDeclaration(func);
			// set begin line number
			func.beginLine = this.currentLine;
			// add function object
			activeClass.methods.push(func);
			return true;
		}

		// check for procedure closure
		pattern = /^endproc$/gi;
		if (line.contains(pattern)) {
			// get active procedure object
			var proc = this.getActiveMethod();
			// set end line number
			proc.endLine = this.currentLine;
			return true;
		}

		// check for procedure declaration
		pattern = /^(protected )?(hidden )?(proc(?:edure)?)/gi;
		if (line.contains(pattern)) {
			// get active class object
			var activeClass = this.getActiveClass();
			// create new procedure item
			var proc = new Proc();
			// set name
			proc.name = line.remove(pattern);
			// procedure name (parameters) declaration
			this.searchInlineParametersDeclaration(proc);
			// set begin line number
			proc.beginLine = this.currentLine;
			// add procedure object
			activeClass.methods.push(proc);
			return true;
		}

		// check for parameter declaration
		pattern = /^(?:l)?parameters/gi;
		if (line.contains(pattern)) {
			// get active method object
			var meth = this.getActiveMethod();
			// split params
			var params = line.remove(pattern).split(',');
			for (var i = 0; i < params.length; i++) {
				// add param
				meth.parameters.push(params[i].trim());
			}
			return true;
		}

		// check for array declaration
		pattern = /^local array /gi;
		if (line.contains(pattern)) {
			// get active method object
			var meth = this.getActiveMethod();
			// remove declaration
			var declaration = line.remove(pattern);
			// test parentheses declaration
			var pattern = /\([0-9](?:\,)?(?:\s)?(?:[0-9])?\)/gi;
			if (!line.contains(pattern)) {
				// test brackets declaration
				var pattern = /\[[0-9](?:\,)?(?:\s)?(?:[0-9])?\]/gi;
			}
			// split variables
			var variables = declaration.remove(pattern).split(',');
			for (var i = 0; i < variables.length; i++) {
				// add variable
				meth.variables.push(variables[i].trim());
			}
			return true;
		}

		// check for variable declaration
		pattern = /^local /gi;
		if (line.contains(pattern)) {
			// get active method object
			var meth = this.getActiveMethod();
			// split variables
			var variables = line.remove(pattern).split(',');
			for (var i = 0; i < variables.length; i++) {
				// add variable
				meth.variables.push(variables[i].trim());
			}
			return true;
		}

		// check for array assignment
		pattern = /^(?:m\.)?(\w+) *(\()|(\[).*?=/gi;
		if (line.contains(pattern)) {
			// test parentheses declaration
			var pattern = /\([0-9](?:\,)?(?:\s)?(?:[0-9])?\)/gi;
			if (!line.contains(pattern)) {
				// test brackets declaration
				var pattern = /\[[0-9](?:\,)?(?:\s)?(?:[0-9])?\]/gi;
			}
			// get active method object
			var meth = this.getActiveMethod();
			meth.assignments.push(line.remove(pattern).split(" ")[0]);
			return true;
		}

		// check for assignment
		pattern = /^(?:m\.)?(\w+) *(\[.*?)?=/gi;
		if (line.contains(pattern)) {
			// retrieve everything before equal sign
			var variable = line.substr(0, line.indexOf("=")).trim();
			// get active class object
			var activeClass = this.getActiveClass();
			// get active method object
			var meth = activeClass.getActiveMethod();
			// if we are not in a method
			// this is a class property
			if (meth === undefined) {
				activeClass.properties.push(variable);
			} else {
				// look for m. declaration
				var index = variable.toLowerCase().indexOf("m.");
				if (index >= 0) {
					// get rid of m. declaration
					variable = variable.substr(index + 2);
				}
				meth.assignments.push(variable);
			}
			return true;
		}

		pattern = /^return/gi;
		if (line.contains(pattern)) {
			// get active class object
			var activeClass = this.getActiveClass();
			if (activeClass) {
				// get active method object
				var meth = activeClass.getActiveMethod();
				if (meth) {
					// increment return count
					meth.returnCount += 1;
				}
			}
			return true;
		}

		// if statements
		pattern = /^if +(?:not)?/gi;
		if (line.contains(pattern)) {
			console.log("### " + line);
			line = line.remove(pattern);
			// check for function usage
			pattern = /\(/gi;
			if (line.contains(pattern)) {
				var start = line.indexOf("(");
				var end = line.indexOf(")");
				line = line.substr(start + 1, end - start - 1).trim();
			}

			if (this.isEmptyLine(line)) {
				return true;
			}

			pattern = /^this/gi;
			if (line.contains(pattern)) {
				// ignore class properties
				return true;
			}
			// get active method object
			var meth = this.getActiveMethod();
			meth.assignments.push(line);
			console.log('::> ' + line);
			return true;
		}

		// for loop
		pattern = /^for +(?:each +)?(?:m\.)?(\w*)/gi;
		if (line.contains(pattern)) {
			// get active method object
			var meth = this.getActiveMethod();
			var variables = /(?:m\.)?(\w+) *(\[.*?)?=/gi.exec(line);
			meth.assignments.push(variables[1]);
			return true;
		}

		// store assignments
		pattern = /^store\s+.*?\s+to\s+/gi;
		if (line.contains(pattern)) {
			// get active method object
			var meth = this.getActiveMethod();
			var assignments = line.remove(pattern).split(',');
			for (var i = 0; i < assignments.length; i++) {
				// add variable
				meth.assignments.push(assignments[i].remove(/(?:m\.)?/gi));
			}
			return true;
		}

		// scatter assignments
		pattern = /^scatter +(?:memo +)?name +(?:m\.)/gi;
		if (line.contains(pattern)) {
			// get active method object
			var meth = this.getActiveMethod();
			meth.assignments.push(line.remove(pattern));
			return true;
		}

		// to assignments
		pattern = /(?:calcutate|catch|count|sum|text) to (?:m\.)?/gi;
		if (line.contains(pattern)) {
			// get active method object
			var meth = this.getActiveMethod();
			meth.assignments.push(line.remove(pattern));
			return true;
		}

		// do form
		pattern = /^do form .* with /gi;
		if (line.contains(pattern)) {
			// get active method object
			var meth = this.getActiveMethod();
			var assignments = line.remove(pattern).split(',');
			for (var i = 0; i < assignments.length; i++) {
				// add variable
				meth.assignments.push(assignments[i].remove(/(?:m\.)?/gi));
			}
			return true;
		}

		// dimension
		pattern = /^dimension /gi;
		if (line.contains(pattern)) {
			// get active method object
			var meth = this.getActiveMethod();
			var assign = line.remove(pattern).remove(/(?:m\.)?/gi);
			pattern = /\([0-9](?:\,)?(?:\s)?(?:[0-9])?\)/gi;
			if (!line.contains(pattern)) {
				pattern = /\[[0-9](?:\,)?(?:\s)?(?:[0-9])?\]/gi;
			}
			if (meth) {
				meth.assignments.push(assign.remove(pattern));
			} else {
				// class property
				var activeClass = this.getActiveClass();
				activeClass.properties.push(assign.remove(pattern));
			}
			return true;
		}

		// scan
		pattern = /^scan for /gi;
		if (line.contains(pattern)) {
			line = line.remove(pattern);
			pattern = /=(?:\s)?/gi;
			if (line.contains(pattern)) {
				line = line.remove(pattern);
				lines = line.split(' ');
				var meth = this.getActiveMethod();
				for (var i = 1; i < lines.length; i++) {
					line = lines[i].trim();
					pattern = /(?:m\.)?/gi;
					if (line.contains(pattern)) {
						line = line.remove(pattern);
						if (!line.isOperator() && !line.isNumber() && !line.isField() && !line.isProperty()) {
							meth.assignments.push(line);
						}
					}
				}
			}
			return true;
		}

		// no pattern found
		console.log("no pattern found : " + line);
		return false;
	}

	this.contains = function (pattern, line) {
		return pattern.test(line);
	};

	this.remove = function (pattern, line) {
		return line.replace(pattern, '').trim();
	};

	this.getActiveClass = function () {
		if (!this.Classes.length) {
			this.Classes.push(new Class());
		}
		return this.Classes[this.Classes.length - 1];
	};

	this.getActiveMethod = function () {
		var activeClass = this.getActiveClass();
		return activeClass.getActiveMethod();
	};

	this.searchInlineParametersDeclaration = function (meth) {
		var pattern = /\(/gi;
		if (meth.name.contains(pattern)) {
			var names = meth.name.split("(");
			meth.name = names[0].trim();
			var parameters = names[1].remove(")").split(",");
			for (var i = 0; i < parameters.length; i++) {
				meth.parameters.push(parameters[i].trim());
			};
		}
	};

	this.isEmptyLine = function (line) {
		return line.length === 0;
	}

	this.isIgnoredPattern = function (line) {

		var pattern;

		// check for empty line
		if (this.isEmptyLine(line)) {
			return true;
		}

		// check for comment line
		pattern = /(^\*)|(^&&)/gi;
		if (line.contains(pattern)) {
			return true;
		}

		// ignored pattern
		pattern = /(^endfor)|(^endtext)|(^endwith)|(^endcase)|(^endif)|(^enddo)|(^endscan)|(^otherwise)|(^do case)|(^else)|(^select)|(^nodefault)|(^dodefault)|(^#include)|(^scan$)/gi;
		if (line.contains(pattern)) {
			return true;
		}

	};

	// remove inline comments and trailing spaces
	this.cleanUpLine = function (line) {
		var pattern = /&&/gi;
		if (line.contains(pattern)) {
			return line.substr(0, line.indexOf('&&')).trim();
		}
		return line.trim();
	};

	this.report = function () {
		return JSON.stringify(this);
	};

};

var Class = function () {
	this.name = '';
	this.parent = '';
	this.beginLine = 0;
	this.endLine = 0;
	this.methods = [];
	this.properties = [];

	this.getActiveMethod = function () {
		return this.methods[this.methods.length - 1];
	}
}

var Meth = function () {
	this.name = '';
	this.beginLine = 0;
	this.endLine = 0;
	this.parameters = [];
	this.variables = [];
	this.assignments = [];
	this.returnCount = 0;
}

var Proc = function () {
	return new Meth();
}
var Func = function () {
	return new Meth();
}

String.prototype.contains = function (pattern) {
	return pattern.test(this);
}

String.prototype.remove = function (pattern) {
	return this.replace(pattern, '').trim();
}

String.prototype.isField = function () {
	return this == this.toUpperCase();
}

String.prototype.isNumber = function () {
	var pattern = /^[0-9]/gi;
	return this.contains(pattern);
};

String.prototype.isOperator = function () {
	var pattern = /(\<\>)|(\<)|(\>)|(\<\=)|(\>\=)|(\!=)|(==)|(=)|(and)|(or)/gi;
	return this.contains(pattern);
};

String.prototype.isProperty = function () {
	var pattern = /(^this)|(^thisform)|(^\.)/gi;
	return this.contains(pattern);
};

// expose parser constructor
module.exports = Parser;