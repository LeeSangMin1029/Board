function getPost() {
  return {
    new: {
      postTitle: {
        class: "title",
        dbFieldName: "title",
      },
      postBody: {
        class: "body",
        dbFieldName: "body",
      },
    },
    edit: {
      postTitle: {
        class: "title",
        dbFieldName: "title",
      },
      postBody: {
        class: "body",
        dbFieldName: "body",
      },
    },
  };
}

function getUser() {
  return {
    register: {
      name: {
        class: "name",
        dbFieldName: "name",
      },
      email: {
        class: "email",
        dbFieldName: "email",
      },
      id: {
        class: "id",
        dbFieldName: "id",
      },
      password: {
        class: "origin",
        dbFieldName: "password",
      },
      passwordConfirmation: {
        class: "confirm",
        dbFieldName: "passwordConfirmation",
      },
    },
    edit: {
      id: {
        class: "id",
        dbFieldName: "id",
      },
      name: {
        class: "name",
        dbFieldName: "name",
      },
      currentPassword: {
        class: "current",
        dbFieldName: "currentPassword",
      },
    },
    login: {
      email: {
        class: "email",
        dbFieldName: "email",
      },
      password: {
        class: "password",
        dbFieldName: "password",
      },
    },
  };
}

function getComment() {
  return {
    new: {
      text: {
        class: "text",
        dbFieldName: "text",
      },
    },
  };
}

function getFormElementName() {
  return {
    user: getUser(),
    post: getPost(),
    comment: getComment(),
  };
}

function validateForm(userInputData, formContent, errors) {
  const [property, formName] = formContent.split(" ");
  const formAction = { ...getFormElementName()[property][formName] };
  let formDataKey, errorDoc, error;
  if (property === "user" || property === "comment") {
    for (const [key] of userInputData.entries()) {
      if (typeof formAction[key] === "undefined") continue;
      formDataKey = formAction[key];
      errorDoc = document.querySelector(
        `.${formDataKey["class"]}-area span.error`
      );
      error = errors[formDataKey["dbFieldName"]];
      if (typeof error === "undefined") {
        errorDoc.innerHTML = "";
      } else {
        errorDoc.innerHTML = error.message;
      }
    }
  }
  // 위와 아래의 코드는 완벽하게 동일하다. 하지만 추후에 변경이 일어날 수도 있기 때문에
  // 굳이 분리를 해주었다.
  else if (property === "post") {
    for (const [key] of userInputData.entries()) {
      if (typeof formAction[key] === "undefined") continue;
      formDataKey = formAction[key];
      errorDoc = document.querySelector(
        `.${formDataKey["class"]}-area span.error`
      );
      error = errors[formDataKey["dbFieldName"]];
      if (typeof error === "undefined") {
        errorDoc.innerHTML = "";
      } else {
        errorDoc.innerHTML = error.message;
      }
    }
  }
}

export { validateForm };
