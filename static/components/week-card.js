const cssUrl = new URL(
  "./styles/week-card/week-card.css",
  import.meta.url
);

class WeekCard extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <link rel="stylesheet" href="${cssUrl.href}">

      <div class="week-card">
        <div class="week-day-title">
          <h3>${this.getAttribute("day")}</h3>
        </div>
        <div class="task-add-btn">
          <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" stroke="black" fill="white" />
            
            <!-- plus sign -->
            <line x1="50" y1="30" x2="50" y2="70" stroke="black" />
            <line x1="30" y1="50" x2="70" y2="50" stroke="black" />
          </svg>
        </div>

        <div id="daily-comment-${this.getAttribute("day")}" contenteditable="true" data-placeholder="Comment Disables in HH::MM::SS"></div>

      </div>
    `;
  }
}

customElements.define("week-card", WeekCard);
