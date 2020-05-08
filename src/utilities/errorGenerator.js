module.exports = (errorName, errorMessage, errorCode) => {
  return {
    error: {
      status: errorCode,
      name: errorName,
      message: errorMessage,
    },
  };
};
