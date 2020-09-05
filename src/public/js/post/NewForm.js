import {
  FormValidate,
  getDocuments,
  isEmpty,
  isNotEmpty,
} from "../utils/Form.js";

const createForm = new FormValidate("#post-create");
createForm.addSubmitEvent(async function () {
  try {
    const fetched = await fetch("/posts", {
      body: this.formData,
      method: "POST",
    });
    const { response } = await fetched.json();
  } catch (err) {
    console.log(err);
  }
}, true);
