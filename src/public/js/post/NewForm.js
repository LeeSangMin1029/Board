import { getDocuments, addEvent } from "../utils/Doc.js";
import { navigateToURL, partial } from "../utils/Util.js";

const createFormSubmit = async function () {
  try {
    const formData = new FormData(this);
    const fetched = await fetch("/posts", {
      body: formData,
      method: "POST",
    });
    const {
      response: { success = false, errors = {} },
    } = await fetched.json();
    if (success) {
      navigateToURL("/posts");
    } else {
      this.querySelectorAll(".input-area").forEach((input) => {
        if (input.hasAttribute("error-messages")) {
          input.removeAttribute("error-messages");
        }
      });
      Object.keys(errors).map((key) => {
        const input = this.querySelector(`#${key}`);
        input.parentNode.setAttribute("error-messages", errors[key]);
      });
    }
  } catch (err) {
    console.log(err);
  }
};

(() => {
  try {
    const createForm = getDocuments("#post-create");
    addEvent(createForm, "submit", partial(createFormSubmit), true);
  } catch (err) {
    console.log(err);
  }
})();
