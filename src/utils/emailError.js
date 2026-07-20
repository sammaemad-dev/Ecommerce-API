function handleMailError(err) {
  const appError = new Error(err.message);
  const httpStatusCode = 500;
  switch (err.code) {
    case "ECONNECTION":
    case "ETIMEDOUT":
      appError.cause = `Network error, please retry later`;
      appError.message = err.message;
      httpStatusCode = 503;
      break;
    case "EAUTH":
      appError.cause = `Authentication error, check your credentials`;
      appError.message = err.message;
      break;
    case "EENVELOPE":
      appError.cause = `Envelope error (bad sender/recipient addresses)`;
      appError.message = err.message;
      httpStatusCode = 400;
      break;
    case "EMESSAGE":
      appError.cause = `Bad Request`;
      appError.message = err.message;
      httpStatusCode = 400;
    case "ESTREAM":
      appError.cause = `Internal Server Error (Missing local attachment file)`;
      appError.message = err.message;
    default:
      appError.cause = `Unhandled Nodemailer error`;
      appError.message = err.message;
  }
  appError.statusCode = httpStatusCode;
  return appError;
}

module.exports = handleMailError;
