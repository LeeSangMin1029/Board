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

export { getDocuments, isEmpty, isNotEmpty };
