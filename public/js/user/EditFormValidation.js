(async function () {
  const { getData } = await import("../required/Request.js");
  const { validateForm } = await import("../utils/FormValidation.js");
  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const formdata = new FormData(form);
      const path = `/users/${window.location.pathname.split("/")[2]}`;
      const { errors, redirect } = await getData(path, formdata, "PUT");
      if (typeof errors === "undefined" && redirect) {
        console.log("sdsdf");
        window.location.replace("/users");
      } else {
        validateForm(formdata, "user edit", errors);
      }
    } catch (err) {
      console.error(err);
    }
  });
})();
