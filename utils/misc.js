const generateAuthResponse = (principalId, effect, methodArn) => {
    const policyDocument = generatePolicyDocument(effect, methodArn);
    return {
        principalId, policyDocument
    }
}
const generatePolicyDocument = (effect, methodArn) => {
    if(!effect || !methodArn) return null;
    const policyDocument = {
        Versions: '2012-10-17',
        Statement: [{
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: methodArn
        }]
    }
    return policyDocument;
}
module.exports = {
    generateAuthResponse
}