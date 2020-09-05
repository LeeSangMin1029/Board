const navigateToURL = (targetURL = "") => {
  try {
    if (isNotEmpty(targetURL)) {
      location = targetURL;
    }
  } catch (err) {
    console.log(err);
  }
};

export { navigateToURL };
