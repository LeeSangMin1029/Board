(async function () {
  const { getData } = await import("../required/Request.js");
  const { validateForm } = await import("../utils/FormValidation.js");
  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
  });
})();
