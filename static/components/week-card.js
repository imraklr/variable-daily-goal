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

// Will be populated after the DOM is ready by collecting each <week-card>'s shadow comment box
let weekElementMapping = {};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('week-card').forEach(weekCard => {
    const shadow = weekCard.shadowRoot;
    if (!shadow) return;

    const weekTitle = shadow.querySelector('.week-day-title')?.textContent?.trim();
    const commentBox = shadow.querySelector('[id^="daily-comment-"]');

    if (weekTitle && commentBox) {
      weekElementMapping[weekTitle] = commentBox;
    }
  });
});

function asSoonAsCommentPlaceholderIsEmpty(box) {
  const date = new Date();

  box.setAttribute(
    "data-placeholder",
    `Comment Disables in ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  );
}

function updateCommentState(dayName, box) {
  const now = new Date();

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const todayIndex = now.getDay();
  const yesterdayIndex = (todayIndex + 6) % 7;

  const cardIndex = weekDays.indexOf(dayName);

  let startDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  );

  if (cardIndex === yesterdayIndex) {
    if (box.textContent.length === 0) {
      box.textContent = "";
    }
    startDate.setDate(startDate.getDate() - 1);
  } else if (cardIndex !== todayIndex) {
    box.contentEditable = "false";
    box.setAttribute("data-placeholder", "Comment Disabled");
    return;
  }

  const expiryTime = new Date(
    startDate.getTime() + 36 * 60 * 60 * 1000
  );

  const remainingMs = expiryTime.getTime() - now.getTime();

  if (remainingMs <= 0) {
    box.contentEditable = "false";
    box.setAttribute("data-placeholder", "Comments Disabled");
    return;
  }

  box.contentEditable = "true";

  const totalSeconds = Math.floor(remainingMs / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (box.textContent.length === 0) {
    box.textContent = "";
  }
  box.setAttribute(
    "data-placeholder",
    `Comment Disables in T-${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  );
}

setInterval(() => {
  Object.entries(weekElementMapping).forEach(([dayName, box]) => {
    updateCommentState(dayName, box);
  });
}, 1000);