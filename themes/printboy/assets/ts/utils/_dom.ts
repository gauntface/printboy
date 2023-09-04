export function rmElementChildren(element: Element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
