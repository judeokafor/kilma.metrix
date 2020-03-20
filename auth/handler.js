'use strict';
const { generateAuthResponse } = require('../utils/misc');
module.exports.authorizer = async event => {
	const token = event.authorizationToken.toLowerCase();
	const { methodArn } = event;
	switch (token) {
		case 'allow':
			return generateAuthResponse('user', 'Allow', methodArn);
		default:
			return generateAuthResponse('user', 'Deny', methodArn);
	}
};
