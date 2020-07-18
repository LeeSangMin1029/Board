function safeParseJSON(json) {
  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch (err) {
    console.log(err);
  }
  return parsed;
}

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function isEmptyArray(arr) {
  return Array.isArray(arr) && !arr.length;
}

export { safeParseJSON, isEmptyArray, isEmptyObject };
