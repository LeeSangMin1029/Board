import { getDocuments, addEvent } from "../utils/Doc.js";
import { navigateToURL, partial } from "../utils/Util.js";

const editFormSubmit = async function () {
  try {
    const formData = new FormData(this);
    const fetched = await fetch(this.action, {
      body: formData,
      method: "POST",
    });
    const {
      response: { success = false, errors = {} },
    } = await fetched.json();
    if (success) {
      const path = location.pathname.replace("/edit", "");
      navigateToURL(path);
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
    const editForm = getDocuments("#user-edit");
    addEvent(editForm, "submit", partial(editFormSubmit), true);
  } catch (err) {
    console.log(err);
  }
})();
