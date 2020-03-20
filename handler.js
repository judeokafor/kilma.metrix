'use strict';
const AWS = require('aws-sdk');
const fileType = require('file-type');
const s3 = new AWS.S3();
const db = new AWS.DynamoDB.DocumentClient({
	apiVersion: '2012-08-10',
	region: 'eu-west-2',
});
const calculateDistance = require('./utils/calculateDistance');
const getFile = require('./utils/upload');
module.exports.postUpload = async event => {
	let responseBody = {};
	let statusCode = 0;
	const { name } = event.Records[0].s3.bucket;
	const { key } = event.Records[0].s3.object;
	const getObjectParams = {
		Bucket: name,
		Key: key,
	};
	try {
		const s3Data = await s3.getObject(getObjectParams).promise();
		const locationString = s3Data.Body.toString();
		const locationsJSON = JSON.parse(locationString);
		const putData = locationsJSON.map(async location => {
			const {
				id,
				longitude,
				latitude,
				name,
				zipCode,
				population,
				description,
			} = location;

			const putParams = {
				TableName: 'Locations',
				Item: {
					id,
					longitude,
					latitude,
					name,
					zipCode,
					population,
					description,
					distance: calculateDistance(parseFloat(latitude), parseFloat(longitude)),
				},
			};
			await db.put(putParams).promise();
		});
		await Promise.all(putData);
		responseBody = 'Success adding locations';
		statusCode = 201;
	} catch (error) {
		responseBody = 'Error adding locations';
		statusCode = 400;
	}
	const response = {
		statusCode,
		body: responseBody,
	};
	return response;
};
module.exports.getLocationById = async event => {
	let responseBody = {};
	let statusCode = 0;
	const { id } = event.pathParameters;
	const params = {
		Key: {
			id,
		},
		TableName: 'Locations',
	};
	try {
		const data = await db.get(params).promise();
		responseBody = JSON.stringify(data.Item);
		statusCode = 200;
	} catch (error) {
		responseBody = 'Unable to get location data';
		statusCode = 400;
	}
	const response = {
		statusCode,
		body: responseBody,
	};
	return response;
};
module.exports.getAllLocations = async event => {
	let responseBody = {};
	let statusCode = 0;
	const params = {
		TableName: 'Locations',
	};
	try {
		const data = await db.scan(params).promise();
		responseBody = JSON.stringify(data.Items);
		statusCode = 200;
	} catch (error) {
		responseBody = 'Unable to get location data';
		statusCode = 400;
	}
	const response = {
		statusCode,
		body: responseBody,
	};
	return response;
};
module.exports.uploadFile = async (event, context) => {
	let responseBody = {};
	let statusCode = 0;
	const request = event.body;
	const base64String = request.base64String;
	try {
    const buffer = Buffer.from(base64String, 'base64');
		const fileMime = fileType(buffer);
		if (fileMime === null) {
			return context.fail('The string supplied is not a file type');
		}
		const file = getFile(fileMime, buffer);
		const params = file.params;
		s3.putObject(params, (err, data) => {
			if (err) {
				console.log(err);
			}
			return console.log(data.full_path);
		});
		responseBody = 'Finished uploading';
		statusCode = 200;
	} catch (error) {
		responseBody = 'Error uploading document';
		statusCode = 500;
    }
    const response = {
        statusCode,
        body: responseBody
    }
    return response;
};


