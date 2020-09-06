import { FormValidate } from "../utils/Form.js";
import { alertAllError } from "../utils/Doc.js";
import { navigateToURL } from "../utils/Util.js";

const createForm = new FormValidate("#post-create");
createForm.submitEvent(async function () {
  try {
    this.data = this.form;
    const fetched = await fetch("/posts", {
      body: this.formData,
      method: "POST",
    });
    const { response } = await fetched.json();
    if (response.success) {
      navigateToURL("/");
    } else {
      alertAllError(response.errors, "error-messages");
    }
  } catch (err) {
    console.log(err);
  }
}, true);
