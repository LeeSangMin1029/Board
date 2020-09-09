import { isEmpty } from "./ObjectValidation.js";

const getDocuments = (selector = "", isAll = false) => {
  if (isEmpty(selector)) return;
  try {
    return isAll
      ? document.querySelectorAll(selector)
      : document.querySelector(selector);
  } catch (err) {}
};

const addEvent = function (
  doc,
  eventName = "",
  callFunc = {},
  prevent = false,
  useCapture = false
) {
  if (!typeof callFunc === "function" || !doc) return;
  doc.addEventListener(
    eventName,
    function (e) {
      prevent ? e.preventDefault() : null;
      try {
        callFunc.call(this, e);
      } catch (err) {}
    },
    useCapture
  );
};

const nodeListAddEvent = (eachDoc, callFunc) => {
  if (
    !NodeList.prototype.isPrototypeOf(eachDoc) ||
    !typeof callFunc === "function"
  )
    return;
  eachDoc.forEach((doc) => {
    callFunc.call(this, doc);
  });
};

export { getDocuments, addEvent, nodeListAddEvent };
