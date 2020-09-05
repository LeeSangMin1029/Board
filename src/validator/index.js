const errorListen = {};
errorListen.mongooseValidator = (err, req, res, next) => {
  return res.json({ errors: errorHandler(err) });
};

const errorHandler = (errors) => {
  const parsed = {};
  if (errors.name == "ValidationError") {
    let validationError;
    for (const name in errors.errors) {
      validationError = errors.errors[name];
      parsed[name] = validationError.message;
    }
  } else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
};

export default errorListen;
