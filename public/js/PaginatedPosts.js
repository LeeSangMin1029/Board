(async function () {
  if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
  ) {
    documentReady();
  } else {
    document.addEventListener("DOMContentLoaded", documentReady);
  }
})();

window.onpopstate = function (event) {
  console.log(event);
  const page = window.location.pathname.split("/")[3];
  getPosts(page);
};

function renderErrorMsg(err) {
  document.getElementById("tbody-posts").innerHTML = `<tr>${err}</tr>`;
}

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function isEmptyArray(arr) {
  return Array.isArray(arr) && !arr.length;
}

function documentReady() {
  moveToPage();
}

function moveToPage() {
  document.querySelectorAll(".page-link").forEach((a) => {
    let page = a.textContent | 0;
    a.addEventListener("click", function (e) {
      e.preventDefault();
      getPosts(page);
      history.pushState(null, null, `/posts/page/${page}`);
    });
  });
  // document.querySelectorAll(".post-link").forEach((a) => {
  //   console.log(a.href);
  //   a.addEventListener("click", function (e) {
  //     e.preventDefault();
  //   });
  // });
}

function getXHR({ url, data, method = "GET" }, async = true) {
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, async);
    // 헤더 설정 부분은 나중에 수정
    xhr.setRequestHeader("Accept", "application/json");

    if (method === "POST") {
      xhr.setRequestHeader("Accept", "application/json");
      xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          res(safeParseJSON(this.responseText));
        }
      };
    } else if (method === "GET") {
      xhr.onload = function () {
        if (this.responseText === "") {
          rej(new Error("Failed to get data from server"));
        }
        const response = safeParseJSON(this.responseText);
        if (isEmptyObject(response)) {
          rej(new Error("An empty object was received from the server"));
        } else {
          res(response);
        }
      };
    }
    xhr.send(data);
  });
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
    const { posts } = await getXHR({ url: `/posts/page/${page}` });
    if (isEmptyArray(posts)) {
      renderErrorMsg(`There are no posts please create it`);
    } else {
      renderPosts(posts);
    }
  } catch (err) {
    console.log(err);
  }
}

function safeParseJSON(json) {
  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch (err) {
    console.log(err);
  }
  return parsed;
}
