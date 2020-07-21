import { isEmpty, safeParseJSON } from "../utils/ObjectValidation.js";

function getXHR(url, data, method = "GET", async = true) {
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, async);
    if (method === "POST") {
      //xhr.setRequestHeader("Accept", "application/json");
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
  if (xhr.responseText === "") {
    throw new Error("Failed to get data from server");
  }
  const response = safeParseJSON(xhr.responseText);
  if (isEmpty(response)) {
    throw new Error("An empty object was received from the server");
  }
  return response;
};

export { getXHR as getData };
