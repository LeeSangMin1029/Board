(async function () {
  const { getData } = await import("../required/Request.js");
  const { validateForm } = await import("../utils/FormValidation.js");
  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const formdata = new FormData(form);
      const { errors, redirect } = await getData("/login", formdata, "POST");
      if (typeof errors === "undefined" && redirect) {
        window.location.href = "/";
      } else {
        console.log(errors);
        validateForm(formdata, "user login", errors);
      }
    } catch (err) {
      console.log(err);
    }
  });
})();
