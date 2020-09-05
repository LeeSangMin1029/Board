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
    let tmpDoc = isNotEmpty(selector) ? getDocuments(selector) : {};
    this.form = tmpDoc;
    this.formData = new FormData(tmpDoc);
  }

  get data() {
    const formData = {};
    for (const [key, value] of this.formData.entries()) {
      formData[key] = value;
    }
    return formData;
  }

  set data(form) {
    this.formData = new FormData(form);
  }

  update() {
    try {
    } catch (err) {
      console.log(err);
    }
  }

  addSubmitEvent(customFn = {}) {
    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      this.update();
      try {
        if (typeof customFn === "function") {
          const target = customFn.bind(this, e);
          const result = await target(e);
          // this.renderError(result);
        } else throw new Error("This object is not a function");
      } catch (err) {
        console.log(err);
      }
    });
  }

  renderError(errors) {}
}

export { FormValidate, submitConfirm, getDocuments, isEmpty, isNotEmpty };
