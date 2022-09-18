// LOCAL STORAGE HANDLERS

export function readListFromLocalStorage() {
  // check for LocalStorage, ask for permission if needed
  let isStorageEnabled = localStorageAllowed("localStorage");

  if (isStorageEnabled) {
    if (!localStorage.getItem("littlelistLocalList")) {
      localStorage.setItem("littlelistLocalList", JSON.stringify([]));
    }
    return JSON.parse(localStorage.getItem("littlelistLocalList"));
  } else {
    return isStorageEnabled;
  }
}

export function writeToLocalStorage(listObject) {
  localStorage.setItem("littlelistLocalList", JSON.stringify(listObject));
}

function localStorageAllowed(storageType) {
  try {
    let storage = window[storageType];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return new Error(
      "Hi! It appears that your browser's storage support is enabled. In order to store your lists locally, you'll have to enable Local Storage support in your browser's settings."
    );
  }
}

export async function fetchAvgItemPrice(itemName) {
  try {
    let res = await fetch(`api/prices/${itemName}`);
    let prices = await res.json();
    let avgPrice = prices.reduce((a, b) => a + b) / prices.length;

    return avgPrice;
  } catch (e) {
    console.error(e);
    return 0;
  }
}
