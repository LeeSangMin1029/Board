import { isEmpty } from "./ObjectValidation.js";

/*
  error status :
  failed : 1000
  succeded : -1
*/
function exceptionError(object) {
  const status = {};
  const isObj = isNotEmpty(object);
  let resultObject, code;
  if (isObj) {
    resultObject = object;
    code = 1000;
  } else {
    status.errorMessage = new Error("Object does not exist").stack.split(
      "\n"
    )[0];
    resultObject = undefined;
    code = -1;
  }
  status.code = code;
  return { status: status, object: resultObject };
}

function defaultRegex() {
  return {
    special: /[~!@#$%^&*()_+|<>?:{}]/,
    hanguel: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/,
    number: /[0-9]/,
    english: /[a-zA-Z]/,
  };
}

function getRegex(regKey = "") {
  let reg = defaultRegex();
  let regParsed = {};
  const parsedName = regKey.replace(/ /g, "").split(",");
  const { keys, excludeKeys } = getKey(parsedName, "!");
  if (isNotEmpty(excludeKeys)) {
    excludeKeys.forEach((key) => {
      delete reg[key];
    });
  }
  if (isNotEmpty(keys)) {
    for (const k of keys) {
      regParsed[k] = reg[k];
    }
  }
  return regParsed;
}

function getKey(name, exclude) {
  let exKeys = [];
  let keys = [];
  for (const n of name) {
    // !일 때는 해당 키를 반환해서 배열에 추가
    if (isNotEmpty(n) && isNotEmpty(exclude) && n.includes(exclude)) {
      exKeys.push(n.replace("!", ""));
    } else {
      keys.push(n);
    }
  }
  return { excludeKeys: exKeys, keys: keys };
}

function regexTest(keys = "", value) {
  const { object: regKey } = exceptionError(keys);
  const regex = regKey === "all" ? defaultRegex() : getRegex(regKey);
  let checked = false;
  for (const key in regex) {
    if (!regex.hasOwnProperty(key)) continue;
    const obj = regex[key];
    if (obj.test(value)) {
      checked = true;
    }
  }
  return checked;
}

function customEventOccurred(node, eventName, fn) {
  if (isNotEmpty(node)) {
    node.dispatchEvent(
      new CustomEvent(eventName, {
        detail: fn(),
      })
    );
  }
}

function addOneEvent(node, event, fn) {
  node.addEventListener(event, (e) => {
    fn(e, node);
  });
}

class DocumentEvents {
  constructor(selector, eventList) {
    this.selector = selector;
    this.eventList = eventList;
    const { object, status } = exceptionError(
      document.querySelectorAll(this.selector)
    );
    this.nodeElements = object;
    this.nodeLength = object.length;
    this.nodeErrors = status.errorMessage;
  }
  get nodes() {
    return this.nodeElements;
  }

  get length() {
    return this.nodeLength;
  }

  get errors() {
    return this.nodeErrors;
  }

  addMultipleEvent(fn) {
    this.nodeElements.forEach((node) => {
      this.eventList.forEach((event) => {
        addOneEvent(node, event, fn);
      });
    });
  }

  execute(fn) {
    this.addMultipleEvent(fn);
  }
}

export { DocumentEvents, customEventOccurred, regexTest };
