(async function () {
  const { getData } = await import("../required/Request.js");
  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const formdata = new FormData(form);
      const { errors, response } = await getData("/login", formdata, "POST");
      if (typeof errors === "undefined" && response) {
        window.location.href = "/";
      }
    } catch (err) {
      console.log(err);
    }
  });
})();
