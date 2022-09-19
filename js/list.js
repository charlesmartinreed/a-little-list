import {
  readListFromLocalStorage,
  writeToLocalStorage,
  fetchAvgItemPrice,
} from "./utils.js";

let sortByDescending = true;
let activeListName = null;

const list = document.querySelector(".container-items");
const listItems = document.querySelectorAll(".container-list-item");
const listsListContainer = document.querySelector("#container-lists-list");
const listNameInputEl = document.querySelector("#list-page-title");

const pageContainer = document.querySelector(".container-page");
const helpModal = document.querySelector("#modal-help");
const infoModal = document.querySelector("#modal-info");
const dialog = document.querySelector("#notes-dialog");

const createNewListBtn = document.querySelector("#btn-lists-create-new-list");
const listsListToggleBtn = document.querySelector("#btn-lists-list-toggle");
const lockUnlockBtn = document.querySelector(".btn-lock-unlock-all");
const addNewItemBtn = document.querySelector(".btn-add-new-item");
const deleteAllItemsBtn = document.querySelector(".btn-delete-all");
const undoDeleteBtn = document.querySelector(".btn-undo-delete");
const searchItemsBtn = document.querySelector("#btn-search-item-list");
const sortItemsBtn = document.querySelector(".btn-sort-item-list");
const helpBtn = document.querySelector(".btn-help");
// const closeHelpBtn = document.querySelector("#btn-close-modal");

let deleteItemBtns;
let lockedItemBtns;
let showNotesBtns;
let submitNotesBtns;
let listsListContainerCloseBtns;
let listsListSwitchCurrentBtns;
let deleteListBtns;

let itemUIButtons = [];

let inputContainer = document.querySelector(".container-input-box");
let addModeInput = document.querySelector("#input-add-item");
let searchModeInput = document.querySelector("#input-search-item");

let allItems;
let deletedItems = [];

// grab the price data, if possible

// EVENT LISTENERS

createNewListBtn.addEventListener("click", (e) => createNewList());

listNameInputEl.addEventListener("keyup", (e) =>
  updateListTitle(e.target.value)
);

listsListToggleBtn.addEventListener("click", (e) => displayListsPane());
lockUnlockBtn.addEventListener("click", (e) => handleLockBtnClicked(e));
deleteAllItemsBtn.addEventListener("click", (e) => {
  handleModal(
    infoModal,
    "Are you sure you want to delete ALL of the unlocked items on your list?",
    handleDeleteAllBtnClicked
  );
});
undoDeleteBtn.addEventListener("click", () => handleUndoBtnClicked());

addNewItemBtn.addEventListener("click", (e) => addNewItem(e));
searchItemsBtn.addEventListener("click", () => handleSearchBtnClicked());
sortItemsBtn.addEventListener("click", () => handleSortBtnClicked());

helpBtn.addEventListener("click", () => handleModal(helpModal, null, null));
// closeHelpBtn.addEventListener("click", () => handleModal(helpModal));

addModeInput.addEventListener("keypress", (e) => {
  if (e.value === "") return;
  if (e.code === "Enter") addNewItem();
});

searchModeInput.addEventListener("keyup", (e) => searchItemsList(e));

function createNewList() {
  let defautListName = `${generateNewListName()}`;

  activeListName = defautListName;
  listNameInputEl.value = activeListName;

  allItems.push({
    list_name: activeListName,
    list_id: generateID(),
    list_items: [],
  });

  displayItemList(allItems);
}

function deleteList(target) {
  let id =
    target.parentElement.previousElementSibling.children[0].getAttribute(
      "data-list-id"
    );

  allItems = allItems.filter((list) => list.list_id !== id);

  if (allItems.length === 0) {
    createNewList();
  }

  if (allItems.length >= 1) {
    let updatedTitle = allItems[0].list_name;
    activeListName = updatedTitle;
    listNameInputEl.value = updatedTitle;
    displayItemList(allItems);
  }

  listsListContainer.classList.remove("active");
}

function switchCurrentlyDisplayedList(e) {
  let id = e.target.getAttribute("data-list-id");

  activeListName = allItems.find((list) => list.list_id === id).list_name;
  listNameInputEl.value = activeListName;

  displayItemList(allItems);
  listsListContainer.classList.remove("active");
}

function updateListTitle(updatedTitle) {
  let matchedList = allItems.find((list) => list.list_name === activeListName);

  matchedList.list_name = updatedTitle;
  activeListName = matchedList.list_name;
}

