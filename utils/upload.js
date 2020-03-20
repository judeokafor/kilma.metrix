const Busboy = require('busboy');
const getContentType = event => {
    const contentType = event.headers["content-type"];
    if (!contentType) {
      return event.headers["Content-Type"];
    }
    return contentType;
  };
const parser = (event) => new Promise((resolve, reject) => {
    const busboy = new Busboy({
        headers: {
            'content-type': getContentType(event)
        }
    });
  
    const result = {};
  
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        file.on('data', data => {
            result.file = data;
        });
  
        file.on('end', () => {
            result.filename = filename;
            result.contentType = mimetype;
        });
    });
  
    busboy.on('field', (fieldname, value) => {
        result[fieldname] = value;
    });
  
    busboy.on('error', error => reject(error));
    busboy.on('finish', () => {
        event.body = result;
        resolve(event);
    });
  
    busboy.write(event.body, event.isBase64Encoded ? 'base64' : 'binary');
    busboy.end();
  });
  module.exports = parser;