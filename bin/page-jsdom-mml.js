"use strict";
var mjAPI = require("../lib/main.js");
mjAPI.start();
var jsdom = require('jsdom').jsdom;
var serializeDocument = require("jsdom").serializeDocument;

var input = "<!DOCTYPE html><p> When <math> <mi>a</mi><mo>&#x2260;</mo><mn>0</mn> </math>, there are two solutions to <math> <mi>a</mi><msup><mi>x</mi><mn>2</mn></msup> <mo>+</mo> <mi>b</mi><mi>x</mi> <mo>+</mo> <mi>c</mi> <mo>=</mo> <mn>0</mn> </math></p>";

var document = jsdom(input);
var window = document.defaultView;
var array = window.document.getElementsByTagName("math");

var state = {};  // shared state among typeset requests (SVG <defs> for global sprite are stored here);  cf useGlobalCache
var globalSVG = document.createElement("svg"); // the SVG sprite
globalSVG.setAttribute("style","display:none;");
document.body.appendChild(globalSVG);

for (var i = 0; i < array.length; i++) {
    let index = i;
    let element = array[index];
    mjAPI.typeset({
      math: element.outerHTML,
      format: "MathML",
      svg: true,
      useGlobalCache: true,
      state: state,
      speakText: true
    }, function(data) {
      if (data.errors){
        throw data.errors;
      }
      if (data.svg) {
        var svg = document.createElement("span");
        svg.innerHTML = data.svg;
        element.parentNode.replaceChild(svg, element);
      }
      if ( (index+1) === array.length) {
        globalSVG.appendChild(document.importNode(state.defs,true));
        console.log(serializeDocument(document));
      }
    });
}
