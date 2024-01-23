var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var _index, _cjkIndex, _headerToIdMap, _langRoutePrefix, _matchHeader, matchHeader_fn, _matchContent, matchContent_fn, _normalizeStatement, normalizeStatement_fn;
import FlexSearch from "flexsearch";
import { uniqBy } from "lodash-es";
import "react";
import "react/jsx-runtime";
import { g as getAllPages, n as normalizeHref, w as withBase } from "../ssr-entry.mjs";
import "react-dom/server";
import "@vercel/analytics/react";
import "react-live";
import "@nextui-org/react";
import "prism-react-renderer";
import "lucide-react";
import "clsx";
import "tailwind-merge";
import "tone";
import "react-router-dom";
import "nprogress";
import "copy-to-clipboard";
import "body-scroll-lock";
import "react-helmet-async";
import "b-tween";
import "react-router-dom/server.mjs";
function backTrackHeaders(rawHeaders, index) {
  let current = rawHeaders[index];
  let currentIndex = index;
  const res = [current];
  while (current && current.depth > 2) {
    let matchedParent = false;
    for (let i = currentIndex - 1; i >= 0; i--) {
      const header = rawHeaders[i];
      if (header.depth > 1 && header.depth === current.depth - 1) {
        current = header;
        currentIndex = i;
        res.unshift(current);
        matchedParent = true;
        break;
      }
    }
    if (!matchedParent) {
      break;
    }
  }
  return res;
}
const THRESHOLD_CONTENT_LENGTH = 100;
const cjkRegex = /[\u3131-\u314e|\u314f-\u3163|\uac00-\ud7a3]|[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]|[\u3041-\u3096]|[\u30A1-\u30FA]/giu;
const WHITE_PAGE_TYPES = ["home", "api", "404", "custom"];
class PageSearcher {
  constructor(langRoutePrefix = "") {
    __privateAdd(this, _matchHeader);
    __privateAdd(this, _matchContent);
    __privateAdd(this, _normalizeStatement);
    __privateAdd(this, _index, void 0);
    __privateAdd(this, _cjkIndex, void 0);
    __privateAdd(this, _headerToIdMap, {});
    __privateAdd(this, _langRoutePrefix, void 0);
    __privateSet(this, _langRoutePrefix, langRoutePrefix);
  }
  async init(options = {}) {
    const pages = await getAllPages(
      (route) => route.path.startsWith(withBase(__privateGet(this, _langRoutePrefix)))
    );
    const pagesForSearch = pages.filter((page) => {
      var _a;
      return !WHITE_PAGE_TYPES.includes(((_a = page.frontmatter) == null ? void 0 : _a.pageType) || "");
    }).map((page) => ({
      title: page.title,
      headers: (page.toc || []).map((header) => header.text),
      content: page.content || "",
      path: page.routePath,
      rawHeaders: page.toc || []
    }));
    __privateSet(this, _headerToIdMap, pages.reduce((acc, page) => {
      (page.toc || []).forEach((header) => {
        acc[page.routePath + header.text] = header.id;
      });
      return acc;
    }, {}));
    const createOptions = {
      encode: "simple",
      tokenize: "forward",
      split: /\W+/,
      async: true,
      doc: {
        id: "path",
        field: ["title", "headers", "content"]
      },
      ...options
    };
    __privateSet(this, _index, FlexSearch.create(createOptions));
    __privateSet(this, _cjkIndex, FlexSearch.create({
      ...createOptions,
      encode: false,
      tokenize(str) {
        const cjkWords = [];
        let m = null;
        do {
          m = cjkRegex.exec(str);
          if (m) {
            cjkWords.push(m[0]);
          }
        } while (m);
        return cjkWords;
      }
    }));
    __privateGet(this, _index).add(pagesForSearch);
    __privateGet(this, _cjkIndex).add(pagesForSearch);
  }
  async match(query, limit = 7) {
    var _a, _b;
    const searchResult = await Promise.all([
      (_a = __privateGet(this, _index)) == null ? void 0 : _a.search({
        query,
        limit
      }),
      (_b = __privateGet(this, _cjkIndex)) == null ? void 0 : _b.search(query, limit)
    ]);
    const flattenSearchResult = searchResult.flat(2).filter(Boolean);
    const matchedResult = [];
    flattenSearchResult.forEach((item) => {
      const matchedHeader = __privateMethod(this, _matchHeader, matchHeader_fn).call(this, item, query, matchedResult);
      if (matchedHeader) {
        return;
      }
      __privateMethod(this, _matchContent, matchContent_fn).call(this, item, query, matchedResult);
    });
    const res = uniqBy(matchedResult, "link");
    return res;
  }
}
_index = new WeakMap();
_cjkIndex = new WeakMap();
_headerToIdMap = new WeakMap();
_langRoutePrefix = new WeakMap();
_matchHeader = new WeakSet();
matchHeader_fn = function(item, query, matchedResult) {
  const { headers, rawHeaders } = item;
  for (const [index, header] of headers.entries()) {
    if (header.includes(query)) {
      const headerAnchor = __privateGet(this, _headerToIdMap)[item.path + header];
      const headerGroup = backTrackHeaders(rawHeaders, index);
      const headerStr = headerGroup.map((item2) => item2.text).join(" > ");
      matchedResult.push({
        type: "header",
        title: item.title,
        header: headerStr,
        headerHighlightIndex: headerStr.indexOf(query),
        link: `${normalizeHref(item.path)}#${headerAnchor}`
      });
      return true;
    }
  }
  return false;
};
_matchContent = new WeakSet();
matchContent_fn = function(item, query, matchedResult) {
  var _a;
  const { content, headers } = item;
  const queryIndex = content.indexOf(query);
  if (queryIndex === -1) {
    return;
  }
  const headersIndex = headers.map((h) => content.indexOf(h));
  const currentHeaderIndex = headersIndex.findIndex((hIndex, position) => {
    if (position < headers.length - 1) {
      const next = headersIndex[position + 1];
      if (hIndex <= queryIndex && next >= queryIndex) {
        return true;
      }
    } else {
      return hIndex < queryIndex;
    }
  });
  const currentHeader = (_a = headers[currentHeaderIndex]) != null ? _a : item.title;
  let statementStartIndex = content.slice(0, queryIndex).lastIndexOf("\n");
  statementStartIndex = statementStartIndex === -1 ? 0 : statementStartIndex;
  const statementEndIndex = content.indexOf("\n", queryIndex + query.length);
  let statement = content.slice(statementStartIndex, statementEndIndex);
  if (statement.length > THRESHOLD_CONTENT_LENGTH) {
    statement = __privateMethod(this, _normalizeStatement, normalizeStatement_fn).call(this, statement, query);
  }
  matchedResult.push({
    type: "content",
    title: item.title,
    header: currentHeader,
    statement,
    statementHighlightIndex: statement.indexOf(query),
    link: `${normalizeHref(item.path)}#${currentHeader}`
  });
};
_normalizeStatement = new WeakSet();
normalizeStatement_fn = function(statement, query) {
  const queryIndex = statement.indexOf(query);
  const maxPrefixOrSuffix = Math.floor(
    (THRESHOLD_CONTENT_LENGTH - query.length) / 2
  );
  let prefix = statement.slice(0, queryIndex);
  if (prefix.length > maxPrefixOrSuffix) {
    prefix = "..." + statement.slice(queryIndex - maxPrefixOrSuffix + 3, queryIndex);
  }
  let suffix = statement.slice(queryIndex + query.length);
  if (suffix.length > maxPrefixOrSuffix) {
    suffix = statement.slice(
      queryIndex + query.length,
      queryIndex + maxPrefixOrSuffix - 3
    ) + "...";
  }
  return prefix + query + suffix;
};
export {
  PageSearcher
};
