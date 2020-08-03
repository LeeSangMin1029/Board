(async function () {
  const { getData } = await import("../required/Request.js");
  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      if (confirm("Are you sure you want to delete this post?")) {
        const wholePath = window.location.pathname.split("/");
        const path = `/posts/${wholePath[2]}?_method=delete`;
        const { redirect } = await getData(path, "", "DELETE");
        if (redirect) {
          window.location.href = "/posts";
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
})();
