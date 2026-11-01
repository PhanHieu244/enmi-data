// Between Tides — vá nhỏ cho điện thoại bằng API plugin, không dựng lại UI.
// Nạp sau action.js/bt-integrity.js, trước boot.js; CSS riêng bt-mobile.css.
(() => {
  "use strict";
  const E = globalThis.StoryEngine;
  if (!E?.plugin || E.plugins?.["bt-mobile"]) return;
  let dispose = () => {}, hint = null, schedule = () => {};
  const text = (en, vi) => E.nat({ en, vi });
  const isThisStory = () => E.S()?.id === "between-tides";

  const install = () => {
    dispose();
    if (!isThisStory()) return;
    const root = document.querySelector(".se");
    if (!root) return;
    // Engine v093 có gợi ý tự tắt + nút đóng. Dùng đúng UI native khi có;
    // phần bổ sung bên dưới chỉ là fallback cho handoff v07.
    const nativeHints = typeof E.ui?.hintToast === "function";
    if (nativeHints) Object.assign(E.S(), {
      transientHints: true,
      recordPresentation: "compact",
      inspectionZoom: false,
      collapsibleObjectives: true,
    });
    root.classList.add("bt-mobile");
    const abort = new AbortController();
    const options = { capture: true, signal: abort.signal };
    let raf = 0, pointer = null;
    const blocked = new Map();
    const markBlocked = (id, until) => {
      const now = performance.now();
      for (const [key, expiry] of blocked) if (expiry < now) blocked.delete(key);
      if (!blocked.has(id) && blocked.size >= 32) blocked.delete(blocked.keys().next().value);
      blocked.set(id, until);
    };
    const context = () => {
      const view = E.R()?.vw;
      return view ? view.pid + "/" + view.v : "";
    };

    const addSettings = () => {
      for (const host of root.querySelectorAll("[data-opts], .se-shb")) {
        if (!host.querySelector('[data-ov="vDlg"]')) continue;
        let group = host.querySelector(".bt-mobile-settings");
        if (!group) {
          group = document.createElement("div");
          group.className = "se-og bt-mobile-settings";
          group.innerHTML = `<h4>${E.esc(text("Actions", "Thao tác"))}</h4><div class="se-ovos"><button type="button" class="se-ovo" role="switch" aria-checked="false" data-ov="easyAct" data-bt-easy><span><b>${E.esc(text("Easy actions", "Hành động dễ"))}</b><small>${E.esc(text("More touch tolerance and no gesture time limit. Applies to the next action.", "Vùng chạm dễ hơn, không giới hạn giờ cho cử chỉ. Áp dụng từ hành động kế tiếp."))}</small></span><i class="se-sw"></i></button></div>`;
          const groups = host.querySelectorAll(".se-og");
          if (groups.length) groups[groups.length - 1].after(group);
          else host.appendChild(group);
        }
        const on = !!E.G()?.set?.easyAct;
        const button = group.querySelector("[data-bt-easy]");
        button.setAttribute("aria-checked", String(on));
        button.querySelector(".se-sw").classList.toggle("on", on);
      }
    };

    const clearGlow = () => {
      for (const plane of root.querySelectorAll(".vbw.zones .vbx")) {
        plane.classList.remove("hint1", "hint2", "hint3");
        plane.querySelectorAll(".pz.pick").forEach(el => el.classList.remove("pick"));
      }
    };
    const updateHint = () => {
      if (!hint || hint.context !== context()) { hint = null; return; }
      const message = root.querySelector(".se-panel.pl .pl-msg");
      if (!message) return;
      const value = [...message.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join("").trim();
      if (hint.message == null) hint.message = value;
      // Cảnh báo khác (chưa đủ manh mối, dùng sai đồ…) vẫn phải được đọc.
      if (value !== hint.message) { hint = null; return; }
      message.classList.add("bt-hint-message");
      message.hidden = hint.dismissed;
      if (hint.dismissed) { clearGlow(); return; }
      if (!message.querySelector("[data-bt-hide-hint]")) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "bt-hint-close";
        button.dataset.btHideHint = "";
        button.setAttribute("aria-label", text("Hide hint", "Ẩn gợi ý"));
        button.innerHTML = E.ICON.x;
        message.appendChild(button);
      }
    };
    schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; addSettings(); updateHint(); });
    };
    const observer = new MutationObserver(changes => {
      // Không quét lại UI theo từng ký tự lời thoại.
      if (changes.some(change => [...change.addedNodes].some(node => node.nodeType === 1))) schedule();
    });
    observer.observe(root, { childList: true, subtree: true });

    root.addEventListener("click", event => {
      const target = event.target.closest?.("button");
      if (!target) return;
      if (target.matches("[data-bt-easy]")) {
        // data-ov đi qua bindOpts gốc: chỉ lưu G, không ghi đè lần chơi R
        // khi người dùng đang ở màn tổng quan chưa bấm Tiếp tục.
        schedule();
        return;
      }
      if (nativeHints && target.matches("[data-dismiss-hint]")) {
        clearGlow();
        return;
      }
      if (target.matches("[data-bt-hide-hint]")) {
        event.preventDefault(); event.stopImmediatePropagation();
        if (hint) hint.dismissed = true;
        updateHint();
        root.querySelector(".se-panel.pl [data-hint]")?.focus({ preventScroll: true });
        return;
      }
      if (target.matches(".se-panel.pl [data-hint]")) {
        if (nativeHints) return;
        hint = { context: context(), message: null, dismissed: false };
        schedule();
      }
    }, options);

    // place.js dùng một điểm bắt đầu vuốt, chưa giữ pointerId như action.js.
    // Chặn ngón thứ hai trước handler gốc; không can thiệp cử chỉ hành động.
    const exploring = event => !!event.target.closest?.(".se-stage") && root.dataset.m === "pl" && !event.target.closest(".wg");
    const stop = event => { event.preventDefault(); event.stopImmediatePropagation(); };
    root.addEventListener("pointerdown", event => {
      if (!exploring(event)) return;
      blocked.delete(event.pointerId);
      if (event.isPrimary === false || (pointer != null && pointer !== event.pointerId)) {
        markBlocked(event.pointerId, Infinity); stop(event); return;
      }
      pointer = event.pointerId;
    }, options);
    const up = event => {
      if (blocked.has(event.pointerId) || (event.isPrimary === false && exploring(event))) {
        markBlocked(event.pointerId, performance.now() + 700); stop(event); return;
      }
      if (pointer === event.pointerId) pointer = null;
    };
    root.addEventListener("pointerup", up, options);
    root.addEventListener("pointercancel", up, options);
    root.addEventListener("click", event => {
      const until = blocked.get(event.pointerId);
      if (until != null && performance.now() <= until && event.target.closest?.(".se-stage")) stop(event);
    }, options);
    const resetPointers = () => { pointer = null; blocked.clear(); };
    const cancelPlacePointer = () => {
      // Khi ứng dụng xuống nền giữa một cú vuốt, xoá cả điểm bắt đầu ở engine.
      // Gọi luồng pointercancel gốc; không điều hướng và không trao kết quả.
      if (pointer != null && root.dataset.m === "pl" && typeof PointerEvent === "function") {
        root.querySelector(".se-stage")?.dispatchEvent(new PointerEvent("pointercancel", {
          bubbles: true, pointerId: pointer, isPrimary: true,
        }));
      }
      resetPointers();
    };
    window.addEventListener("blur", cancelPlacePointer, { signal: abort.signal });
    window.addEventListener("pagehide", cancelPlacePointer, { signal: abort.signal });
    const offStep = E.on("step", resetPointers);
    dispose = () => {
      abort.abort(); observer.disconnect(); offStep(); cancelAnimationFrame(raf);
      hint = null; schedule = () => {}; root.classList.remove("bt-mobile");
    };
    schedule();
  };

  E.plugin({
    id: "bt-mobile",
    on: {
      boot: install,
      step: () => { hint = null; },
    },
  });
})();
