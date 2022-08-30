const list = document.querySelector(".container-items");
const listItems = document.querySelectorAll(".container-list-item");

const pageContainer = document.querySelector(".container-page");
const helpModal = document.querySelector("#modal-help");

const addNewItemBtn = document.querySelector(".btn-add-new-item");
const searchItemsBtn = document.querySelector("#btn-search-item-list");
const sortItemsBtn = document.querySelector(".btn-sort-item-list");
const helpBtn = document.querySelector(".btn-help");
const closeHelpBtn = document.querySelector("#btn-close-modal");

let deleteItemBtns;
let lockedItemBtns;

let inputContainer = document.querySelector(".container-input-box");
let addModeInput = document.querySelector("#input-add-item");
let searchModeInput = document.querySelector("#input-search-item");

let sortByDescending = true;

let recentlyRemovedItems = [];

let allItems = [
  {
    item_name: "pickles",
    item_id: returnItemID(),
    item_avg_price: "3.99",
    item_is_recurrent: true,
  },
  {
    item_name: "bread",
    item_id: returnItemID(),
    item_avg_price: "5.99",
    item_is_recurrent: true,
  },
  {
    item_name: "vodka",
    item_id: returnItemID(),
    item_avg_price: "17.49",
    item_is_recurrent: false,
  },
  {
    item_name: "cake",
    item_id: returnItemID(),
    item_avg_price: "12.49",
    item_is_recurrent: false,
  },
];

// EVENT LISTENERS
addNewItemBtn.addEventListener("click", (e) => addNewItem(e));
searchItemsBtn.addEventListener("click", () => handleSearchBtnClicked());
sortItemsBtn.addEventListener("click", () => handleSortBtnClicked());

helpBtn.addEventListener("click", () => handleModal());
closeHelpBtn.addEventListener("click", () => handleModal());

addModeInput.addEventListener("keypress", (e) => {
  if (e.value === "") return;
  if (e.code === "Enter") addNewItem();
});

searchModeInput.addEventListener("keyup", (e) => searchItemsList(e));

// window.addEventListener("keypress", (e) => {
//   if (addModeInput.value === "") return;
//   if (e.code === "Enter") addNewItem();
// });

function handleModal() {
  helpModal.classList.toggle("active");
  pageContainer.classList.toggle("modal-active");
}

function handleSortBtnClicked() {
  sortByDescending = !sortByDescending;
  console.log(sortByDescending);
  displayItemList(allItems);
}

function filterAndSortListItems(messyArr) {
  // let recurrentItems = messyArr
  //   .filter(({ item_is_recurrent }) => item_is_recurrent)
  //   .sort((a, b) => a.item_avg_price - b.item_avg_price);

  let recurrentItems = messyArr
    .filter(({ item_is_recurrent }) => item_is_recurrent)
    .sort(sortOperation(sortByDescending));

  // let novelItems = messyArr
  //   .filter(({ item_is_recurrent }) => !item_is_recurrent)
  //   .sort((a, b) => a.item_avg_price - b.item_avg_price);

  let novelItems = messyArr
    .filter(({ item_is_recurrent }) => !item_is_recurrent)
    .sort(sortOperation(sortByDescending));

  function sortOperation(direction, sortable) {
    switch (direction) {
      case false:
        return (a, b) => a.item_avg_price - b.item_avg_price;
      case true:
        return (a, b) => b.item_avg_price - a.item_avg_price;
      default:
        break;
    }
  }

  return [...recurrentItems, ...novelItems];
}

function handleSearchBtnClicked() {
  inputContainer.classList.toggle("add-mode");
  inputContainer.classList.toggle("search-mode");
}

function searchItemsList(e) {
  let input = searchModeInput.value;
  let inputLen = input.length;

  if (input === "") {
    displayItemList(allItems);
  }

  if (input !== "" && inputLen >= 1) {
    let matches = allItems.filter((item) => {
      if (item.item_name.slice(0, inputLen) === input) {
        // console.log(item.item_name.slice(0, inputLen));
        return item;
      }
    });

    displayItemList(matches);
  }
  //a,ab
}

function addNewItem(e) {
  //   e.preventDefault();

  //   let inputValue = e.target.previousElementSibling.value;
  let itemValue = addModeInput.value;
  let itemObject;

  if (addModeInput.value !== "") {
    itemObject = {
      item_name: itemValue,
      item_id: returnItemID(),
      item_avg_price: fetchAvgPrice(),
      item_is_recurrent: false,
    };
    addModeInput.value = "";
  } else {
    return;
  }

  updateItemsList(itemObject);
}

function returnItemID(idLen = 8) {
  let id = "";
  for (let i = 0; i < idLen; i++) {
    id += String(Math.round(Math.random() * 9));
  }

  return id;
}

function deleteItem(e) {
  let deletedItemId =
    e.target.parentElement.previousElementSibling.getAttribute("data-item-id");

  let updatedItemsList = allItems.filter(
    ({ item_id }) => item_id !== deletedItemId
  );

  displayItemList(updatedItemsList);
}

function toggleRecurrentItem(e) {
  let itemId =
    e.target.parentElement.previousElementSibling.getAttribute("data-item-id");

  //   let [item] = allItems.filter(({ item_id }) => item_id === itemId);
  //   item.item_is_recurrent = !item.item_is_recurrent;

  allItems.map((item) => {
    if (item.item_id === itemId)
      item.item_is_recurrent = !item.item_is_recurrent;
  });

  displayItemList(allItems);
}

function updateItemsList(newItemObj) {
  allItems.push(newItemObj);
  // console.log("new items list", allItems);

  displayItemList(allItems);
}

function fetchAvgPrice() {
  // PLACEHOLDER IMPLEMENTATION
  let dollars = String(Math.round(Math.random() * 20));
  let cents = String(Math.round(Math.random() * 99));
  let centsAdjusted = cents >= 10 ? cents : `0${cents}`;

  return `${dollars}.${centsAdjusted}`;
}

function displayItemList(itemList) {
  let html = "";

  let arrangedItems = filterAndSortListItems(itemList);

  for (let item of arrangedItems) {
    let { item_name, item_id, item_avg_price, item_is_recurrent } = item;
    html += `
        <div class="${
          item_is_recurrent
            ? "container-item-list recurrent"
            : "container-item-list"
        }">
            <div class="list-item" data-item-id="${item_id}">
              <p class="list-item-title">${item_name}</p>
              <p class="list-item-price">Average price of <span>$${item_avg_price}</span></p>
            </div>
            <div class="list-item-delete">
            <button class="btn btn-lock-item">${
              item_is_recurrent ? "🔒" : "🔓"
            }</button>
              <button class="btn btn-delete-item" >🗑️</button>
            </div>
          </div>
        `;
  }

  list.innerHTML = html;

  //   add the button listeners here
  deleteItemBtns = document.querySelectorAll(".btn-delete-item");
  lockedItemBtns = document.querySelectorAll(".btn-lock-item");

  addDeleteBtnListeners();
  addLockBtnListeners();
}

function addDeleteBtnListeners() {
  deleteItemBtns.forEach((deleteBtn) =>
    deleteBtn.addEventListener("click", (e) => deleteItem(e))
  );
}

function addLockBtnListeners() {
  lockedItemBtns.forEach((lockBtn) =>
    lockBtn.addEventListener("click", (e) => toggleRecurrentItem(e))
  );
}

displayItemList(allItems);
