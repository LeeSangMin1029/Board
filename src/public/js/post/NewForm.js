import {
  FormValidate,
  getDocuments,
  showAlert,
  isEmpty,
  isNotEmpty,
} from "../utils/Form.js";
import { navigateToURL } from "../utils/Util.js";

const createForm = new FormValidate("#post-create");
createForm.addSubmitEvent(async function () {
  try {
    const fetched = await fetch("/posts", {
      body: this.formData,
      method: "POST",
    });
    const { response } = await fetched.json();
    if (response.success) {
      navigateToURL("/");
    } else {
      showAlert(this.form, response.errors);
    }
  } catch (err) {
    console.log(err);
  }
}, true);
