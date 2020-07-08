// const wrapper = (asyncFn) => {
//   return async (req, res, next) => {
//     try {
//       return await asyncFn(req, res, next);
//     } catch (error) {
//       return next(error);
//     }
//   };
// };

// title : message, body : message의 꼴로 만드는 함수
const errorHandler = (errors) => {
  const parsed = {};
  if (errors.name == "ValidationError") {
    for (const name in errors.errors) {
      const validationError = errors.errors[name];
      parsed[name] = { message: validationError.message };
    }
  } else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
};

module.exports = {
  errorHandler: errorHandler,
};
