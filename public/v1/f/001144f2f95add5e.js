/* A picture attached to a line must not take that line's interpreter slot. */
(() => {
  "use strict";
  const E = globalThis.StoryEngine;
  if (!E?.plugin || E.plugins?.["bt-line-order"]) return;
  let reordered = 0;
  const normalize = data => {
    if (E.S()?.id !== "between-tides") return;
    const seen = new WeakSet();
    const walk = value => {
      if (!value || typeof value !== "object" || seen.has(value)) return;
      seen.add(value);
      if (!Array.isArray(value) && "pic" in value) {
        const keys = Object.keys(value);
        const line = keys.find(k => k === "n" || k === "say" || k === "think");
        if (line && keys.find(k => E.mech[k]) === "pic") {
          // Keep this exact object and every array/path. Native line handlers
          // already pass st.pic to E.ui.line; adding a side handler would duplicate it.
          const picture = value.pic;
          delete value.pic;
          value.pic = picture;
          reordered++;
        }
      }
      for (const item of Object.values(value)) walk(item);
    };
    for (const key of ["nodes", "places", "talks", "events"]) walk(data?.[key]);
  };
  E.btLineOrder = { normalize, count: () => reordered };
  E.plugin({ id: "bt-line-order", on: { boot: () => normalize(E.S()), chapter: normalize } });
})();
