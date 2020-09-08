import { getDocuments, addEvent } from "../utils/Doc.js";
import { navigateToURL, partial } from "../utils/Util.js";

const createFormSubmit = async function () {
  try {
    const formData = new FormData(this);
    formData.append("post_id", this.dataset.postId);
    const fetched = await fetch("/comment", {
      body: formData,
      method: "POST",
    });
    const {
      response: { success = false, errors = {} },
    } = await fetched.json();
    if (success) {
      navigateToURL(location);
    } else {
      Object.keys(errors).map((key) => {
        this.childNodes[0].childNodes[0].setAttribute(
          "error-messages",
          errors[key]
        );
      });
    }
  } catch (err) {
    console.log(err);
  }
};

(() => {
  try {
    const commentAdd = getDocuments("#comment-add");
    const createForm = commentAdd.querySelector("#comment-create");
    addEvent(createForm, "submit", partial(createFormSubmit), true);
  } catch (err) {
    console.log(err);
  }
})();
