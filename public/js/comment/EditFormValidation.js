(async function () {
  const { getData } = await import("../required/Request.js");
  const { validateForm } = await import("../utils/FormValidation.js");
  document.querySelectorAll("#action-edit, #edit-cancel").forEach((anchors) => {
    anchors.addEventListener("click", async (e) => {
      e.preventDefault();
      const comment = anchors.closest("#comment");
      let toggleHidden = comment.querySelector("#comment-edit");
      toggleHidden.hidden = toggleHidden.hidden ? false : true;
      toggleHidden = comment.querySelector("#comment-body");
      toggleHidden.hidden = toggleHidden.hidden ? false : true;
    });
  });
  document.querySelectorAll("form#edit").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        const formdata = new FormData(form);
        formdata.append("post_id", form.dataset.postId);
        const { errors, redirect } = await getData(
          `/comment/${form.dataset.commentId}`,
          formdata,
          "PUT"
        );
        if (typeof errors === "undefined" && redirect) {
        } else {
          validateForm(formdata, "comment edit", errors);
        }
      } catch (err) {
        console.log(err);
      }
    });
  });
})();
