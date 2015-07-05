export function shallowEqual(a, b) {
  if (a === b) {
    return true;
  }
  let key;
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
