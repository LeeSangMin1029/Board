import { getData } from "../required/Request.js";
import { isEmpty } from "../utils/ObjectValidation.js";

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
    updateViewPage(queryObject, ({ posts }) => {
      renderPosts(posts);
    });
  } catch (err) {
    console.log(err);
  }
};

const pageAllButtons = document.querySelectorAll(".page");
pageAllButtons.forEach((btn) => {
  btn.addEventListener("click", btnClickEvent);
});

const searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData(searchForm);
    let searchText = formData.get("search");
    const queryObject = {};
    if (isEmpty(searchText)) {
      searchText = "";
    } else {
      queryObject.search = searchText;
    }
    updateViewPage(queryObject, ({ posts, count, currentPage }) => {
      renderPosts(posts);
      pageAllButtons.forEach((btn) => {
        btn.removeEventListener("click", btnClickEvent);
      });
      renderPageList(count, currentPage);
      document.querySelectorAll(".page").forEach((btn) => {
        btn.addEventListener("click", btnClickEvent);
      });
    });
  } catch (err) {
    console.log(err);
  }
});

window.addEventListener("popstate", async function (e) {
  try {
    let page = getParameterByName("page");
    let searchText = getParameterByName("search");
    const queryObject = {};
    if (isEmpty(page)) {
      page = 1;
    }
    if (isEmpty(searchText)) {
      searchText = "";
    } else {
      queryObject.search = searchText;
    }
    queryObject.page = page;
    const prevClickedPage = document.querySelectorAll(".page")[page - 1];
    currentPageToggle(prevClickedPage);
    const queryString = buildQueryString(queryObject);
    const { posts, count, currentPage } = await getPosts(queryString);
    renderPosts(posts);
    renderPageList(count, currentPage);
    document.querySelectorAll(".page").forEach((btn) => {
      btn.addEventListener("click", btnClickEvent);
    });
  } catch (err) {
    console.log(err);
  }
});

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

const buildQueryString = (params) => {
  if (isEmpty(params)) {
    return null;
  }
  return Object.keys(params)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join("&");
};

const renderPageList = (count, currentPage) => {
  try {
    let result = "";
    for (let i = 1; i <= count; i++) {
      if (currentPage == i)
        result += `<button class="page current-page"><em class="num-page">${i}</em></button>`;
      else
        result += `<button class="page"><em class="num-page">${i}</em></button>`;
    }
    document.querySelector(".page-wrap").innerHTML = result;
  } catch (err) {
    console.log(err);
  }
};

function renderErrorMsg(err) {
  document.getElementById("tbody-posts").innerHTML = `<tr>${err}</tr>`;
}

function renderPosts(posts) {
  try {
    let result = "";
    for (const post of posts) {
      result += `<tr><td><a href="/posts/${post._id}" class="txt-hidden">${post.title}</a></td>
        <td>${post.author.name}</td>
        <td>${post.createdAt}</td></tr>`;
    }
    document.getElementById("tbody-posts").innerHTML = result;
  } catch (err) {}
}

async function getPosts(queryString = "") {
  try {
    let requestPath = "";
    if (!isEmpty(queryString)) {
      requestPath = `?${queryString}`;
    }
    return await getData(`/posts${requestPath}`);
  } catch (err) {}
}
