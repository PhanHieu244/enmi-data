// Between Tides — bảo toàn kiến thức của lần chơi và hành động đang làm dở.
// Nạp sau action.js, trước boot.js. Không thay đổi file lõi hoặc định dạng save.
(() => {
  "use strict";
  const E = globalThis.StoryEngine;
  if (!E?.plugin || E.plugins?.["bt-integrity"]) return;
  const nativeState = E.state;
  const nativeAct = E.mech?.act;
  const isThisStory = () => E.S()?.id === "between-tides";

  // choice.need dạng chuỗi trong engine đọc trực tiếp bộ sưu tập G.truths.
  // Đổi riêng yêu cầu T1–T14 thành điều kiện theo R, giữ nguyên mảng/đường dẫn save.
  const normalizeRequirements = data => {
    if (!isThisStory()) return;
    const visited = new WeakSet();
    const walk = value => {
      if (!value || typeof value !== "object" || visited.has(value)) return;
      visited.add(value);
      if (typeof value.need === "string" && /^T(?:[1-9]|1[0-4])$/.test(value.need)) {
        const id = value.need;
        value.need = s => !!s.R?.truths?.[id];
      }
      for (const child of Object.values(value)) walk(child);
    };
    walk(data);
  };

  E.plugin({
    id: "bt-integrity",
    mechs: nativeAct ? {
      act(c) {
        // Chưa hoàn tất cử chỉ thì tải lại phải trở về chính bước ấy.
        // Nhánh ok/fail và mọi xử lý pointer vẫn do action.js gốc thực hiện.
        if (isThisStory()) c.resumeHere?.();
        return nativeAct(c);
      },
    } : {},
    on: {
      boot: normalizeRequirements,
      chapter: normalizeRequirements,
    },
    setup() {
      E.state = function (...args) {
        const state = nativeState.apply(this, args);
        if (isThisStory()) state.truth = id => !!state.R?.truths?.[id];
        return state;
      };
    },
  });
})();
