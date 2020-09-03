import { isEmpty, isNotEmpty } from "../utils/ObjectValidation.js";

// const getErrorFieldName = (errors) => {
//   const result = [];
//   if (isNotEmpty(errors)) {
//     for (const [k] of Object.entries(errors)) result.push(k);
//   }
//   return result;
// };

// const queryDocuments = (selector = "", isAll = false) => {
//   return isAll
//     ? document.querySelectorAll(selector)
//     : document.querySelector(selector);
// };

// const moveTo = (relativePath) => {
//   try {
//     const { origin } = window.location;
//     if (isNotEmpty(origin)) {
//       let path = origin + relativePath;
//       window.location.href = path;
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

// const formDataProcessing = (form = null, data = {}) => {
//   const formData = new FormData(form);
//   if (isEmpty(data)) {
//     return formData;
//   } else {
//     for (const [k, v] of Object.entries(data)) {
//       formData.append(k, v);
//     }
//     return formData;
//   }
// };

// const getArguments = (originArguments = [], ...otherKey) => {
//   const parsedArg = {};
//   if (isNotEmpty(otherKey) && isNotEmpty(originArguments)) {
//     for (const i in originArguments) {
//       for (const j in otherKey) {
//         const value = originArguments[i][otherKey[j]];
//         if (isNotEmpty(value)) {
//           parsedArg[otherKey[j]] = value;
//         }
//       }
//     }
//   }
//   return parsedArg;
// };

// const errorRender = (form = null, errors = []) => {
//   if (isEmpty(form) || isEmpty(errors)) return;
//   const name = getErrorFieldName(errors);
//   const attName = "error-messages";
//   for (const i in name) {
//     let inputAreaDoc = form
//       .querySelector(`#${form.id} #${name[i]}`)
//       .closest(".input-area");
//     const uitTag = inputAreaDoc.querySelector(".uit");
//     if (isNotEmpty(uitTag)) {
//       let tmpMessage = errors[name[i]].message;
//       inputAreaDoc.setAttribute(attName, tmpMessage);
//       uitTag.addEventListener("focusin", (e) => {
//         inputAreaDoc.removeAttribute(attName);
//       });

//       uitTag.addEventListener("focusout", (e) => {
//         const v = e.target.value;
//         if (v === "") {
//           inputAreaDoc.setAttribute(attName, tmpMessage);
//         }
//       });
//     } else {
//       throw new Error("input Document does not exist!!!");
//     }
//   }
// };

// const editFormToggle = (e, doc) => {
//   if (isNotEmpty(doc)) {
//     const comment = doc.closest("div#comment");
//     let editDoc = comment.querySelector("#comment-body");
//     const value = editDoc.querySelector("#comment-text").innerHTML;
//     editDoc.hidden = editDoc.hidden ? false : true;
//     editDoc = comment.querySelector("#comment-edit-toggle");
//     editDoc.hidden = editDoc.hidden ? false : true;
//     if (editDoc.hidden && (value === editDoc.value || isEmpty(editDoc.value))) {
//       const attName = "error-messages";
//       const inputAreaDoc = editDoc.querySelector(".input-area");
//       const uitDoc = inputAreaDoc.querySelector(".uit");
//       uitDoc.value = value;
//       if (isNotEmpty(inputAreaDoc.getAttribute(attName))) {
//         inputAreaDoc.removeAttribute(attName);
//       }
//     }
//   }
// };

// const fetchResponseReady = async (
//   form = null,
//   formData = {},
//   requestURL = ""
// ) => {
//   try {
//     const params = {
//       body: formData,
//       method: form.method,
//     };
//     const response = await fetch(requestURL, params);
//     return await response.json();
//   } catch (err) {
//     console.log("Failed to fetch error messages : ", err);
//   }
// };

// const formValidation = (
//   formDoc = null,
//   moveToPath = "",
//   requestURL = "",
//   ...otherArg
// ) => {
//   if (isEmpty(moveToPath) || isEmpty(formDoc) || isEmpty(requestURL)) return;

//   formDoc.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     try {
//       const { customFn, addingFormData } = getArguments(
//         otherArg,
//         "addingFormData",
//         "customFn"
//       );
//       const formData = formDataProcessing(formDoc, addingFormData);
//       const submitCoreFunctionExecution = async () => {
//         const { response } = await fetchResponseReady(
//           formDoc,
//           formData,
//           requestURL
//         );
//         const { errors } = response;
//         if (isNotEmpty(response) && isEmpty(errors)) {
//           formDoc.submit();
//           moveTo(moveToPath);
//         } else if (isNotEmpty(errors)) {
//           errorRender(formDoc, errors);
//         }
//       };
//       // customFn이 있을 때
//       if (isNotEmpty(customFn)) {
//         let result = {};
//         customFn(result);
//         if (result.success) {
//           await submitCoreFunctionExecution();
//         } else {
//           console.log("custom function failed.");
//         }
//       }
//       // customFn이 없을 때
//       else {
//         await submitCoreFunctionExecution();
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   });
// };

// const entry = () => {
//   try {
//     // 글 생성 시 사용되는 폼 유효성 검사
//     formValidation(queryDocuments("#post-create"), "/posts", "/posts");
//     // 글 수정 시 사용되는 폼 유효성 검사
//     const path = window.location.pathname.replace("/edit", "");
//     formValidation(queryDocuments("#post-edit"), path, `${path}?_method=PUT`);
//     // 글 삭제 시 사용되는 폼 유효성 검사
//     formValidation(
//       queryDocuments("#post-destroy"),
//       "/posts",
//       `${path}?_method=DELETE`,
//       {
//         customFn: (result) => {
//           result["success"] = confirm(
//             "Are you sure you want to delete this post?"
//           );
//         },
//       }
//     );

//     // 댓글 생성 시 사용되는 폼 유효성 검사
//     const commentCreateForm = queryDocuments("#comment-create");
//     if (isNotEmpty(commentCreateForm)) {
//       formValidation(commentCreateForm, path, "/comment", {
//         addingFormData: {
//           post_id: commentCreateForm.dataset.postId,
//         },
//       });
//     }
//     // 댓글 수정 시 사용되는 수정 버튼 보이는지 유무와 폼 유효성 검사
//     const commentEditBtn = queryDocuments("#action-edit, #edit-cancel", true);
//     if (isNotEmpty(commentEditBtn)) {
//       commentEditBtn.forEach((btn) => {
//         btn.addEventListener("click", (e) => {
//           e.preventDefault();
//           editFormToggle(e, btn);
//         });
//       });
//     }

//     const commentEditForm = queryDocuments("#comment-edit", true);
//     if (isNotEmpty(commentEditForm)) {
//       commentEditForm.forEach((editForm) => {
//         const originPath = window.location.origin;
//         const subpath = editForm.action.replace(originPath, "");
//         formValidation(editForm, path, subpath, {
//           addingFormData: { post_id: editForm.dataset.postId },
//         });
//       });
//     }

//     // 댓글 삭제 시 사용되는 폼 유효성 검사
//     // 사용자 생성 시 사용되는 폼 유효성 검사
//     // 사용자 수정 시 사용되는 폼 유효성 검사
//   } catch (err) {
//     console.log(err);
//   }
// };

// entry();
