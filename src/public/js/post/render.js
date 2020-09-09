import { isEmpty } from "../utils/ObjectValidation.js";
import { nodeListAddEvent, getDocuments, addEvent } from "../utils/Doc.js";

const updateViewPage = async (queryObject, response) => {
  try {
    let resultQueryString = "";
    const queryString = buildQueryString(queryObject);
    if (!isEmpty(queryString)) {
      resultQueryString += `?${queryString}`;
    }
    const { protocol, host, pathname } = window.location;
    const newurl = `${protocol}//${host}${pathname}${resultQueryString}`;
    history.pushState(null, "", newurl);
    const getFromServerData = await getPosts(queryString);
    response(getFromServerData);
  } catch (err) {
    console.log(err);
  }
};

const btnClickEvent = async function () {
  try {
    currentPageToggle(this);
    const queryObject = {};
    const page = getPageNumber(this);
    const searchText = getParameterByName("search");
    if (!isEmpty(searchText)) {
      queryObject.search = searchText;
    }
    queryObject.page = page;
  } catch (err) {
    console.log(err);
  }
};

const searchFormSubmit = async function () {
  try {
    const formData = new FormData(this);
    let searchText = formData.get("search");
    const queryString = buildQueryString({ search: searchText });

    // const requestPath = this.action + queryString;
    // const fetched = await fetch(requestPath, {
    //   body: formData,
    //   method: "POST",
    // });
    // const { posts, count, currentPage } = await fetched.json();
    // console.log(posts);
  } catch (err) {
    console.log(err);
  }
};

// window.addEventListener("popstate", async function (e) {
//   try {
//     let page = getParameterByName("page");
//     let searchText = getParameterByName("search");
//     const queryObject = {};
//     if (isEmpty(page)) {
//       page = 1;
//     }
//     if (isEmpty(searchText)) {
//       searchText = "";
//     } else {
//       queryObject.search = searchText;
//     }
//     queryObject.page = page;
//     const prevClickedPage = document.querySelectorAll(".page")[page - 1];
//     currentPageToggle(prevClickedPage);
//     const queryString = buildQueryString(queryObject);
//     const { posts, count, currentPage } = await getPosts(queryString);
//     renderPosts(posts);
//     renderPageList(count, currentPage);
//     document.querySelectorAll(".page").forEach((btn) => {
//       btn.addEventListener("click", btnClickEvent);
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

const currentPageToggle = (btnElements) => {
  try {
    document.querySelector(".current-page").classList.remove("current-page");
    btnElements.classList.add("current-page");
  } catch (err) {
    console.log(err);
  }
};

const getPageNumber = (btn) => {
  return btn.querySelector(":scope > .num-page").textContent;
};

const getParameterByName = (name, url = window.location.href) => {
  const replacedName = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp(`[?&]${replacedName}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

const buildQueryString = (params = {}) => {
  if (isEmpty(params)) return;
  return Object.keys(params).reduce((acc, cur) => {
    const uriComp = encodeURIComponent;
    const piece = `${uriComp(cur)}=${uriComp(params[cur])}`;
    return acc + piece;
  }, "?");
};

const renderPageList = (count = 0, currentPage = 0) => {
  if (!count || !currentPage) return;
  try {
    let result = "";
    const pageWrap = document.querySelector(".page-wrap");
    if (!pageWrap) return;
    for (let i = 1; i <= count; i++) {
      if (currentPage == i)
        result += `<button class="page current-page"><em class="num-page">${i}</em></button>`;
      else
        result += `<button class="page"><em class="num-page">${i}</em></button>`;
    }
    pageWrap.innerHTML = result;
  } catch (err) {
    console.log(err);
  }
};

function renderPosts(posts = {}) {
  if (!posts) return;
  try {
    let result = "";
    const bodyPosts = document.querySelector("#tbody-posts");
    if (!bodyPosts) return;
    for (const post of posts) {
      result += `<tr><td><a href="/posts/${post._id}" class="txt-hidden">${post.title}</a></td>
        <td>${post.author.name}</td>
        <td>${post.createdAt}</td></tr>`;
    }
    bodyPosts.innerHTML = result;
  } catch (err) {}
}

async function getPosts(queryString = "") {
  try {
    let requestPath = "";
    if (!queryString) {
      requestPath = `?${queryString}`;
    }
    const fetched = await fetch(`/posts${requestPath}`);
    return await fetched.json();
  } catch (err) {}
}

(() => {
  const pageAllButtons = getDocuments(".page", true);
  nodeListAddEvent(pageAllButtons, (btn) => {
    try {
      addEvent(btn, "click", btnClickEvent);
    } catch (err) {
      console.log(err);
    }
  });
  const searchForm = getDocuments("#search-form");
  addEvent(searchForm, "submit", searchFormSubmit, true);
})();
