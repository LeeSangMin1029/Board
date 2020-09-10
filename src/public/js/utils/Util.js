import { isEmpty, isNotEmpty } from "./ObjectValidation.js";

const navigateToURL = (targetURL = "") => {
  try {
    if (isNotEmpty(targetURL)) {
      location = targetURL;
    }
  } catch (err) {
    console.error(err);
  }
};

const partial = function (func, ...argsBound) {
  return function (...args) {
    return func.call(this, ...argsBound, ...args);
  };
};

const getParameterByName = (name, url = window.location.href) => {
  const replacedName = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp(`[?&]${replacedName}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

const buildQueryString = (params = {}) => {
  try {
    const query = filterEmptyValue(params);
    if (isEmpty(query)) return "";
    return `?${new URLSearchParams(query)}`;
  } catch (err) {
    console.error(err);
  }
};

const filterEmptyValue = (object = {}) => {
  try {
    const filteredObject = Object.keys(object).reduce((acc, key) => {
      if (!isEmpty(object[key])) acc[key] = object[key];
      return acc;
    }, {});
    return filteredObject;
  } catch (err) {
    console.error(err);
  }
};

export {
  navigateToURL,
  getParameterByName,
  buildQueryString,
  filterEmptyValue,
  partial,
};
