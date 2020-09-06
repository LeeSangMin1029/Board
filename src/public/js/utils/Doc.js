import { isEmpty, isNotEmpty } from "./ObjectValidation.js";

const getDocuments = (selector = "", isAll = false) => {
  try {
    if (isNotEmpty(selector)) {
      return isAll
        ? document.querySelectorAll(selector)
        : document.querySelector(selector);
    }
  } catch (err) {}
};

const addEvent = function (
  doc,
  eventName = "",
  bindingFn = {},
  prevent = false,
  useCapture = false
) {
  let execute = {};
  if (typeof bindingFn === "function") execute = bindingFn.bind(this);
  else throw new Error("This bindingFn is not a function!");
  doc.addEventListener(
    eventName,
    (e) => {
      prevent ? e.preventDefault() : null;
      try {
        execute(e, doc);
      } catch (err) {}
    },
    useCapture
  );
};

const alertError = (targetDocument = {}, errorMsg = "", attrName = "") => {
  try {
    targetDocument.setAttribute(attrName, errorMsg);
  } catch (err) {
    console.log(err);
  }
};

const alertAllError = (errors, attrName) => {
  for (const [k, v] of Object.entries(errors)) {
    alertError(getDocuments(`#${k}`).parentNode, v, attrName);
  }
};

export {
  getDocuments,
  addEvent,
  alertError,
  alertAllError,
  isEmpty,
  isNotEmpty,
};
