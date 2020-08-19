{
  // import { addEvent } from "../utils/AddDocumentsEvent.js";
  // import { getData } from "../required/Request.js";
  // import { isEmpty } from "../utils/ObjectValidation.js";
  // function getEvents() {
  //   return {
  //     events: {
  //       input: {
  //         eventList: ["paste", "input", "propertychange"],
  //         callFn: inputCallFn,
  //       },
  //       toggleBtn: {
  //         eventList: ["click"],
  //         callFn: btnCallFn,
  //       },
  //       formSubmit: {
  //         eventList: ["submit"],
  //         callFn: formEditCallFn,
  //       },
  //       deleteComment: {
  //         eventList: ["click"],
  //         callFn: deleteCommentBtnCallFn,
  //       },
  //     },
  //   };
  // }
  // const inputCallFn = (e, doc) => {
  //   const curValue = e.target.value;
  //   const initialValue = e.target.defaultValue;
  //   const btn = doc.closest("div.text-area").querySelector("#clickable");
  //   // 현재 값이 비어있을 때
  //   if (isEmpty(curValue)) {
  //     btn.disabled = true;
  //   }
  //   // 초기 값이 현재 값과 같을 때
  //   else if (initialValue === curValue) {
  //     btn.disabled = true;
  //   } else {
  //     btn.disabled = false;
  //   }
  // };
  // const btnCallFn = (e, doc) => {
  //   e.preventDefault();
  //   const comment = doc.closest("div#comment");
  //   let toggleHidden = comment.querySelector("#comment-edit");
  //   toggleHidden.hidden = toggleHidden.hidden ? false : true;
  //   toggleHidden = comment.querySelector("#comment-body");
  //   toggleHidden.hidden = toggleHidden.hidden ? false : true;
  // };
  // const formEditCallFn = async (e, doc) => {
  //   e.preventDefault();
  //   try {
  //     const formdata = new FormData(doc);
  //     formdata.append("post_id", doc.dataset.postId);
  //     const { errors, redirect } = await getData(
  //       `/comment/${doc.dataset.commentId}`,
  //       formdata,
  //       "PUT"
  //     );
  //     if (typeof errors === "undefined" && redirect) {
  //       window.location.href = e.target.action;
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  // const deleteCommentBtnCallFn = async (e, doc) => {
  //   e.preventDefault();
  //   try {
  //     if (confirm("Are you sure you want to delete this comment?")) {
  //       const form = doc.closest("form#comment");
  //       const path = `/comment/${form.dataset.commentId}`;
  //       const result = await fetch(path, {
  //         method: "DELETE",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });
  //       if (result.ok && (await result.json())) {
  //         window.location.href = window.location;
  //       } else {
  //         console.log(result.status);
  //       }
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  // function initButtonsDisabled() {
  //   const btns = document.querySelectorAll("#clickable");
  //   btns.forEach((btn) => {
  //     btn.disabled = true;
  //   });
  // }
  // function formAddSubmit() {
  //   const form = document.querySelector("#comment-add form#comment");
  //   form.addEventListener("submit", async (e) => {
  //     e.preventDefault();
  //     try {
  //       const formdata = new FormData(form);
  //       formdata.append("post_id", form.dataset.postId);
  //       const { getData } = await import("../required/Request.js");
  //       const { error, redirect } = await getData("/comment", formdata, "POST");
  //       console.log(error, redirect);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   });
  // }
  // (async function () {
  //   const { events } = getEvents();
  //   initButtonsDisabled();
  //   formAddSubmit();
  //   addEvent(".uit", events.input, true);
  //   addEvent("#action-edit, #edit-cancel", events.toggleBtn, true);
  //   addEvent("#action-delete", events.deleteComment, true);
  //   addEvent("#comment-edit form#comment", events.formSubmit, true);
  // })();
}

import { isEmpty } from "../utils/ObjectValidation.js";

(async function () {
  sendFormData("post-create", (response, form) => {
    response.then((data) => {
      const { redirect, errors } = data;
      if (!isEmpty(redirect)) {
        form.submit();
        moveTo("/posts");
      } else {
        console.log(errors);
      }
    });
  });
})();

function moveTo(relativePath) {
  const { origin } = window.location;
  let path = origin + relativePath;
  if (!isEmpty(path)) {
    window.location.href = path;
  } else {
    console.log("path is empty!");
  }
}

function sendFormData(id, fn) {
  const form = document.getElementById(id);
  try {
    addSubmitEvent(form, async (event) => {
      fn(initForm(form), form);
    });
  } catch (err) {
    console.log(err);
  }
}

function getFormData(form, isStringfy = false) {
  const parsed = {};
  const formData = new FormData(form);
  for (const [k, v] of formData.entries()) {
    parsed[k] = v;
  }
  return isStringfy ? JSON.stringify(parsed) : parsed;
}

// 요청 url은 form의 action 값
// method는 form의 method 값
async function initForm(form) {
  let Params = {
    headers: {
      "Content-Type": "application/json",
    },
    body: getFormData(form, true),
    method: form.method,
  };
  return await fetch(form.action, Params).then((response) => response.json());
}

function addSubmitEvent(form, fn) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    fn(event);
  });
}