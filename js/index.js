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

function toggleLoginModal(modalMsg, btnText) {
  loginModal.querySelector(".modal-header").textContent = modalMsg;
  loginModal.querySelector("#btn-login-modal-submit").textContent = btnText;

  loginModal.classList.toggle("active");
  pageContainer.classList.toggle("modal-active");
}

async function handleLogin() {
  toggleLoginModal("Welcome back 🥳", "Log in");

  // check the inputs and passwords
  if (validateUserInfo()) {
    let email = inputEmail;
    let password = inputPassword;

    const { user, session, error } = await supabase.auth.signIn({
      email,
      password,
    });

    if (user) {
      // toggleLoginModal(null, null);
      window.location.replace(`/list/${user.email}`);
    }

    if (error) {
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
      // TODO: Replace with proper UI bulletin
      alert(`Unable to login: ${error}`);
    }
  }
}

async function handleSignup() {
  toggleLoginModal("We're glad to have you 👏", "Sign up");

  // check the inputs and passwords
  if (validateUserInfo()) {
    let email = inputEmail;
    let password = inputPassword;

    const { user, session, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (user) {
      // toggleLoginModal(null, null);
      window.location.replace(`/list/${user.email}`);
    }

    if (error) {
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
      // TODO: Replace with proper UI bulletin
      alert(`Unable to login: ${error}`);
    }
  }

  // check the inputs and passwords
}

function validateUserInfo() {
  // currently, not using password check
  // this is just a demo app, of course
  // beyond that, that's a back-end check not front-end!

  return true;
}

function closeModalonBodyClick() {
  // shoutout to https://techstacker.com/close-modal-click-outside-vanilla-javascript/ for .matches and .closest
  document.addEventListener("click", (e) => {
    if (
      loginModal.classList.contains("active") &&
      pageContainer.classList.contains("modal-active")
    ) {
      if (e.target.matches(".container-landing-page")) {
        toggleLoginModal();
      }
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
