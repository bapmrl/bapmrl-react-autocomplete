"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shallowEqual = shallowEqual;
function shallowEqual(a, b) {
  if (a === b) {
    return true;
  }
  var key = void 0;
  for (key in a) {
    if (a.hasOwnProperty(key) && (!b.hasOwnProperty(key) || a[key] !== b[key])) {
      return false;
    }
  }
  for (key in b) {
    if (b.hasOwnProperty(key) && !a.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}