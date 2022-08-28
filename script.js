const list = document.querySelector(".container-items");
const listItems = document.querySelectorAll(".container-list-item");

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

const arrangedItems = filterAndSortListItems(unarrangedItems);

function filterAndSortListItems(messyArr) {
  let recurrentItems = messyArr
    .filter(({ item_is_recurrent }) => item_is_recurrent)
    .sort((a, b) => a.item_avg_price - b.item_avg_price);

  let novelItems = messyArr
    .filter(({ item_is_recurrent }) => !item_is_recurrent)
    .sort((a, b) => a.item_avg_price - b.item_avg_price);

  return [...recurrentItems, ...novelItems];
}

function displayItemList() {
  let html = "";

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

  console.log(html);
  list.innerHTML = html;
}

displayItemList();
