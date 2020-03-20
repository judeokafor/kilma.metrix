# Kilma.Metrix

- ### There are five lambda function
  - #### 3 Api Gateway
  - #### 1 function triggered by a json file upload
  - #### 1 Authorizer function

## API Endpoints

<table>
<tr><th>HTTP VERB</th><th>ENDPOINTS</th><th>DESCRIPTION</th></tr>
<tr><td>POST</td><td>https://ghps3644e5.execute-api.eu-west-2.amazonaws.com/dev/upload</td><td>Uploads a json file to the s3 bucket which triggers the function to read details from the file uploaded and save to the dynamodb</td></tr>
<tr><td>GET</td><td>https://ghps3644e5.execute-api.eu-west-2.amazonaws.com/dev/</td><td>A protected route to get all locations that have been uploded to the database</td></tr>
<tr><td>GET</td><td>https://ghps3644e5.execute-api.eu-west-2.amazonaws.com/dev/{id}</td><td>A protected route to get locations by id from dynamo database</td></tr>
</table>

### Getting Started

**NOTE:** Please use the `locations.json` file available on this repo as a sample upload.
**NOTE:** For Authorization on get location get request please pass in an authorization header and a value of allow `allow` to view the file.

#### Prerequisites

- [Postman](https://getpostman.com/) - API Toolchain
