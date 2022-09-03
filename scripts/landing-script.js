let holdingPen = document.querySelector(".holding-pen");

let emojiContainers;

let emojiIcons = [
  "🍕",
  "🍊",
  "🍌",
  "🍑",
  "🍍",
  "🍞",
  "🍒",
  "🍓",
  "🥝",
  "🥚",
  "🍉",
  "🍅",
  "🍤",
  "🥕",
  "🍰",
  "🍩",
  "🫒",
  "🥐",
  "🍜",
  "🍚",
];
let emojiPositions = [];

let pageHeight = window.innerHeight;
let pageWidth = window.innerWidth;

let emojiCount = 75;

function initContainers() {
  emojiContainers = [];

  for (let i = 0; i < emojiCount; i++) {
    let div = document.createElement("div");
    div.classList.add("bg-emoji-container");
    holdingPen.appendChild(div);
    // emojiContainers.push(div);
  }

  emojiContainers = document.querySelectorAll(".bg-emoji-container");
}

function initEmojis() {
  emojiContainers.forEach((container) => {
    // let delayAmt = emoji.getAttribute("data-animation-delay");
    // emoji.style.animationDelay = `${delayAmt}`;
    let emoji = emojiIcons[Math.floor(Math.random() * emojiIcons.length)];
    // console.log(emoji);
    setEmojiPosition(container, emoji);
    container.style.animationDelay = setAnimationDelay(2);
    // console.log(emoji.style.top, emoji.style.left);
  });
}

function setAnimationDelay(totalSeconds) {
  return `${Math.random() * totalSeconds}s`;
}

function setEmojiPosition(container, emoji) {
  container.innerText = emoji;

  console.log(pageWidth, pageHeight);

  let proposedXPos;
  let proposedYPos;

  if (pageWidth <= 600) {
    proposedXPos = Math.round(Math.random() * pageWidth * 0.75);
  } else {
    proposedXPos = Math.round(Math.random() * pageWidth);
  }

  if (pageHeight <= 600) {
    proposedYPos = Math.round(Math.random() * pageHeight * 0.75);
  } else {
    proposedYPos = Math.round(Math.random() * pageHeight);
  }

  let distanceModifier = 48;

  if (emojiPositions.length > 0) {
    emojiPositions.forEach((emoji) => {
      let x = emoji.position[0];
      let y = emoji.position[1];

      //   if (Math.abs(proposedXPos - x) <= 36) {
      //     let difference = Math.abs(proposedXPos - x);
      //     proposedXPos = x + difference;
      //   }

      //   if (Math.abs(proposedYPos - y) <= 36) {
      //     let difference = Math.abs(proposedYPos - y);
      //     proposedYPos = y + difference;
      //   }
    });
  }

  //   if (proposedXPos > pageWidth) {
  //     let difference = Math.abs(proposedXPos - pageWidth);
  //     proposedXPos = pageWidth - difference;
  //     console.log("difference", difference, "new x", proposedXPos);
  //   }

  //   if (proposedYPos > pageHeight) {
  //     let difference = Math.abs(proposedYPos - pageHeight);
  //     proposedYPos = pageWidth - difference;
  //     console.log("difference", difference, "new x", proposedXPos);
  //   }

  //   if (proposedYPos >= innerHeight + 48) {
  //     proposedYPos = proposedYPos / 2 - 96;
  //   }

  emojiPositions.push({
    emoji: emoji,
    position: [
      proposedXPos + distanceModifier,
      proposedYPos + distanceModifier,
    ],
  });

  console.log(proposedXPos, proposedYPos);

  container.style.top = `${proposedYPos}px`;
  container.style.left = `${proposedXPos}px`;
}

function calcTotalEmojis() {
  // assume a size of 72px
  // need space of at 36px on each side
  // number of rows = pageWidth
  // 500
  //   let startingXCoord = 36;
  //   let startingYCoord = 36;
  //   let emojiCoords = [];
}

window.addEventListener("resize", () => {
  pageHeight = window.innerHeight;
  pageWidth = window.innerWidth;

  //   while (startingXCoord < pageWidth) {
  //     while (startingYCoord < pageHeight) {
  //     }
  //   }

  initEmojis();

  //   console.log(pageHeight, pageWidth);
});

window.addEventListener("DOMContentLoaded", () => {
  //   console.log("pageheight/pagewidth", pageHeight, pageWidth);

  calcTotalEmojis();
  initContainers();
  initEmojis();
});
