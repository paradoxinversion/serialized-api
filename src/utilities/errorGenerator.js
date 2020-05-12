// module.exports = (errorName, errorMessage, errorCode) => {
//   return {
//     error: {
//       status: errorCode,
//       name: errorName,
//       message: errorMessage,
//     },
//   };
// };
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.status = 401;
  }
}

class MissingArgumentError extends Error {
  constructor(message) {
    super(message);
    this.name = "MissingArgumentError";
    this.status = 401;
  }
}

class NoAuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = "NoAuthenticationError";
    this.status = 403;
  }
}

class UserUnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserUnauthorizedError";
    this.status = 403;
  }
}

module.exports = {
  MissingArgumentError,
  NoAuthenticationError,
  UserUnauthorizedError,
  ValidationError,
};
