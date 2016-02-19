'use strict';
var createAvaRule = require('../create-ava-rule');

/* eslint quote-props: [2, "as-needed"] */
module.exports = function (context) {
	var ifMultiple = context.options[0] === 'if-multiple';
	var testCount = 0;

	var ava = createAvaRule();
	return ava.merge({
		CallExpression: function (node) {
			if (!ava.isTestFile || ava.currentTestNode !== node) {
				return;
			}

			testCount++;
			var hasNoTitle = node.arguments.length !== 2;
			var isOverThreshold = !ifMultiple || testCount > 1;
			if (hasNoTitle && isOverThreshold) {
				context.report(node, 'Test should have a title.');
			}
		},
		'Program.exit': function () {
			testCount = 0;
		}
	});
};

module.exports.schema = [{
	enum: ['always', 'if-multiple']
}];
