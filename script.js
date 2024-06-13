document.addEventListener('DOMContentLoaded', (event) => {
    loadItems();
});

function uploadItem() {
    const itemInput = document.getElementById('item-input');
    const itemValue = itemInput.value.trim();
    const errorMessage = document.getElementById('error-message');

    if (!itemValue) {
        errorMessage.textContent = 'Please enter an item.';
        return;
    }

    fetch('/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item: itemValue })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            addItemToList(itemValue);
            itemInput.value = '';
            errorMessage.textContent = '';
        } else {
            errorMessage.textContent = data.error;
        }
    });
}

function addItemToList(item) {
    const itemList = document.getElementById('item-list');
    const listItem = document.createElement('li');
    listItem.textContent = item;
    listItem.onclick = () => deleteItem(item);
    itemList.appendChild(listItem);
}

function deleteItem(item) {
    fetch('/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item: item })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            removeItemFromList(item);
        }
    });
}

function removeItemFromList(item) {
    const itemList = document.getElementById('item-list');
    const items = itemList.getElementsByTagName('li');
    for (let i = 0; i < items.length; i++) {
        if (items[i].textContent === item) {
            itemList.removeChild(items[i]);
            break;
        }
    }
}

function loadItems() {
    fetch('/items')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            data.items.forEach(item => addItemToList(item));
        }
    });
}