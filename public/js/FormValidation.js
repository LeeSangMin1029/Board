import { isEmpty } from "./utils/ObjectValidation.js";
(async function () {
  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    try {
      e.preventDefault();
      const { getData } = await import("./required/Request.js");
      const formData = new FormData(form);
      const data = await getData("/posts", formData, "POST");
      if (typeof data.redirect !== "undefined") {
        window.location.href = "/posts/page/1";
      } else if (data.errors) {
        addErrorMessage(data.errors);
      }
    } catch (error) {
      console.error(error);
    }
  });
})();

function addErrorMessage(errors) {
  let errorDoc = "";
  const titleDoc = document.querySelector(".title-area");
  const bodyDoc = document.querySelector(".body-area");
  try {
    errorDoc = titleDoc.querySelector(".error");
    if (!isEmpty(errors.title)) {
      errorDoc.innerHTML = errors.title.message;
    } else {
      errorDoc.innerHTML = "";
    }
    errorDoc = bodyDoc.querySelector(".error");
    if (!isEmpty(errors.body)) {
      errorDoc.innerHTML = errors.body.message;
    } else {
      errorDoc.innerHTML = "";
    }
  } catch (err) {
    console.log(err);
  }
}
