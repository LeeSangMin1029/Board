(async function () {
  const { getData } = await import("../required/Request.js");
  const { validateForm } = await import("../utils/FormValidation.js");
  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const formdata = new FormData(form);
      const path = `/posts/${window.location.pathname.split("/")[2]}`;
      const { errors, redirect } = await getData(path, formdata, "PUT");
      if (typeof errors === "undefined" && redirect) {
        history.back();
      } else {
        validateForm(formdata, "post edit", errors);
      }
    } catch (err) {
      console.error(err);
    }
  });
})();
