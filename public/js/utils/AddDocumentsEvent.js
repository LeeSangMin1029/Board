// attribute default value === "id"
function getDoc(selector, isAll = false) {
  return isAll
    ? document.querySelectorAll(selector)
    : document.querySelector(selector);
}

function addEvent(selector, events, isAll) {
  try {
    const docs = getDoc(selector, isAll);
    executeNodeEvents(docs, events);
  } catch (err) {
    console.log(err);
  }
}

function executeNodeEvents(docs, { eventList, callFn }) {
  if (typeof docs === "object" && typeof docs.length !== "undefined") {
    docs.forEach((childTag) => {
      eventList.forEach((event) => {
        childTag.addEventListener(event, (evt) => {
          callFn(evt, childTag);
        });
      });
    });
  } else {
    docs.addEventListener(eventList, (evt) => {
      callFn(evt, docs);
    });
  }
}

export { addEvent, getDoc };
