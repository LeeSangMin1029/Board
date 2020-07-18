import { isEmptyArray } from "./utils/ObjectValidation.js";
import { getData } from "./required/Request.js";

window.onpopstate = function (event) {
  const page = window.location.pathname.split("/")[3];
  getPosts(page);
};

document.querySelectorAll(".page-link").forEach((a) => {
  let page = a.textContent | 0;
  a.addEventListener("click", function (e) {
    e.preventDefault();
    getPosts(page);
    history.pushState(null, null, `/posts/page/${page}`);
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
    const { posts } = await getData({ url: `/posts/page/${page}` });
    if (isEmptyArray(posts)) {
      renderErrorMsg(`There are no posts please create it`);
    } else {
      renderPosts(posts);
    }
  } catch (err) {
    console.log(err);
  }
}
