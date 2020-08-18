import { isEmpty, safeParseJSON } from "../utils/ObjectValidation.js";

function getXHR(url, data, method = "GET", async = true) {
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, async);
    if (method === "POST" || method === "PUT" || method === "DELETE") {
      xhr.addEventListener("load", function () {
        try {
          res(receivedData(xhr));
        } catch (err) {
          rej(err);
        }
      });
    } else if (method === "GET") {
      xhr.setRequestHeader("Accept", "application/json");
      xhr.addEventListener("load", function () {
        try {
          res(receivedData(xhr));
        } catch (err) {
          rej(err);
        }
      });
    }
    xhr.send(data);
  });
}

const receivedData = (xhr) => {
  const response = xhr.responseText;
  if (isEmpty(response)) {
    throw new Error("Failed to get data from server");
  }
  return safeParseJSON(response);
};

export { getXHR as getData };
