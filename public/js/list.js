// import { fetchWebSiteResults } from "../utils/utils.js";

const list = document.querySelector(".container-items");
const listItems = document.querySelectorAll(".container-list-item");
const listsListContainer = document.querySelector(".container-lists-list");

const pageContainer = document.querySelector(".container-page");
const helpModal = document.querySelector("#modal-help");
const infoModal = document.querySelector("#modal-info");
const dialog = document.querySelector("#notes-dialog");

const listsListToggleBtn = document.querySelector("#btn-lists-list-toggle");
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
let submitNotesBtns;

let itemUIButtons = [];

let inputContainer = document.querySelector(".container-input-box");
let addModeInput = document.querySelector("#input-add-item");
let searchModeInput = document.querySelector("#input-search-item");

let sortByDescending = true;

let allItems = [];
let deletedItems = [];

// grab the price data, if possible

// EVENT LISTENERS
listsListToggleBtn.addEventListener("click", (e) => displayListsPane());
lockUnlockBtn.addEventListener("click", (e) => handleLockBtnClicked(e));
deleteAllItemsBtn.addEventListener("click", () => handleDeleteAllBtnClicked());
undoDeleteBtn.addEventListener("click", () => handleUndoBtnClicked());

addNewItemBtn.addEventListener("click", (e) => addNewItem(e));
searchItemsBtn.addEventListener("click", () => handleSearchBtnClicked());
sortItemsBtn.addEventListener("click", () => handleSortBtnClicked());

helpBtn.addEventListener("click", () => handleModal(helpModal));
closeHelpBtn.addEventListener("click", () => handleModal(helpModal));

addModeInput.addEventListener("keypress", (e) => {
  if (e.value === "") return;
  if (e.code === "Enter") addNewItem();
});

searchModeInput.addEventListener("keyup", (e) => searchItemsList(e));

window.addEventListener("DOMContentLoaded", () => {
  displayItemList(allItems);
});

function displayListsPane() {
  listsListContainer.classList.toggle("active");
}

