import { getDocuments, isEmpty, isNotEmpty } from "./Doc.js";

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
    let tmpDoc = {};
    if (isNotEmpty(selector)) {
      tmpDoc = getDocuments(selector);
    } else {
      tmpDoc = {};
    }
    this.form = tmpDoc;
    this.formData = new FormData(tmpDoc);
  }

  get data() {
    return this.formData;
  }

  set data(form) {
    this.formData = new FormData(form);
  }

  addSubmitEvent(customFn = {}) {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      try {
        if (typeof customFn === "function") {
          const target = customFn.bind(this, e);
          target(e);
        } else throw new Error("This object is not a function");
      } catch (err) {
        console.log(err);
      }
    });
  }
}

export { FormValidate, submitConfirm, getDocuments, isEmpty, isNotEmpty };
