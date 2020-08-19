const errorListen = {};
errorListen.serverStatus = (err, req, res, next) => {};
errorListen.mongooseValidator = (err, req, res, next) => {
  const responseObject = {};
  responseObject.errors = errorHandler(err);
  if (responseObject.errors !== undefined) {
    return res.json({ response: responseObject });
  } else {
    return res.send(err);
  }
};

const errorHandler = (errors) => {
  const parsed = {};
  if (errors.name == "ValidationError") {
    let validationError;
    for (const name in errors.errors) {
      validationError = errors.errors[name];
      parsed[name] = { message: validationError.message };
    }
  } else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
};

export default errorListen;
