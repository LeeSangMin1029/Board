async function addErrorMessage(errors) {
  let errorDoc = "";
  const titleDoc = document.querySelector(".title-area");
  const bodyDoc = document.querySelector(".body-area");
  try {
    const { isEmpty } = await import("./ObjectValidation.js");
    errorDoc = titleDoc.querySelector(".error");
    if (!isEmpty(errors.title)) {
      errorDoc.innerHTML = errors.title.message;
    } else {
      errorDoc.innerHTML = "";
    }
    errorDoc = bodyDoc.querySelector(".error");
    if (!isEmpty(errors.body)) {
      errorDoc.innerHTML = errors.body.message;
    } else {
      errorDoc.innerHTML = "";
    }
  } catch (err) {
    console.log(err);
  }
}

export default addErrorMessage;
