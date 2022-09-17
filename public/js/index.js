let iconDiv = document.querySelector(".emoji-icon");
let textDiv = document.querySelector(".emoji-text");
let emojiDiv = document.querySelector(".emoji-carousel");

let ctaButtons = document.querySelectorAll(".cta-buttons button");
let loginBtn = document.querySelector(".btn-login");
let signupBtn = document.querySelector(".btn-signup");
let submitBtn = document.querySelector("#btn-login-modal-submit");

let inputEmail = document.querySelector("#login-email").value;
let inputPassword = document.querySelector("#login-password").value;

let pageContainer = document.querySelector(".container-landing-page");
let loginModal = document.querySelector(".login-modal");
let loginModalHeader = document.querySelector(".modal-header");

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

  returnRandomEmojiArr();
}

function returnRandomEmojiArr() {
  let idx = Math.floor(Math.random() * emojiIcons.length);
  let emoji = emojiIcons[idx];
  return emoji;
}

// ctaButtons.forEach((btn) =>
//   btn.addEventListener("click", (e) => handleAccountButtonClicked(e))
// );

function handleAccountButtonClicked(btn) {
  loginModalHeader.textContent = btn.getAttribute("data-heading-text");
  submitBtn.innerText = btn.getAttribute("data-btn-text");

  toggleLoginModal();
}

function handleLoginAndSignup() {
  if (checkInputIsValid()) {
    if (clickedBtn.classList.contains("btn-login")) {
      login(inputEmail, inputPassword);
    } else {
      signup(inputEmail, inputPassword);
    }
  } else {
    submitBtn.animate(
      [
        { transform: "translateX(-2px) rotate(-5deg)" },
        { transform: "translateX(0px) rotate(0deg)" },
        { transform: "translateX(2px) rotate(5deg)" },
      ],
      {
        duration: 100,
        iterations: 3,
      }
    );
    return;
  }
}

function toggleLoginModal() {
  loginModal.classList.toggle("active");
  pageContainer.classList.toggle("modal-active");

  // document.querySelector("body").removeEventListener("click");
}

function login(user, pass) {
  toggleLoginModal();
}

function signup(user, pass) {
  toggleLoginModal();
}

function checkInputIsValid() {
  return inputEmail !== "" || inputPassword !== "";
}

function closeModalonBodyClick() {
  // shoutout to https://techstacker.com/close-modal-click-outside-vanilla-javascript/ for .matches and .closest
  document.addEventListener("click", (e) => {
    if (e.target.matches("#btn-login-modal-submit")) {
      handleLoginAndSignup(e.target);
      return;
    }

    if (e.target.matches(".container-landing-page")) {
      if (loginModal.classList.contains("active")) {
        toggleLoginModal();
      }
    }

    if (e.target.matches(".btn-login") || e.target.matches(".btn-signup")) {
      handleAccountButtonClicked(e.target);
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  closeModalonBodyClick();

  setInterval(
    (function startInterval() {
      renderEmojiContainer();
      return startInterval;
    })(),
    3500
  );
});
