import { getDocuments, addEvent } from "../utils/Doc.js";
import { navigateToURL, partial } from "../utils/Util.js";

const deletePostFormSubmit = async function (form) {
  if (!confirm("Do you want delete this post?")) return;
  try {
    const formData = new FormData(form);
    const fetched = await fetch(form.action, {
      body: formData,
      method: "POST",
    });
    const {
      response: { success = true },
    } = await fetched.json();
    if (success) {
      navigateToURL("/posts");
    }
  } catch (err) {
    console.log(err);
  }
};

(() => {
  const deleteForm = getDocuments("#post-delete");
  if (!deleteForm) return;
  addEvent(
    deleteForm.childNodes[0],
    "click",
    partial(deletePostFormSubmit, deleteForm),
    true
  );
})();
