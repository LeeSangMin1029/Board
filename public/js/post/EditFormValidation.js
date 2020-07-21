(async function () {
  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    try {
      e.preventDefault();
      const { getData } = await import("../required/Request.js");
      const formData = new FormData(form);
      const path = `/posts/${window.location.pathname.split("/")[2]}`;
      const data = await getData(path, formData, "PUT");
      if (typeof data.redirect !== "undefined") {
        window.location.href = path;
      } else if (data.errors) {
        const { default: addErrorMessage } = await import(
          "../utils/FormError.js"
        );
        await addErrorMessage(data.errors);
      }
    } catch (error) {
      console.error(error);
    }
  });
})();
