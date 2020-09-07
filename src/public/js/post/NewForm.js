import { getDocuments } from "../utils/Doc.js";
import { navigateToURL } from "../utils/Util.js";

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
    }
  } catch (err) {
    console.log(err);
  }
};

(() => {
  const createForm = getDocuments("#post-create");
  addEvent(createForm, "submit", partial(createFormSubmit), true);
})();
