(async function () {
  const { getData } = await import("../required/Request.js");
  const { validateForm } = await import("../utils/FormValidation.js");
  const form = document.querySelectorAll("form")[1];

  if (typeof form === "undefined") {
    return 0;
  } else {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        const formdata = new FormData(form);
        formdata.append("post_id", form.dataset.postId);
        const { errors, redirect } = await getData(
          "/comment",
          formdata,
          "POST"
        );
        if (typeof errors === "undefined" && redirect) {
          window.location.href = `/posts/${form.dataset.postId}`;
        } else {
          validateForm(formdata, "comment new", errors);
        }
      } catch (err) {
        console.log(err);
      }
    });
  }
})();
