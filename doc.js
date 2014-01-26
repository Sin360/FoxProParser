var Doc = function (data) {

	/**
	 * Generates yui documentation for classes and methods
	 *
	 * @method run
	 * @return {string} Classes and methods documentation
	 */
	this.run = function () {

		var report = JSON.parse(data);
		var stream = '';
		var header = '*<\n* description\n';
		var footer = '\n*>\n';

		// add class declaration
		for (var i = 0, classesLen = report.Classes.length, classObj; i < classesLen; i++) {
			classObj = report.Classes[i];
			stream = stream + header + '*\n* @class ' + classObj.name + '\n* @extends ' + classObj.parent + footer;

			// add method declaration
			for (var j = 0, methodsLen = classObj.methods.length, methObj; j < methodsLen; j++) {
				methObj = classObj.methods[j];
				stream = stream + '\n' + header + '*\n* @method ' + methObj.name;

				// add param declaration
				for (var k = 0, paramsLen = methObj.parameters.length, param; k < paramsLen; k++) {
					param = methObj.parameters[k];
					stream = stream + '\n* @param {' + this.getVarType(param) + '} ' + param + ' description';
				}

				// add return declaration
				if (methObj.returnCount) {
					stream = stream + '\n* @return {type} description';
				}

				stream = stream + footer;
			}
		}

		return stream;
	};

	/**
	 * Returns variable type based on prefix
	 *
	 * @method getVarType
	 * @param {string} variable Name of the variable
	 * @return {string} Type of the variable
	 */
	this.getVarType = function (variable) {
		var type;
		switch (variable[0]) {
			case 'c': type = 'string'; break;
			case 'd': type = 'date'; break;
			case 'l': type = 'boolean'; break;
			case 'n': type = 'integer'; break;
			case 'o': type = 'object'; break;
			case 's': type = 'string'; break;
			case 't': type = 'datetime'; break;
			default: type = 'type';
		}
		return type;
	};
};

// expose report constructor
module.exports = Doc;