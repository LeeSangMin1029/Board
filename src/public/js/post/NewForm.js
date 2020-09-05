import {
  FormValidate,
  getDocuments,
  isEmpty,
  isNotEmpty,
} from "../utils/Form.js";

const createForm = new FormValidate("#post-create");
createForm.addSubmitEvent(async function (e) {
  try {
    const fetched = await fetch("/posts", {
      body: this.data,
      method: "POST",
    });
    return await fetched.json();
  } catch (err) {
    console.log(err);
  }
});
