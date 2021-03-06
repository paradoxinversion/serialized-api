// possible starting point for implementation: https://gist.github.com/ziluvatar/a3feb505c4c0ec37059054537b38fc48

const jwt = require("jsonwebtoken");

function TokenManager(secretOrPrivateKey, secretOrPublicKey, options) {
  this.secretOrPrivateKey = secretOrPrivateKey;
  this.secretOrPublicKey = secretOrPublicKey;
  this.options = options; //algorithm + keyid + noTimestamp + expiresIn + notBefore
}

TokenManager.prototype.sign = function (payload, signOptions) {
  const jwtSignOptions = Object.assign({}, signOptions, this.options);
  return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
};

// refreshOptions.verify = options you would use with verify function
// refreshOptions.jwtid = contains the id for the new token
TokenManager.prototype.refresh = function (token, refreshOptions) {
  const payload = jwt.verify(
    token,
    this.secretOrPublicKey,
    refreshOptions.verify
  );
  delete payload.iat;
  delete payload.exp;
  delete payload.nbf;
  delete payload.jti; //We are generating a new token, if you are using jwtid during signing, pass it in refreshOptions
  const jwtSignOptions = Object.assign({}, this.options, {
    jwtid: refreshOptions.jwtid,
  });
  // The first signing converted all needed options into claims, they are already in the payload
  return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
};

TokenManager.prototype.verify = function (
  token,
  secretOrPublicKey,
  verifyOptions
) {
  const verified = jwt.verify(token, secretOrPublicKey);
  return verified;
};

module.exports = TokenManager;
