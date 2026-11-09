"use strict";

document.querySelectorAll(".faq").forEach((item, index) => {
  const button = item.querySelector("button");
  const answer = item.querySelector(".answer");

  if (!button || !answer) {
    return;
  }

  const symbol = button.querySelector(".plus");

  button.type = "button";
  answer.id = `features-answer-${index + 1}`;
  button.setAttribute("aria-controls", answer.id);
  button.setAttribute("aria-expanded", "false");
  answer.hidden = true;

  if (symbol) {
    symbol.setAttribute("aria-hidden", "true");
    symbol.textContent = "+";
  }

  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", String(!expanded));
    answer.hidden = expanded;

    if (symbol) {
      symbol.textContent = expanded ? "+" : "−";
    }
  });
});
