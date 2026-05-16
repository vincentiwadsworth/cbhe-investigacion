/**
 * initLoadMore — Paginates grid items with a "load more" button.
 *
 * Expects this HTML structure:
 *   <div data-load-more="BATCH_SIZE">
 *     <article data-load-more-item>...</article>
 *     ...
 *   </div>
 *   <div data-load-more-wrapper>
 *     <button data-load-more-btn>
 *       <span data-load-more-text>Label text</span>
 *     </button>
 *   </div>
 *
 * Initially hides items beyond BATCH_SIZE, reveals BATCH_SIZE more per click,
 * updates the label with the remaining count, and removes the button when done.
 */
export function initLoadMore(): void {
  document.querySelectorAll<HTMLElement>("[data-load-more]").forEach((grid) => {
    const batch = parseInt(grid.dataset.loadMore || "4", 10);
    const items = grid.querySelectorAll<HTMLElement>("[data-load-more-item]");

    // Find the corresponding button wrapper (next sibling)
    const wrapper = grid.parentElement?.querySelector("[data-load-more-wrapper]");
    const btn = wrapper?.querySelector<HTMLButtonElement>("[data-load-more-btn]");
    const label = wrapper?.querySelector("[data-load-more-text]");

    if (!btn || items.length <= batch) {
      wrapper?.remove();
      return;
    }

    let shown = batch;
    items.forEach((el, i) => {
      if (i >= batch) el.classList.add("hidden");
    });

    const updateLabel = () => {
      const left = items.length - shown;
      if (label) label.textContent = `Cargar más (${left})`;
    };
    updateLabel();

    btn.addEventListener("click", () => {
      const next = Math.min(shown + batch, items.length);
      for (let i = shown; i < next; i++) items[i].classList.remove("hidden");
      shown = next;
      if (shown >= items.length) {
        wrapper?.remove();
        return;
      }
      updateLabel();
    });
  });
}