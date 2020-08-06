import { addEvent, getDoc } from "../utils/AddDocumentsEvent.js";
import { getData } from "../required/Request.js";
import { isEmpty } from "../utils/ObjectValidation.js";

function getEvents() {
  return {
    events: {
      input: {
        eventList: ["paste", "input", "propertychange"],
        callFn: inputCallFn,
      },
      toggleBtn: {
        eventList: ["click"],
        callFn: btnCallFn,
      },
      formSubmit: {
        eventList: ["submit"],
        callFn: formCallFn,
      },
    },
  };
}

const inputCallFn = (e, doc) => {
  const curValue = e.target.value;
  const initialValue = e.target.defaultValue;
  const btn = doc.closest("div.text-area").querySelector("#clickable");
  // 현재 값이 비어있을 때
  if (isEmpty(curValue)) {
    btn.disabled = true;
  }
  // 초기 값이 현재 값과 같을 때
  else if (initialValue === curValue) {
    btn.disabled = true;
  } else {
    btn.disabled = false;
  }
};

const btnCallFn = (e, doc) => {
  e.preventDefault();
  const comment = doc.closest("div#comment");
  let toggleHidden = comment.querySelector("#comment-edit");
  toggleHidden.hidden = toggleHidden.hidden ? false : true;
  toggleHidden = comment.querySelector("#comment-body");
  toggleHidden.hidden = toggleHidden.hidden ? false : true;
};

const formCallFn = async (e, doc) => {
  e.preventDefault();
  try {
    const formdata = new FormData(doc);
    formdata.append("post_id", doc.dataset.postId);
    const { errors, redirect } = await getData(
      `/comment/${doc.dataset.commentId}`,
      formdata,
      "PUT"
    );
  } catch (err) {
    console.log(err);
  }
};

(async function () {
  const { events } = getEvents();

  // 값 변경시 발생하는 이벤트
  addEvent(".uit", events.input, true);
  // 토글 기능 수행
  addEvent("#action-edit, #edit-cancel", events.toggleBtn, true);
  // 각 form에 대한 submit 이벤트
  addEvent("form#comment", events.formSubmit, true);

  // 페이지 초기에 button을 비활성화
  const btns = document.querySelectorAll("#clickable");
  btns.forEach((btn) => {
    btn.disabled = true;
  });
})();
