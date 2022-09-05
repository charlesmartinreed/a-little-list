let iconDiv = document.querySelector(".emoji-icon");
let textDiv = document.querySelector(".emoji-text");
let emojiDiv = document.querySelector(".emoji-carousel");

let ctaButtons = document.querySelectorAll(".cta-buttons button");
let loginBtn = document.querySelector(".btn-login");
let signupBtn = document.querySelector(".btn-signup");
let submitBtn = document.querySelector("#btn-login-modal-submit");
let inputEmail = document.querySelector("#login-email");
let inputPassword = document.querySelector("#login-password");

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
  let idx = Math.round(Math.random() * emojiIcons.length);
  let emoji = emojiIcons[idx];
  return emoji;
}

ctaButtons.forEach((btn) =>
  btn.addEventListener("click", (e) => handleAccountButtonClicked(e))
);

function handleAccountButtonClicked(e) {
  let clickedBtn = e.target;

  loginModalHeader.textContent = clickedBtn.getAttribute("data-heading-text");

  if (clickedBtn.classList.contains("btn-login")) {
    submitBtn.innerText = "Log in";
  } else {
    submitBtn.innerText = "Sign up";
  }

  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    handleLoginAndSignup(clickedBtn);
  });

  toggleLoginModal();
}

function handleLoginAndSignup(clickedBtn) {
  let email = inputEmail.value;
  let password = inputPassword.value;

  if (checkInputIsValid(email, password)) {
    if (clickedBtn.classList.contains("btn-login")) {
      login(email, password);
    } else {
      signup(email, password);
    }
  } else {
    return;
  }

  toggleLoginModal();
}

function toggleLoginModal() {
  // document.querySelector("body").addEventListener("click", (e) => {
  //   if (!e.target.classList.contains("modal-active")) {
  //     console.log(e.target);
  //     toggleLoginModal();
  //   }
  // });

  loginModal.classList.toggle("active");
  pageContainer.classList.toggle("modal-active");

  // document.querySelector("body").removeEventListener("click");
}

function login(user, pass) {
  console.log("logging in old user", "user:", user, "pass", pass);
}

function signup(user, pass) {
  console.log("signing up new user", "user:", user, "pass", pass);
}

function checkInputIsValid(emailStr, passwordStr) {
  return emailStr !== "" && passwordStr !== "";
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
