const list = document.querySelector(".container-items");
const listItems = document.querySelectorAll(".container-list-item");
const addNewItemBtn = document.querySelector("#btn-add-new-item");
let inputText = document.querySelector("#input-item-text");

const sortType = "asc";

const unarrangedItems = [
  {
    item_name: "Pickles",
    item_avg_price: "3.99",
    item_is_recurrent: true,
  },
  {
    item_name: "Bread",
    item_avg_price: "5.99",
    item_is_recurrent: true,
  },
  {
    item_name: "Vodka",
    item_avg_price: "17.49",
    item_is_recurrent: false,
  },
  {
    item_name: "Cake",
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
      item_avg_price: fetchAvgPrice(),
      item_is_recurrent: false,
    };
    inputText.value = "";
  } else {
    return;
  }

  updateItemsList(itemObject);
}

function updateItemsList(newItemObj) {
  unarrangedItems.push(newItemObj);
  console.log("new items list", unarrangedItems);

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

  let arrangedItems = filterAndSortListItems(unarrangedItems);

  for (let item of arrangedItems) {
    let { item_name, item_avg_price, item_is_recurrent } = item;
    html += `
        <div class="${
          item_is_recurrent
            ? "container-item-list recurrent"
            : "container-item-list"
        }">
            <div class="list-item">
              <p class="list-item-title">${item_name}</p>
              <p class="list-item-price">Average price of <span>$${item_avg_price}</span></p>
            </div>
            <div class="list-item-delete">
              <button class="btn item-delete-btn" id="item-delete-btn">X</button>
            </div>
          </div>
        `;
  }

  list.innerHTML = html;
}

displayItemList();