function generateListsPane() {
  let contentHTML = "";

  allItems.forEach((list) => {
    contentHTML += `
    <div class="container-lists-list-item" id="container-lists-list-item">
    <div>
      <button class="btn btn-lists-list-display" id="btn-lists-list-display" data-list-id=${list.list_id}>A list of ${list.list_name}</button>
    </div>
    <div>
      <button class="btn btn-lists-list-share" disabled>Share</button>
      <button class="btn btn-lists-list-delete">Delete</button>
    </div>
  </div>
  </div>
    `;
  });

  // <button class="btn btn-lists-list-close" id="btn-lists-list-close">Close</button>
  listsListContainer.innerHTML = contentHTML;

  let closeBtn = document.createElement("button");
  closeBtn.setAttribute("class", "btn btn-lists-list-close");
  closeBtn.setAttribute("id", "btn-lists-list-close");
  closeBtn.textContent = "Close";

  listsListContainer.appendChild(closeBtn);

  listsListContainerCloseBtns = document.querySelectorAll(
    ".btn-lists-list-close"
  );
  deleteListBtns = document.querySelectorAll(".btn-lists-list-delete");
  listsListSwitchCurrentBtns = document.querySelectorAll(
    ".btn-lists-list-display"
  );

  addListenersToUIButtons(
    listsListSwitchCurrentBtns,
    switchCurrentlyDisplayedList
  );
  addListenersToUIButtons(deleteListBtns, (e) => {
    handleModal(
      infoModal,
      "Are you sure you want to delete this list?",
      deleteList,
      e.target
    );
  });
  addListenersToUIButtons(listsListContainerCloseBtns, displayListsPane);
}

function displayListsPane() {
  listsListContainer.classList.toggle("active");
  generateListsPane();
}

window.addEventListener("DOMContentLoaded", () => {
  init();
  // readListFromLocalStorage();
  // createNewList();
  // displayItemList(allItems);
});

function init() {
  let localStorageEnabledResult = readListFromLocalStorage();

  if (typeof localStorageEnabledResult === Error) {
    handleModal(infoModal, localStorageEnabledResult.message, null, null);
    allItems = [];
  } else {
    allItems = localStorageEnabledResult;
  }

  if (allItems.length === 0) {
    createNewList();
  }

  if (allItems.length >= 1) {
    activeListName = allItems[0].list_name;
    listNameInputEl.value = activeListName;
    displayItemList(allItems);
  }
}

function handleDeleteAllBtnClicked() {
  let matchedList = allItems.find((list) => list.list_name === activeListName);

  let pendingDeletedItems = matchedList.list_items.filter(
    ({ item_is_recurrent }) => !item_is_recurrent
  );

  moveToDeletedItems(pendingDeletedItems);

  matchedList.list_items = matchedList.list_items.filter(
    ({ item_is_recurrent }) => item_is_recurrent
  );

  displayItemList(allItems);

  // confirmBtn.addEventListener("click", () => {});

  // cancelBtn.addEventListener("click", () => {
  //   handleDeleteAllBtnClicked();
  // });
}

function moveToDeletedItems(itemObj) {
  deletedItems.push(itemObj);

  // let objectKeyCount = Object.keys(itemObj).length;

  // if (objectKeyCount > 1) {
  //   deletedItems = [...deletedItems, itemObj];
  // }

  // if (objectKeyCount === 1) {
  //   deletedItems = [...deletedItems, ...itemObj];
  // }
}

function handleUndoBtnClicked() {
  let lastDeleted;
  let matchedList = allItems.find((list) => list.list_name === activeListName);

  while (deletedItems.length >= 1) {
    lastDeleted = deletedItems.pop();

    if (Array.isArray(lastDeleted)) {
      matchedList.list_items.push(...lastDeleted);
    } else {
      matchedList.list_items.push(lastDeleted);
    }
  }

  displayItemList(allItems);
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
  let currentListItems = allItems.find(
    (list) => list.list_name === activeListName
  ).list_items;

  currentListItems.forEach((item) => {
    toggleRecurrentItem(null, item.item_id);
  });

  displayItemList(allItems);
}

function handleUnlockAllItems() {
  let currentListItems = allItems.find(
    (list) => list.list_name === activeListName
  ).list_items;

  currentListItems.forEach((item) => {
    toggleRecurrentItem(null, item.item_id);
  });

  displayItemList(allItems);
}

