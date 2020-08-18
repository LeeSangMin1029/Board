(async function () {
  const { getData } = await import("../required/Request.js");
  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const formdata = new FormData(form);
      const { errors, redirect } = await getData("/login", formdata, "POST");
      if (typeof errors === "undefined" && redirect) {
        window.location.href = "/";
      }
    } catch (err) {
      console.log(err);
    }
  });
})();
