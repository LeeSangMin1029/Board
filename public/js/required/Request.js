import { isEmptyObject, safeParseJSON } from "../utils/ObjectValidation.js";

function getXHR(url, data, method = "GET", async = true) {
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

export { getXHR as getData };
