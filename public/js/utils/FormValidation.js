function validateForm() {}

// Document 전달 함수
function getDoc(name, option = "id") {
  let selector;
  if (option === "id") {
    selector = `#${name}`;
  } else if (option === "class") {
    selector = `.${name}`;
  }
  return document.querySelector(selector);
}

export { validateForm };
