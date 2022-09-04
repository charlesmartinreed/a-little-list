let iconDiv = document.querySelector(".emoji-icon");
let textDiv = document.querySelector(".emoji-text");
let emojiDiv = document.querySelector(".emoji-carousel");
let pageContainer = document.querySelector(".container-landing-page");

let emojiIcons = [
  ["🍕", "Pizza"],
  ["🍊", "Oranges"],
  ["🍌", "Bananas"],
  ["🍑", "Peaches"],
  ["🍍", "Pineapples"],
  ["🍞", "Bread"],
  ["🍒", "Cherries"],
  ["🍓", "Strawberries"],
  ["🥝", "Kiwis"],
  ["🍗", "Chicken"],
  ["🥑", "Avocados"],
  ["🥚", "Eggs"],
  ["🍉", "Watermelon"],
  ["🍅", "Tomatoes"],
  ["🥛", "Milk"],
  ["🍤", "Shrimp"],
  ["🥕", "Carrots"],
  ["🥧", "Pie"],
  ["🍩", "Donuts"],
  ["🫒", "Olives"],
  ["🍎", "Apples"],
  ["🥐", "Croissants"],
  ["🥩", "Steak"],
];

function renderEmojiContainer() {
  let [icon, text] = returnRandomEmojiArr();
  let currentIcon = icon.innerText;
  if (icon === currentIcon) {
    [icon, text] = renderEmojiContainer();
  }

  emojiDiv.remove();

  emojiDiv.removeChild(iconDiv);
  emojiDiv.removeChild(textDiv);

  iconDiv.innerText = icon;
  textDiv.innerText = text;

  pageContainer.insertBefore(
    emojiDiv,
    document.querySelector("#cta-landing-page")
  );
  emojiDiv.appendChild(iconDiv);
  emojiDiv.appendChild(textDiv);

  // emojiDiv.childNodes.forEach((node) => node.remove());
  // emojiDiv.append(icon, text);
  // console.log(emojiDiv.childNodes);
  returnRandomEmojiArr();
}

function returnRandomEmojiArr() {
  let emoji = emojiIcons[Math.round(Math.random() * emojiIcons.length - 1)];
  return emoji;
}

window.addEventListener("DOMContentLoaded", () => {
  setInterval(
    (function startInterval() {
      renderEmojiContainer();
      return startInterval;
    })(),
    3500
  );
});
