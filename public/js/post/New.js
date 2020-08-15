import { DocumentEvents, regexTest } from "../utils/AddDocumentsEvent.js";

(async function () {
  const inputDocs = new DocumentEvents(".uit", [
    "keyup",
    "paste",
    "propertychange",
  ]);
  inputDocs.execute((e, doc) => {
    const value = e.target.value;
    // regex가 통과되고 0.3 ~ 0.5초간 입력이 없으면 form을 검사한다.
    if (regexTest("all", value)) {
      console.log("regex pass", e);
    }
  });
})();

// 시간 검사 로직
// var startTime, endTime;

// function start() {
//   startTime = new Date();
// };

// function end() {
//   endTime = new Date();
//   var timeDiff = endTime - startTime; //in ms
//   // strip the ms
//   timeDiff /= 1000;

//   // get seconds
//   var seconds = Math.round(timeDiff);
//   console.log(seconds + " seconds");
// }
