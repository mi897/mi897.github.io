// Tick-box progress for study plans. State lives in this browser's localStorage under the plan's key.
export function initStudyProgress() {
  const root = document.querySelector<HTMLElement>(".study[data-store]");
  if (!root) return;
  const key = root.dataset.store!;
  let state: Record<string, boolean> = {};
  try { state = JSON.parse(localStorage.getItem(key) || "{}") || {}; } catch { state = {}; }

  const boxes = [...root.querySelectorAll<HTMLInputElement>("input[data-key]")];
  const cells = [...root.querySelectorAll<HTMLElement>("[data-count]")];
  const label = document.getElementById("overall-label");
  const bar = document.getElementById("overall-bar") as HTMLProgressElement | null;

  const update = () => {
    // Contents page: totals come from the build; ticks come from storage, so a section's count works without its page loaded.
    if (cells.length) {
      let done = 0, total = 0;
      for (const c of cells) {
        const t = Number(c.dataset.total);
        if (!t) continue;
        const prefix = "m" + c.dataset.count!.replace("module-", "");
        const d = Object.entries(state).filter(([k, v]) => v && k.startsWith(prefix) && /^m\d(p\d|g)$/.test(k)).length;
        c.textContent = `${d} / ${t}`;
        done += d; total += t;
      }
      if (label) label.textContent = `${done} of ${total} done`;
      if (bar) { bar.max = total || 1; bar.value = done; }
    }
  };

  for (const b of boxes) {
    b.checked = !!state[b.dataset.key!];
    b.addEventListener("change", () => {
      state[b.dataset.key!] = b.checked;
      try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
      update();
    });
  }
  update();
}
