"use strict";

document.querySelectorAll(".faq-item").forEach((item, index) => {
  const heading = item.querySelector("h3");
  const answer = item.querySelector("p");

  if (!heading || !answer || heading.querySelector("button")) {
    return;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "faq-toggle";
  button.append(document.createTextNode(heading.textContent.trim()));

  const symbol = document.createElement("span");
  symbol.className = "faq-symbol";
  symbol.setAttribute("aria-hidden", "true");
  symbol.textContent = "+";
  button.append(symbol);

  answer.id = `pricing-answer-${index + 1}`;
  answer.hidden = true;

  button.setAttribute("aria-controls", answer.id);
  button.setAttribute("aria-expanded", "false");

  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", String(!expanded));
    answer.hidden = expanded;
    symbol.textContent = expanded ? "+" : "−";
  });

  heading.replaceChildren(button);
});
