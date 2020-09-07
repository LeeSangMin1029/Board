import { isNotEmpty } from "./ObjectValidation.js";

const navigateToURL = (targetURL = "") => {
  try {
    if (isNotEmpty(targetURL)) {
      location = targetURL;
    }
  } catch (err) {
    console.log(err);
  }
};

const partial = function (func, ...argsBound) {
  return function (...args) {
    return func.call(this, ...argsBound, ...args);
  };
};

export { navigateToURL, partial };
