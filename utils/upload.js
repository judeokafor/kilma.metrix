const sha1 = require('sha1');
const moment = require('moment');
const getFile = (fileMime, buffer) => {
	const fileExt = fileMime.ext;
	const hash = sha1(Buffer.from(new Date().toString()));
	const now = moment().format('LLLL');
	const filePath = hash + '/';
	const fileName = Math.round(new Date(now).getTime() / 1000) + '.' + fileExt;
	const fileFullName = filePath + fileName;
	const fileFullPath = fileFullName;
	const params = {
		Bucket: 'kilma-metrix-2',
		Key: fileFullName + fileExt,
		Body: buffer,
	};
	const uploadFile = {
		size: buffer.toString('ascii').length,
		type: fileMime.mime,
		name: fileName,
		fullPath: fileFullPath,
	};
	return {
		params,
		uploadFile,
	};
};
module.exports = getFile;
