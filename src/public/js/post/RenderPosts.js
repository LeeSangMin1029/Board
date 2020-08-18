import { isEmpty } from "../utils/ObjectValidation.js";

window.addEventListener("popstate", function () {
  let page = this.location.pathname.split("/")[3];
  if (isEmpty(page)) {
    page = 1;
  }
  document
    .getElementsByClassName("current-page")[0]
    .classList.remove("current-page");
  document.querySelectorAll(".page")[page - 1].classList.add("current-page");
  getPosts(page);
});

document.querySelectorAll(".page").forEach((btn) => {
  btn.addEventListener("click", async function (e) {
    const page = btn.childNodes[0].textContent | 0;
    const currentPage = document.getElementsByClassName("current-page");
    if (!currentPage.length) {
      this.classList.add("current-page");
    } else {
      currentPage[0].classList.remove("current-page");
      this.classList.add("current-page");
      await getPosts(page);
      history.pushState(null, null, `/posts/page/${page}`);
    }
  });
});

// const form = document.querySelector("form");
// form.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   try {
//     console.log("submit");
//     const formdata = new FormData(form);
//     const result = await fetch("/posts", { method: "GET" });
//     if (result.ok) {
//       console.log("success");
//     } else {
//       console.log("failed", result.status);
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });

function renderErrorMsg(err) {
  document.getElementById("tbody-posts").innerHTML = `<tr>${err}</tr>`;
}

function renderPosts(posts) {
  let result = "";
  for (const post of posts) {
    result += `<tr><td><a href="/posts/${post._id}" class="txt-hidden">${post.title}</a></td>
      <td>${post.author.name}</td>
      <td>${post.createdAt}</td></tr>`;
  }
  document.getElementById("tbody-posts").innerHTML = result;
}

async function getPosts(page) {
  try {
    const { getData } = await import("../required/Request.js");
    const { posts } = await getData(`/posts/page/${page}`);
    if (isEmpty(posts)) {
      renderErrorMsg(`There are no posts please create it`);
    } else {
      renderPosts(posts);
    }
  } catch (err) {
    console.log(err);
  }
}
