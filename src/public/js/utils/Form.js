import { getDocuments, addEvent, isEmpty, isNotEmpty } from "./Doc.js";

const confirmSuccess = (formDoc) => {
  formDoc.submit();
};

const submitConfirm = (
  formDoc = {},
  confirmMsg = "",
  success = confirmSuccess
) => {
  try {
    if (isNotEmpty(confirmMsg) || isNotEmpty(formDoc)) {
      if (confirm(confirmMsg)) {
        success(formDoc);
      }
    }
  } catch (err) {}
};

class FormValidate {
  constructor(selector = "") {
    let tmpDoc = isNotEmpty(selector) ? getDocuments(selector) : {};
    this.form = tmpDoc;
    this.formData = new FormData(tmpDoc);
  }

  get data() {
    const parsed = {};
    for (const [key, value] of this.formData) {
      parsed[key] = value;
    }
    return parsed;
  }

  set data(form) {
    this.formData = new FormData(form);
  }

  submitEvent(bindingFn = {}, prevent = false, useCapture = false) {
    addEvent.call(this, this.form, "submit", bindingFn, prevent, useCapture);
  }
}

export { FormValidate, submitConfirm, getDocuments, isEmpty, isNotEmpty };
