// Compact mobile navigation, adapted from the supplied v093 toolbar contract.
// Native data-a controls and quick-menu events remain the action/Auto owners.
(() => {
  "use strict";
  const E = globalThis.StoryEngine, V = globalThis.MobileVN;
  if (!E?.plugin || !V || E.plugins?.["bt-navigation"]) return;
  const label = (en, vi) => E.nat({ en, vi });
  let dispose = () => {}, close = () => {}, update = () => {};
  const reset = E.ui.reset;
  E.ui.reset = (...args) => { close(); return reset(...args); };
  E.plugin({ id: "bt-navigation", on: {
    boot() {
      dispose();
      if (E.S()?.id !== "between-tides") return;
      const root = document.querySelector(".se"), top = root?.querySelector(".se-top"), group = top?.querySelector(".se-grp");
      if (!root || !top || !group || top.querySelector("[data-bt-menu]")) return;
      root.classList.add("bt-navigation");
      const abort = new AbortController(), listen = (el, type, fn, options = {}) => el.addEventListener(type, fn, { ...options, signal: abort.signal });
      const names = { book: ["Records", "Hồ sơ"], log: ["Dialogue history", "Lịch sử thoại"], trall: ["Translation", "Bản dịch"], flow: ["Your route", "Tuyến đã chơi"], menu: ["Settings", "Cài đặt"] };
      const buttons = {};
      for (const button of [...top.querySelectorAll("[data-a]")]) {
        const key = button.dataset.a; if (!names[key]) continue;
        buttons[key] = button; button.type = "button";
        button.setAttribute("aria-label", label(...names[key])); button.title = label(...names[key]);
        const name = document.createElement("span"); name.className = "bt-tool-label"; name.textContent = label(...names[key]); button.append(name);
      }
      group.classList.add("bt-quick-menu"); group.dataset.quickMenu = ""; group.id = "bt-quick-menu"; group.hidden = true;
      group.setAttribute("role", "group"); group.setAttribute("aria-label", label("Game menu", "Menu trò chơi"));
      for (const key of ["book", "log", "trall", "flow", "menu"]) if (buttons[key]) group.append(buttons[key]);
      const home = document.createElement("button"); home.type = "button"; home.dataset.btHome = "";
      home.innerHTML = E.ICON.back + '<span class="bt-tool-label">' + E.esc(label("Back to overview", "Thoát về tổng quan")) + "</span>"; group.append(home);
      const menu = document.createElement("button"); menu.type = "button"; menu.className = "bt-top-icon"; menu.dataset.btMenu = "";
      menu.setAttribute("aria-controls", group.id); menu.setAttribute("aria-expanded", "false"); menu.setAttribute("aria-label", label("Open game menu", "Mở menu trò chơi"));
      menu.innerHTML = E.ICON.menu + '<i class="bt-menu-dot" hidden></i>';
      const goal = document.createElement("button"); goal.type = "button"; goal.className = "bt-top-icon"; goal.dataset.btGoal = "";
      goal.setAttribute("aria-controls", "bt-current-objective"); goal.setAttribute("aria-expanded", "false"); goal.setAttribute("aria-label", label("Current objective", "Mục tiêu hiện tại"));
      goal.innerHTML = (E.ICON.target || E.ICON.hint || E.ICON.doc) + '<small class="bt-clue-count" hidden></small>';
      top.prepend(goal); top.append(menu);
      // Location/time are passive context. Only Objective and Menu are controls.
      const oldStatus = top.querySelector(".se-stat");
      if (oldStatus) { const status = document.createElement("div"); status.className = oldStatus.className; status.innerHTML = oldStatus.innerHTML; status.setAttribute("role", "status"); oldStatus.replaceWith(status); }
      const objective = document.createElement("section"); objective.id = "bt-current-objective"; objective.className = "bt-objective"; objective.dataset.quickMenu = ""; objective.hidden = true;
      objective.innerHTML = '<b>' + E.esc(label("Current objective", "Mục tiêu hiện tại")) + '</b><p></p><button type="button" data-bt-goal-close>' + E.esc(label("Close", "Đóng")) + '</button>'; top.append(objective);
      const shield = document.createElement("div"); shield.className = "bt-menu-shield"; shield.hidden = true; shield.setAttribute("aria-hidden", "true"); root.append(shield);
      let opened = null, scheduled = false, lastFlag = E.R()?.f?.goal, currentGoal = "";
      const movedProfiles = new WeakSet();
      const setOpen = (kind, focus = false) => {
        if (opened === kind) return;
        const previous = opened; opened = kind;
        group.hidden = kind !== "menu"; objective.hidden = kind !== "goal"; shield.hidden = !kind;
        root.classList.toggle("bt-tools-open", !!kind);
        menu.setAttribute("aria-expanded", String(kind === "menu")); goal.setAttribute("aria-expanded", String(kind === "goal"));
        menu.setAttribute("aria-label", label(kind === "menu" ? "Close game menu" : "Open game menu", kind === "menu" ? "Đóng menu trò chơi" : "Mở menu trò chơi"));
        if (kind) { E.hush(); buttons.trall?.setAttribute("aria-pressed", String(!!E.G().set.tr)); if (focus) (kind === "menu" ? group : objective).querySelector("button")?.focus({ preventScroll: true }); }
        else if (focus) (previous === "goal" ? goal : menu).focus({ preventScroll: true });
        E.emit("quick-menu", !!kind);
      };
      close = () => setOpen(null); V.closeQuickMenu = close;
      const stopClick = event => { event.preventDefault(); event.stopPropagation(); };
      listen(menu, "click", event => { stopClick(event); setOpen(opened === "menu" ? null : "menu", event.detail === 0); });
      listen(goal, "click", event => { stopClick(event); update(); setOpen(opened === "goal" ? null : "goal", event.detail === 0); });
      listen(shield, "click", event => { stopClick(event); setOpen(null, true); });
      listen(objective.querySelector("button"), "click", event => { stopClick(event); setOpen(null, true); });
      listen(objective, "click", event => event.stopPropagation());
      listen(home, "click", event => { stopClick(event); setOpen(null); V.home(); });
      listen(group, "click", event => { if (event.target.closest("[data-a]")) setOpen(null); });
      listen(root, "keydown", event => {
        if (!opened) return;
        if (event.key === "Escape") { stopClick(event); setOpen(null, true); return; }
        if (opened !== "menu" || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
        const list = [...group.querySelectorAll("button")].filter(b => !b.disabled), index = list.indexOf(document.activeElement);
        event.preventDefault(); const next = event.key === "Home" ? 0 : event.key === "End" ? list.length - 1 : event.key === "ArrowDown" ? (index + 1 + list.length) % list.length : (index - 1 + list.length) % list.length;
        list[next]?.focus({ preventScroll: true });
      });
      let tabTransfer = false;
      listen(top, "keydown", event => { if (event.key === "Tab") tabTransfer = true; });
      listen(top, "pointerdown", () => { tabTransfer = false; }, { capture: true });
      listen(top, "focusout", event => { if (tabTransfer && event.relatedTarget && !top.contains(event.relatedTarget)) setOpen(null); tabTransfer = false; });
      const goalText = () => {
        const nativeGoal = root.querySelector(".se-panel.pl [data-objective], .se-panel.xp [data-xp-objective]");
        if (nativeGoal) return (nativeGoal.getAttribute("aria-label") || "").replace(/^(Objective|Mục tiêu):\s*/, "");
        const entry = E.S().profile?.lines?.[0], value = typeof entry?.value === "function" ? entry.value(E.state()) : entry?.value;
        return E.nat(value || E.S().me?.goal || { en: "Explore and listen to the people around you.", vi: "Khám phá và lắng nghe những người quanh bạn." });
      };
      update = (announce = false) => {
        // The v093 life module creates Profile outside .se-top. Keep that
        // native control/onclick, but place it with the other menu actions.
        // drawHud2 searches the entire .se host, so moving it cannot duplicate it.
        const profile = root.querySelector(".lf-hud");
        if (profile && profile.parentElement !== group) {
          profile.type = "button";
          profile.title = label("Profile", "Cá nhân");
          if (!profile.querySelector(".bt-tool-label")) {
            const name = document.createElement("span"); name.className = "bt-tool-label"; name.textContent = label("Profile", "Cá nhân"); profile.append(name);
          }
          group.prepend(profile);
          if (!movedProfiles.has(profile)) {
            movedProfiles.add(profile);
            // Native onclick stops bubbling. Close the quick menu during
            // capture, then let the unchanged native handler open its sheet.
            listen(profile, "click", () => setOpen(null), { capture: true });
          }
        }
        const next = goalText(); if (currentGoal !== next) { currentGoal = next; objective.querySelector("p").textContent = next; }
        const count = root.querySelector(".se-panel [data-objective] b, .se-panel [data-xp-objective] b")?.textContent || "", badge = goal.querySelector("small");
        badge.textContent = count; badge.hidden = !count;
        const flag = E.R()?.f?.goal;
        if (announce && flag && flag !== lastFlag && !E.auto && root.dataset.m !== "ov") {
          const toast = E.ui.toast('<div class="bt-objective-notice"><span>' + E.esc(next) + '</span><button type="button" aria-label="' + E.esc(label("Dismiss objective", "Đóng thông báo mục tiêu")) + '">×</button></div>', 2200, "objective-notice");
          if (toast) toast.onclick = event => { event.stopPropagation(); if (event.target.closest("button")) toast.remove(); };
        }
        lastFlag = flag;
      };
      const schedule = () => { if (scheduled) return; scheduled = true; queueMicrotask(() => { scheduled = false; update(); }); };
      const observer = new MutationObserver(schedule); observer.observe(root.querySelector(".se-ui"), { childList: true, subtree: true });
      // Profile may first appear after boot or be recreated when HUD toggles.
      observer.observe(root, { childList: true });
      const dotSource = buttons.book?.querySelector(".se-dot"), dot = menu.querySelector(".bt-menu-dot");
      const dotObserver = new MutationObserver(() => { dot.hidden = dotSource.hidden; }); if (dotSource) { dotObserver.observe(dotSource, { attributes: true, attributeFilter: ["hidden"] }); dot.hidden = dotSource.hidden; }
      dispose = () => { abort.abort(); observer.disconnect(); dotObserver.disconnect(); close(); update = () => {}; close = () => {}; };
      update();
    },
    step(type, step) { close(); queueMicrotask(() => update(type === "set" && Object.hasOwn(step.set || {}, "goal"))); },
    line() { update(); },
    end() { close(); },
  } });
})();
