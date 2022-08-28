const list = document.querySelector(".container-items");
const listItems = document.querySelectorAll(".container-list-item");

const addNewItemBtn = document.querySelector(".btn-add-new-item");
let deleteItemBtns;
let lockedItemBtns;

let inputText = document.querySelector("#input-item-text");

const sortType = "asc";
let recentlyRemovedItems = [];

let allItems = [
  {
    item_name: "Pickles",
    item_id: returnItemID(),
    item_avg_price: "3.99",
    item_is_recurrent: true,
  },
  {
    item_name: "Bread",
    item_id: returnItemID(),
    item_avg_price: "5.99",
    item_is_recurrent: true,
  },
  {
    item_name: "Vodka",
    item_id: returnItemID(),
    item_avg_price: "17.49",
    item_is_recurrent: false,
  },
  {
    item_name: "Cake",
    item_id: returnItemID(),
    item_avg_price: "12.49",
    item_is_recurrent: false,
  },
];

// EVENT LISTENERS
addNewItemBtn.addEventListener("click", (e) => addNewItem(e));

window.addEventListener("keypress", (e) => {
  if (inputText.value === "") return;
  if (e.code === "Enter") addNewItem();
});

function filterAndSortListItems(messyArr) {
  let recurrentItems = messyArr
    .filter(({ item_is_recurrent }) => item_is_recurrent)
    .sort((a, b) => a.item_avg_price - b.item_avg_price);

  let novelItems = messyArr
    .filter(({ item_is_recurrent }) => !item_is_recurrent)
    .sort((a, b) => a.item_avg_price - b.item_avg_price);

  return [...recurrentItems, ...novelItems];
}

function addNewItem(e) {
  //   e.preventDefault();

  //   let inputValue = e.target.previousElementSibling.value;
  let itemValue = inputText.value;
  let itemObject;

  if (inputText.value !== "") {
    itemObject = {
      item_name: itemValue,
      item_id: returnItemID(),
      item_avg_price: fetchAvgPrice(),
      item_is_recurrent: false,
    };
    inputText.value = "";
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

  allItems = allItems.filter(({ item_id }) => item_id !== deletedItemId);
  displayItemList();
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
  console.log(allItems);
  displayItemList();
}

function updateItemsList(newItemObj) {
  allItems.push(newItemObj);
  console.log("new items list", allItems);

  displayItemList();
}

function fetchAvgPrice() {
  // PLACEHOLDER IMPLEMENTATION
  let dollars = String(Math.round(Math.random() * 20));
  let cents = String(Math.round(Math.random() * 99));
  let centsAdjusted = cents >= 10 ? cents : `0${cents}`;

  return `${dollars}.${centsAdjusted}`;
}

function displayItemList() {
  let html = "";

  let arrangedItems = filterAndSortListItems(allItems);

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
              <button class="btn btn-delete-item" >X</button>
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

displayItemList();
