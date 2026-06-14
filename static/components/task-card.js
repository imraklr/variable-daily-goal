const cssUrlTaskCard = new URL(
  "./styles/task-card/task-card.css",
  import.meta.url
);

class TaskCard extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <link rel="stylesheet" href="${cssUrlTaskCard.href}">

      <div class="task-card" id="${this.getAttribute("day")}" data-nth-day="${this.getAttribute("nth-day")}">
        <div class="task-card-timer-box-btns">
            <div class="task-card-timer-box">07:30AM to 08:40AM</div>
            <div class="btns-box">
                <div class="cascade-time-down">&darr;</div>
            </div>
        </div>
        <div class="task-card-text-box" contenteditable="true"></div>
      </div>
    `;
  }
}

customElements.define("task-card", TaskCard);


function checkIfBasicUserInputRequirementsMetOnTaskCard(taskCardDayIdentifier, taskCardNthDayIdentifier) {

}