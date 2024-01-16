import * as jsxRuntime from "react/jsx-runtime";
var data = {
  islandProps: [],
  islandToPathMap: {}
};
var originJsx = jsxRuntime.jsx;
var originJsxs = jsxRuntime.jsxs;
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
var Fragment2 = jsxRuntime.Fragment;
export {
  Fragment2 as Fragment,
  data,
  jsx2 as jsx,
  jsxs2 as jsxs
};
