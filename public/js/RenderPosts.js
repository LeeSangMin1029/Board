import { isEmptyArray } from "./utils/ObjectValidation.js";
import { getData } from "./required/Request.js";

window.onpopstate = function (event) {
  const page = window.location.pathname.split("/")[3];
  getPosts(page);
};

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

function renderErrorMsg(err) {
  document.getElementById("tbody-posts").innerHTML = `<tr>${err}</tr>`;
}

function renderPosts(posts) {
  let result = "";
  for (const post of posts) {
    result += `<tr><td><a href="/posts/${post._id}">${post.title}</a></td>
      <td>${post.body}</td>
      <td>${post.createdAt}</td></tr>`;
  }
  document.getElementById("tbody-posts").innerHTML = result;
}

async function getPosts(page) {
  try {
    const { posts } = await getData(`/posts/page/${page}`);
    if (isEmptyArray(posts)) {
      renderErrorMsg(`There are no posts please create it`);
    } else {
      renderPosts(posts);
    }
  } catch (err) {
    console.log(err);
  }
}
