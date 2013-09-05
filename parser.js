var Parser = function () {

	this.Classes = [];
	this.fileName = "";
	this.currentLine = 0;

	this.parseLine = function (line) {

		var pattern;

		// remove trailing spaces
		var line = line.trim()

		// increment active line number
		this.currentLine += 1;

		// check for comment declaration
		pattern = /^\*/gi;
		if (line.contains(pattern)) {
			return true;
		}

		// check for class declaration
		pattern = /(^DEFINE +CLASS)/gi;
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
		pattern = /^ENDDEFINE$/gi;
		if (line.contains(pattern)) {
			// get active class object
			var activeClass = this.getActiveClass();
			// set end line number
			activeClass.endLine = this.currentLine;
			return true;
		}

		// check for function closure
		pattern = /^ENDFUNC$/gi;
		if (line.contains(pattern)) {
			// get active class object
			var activeClass = this.getActiveClass();
			// get active function object
			var func = activeClass.getActiveMethod();
			// set end line number
			func.endLine = this.currentLine;
			return true;
		}

		// check for function declaration
		pattern = /(PROTECTED )?(HIDDEN )?(FUNC(?:TION)?)/gi;
		if (line.contains(pattern)) {
			// get active class object
			var activeClass = this.getActiveClass();
			// create new function item
			var func = new Func();
			// set name
			func.name = line.remove(pattern);
			// set begin line number
			func.beginLine = this.currentLine;
			// add function object
			activeClass.methods.push(func);
			return true;
		}

		// check for procedure closure
		pattern = /^ENDPROC$/gi;
		if (line.contains(pattern)) {
			// get active class object
			var activeClass = this.getActiveClass();
			// get active procedure object
			var proc = activeClass.getActiveMethod();
			// set end line number
			proc.endLine = this.currentLine;
			return true;
		}

		// check for procedure declaration
		pattern = /(PROTECTED )?(HIDDEN )?(PROC(?:EDURE)?)/gi;
		if (line.contains(pattern)) {
			// get active class object
			var activeClass = this.getActiveClass();
			// create new procedure item
			var proc = new Proc();
			// set name
			proc.name = line.remove(pattern);
			// set begin line number
			proc.beginLine = this.currentLine;
			// add procedure object
			activeClass.methods.push(proc);
			return true;
		}

		// check for parameter declaration
		pattern = /^(?:L)?PARAMETERS/gi;
		if (line.contains(pattern)) {
			// get active class object
			var activeClass = this.getActiveClass();
			// get active method object
			var meth = activeClass.getActiveMethod();
			// split params
			var params = line.remove(pattern).split(',');
			for (var i = 0; i < params.length; i++) {
				// add param
				meth.parameters.push(params[i].trim());
			}
			return true;
		}

		// check for variable declaration
		pattern = /^LOCAL (?:ARRAY )?/gi;
		if (line.contains(pattern)) {
			// get active class object
			var activeClass = this.getActiveClass();
			// get active method object
			var meth = activeClass.getActiveMethod();
			// split variables
			var variables = line.remove(pattern).split(',');
			for (var i = 0; i < variables.length; i++) {
				// add variable
				meth.variables.push(variables[i].trim());
			}
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

		pattern = /^RETURN/gi;
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

		// for loop
		pattern = /^For +(?:Each +)?(?:m\.)?(\w*)/gi;
		if (line.contains(pattern)) {
			// get active class object
			var activeClass = this.getActiveClass();
			// get active method object
			var meth = activeClass.getActiveMethod();
			var variables = /(?:m\.)?(\w+) *(\[.*?)?=/gi.exec(line);
			meth.assignments.push(variables[1]);
			return true;
		}

		// store assignments
		pattern = /^store\s+.*?\s+to\s+(.+?)$/gi;
		if (line.contains(pattern)) {
			console.log(line);
			return true;
		}

		// no pattern found
		return false;
	}

	this.contains = function (pattern, line) {
		return pattern.test(line);
	}

	this.remove = function (pattern, line) {
		return line.replace(pattern, '').trim();
	}

	this.getActiveClass = function () {
		if (!this.Classes.length) {
			this.Classes.push(new Class());
		}
		return this.Classes[this.Classes.length - 1];
	}

	this.report = function () {
		console.log(JSON.stringify(this));
		return JSON.stringify(this);
	}

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

// expose parser constructor
module.exports = Parser;