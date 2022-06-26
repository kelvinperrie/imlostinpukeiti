
// console.log("here's the data: ");
// console.log(trailData);

const parser = new DOMParser();
const doc = parser.parseFromString(trailData, "application/xml");
// print the name of the root element or error message
const errorNode = doc.querySelector("parsererror");
if (errorNode) {
  console.log("error while parsing");
} else {
  console.log(doc.documentElement.nodeName);
}