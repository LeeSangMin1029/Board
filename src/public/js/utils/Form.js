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
    const parsed = {};
    for (const [key, value] of this.formData) {
      parsed[key] = value;
    }
    return parsed;
  }

  set data(form) {
    this.formData = new FormData(form);
  }

  update() {
    try {
      this.data = this.form;
    } catch (err) {
      console.log(err);
    }
  }

  addSubmitEvent(customFn = {}, prevent = false) {
    let execute = {};
    if (typeof customFn === "function") execute = customFn.bind(this);
    else throw new Error("This object is not a function!");

    this.form.addEventListener("submit", async (e) => {
      prevent ? e.preventDefault() : null;
      try {
        this.update();
        execute();
      } catch (err) {
        console.log(err);
      }
    });
  }

  showAlert(errors) {}
}

export { FormValidate, submitConfirm, getDocuments, isEmpty, isNotEmpty };
