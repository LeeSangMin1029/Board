(async function () {
  const { getData } = await import("../required/Request.js");
  const { validateForm } = await import("../utils/FormValidation.js");
  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const formdata = new FormData(form);
      const { errors, redirect } = await getData("/posts", formdata, "POST");
      if (typeof errors === "undefined" && redirect) {
        window.location.href = "/posts";
      } else {
        validateForm(formdata, "post new", errors);
      }
    } catch (err) {
      console.log(err);
    }
  });
})();