function handleModal(modal, modalMsg, cb, target = null) {
  let modalTextEl = modal.querySelector(".modal-info-msg");

  if (modalMsg) {
    modalTextEl.textContent = modalMsg;
  }

  let confirmBtn = modal.querySelector(".btn-modal-confirm");
  let cancelBtn = modal.querySelector(".btn-modal-cancel");

  modal.classList.add("active");
  pageContainer.classList.add("modal-active");

  confirmBtn.addEventListener("click", (e) => {
    if (cb) {
      if (target) {
        cb(target);
      } else {
        cb();
      }
    }
    closeModal(modal);
  });

  if (cancelBtn) {
    cancelBtn.addEventListener("click", (e) => {
      closeModal(modal);
    });
  }
}

function closeModal(modal) {
  modal.classList.remove("active");
  pageContainer.classList.remove("modal-active");
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

  let currentList = allItems.find(
    (list) => list.list_name === activeListName
  ).list_items;

  if (input === "") {
    displayItemList(allItems);
  }

  if (input !== "" && inputLen >= 1) {
    let matches = currentList.filter((item) => {
      if (item.item_name.slice(0, inputLen) === input) {
        return item;
      }
    });

    displayItemList([{ list_name: activeListName, list_items: [...matches] }]);
  }
}

async function addNewItem(e) {
  let itemValue = addModeInput.value.toLowerCase();

  let itemObject;

  let avgPrice = await fetchAvgItemPrice(itemValue);

  if (addModeInput.value !== "") {
    itemObject = {
      item_name: itemValue,
      item_id: generateID(),
      item_avg_price: avgPrice,
      item_is_recurrent: false,
      item_notes: "Add a note about this item",
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

  let matchedList = allItems.find((list) => list.list_name === activeListName);

  let [deletedItem] = matchedList.list_items.filter(
    ({ item_id }) => item_id === deletedItemId
  );

  matchedList.list_items = matchedList.list_items.filter(
    ({ item_id }) => item_id !== deletedItemId
  );

  moveToDeletedItems(deletedItem);

  displayItemList(allItems);
}

function toggleRecurrentItem(e, id) {
  let itemId;

  if (e === null) {
    itemId = id;
  } else {
    itemId =
      e.target.parentElement.previousElementSibling.getAttribute(
        "data-item-id"
      );
  }

  let selectedItem = allItems
    .find((list) => list.list_name === activeListName)
    .list_items.find((item) => item.item_id === itemId);

  selectedItem.item_is_recurrent = !selectedItem.item_is_recurrent;

  displayItemList(allItems);
}

function updateItemsList(newItemObj) {
  allItems.map((list) => {
    if (list.list_name === activeListName) {
      list.list_items = [...list.list_items, newItemObj];
    }
  });

  // writeToLocalStorage(allItems);
  displayItemList(allItems);
}

function toggleItemNotes(e) {
  let itemID =
    e.target.parentElement.previousElementSibling.getAttribute("data-item-id");
  // let [{ item_notes }] = allItems.filter((list) => item.item_id === itemID);

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

function updateItemNotes(updateNote, itemID) {
  let [{ item_notes }] = allItems
    .find((list) => list.list_name === activeListName)
    .list_items.filter(({ item_id }) => item_id === itemID);

  item_notes = updateNote;
}

function displayItemList(itemList) {
  let currentListItems = itemList.find(
    (list) => list.list_name === activeListName
  ).list_items;

  checkUIButtonsState();

  let html = "";
  let listPriceTotal = 0;
  let currentTaxRate = 8.25;

  if (currentListItems.length === 0) {
    html += `<div class="empty-item-list">Your list is empty!?</div>`;
    list.innerHTML = html;
    return;
  }

  let arrangedItems = filterAndSortListItems(currentListItems);

  for (let item of arrangedItems) {
    let { item_name, item_id, item_avg_price, item_is_recurrent, item_notes } =
      item;
    listPriceTotal += item_avg_price;
    html += `
          <div class="${
            item_is_recurrent
              ? "container-item-list recurrent"
              : "container-item-list"
          }">
              <div class="list-item" data-item-id="${item_id}">
                <p class="list-item-title">${item_name}</p>
                <p class="list-item-price">Average price of <span>${formatPriceAsCurrency(
                  item_avg_price,
                  "en-US",
                  "USD"
                )}</span></p>
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

    list.innerHTML = html;

    function calculateTotalWithTax() {
      let calculatedPrice =
        listPriceTotal + (listPriceTotal * currentTaxRate) / 100;

      return formatPriceAsCurrency(calculatedPrice, "en-US", "USD");
    }

    function formatPriceAsCurrency(price, locale, currencyType) {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currencyType,
      }).format(price);
    }

    let priceTotalDiv = document.createElement("div");
    priceTotalDiv.setAttribute("class", "container-items-price-total");
    priceTotalDiv.innerHTML = `
    <p class="price-label">Estimated total price is <span>${calculateTotalWithTax()}</span>
    </p>
    <div class="price-total-tax-div"><p class="tax-label">Current tax rate is </p> <input id="tax-input" type="number" min=1.0 max="15.0" step="0.01" placeholder=${currentTaxRate} value=${currentTaxRate} /></div>
    
    `;

    list.appendChild(priceTotalDiv);

    document.querySelectorAll("#tax-input").forEach((taxInput) =>
      taxInput.addEventListener("change", (e) => {
        currentTaxRate = taxInput.value;
        priceTotalDiv.querySelector(
          ".price-label span"
        ).textContent = `$${calculateTotalWithTax()}`;
      })
    );

    deleteItemBtns = document.querySelectorAll(".btn-delete-item");
    lockedItemBtns = document.querySelectorAll(".btn-lock-item");
    showNotesBtns = document.querySelectorAll(".btn-show-notes");

    addListenersToUIButtons(deleteItemBtns, deleteItem);
    addListenersToUIButtons(lockedItemBtns, toggleRecurrentItem);
    addListenersToUIButtons(showNotesBtns, toggleItemNotes);
  }

  writeToLocalStorage(allItems);
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

function generateID() {
  let id = "";
  let idLen = 8;
  for (let i = 0; i < idLen; i++) {
    id += String(Math.round(Math.random() * 9));
  }

  return id;
}

function convertToHTMLAndParse(resBody) {
  // let parser = new DOMParser();
  // let doc = parser.parseFromString(resBody, "text/html");
  // let itemDivs = Array.from(doc.querySelectorAll("div")).filter(
  //   (div) => div.getAttribute("data-automation-id") === "product-price"
  // );
  // let prices = itemDivs
  //   .map((div) => div.innerHTML)
  //   .map((divHTML) => {
  //     let matched = divHTML.match(/[$][0-9]+(\.[0-9]{1,2})?/);
  //     if (matched !== null) {
  //       return Number(matched[0].replace(/[^0-9\.-]+/g, ""));
  //     }
  //   });
  // let avgPrice = (prices.reduce((a, b) => a + b) / prices.length).toFixed(2);
  // return avgPrice;
}

function generateNewListName() {
  let nouns = [
    "sail",
    "sock",
    "notebook",
    "neck",
    "axolotl",
    "quince",
    "rice",
    "knee",
    "hose",
    "scene",
    "quilt",
    "bumper",
    "arithmetic",
    "quilt",
    "stove",
    "copper",
    "laborer",
    "boulder",
    "confusion",
    "religion",
    "treatment",
    "hall",
    "bomb",
    "argument",
    "manager",
    "position",
    "zephyr",
    "oceleot",
    "flavor",
    "route",
    "front",
    "temper",
    "wealth",
    "machine",
    "templar",
    "self",
    "anger",
    "thought",
    "group",
    "behavior",
    "request",
    "thing",
    "look",
    "gasket",
    "temple",
    "crowd",
    "arboretum",
    "bead",
    "harbor",
    "range",
  ];
  let adjectives = [
    "pushy",
    "lovely",
    "heavy",
    "momentous",
    "hissing",
    "boiling",
    "unruly",
    "boundless",
    "bloody",
    "thundering",
    "clever",
    "uneven",
    "thinkable",
    "cynical",
    "wet",
    "coordinated",
    "first",
    "glorious",
    "awesome",
    "crooked",
    "available",
    "quack",
    "upset",
    "nervous",
    "testy",
    "tense",
    "typical",
    "selective",
    "concerned",
    "hysterical",
    "unwieldy",
    "naive",
    "unadvised",
    "better",
    "funny",
    "even",
    "abstracted",
    "inquisitive",
    "faithful",
    "moaning",
    "brainy",
    "efficient",
    "delicate",
    "conscious",
    "tangible",
    "dramatic",
    "enchanting",
    "uppity",
    "invincible",
    "sedate",
  ];

  let phrase = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${
    nouns[Math.floor(Math.random() * nouns.length)]
  }s`;

  return phrase;
}
