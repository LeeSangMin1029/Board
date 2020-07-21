(async function () {
  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    try {
      e.preventDefault();
      const { getData } = await import("../required/Request.js");
      const formData = new FormData(form);
      const data = await getData("/posts", formData, "POST");
      if (typeof data.redirect !== "undefined") {
        window.location.href = "/posts/page/1";
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
