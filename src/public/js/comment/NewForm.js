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
      // alertAllError(errors, "error-messages");
    }
  } catch (err) {
    console.log(err);
  }
};

(() => {
  const createForm = getDocuments("#comment-create");
  addEvent(createForm, "submit", partial(createFormSubmit), true);
})();
