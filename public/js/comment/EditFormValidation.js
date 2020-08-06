function getEvents() {
  return {
    input: {
      eventList: ["keyup", "paste", "input", "propertychange"],
      callFn: inputCallFn,
    },
    btn: {
      eventList: ["click"],
      callFn: btnCallFn,
    },
    form: {
      eventList: ["submit"],
      callFn: formCallFn,
    },
  };
}

const inputCallFn = (e, doc) => {
  const initalValue = doc.innerHTML;
  if (initalValue == doc.innerHTML) {
    console.log(doc.innerHTML);
  }
};

const btnCallFn = (e, doc) => {
  e.preventDefault();
  const comment = doc.closest("#comment");
  let toggleHidden = comment.querySelector("#comment-edit");
  toggleHidden.hidden = toggleHidden.hidden ? false : true;
  toggleHidden = comment.querySelector("#comment-body");
  toggleHidden.hidden = toggleHidden.hidden ? false : true;
};

const formCallFn = async (e, doc) => {
  const { getData } = await import("../required/Request.js");
  e.preventDefault();
  try {
    const formdata = new FormData(doc);
    formdata.append("post_id", doc.dataset.postId);
    const { errors, redirect } = await getData(
      `/comment/${doc.dataset.commentId}`,
      formdata,
      "PUT"
    );
  } catch (err) {
    console.log(err);
  }
};

(async function () {
  const { input, btn, form } = getEvents();
  const { addEvent } = await import("../utils/FormValidation.js");
  addEvent(".uit", input, true);
  addEvent("#action-edit, #edit-cancel", btn, true);
  addEvent("form#edit", form, true);
})();
