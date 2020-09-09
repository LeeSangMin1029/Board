"use strict";
function safeParseJSON(json) {
  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch (err) {
    console.log(err);
  }
  return parsed;
}

function isEmpty(value) {
  if (value === 0) return true;
  if ((typeof value === "object" && !value) || typeof value === "undefined") {
    return true;
  }

  if (typeof value === "string" && value === "") {
    return true;
  }

  if (Object.keys(value).length === 0 && value.constructor === Object)
    return true;

  if (Array.isArray(value) && !value.length) return true;
  return false;
}

function isNotEmpty(value) {
  return !isEmpty(value);
}

function isEmptyArray(arr) {
  return Array.isArray(arr) && !arr.length;
}

export { safeParseJSON, isEmptyArray, isEmpty, isNotEmpty };
