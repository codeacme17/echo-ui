"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
function _interopNamespace(e) {
  if (e && e.__esModule)
    return e;
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const jsxRuntime__namespace = /* @__PURE__ */ _interopNamespace(jsxRuntime);
var data = {
  islandProps: [],
  islandToPathMap: {}
};
var originJsx = jsxRuntime__namespace.jsx;
var originJsxs = jsxRuntime__namespace.jsxs;
var internalJsx = (jsx3, type, props, ...args) => {
  if (props && props.__island) {
    data.islandProps.push(props || {});
    const id = type.name;
    data.islandToPathMap[id] = props.__island;
    delete props.__island;
    return jsx3("div", {
      __island: `${id}:${data.islandProps.length - 1}`,
      children: jsx3(type, props, ...args)
    });
  }
  return jsx3(type, props, ...args);
};
var jsx2 = (...args) => internalJsx(originJsx, ...args);
var jsxs2 = (...args) => internalJsx(originJsxs, ...args);
var Fragment2 = jsxRuntime__namespace.Fragment;
exports.Fragment = Fragment2;
exports.data = data;
exports.jsx = jsx2;
exports.jsxs = jsxs2;
