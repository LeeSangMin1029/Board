function loadScript(src, type = "text/javascript", async, defer) {
  const imported = document.createElement("script");
  imported.defer = defer | false;
  imported.async = async | false;
  imported.type = type;
  imported.src = `/static/js/${src}`;
  document.head.appendChild(imported);
}

export { loadScript as load };