function handleDeleteAllBtnClicked() {
  handleModal(infoModal);

  let confirmBtn = infoModal.querySelector(".btn-modal-confirm");
  let cancelBtn = infoModal.querySelector(".btn-modal-cancel");

  confirmBtn.addEventListener("click", () => {
    let deletedItems = allItems.filter(
      ({ item_is_recurrent }) => !item_is_recurrent
    );

    moveToDeleteItems(deletedItems);

    allItems = allItems.filter(({ item_is_recurrent }) => item_is_recurrent);

    handleDeleteAllBtnClicked();
    displayItemList(allItems);
  });

  cancelBtn.addEventListener("click", () => {
    handleDeleteAllBtnClicked();
  });
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

function handleModal(modal) {
  modal.classList.toggle("active");
  pageContainer.classList.toggle("modal-active");
}

function handleSortBtnClicked() {
  sortByDescending = !sortByDescending;
  displayItemList(allItems);
}

function filterAndSortListItems(messyArr) {
  let recurrentItems = messyArr.filter(
    ({ item_is_recurrent }) => item_is_recurrent
  );
  let novelItems = messyArr.filter(
    ({ item_is_recurrent }) => !item_is_recurrent
  );

  if (recurrentItems.length >= 1) {
    recurrentItems = recurrentItems.sort(sortOperation(sortByDescending));
  }

  if (novelItems.length >= 1) {
    novelItems = novelItems.sort(sortOperation(sortByDescending));
  }

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

async function addNewItem(e) {
  let itemValue = addModeInput.value;
  let itemObject;

  let avgPrice = await fetchAvgPrice(itemValue);

  if (addModeInput.value !== "") {
    itemObject = {
      item_name: itemValue,
      item_id: generateItemID(),
      item_avg_price: avgPrice,
      item_is_recurrent: false,
      item_notes: "",
    };
    addModeInput.value = "";
  } else {
    return;
  }

  updateItemsList(itemObject);
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

function toggleItemNotes(e) {
  let itemID =
    e.target.parentElement.previousElementSibling.getAttribute("data-item-id");
  let [{ item_notes }] = allItems.filter((item) => item.item_id === itemID);

  let [textbox] = Array.from(
    document.querySelectorAll(".container-item-list-notes")
  ).filter((textbox) => textbox.getAttribute("data-item-id") === itemID);

  textbox.classList.toggle("active");

  let textarea = textbox.children[0];
  let submitBtn = textbox.children[1];

  submitBtn.addEventListener("click", () => {
    updateItemNotes(textarea.value, itemID);
    textbox.classList.remove("active");
  });
}

function updateItemNotes(updateNote, itemObjID) {
  allItems.find((item) => item.item_id === itemObjID).item_notes = updateNote;
}

function displayItemList(itemList) {
  checkUIButtonsState();

  let html = "";

  if (itemList.length === 0) {
    html += `<div class="empty-item-list">Your list is empty!?</div>`;
    list.innerHTML = html;
  }

  if (itemList.length > 0) {
    let arrangedItems = filterAndSortListItems(itemList);

    for (let item of arrangedItems) {
      let {
        item_name,
        item_id,
        item_avg_price,
        item_is_recurrent,
        item_notes,
      } = item;
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
            <div class="container-item-list-notes" data-item-id="${item_id}">
            <textarea class="textbox list-note-textbox" id="list-note-textbox">${item_notes}</textarea>
            <button class="btn btn-list-notes-submit" id="btn-list-notes-submit">✅</button>
            </div>
          `;
    }

    list.innerHTML = html;

    deleteItemBtns = document.querySelectorAll(".btn-delete-item");
    lockedItemBtns = document.querySelectorAll(".btn-lock-item");
    showNotesBtns = document.querySelectorAll(".btn-show-notes");

    addListenersToUIButtons(deleteItemBtns, deleteItem);
    addListenersToUIButtons(lockedItemBtns, toggleRecurrentItem);
    addListenersToUIButtons(showNotesBtns, toggleItemNotes);
  }
}

function addListenersToUIButtons(buttons, cb) {
  buttons.forEach((btn) => btn.addEventListener("click", (e) => cb(e)));
}

function checkUIButtonsState() {
  undoDeleteBtn.disabled = deletedItems.length > 0 ? "" : "disabled";
  deleteAllItemsBtn.disabled = allItems.length === 0 ? "disabled" : "";

  sortItemsBtn
    .querySelector("span.up-arrow")
    .classList.toggle("active", !sortByDescending);

  sortItemsBtn
    .querySelector("span.down-arrow")
    .classList.toggle("active", sortByDescending);
}

function generateItemID() {
  let id = "";
  let idLen = 8;
  for (let i = 0; i < idLen; i++) {
    id += String(Math.round(Math.random() * 9));
  }

  return id;
}

async function fetchAvgPrice(itemName) {
  return 0;
  let url = `https://cors-anywhere.herokuapp.com/https://www.walmart.com/search?q=${itemName}`;

  let fetchedPrice;

  try {
    let res = await fetch(url, {
      headers: {
        Origin: "https://www.walmart.com",
      },
    });

    console.log("fetching for", url);
    let rawBody = await res.text();
    console.log("fetched body is", rawBody.length, "characters long");
    fetchedPrice = convertToHTMLAndParse(rawBody);
  } catch (e) {
    console.error(e);
    fetchedPrice = 0;
    console.log("could not fetch", fetchedPrice);
  }

  return fetchedPrice;
}

function convertToHTMLAndParse(resBody) {
  let parser = new DOMParser();
  let doc = parser.parseFromString(resBody, "text/html");

  let itemDivs = Array.from(doc.querySelectorAll("div")).filter(
    (div) => div.getAttribute("data-automation-id") === "product-price"
  );

  // let prices = Array.from(itemDivs.childNodes).filter((node) =>
  //   node.innerText.match(/[$][0-9]+(\.[0-9]{1,2})?$/gm)
  // );

  let prices = itemDivs
    .map((div) => div.innerHTML)
    .map((divHTML) => {
      let matched = divHTML.match(/[$][0-9]+(\.[0-9]{1,2})?/);

      if (matched !== null) {
        return Number(matched[0].replace(/[^0-9\.-]+/g, ""));
      }
    });

  console.log(itemDivs);
  console.log(prices);
  // let prices = itemDivs.map((div) =>
  //   div.innerText.match(/[$][0-9]+(\.[0-9]{1,2})?$/gm)
  // );

  // console.log(prices);

  // let priceValues = prices.map((priceStr) =>
  //   priceStr.replace(/[^0-9|^.]/gi, "")
  // );

  let avgPrice = (prices.reduce((a, b) => a + b) / prices.length).toFixed(2);

  // console.log(avgPrice);
  return avgPrice;
}
