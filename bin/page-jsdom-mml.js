var mjAPI = require("../lib/main");
mjAPI.start();
var jsdom = require('jsdom').jsdom;
var serializeDocument = require("jsdom").serializeDocument;

var input = "<!DOCTYPE html><p> When <math> <mi>a</mi><mo>&#x2260;</mo><mn>0</mn> </math>, there are two solutions to <math> <mi>a</mi><msup><mi>x</mi><mn>2</mn></msup> <mo>+</mo> <mi>b</mi><mi>x</mi> <mo>+</mo> <mi>c</mi> <mo>=</mo> <mn>0</mn> </math>";

var document = jsdom(input);
var window = document.defaultView;
var array = window.document.getElementsByTagName("math");

for (var i = 0; i < array.length; i++) {
  var element = array[i];
  mjAPI.typeset({
    math: element.outerHTML,
    format: "MathML",
    svg: true
  }, function(data) {
    if (data.errors){
      throw data.errors;
    }
    if (data.svg) {
      var svg = document.createElement("span");
      svg.innerHTML = data.svg;
      console.log(element.parentElement.innerHTML);;
      element.parentNode.replaceChild(svg, element);
    }
});
}
console.log(serializeDocument(document));
