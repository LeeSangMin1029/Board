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
  if (typeof value === "null" || typeof value === "undefined") {
    return true;
  }
  if (Object.keys(value).length === 0 && value.constructor === Object) {
    console.log(value);
    return true;
  }

  return false;
}

function isEmptyArray(arr) {
  return Array.isArray(arr) && !arr.length;
}

export { safeParseJSON, isEmptyArray, isEmpty };
