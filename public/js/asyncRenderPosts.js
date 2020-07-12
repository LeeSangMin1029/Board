$(document).ready(async () => {
  try {
    const { posts, count } = await getJSONObject({
      page: 1,
    });
    renderPageNav(count);
    renderPosts(posts);

    $(".btn-page").click(async function () {
      const { posts } = await getJSONObject({
        page: $(this).text(),
      });
      renderPosts(posts);
      return false;
    });
  } catch (err) {
    console.log(err);
  }
});

function getJSONObject(data) {
  return new Promise((resolve, reject) => {
    $.getJSON("/posts", data, (response) => {
      if (!isEmptyObject(response)) {
        resolve(response);
      }
      reject(new Error("Failed to get json object from server"));
    });
  });
}

function renderPosts(posts) {
  let tableRow = "<tr>";
  posts.forEach((post) => {
    const anchor = `<a href="/posts/${post._id}">${post.title}</a>`;
    const body = post.body;
    const createdDate = post.createdAt;
    const tableData = `<td>${anchor}</td>
      <td>${body}</td>
      <td>${createdDate}</td>`;
    tableRow += tableData + "</tr>";
  });
  document.getElementById("tbody-posts").innerHTML = tableRow;
}

function renderPageNav(pageCount) {
  let result = '<ul class="pagination">';
  let listResult = "";
  for (let i = 0; i < pageCount; i++) {
    const list = '<li class="page-item">';
    const btnPage = `<button class="page-link btn-page">${i + 1}</button>`;
    listResult += list + btnPage + "</li>";
  }
  result += listResult + "</ul>";

  document.getElementById("nav-page").innerHTML = result;
}

// 빈객체인지, 실제 객체인지 검사
// return value :
// empty object: true, not empty object : false;
function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}
