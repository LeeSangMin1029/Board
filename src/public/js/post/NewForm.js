import {
  FormValidate,
  getDocuments,
  isEmpty,
  isNotEmpty,
} from "../utils/Form.js";

const execute = async function (e) {
  try {
    const fetced = await fetch("/posts", {
      body: this.data,
      method: "POST",
    });
    console.log(await fetced.json());
  } catch (err) {
    console.log(err);
  }
};

const createForm = new FormValidate("#post-create");
createForm.addSubmitEvent(execute);
