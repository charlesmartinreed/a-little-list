const list = document.querySelector(".container-items");
const listItems = document.querySelectorAll(".container-list-item");

const pageContainer = document.querySelector(".container-page");
const helpModal = document.querySelector("#modal-help");

const lockUnlockBtn = document.querySelector(".btn-lock-unlock-all");
const addNewItemBtn = document.querySelector(".btn-add-new-item");
const deleteAllItemsBtn = document.querySelector(".btn-delete-all");
const undoDeleteBtn = document.querySelector(".btn-undo-delete");
const searchItemsBtn = document.querySelector("#btn-search-item-list");
const sortItemsBtn = document.querySelector(".btn-sort-item-list");
const helpBtn = document.querySelector(".btn-help");
const closeHelpBtn = document.querySelector("#btn-close-modal");

let deleteItemBtns;
let lockedItemBtns;
let showNotesBtns;

let itemUIButtons = [];

let inputContainer = document.querySelector(".container-input-box");
let addModeInput = document.querySelector("#input-add-item");
let searchModeInput = document.querySelector("#input-search-item");

let sortByDescending = true;

let allItems = [
  {
    item_name: "pickles",
    item_id: returnItemID(),
    item_avg_price: "3.99",
    item_is_recurrent: true,
    item_notes: "Test note entry",
  },
  {
    item_name: "bread",
    item_id: returnItemID(),
    item_avg_price: "5.99",
    item_is_recurrent: true,
    item_notes: "Test note entry",
  },
  {
    item_name: "vodka",
    item_id: returnItemID(),
    item_avg_price: "17.49",
    item_is_recurrent: false,
    item_notes: "Test note entry",
  },
  {
    item_name: "cake",
    item_id: returnItemID(),
    item_avg_price: "12.49",
    item_is_recurrent: false,
    item_notes: "Test note entry",
  },
];
let deletedItems = [];

// EVENT LISTENERS
lockUnlockBtn.addEventListener("click", (e) => handleLockBtnClicked(e));
deleteAllItemsBtn.addEventListener("click", () => handleDeleteAllBtnClicked());
undoDeleteBtn.addEventListener("click", () => handleUndoBtnClicked());

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

window.addEventListener("DOMContentLoaded", () => {
  displayItemList(allItems);
});

function handleDeleteAllBtnClicked() {
  let confirm = displayConfirmationModal();

  if (confirm) {
    // could also just, you know, check that the item isn't already in deleted to avoid duplicate entries, but... lazy
    // allItems.forEach((item) => {
    //   moveToDeleteItems(item);
    // });
    moveToDeleteItems(allItems);

    allItems = [];
    displayItemList(allItems);
  }

  if (!confirm) return;
}

function moveToDeleteItems(itemObj) {
  if (itemObj.length > 1) {
    deletedItems = [...deletedItems, itemObj];
  }

  if (itemObj.length === 1) {
    deletedItems = [...deletedItems, ...itemObj];
  }
}

function handleUndoBtnClicked() {
  if (deletedItems.length >= 1) {
    let lastDeleted = deletedItems.pop();

    if (Array.isArray(lastDeleted)) {
      allItems.push(...lastDeleted);
    } else {
      allItems.push(lastDeleted);
    }

    displayItemList(allItems);
  }

  if (deletedItems.length === 0) return;
}

function handleLockBtnClicked(e) {
  let buttonIcon = e.target;
  let button = e.target.parentElement;

  if (button.classList.contains("lock-all")) {
    buttonIcon.textContent = "🔒";
    handleLockAllItems();
  }

  if (!button.classList.contains("lock-all")) {
    buttonIcon.textContent = "🔓";
    handleUnlockAllItems();
  }

  button.classList.toggle("lock-all");
}

function handleLockAllItems() {
  allItems.forEach((item) => {
    item.item_is_recurrent = true;
  });
  displayItemList(allItems);
}

function handleUnlockAllItems() {
  allItems.forEach((item) => {
    item.item_is_recurrent = false;
  });
  displayItemList(allItems);
}

function handleModal() {
  helpModal.classList.toggle("active");
  pageContainer.classList.toggle("modal-active");
}

function handleSortBtnClicked() {
  sortByDescending = !sortByDescending;
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
  searchItemsBtn.classList.toggle("active");
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
        return item;
      }
    });

    displayItemList(matches);
  }
}

function addNewItem(e) {
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

  let deletedItem = allItems.filter(({ item_id }) => item_id === deletedItemId);

  moveToDeleteItems(deletedItem);

  allItems = allItems.filter(({ item_id }) => item_id !== deletedItemId);

  displayItemList(allItems);
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

  displayItemList(allItems);
}

function updateItemNotes(e) {
  // window.alert for now, need to dig into working with <dialog> element
  // eventually this will bring up a textarea in a modal that can be edited, if desired.

  let itemID =
    e.target.parentElement.previousElementSibling.getAttribute("data-item-id");
  let [{ item_notes }] = allItems.filter((item) => item.item_id === itemID);

  let updatedNotes = window.prompt(
    "Add some notes about your item",
    item_notes
  );

  allItems.find((item) => item.item_id === itemID).item_notes = updatedNotes;
}

function fetchAvgPrice() {
  // PLACEHOLDER IMPLEMENTATION
  let dollars = String(Math.round(Math.random() * 20));
  let cents = String(Math.round(Math.random() * 99));
  let centsAdjusted = cents >= 10 ? cents : `0${cents}`;

  return `${dollars}.${centsAdjusted}`;
}

function displayItemList(itemList) {
  checkUIButtonsState();

  let html = "";

  if (itemList.length === 0) {
    html += `<div class="empty-item-list">Your list is currently empty.</div>`;
    list.innerHTML = html;
  }

  if (itemList.length > 0) {
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
              <button class="btn btn-show-notes">📝</button>
              <button class="btn btn-lock-item">${
                item_is_recurrent ? "🔒" : "🔓"
              }</button>
                <button class="btn btn-delete-item" ${
                  item_is_recurrent ? "disabled" : ""
                } >🗑️</button>
              </div>
            </div>
          `;
    }

    list.innerHTML = html;

    deleteItemBtns = document.querySelectorAll(".btn-delete-item");
    lockedItemBtns = document.querySelectorAll(".btn-lock-item");
    showNotesBtns = document.querySelectorAll(".btn-show-notes");

    // addDeleteBtnListeners();
    // addLockBtnListeners();
    // addNoteBtnListeners();
    addListenersToUIButtons(deleteItemBtns, deleteItem);
    addListenersToUIButtons(lockedItemBtns, toggleRecurrentItem);
    addListenersToUIButtons(showNotesBtns, updateItemNotes);
  }
}

function addListenersToUIButtons(buttons, cb) {
  buttons.forEach((btn) => btn.addEventListener("click", (e) => cb(e)));
}

function addNoteBtnListeners() {
  showNotesBtns.forEach((noteBtn) =>
    noteBtn.addEventListener("click", (e) => updateItemNotes(e))
  );
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

function checkUIButtonsState() {
  undoDeleteBtn.disabled = deletedItems.length > 0 ? "" : "disabled";
  deleteAllItemsBtn.disabled = allItems.length === 0 ? "disabled" : "";
}

function displayConfirmationModal() {
  return confirm(`Are you sure you want to remove all items from your list?`);
}
