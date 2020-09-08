import { getDocuments, nodeListAddEvent, addEvent } from "../utils/Doc.js";
import { navigateToURL, partial } from "../utils/Util.js";

const editFormSubmit = async function () {
  try {
    const formData = new FormData(this);
    formData.append("post_id", this.dataset.postId);
    const fetched = await fetch(this.action, {
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

const inputValueCheck = (doc) => {
  if (!doc) return;
  try {
    const { defaultValue: target, value: compare } = doc;
    if (target !== compare) doc.value = target;
  } catch (err) {
    console.log(err);
  }
};

const hiddenToggle = (doc) => {
  if (!doc) return;
  try {
    doc.hidden = doc.hidden ? false : true;
  } catch (err) {
    console.log(err);
  }
};

const formViewToggle = (body, form) => {
  if (!body || !form) return;
  hiddenToggle(body);
  hiddenToggle(form);
};

const cancelBtnClick = (body, form) => {
  try {
    const input = form.querySelector(".uit");
    inputValueCheck(input);
    const inputArea = input.parentNode;
    if (inputArea.hasAttribute("error-messages")) {
      inputArea.removeAttribute("error-messages");
    }
    formViewToggle(body, form);
  } catch (err) {
    console.log(err);
  }
};

const deleteCommentClick = async (form) => {
  if (!form || !confirm("Do you want delete this comment?")) return;
  try {
    const formData = new FormData(form);
    formData.append("post_id", form.dataset.postId);
    const fetched = await fetch(form.action, {
      body: formData,
      method: "POST",
    });
    const {
      response: { success = false },
    } = await fetched.json();
    if (success) {
      navigateToURL(location);
    }
  } catch (err) {
    console.log(err);
  }
};

(() => {
  const commentList = getDocuments("#comment", true);
  nodeListAddEvent(commentList, (doc) => {
    const body = doc.querySelector("#comment-body");
    const editForm = doc.querySelector("#comment-edit-toggle");
    const cancelBtn = editForm.querySelector("#edit-cancel");
    const action = body.querySelector("#action");
    const editBtn = action.querySelector("#action-edit");
    const deleteBtn = action.querySelector("#action-delete");
    addEvent(editBtn, "click", partial(formViewToggle, body, editForm));
    addEvent(cancelBtn, "click", partial(cancelBtnClick, body, editForm), true);
    addEvent(
      deleteBtn,
      "click",
      partial(deleteCommentClick, deleteBtn.parentNode)
    );
    addEvent(editForm.childNodes[0], "submit", partial(editFormSubmit), true);
  });
})();
