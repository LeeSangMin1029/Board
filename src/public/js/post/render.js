import { getParameterByName, buildQueryString } from "../utils/Util.js";
import {
  nodeListAddEvent,
  getDocuments,
  addEvent,
  toggleClass,
} from "../utils/Doc.js";

const addEventPageBtn = () => {
  try {
    const pageAllButtons = getDocuments(".page", true);
    nodeListAddEvent(pageAllButtons, "click", pageBtnClick);
  } catch (err) {
    console.error(err);
  }
};

const getFetchRes = async (params = {}, path = "", isPush = false) => {
  if (!path) return;
  try {
    const queryString = buildQueryString(params);
    const pathname = path + queryString;
    if (isPush && queryString) {
      history.pushState({ data: params }, null, pathname);
    }
    const fetched = await fetch(pathname);
    return await fetched.json();
  } catch (err) {
    console.error(err);
  }
};

const currentPageHighlighted = function () {
  try {
    const pageList = getDocuments(".page", true);
    pageList.forEach((page) => {
      page.classList.remove("current-page");
    });
    const curPageNumber = getParameterByName("page") || 1;
    toggleClass(pageList[curPageNumber - 1], "current-page");
  } catch (err) {
    console.error(err);
  }
};

const pageBtnClick = async function () {
  try {
    const searchText = getParameterByName("search") || "";
    const page = this.querySelector(".num-page").innerHTML;
    const { posts } = await getFetchRes(
      { search: searchText, page: page },
      "/posts",
      true
    );
    const postListDoc = getDocuments("#post-list");
    if (!postListDoc) return;
    postListDoc.innerHTML = renderedPosts(posts);
    currentPageHighlighted();
  } catch (err) {
    console.error(err);
  }
};

const searchFormSubmit = async function () {
  try {
    const formData = new FormData(this);
    const searchText = formData.get("search");
    const { posts, count } = await getFetchRes(
      { search: searchText },
      "/posts",
      true
    );
    const postListDoc = getDocuments("#post-list");
    postListDoc.innerHTML = renderedPosts(posts);
    const pageListDoc = getDocuments(".page-wrap");
    pageListDoc.innerHTML = renderedPageList(count);
    currentPageHighlighted();
    addEventPageBtn();
  } catch (err) {
    console.error(err);
  }
};

const popState = async function (e) {
  try {
    const {
      data: { search = "", page = 0 },
    } = e.state;
    const { posts, count } = await getFetchRes(
      { page: page, search: search },
      "/posts"
    );
    const postListDoc = getDocuments("#post-list");
    postListDoc.innerHTML = renderedPosts(posts);
    const pageListDoc = getDocuments(".page-wrap");
    pageListDoc.innerHTML = renderedPageList(count);
    currentPageHighlighted();
    addEventPageBtn();
  } catch (err) {
    console.error(err);
  }
};

const renderedPageList = (count = 0) => {
  if (!count) return;
  try {
    return [...Array(count).keys()].reduce(
      (acc, i) =>
        acc +
        `<button class="page"><em class="num-page">${i + 1}</em></button>`,
      ""
    );
  } catch (err) {
    console.error(err);
  }
};

const renderedPosts = (posts = {}) => {
  if (!posts) return;
  try {
    return Array.from(posts).reduce(
      (acc, post) =>
        acc +
        `<tr><td><a href="/posts/${post._id}" class="txt-hidden">${post.title}</a></td>
        <td>${post.author.name}</td>
        <td>${post.createdAt}</td></tr>`,
      ""
    );
  } catch (err) {
    console.error(err);
  }
};

const preInit = () => {
  history.replaceState({ data: { search: "", page: 0 } }, null, location);
  currentPageHighlighted();
};

(() => {
  preInit();
  addEventPageBtn();
  const searchForm = getDocuments("#search-form");
  addEvent(searchForm, "submit", searchFormSubmit, true);
  addEvent(window, "popstate", popState);
})();
