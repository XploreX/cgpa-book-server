function prepareQuery(query) {
  let flags = "";
  if ("ignorecase" in query) {
    if (query["ignorecase"].toLowerCase() == "true") {
      flags += "i";
      query["ignorecase"] = true;
    } else {
      query["ignorecase"] = false;
    }
  }
  if ("semester" in query) {
    query["semester"] = Number(query["semester"]);
  }
  for (key in query) {
    // console.log(key);
    if (typeof query[key] === "string") {
      // console.log(key + " is string");
      query[key] = query[key].replace("(", "\\(");
      query[key] = query[key].replace(")", "\\)");
      query[key] = new RegExp(query[key], flags);
      // console.log(query[key]);
    }
  }
}

module.exports = prepareQuery;
