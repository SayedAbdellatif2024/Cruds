// Get references to HTML elements by their IDs
let title = document.getElementById('title');
let price = document.getElementById('price');
let tax = document.getElementById('tax');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let submit = document.getElementById('submit');

// Variables for managing form mode and temporary data
let mood = 'create'; // Current mode (create or update)
let temp; // Temporary variable to hold the index of an item being updated

// Function to calculate and display the total price
function getTotal() {
    if (price.value != '') { // Ensure price is not empty
        let result = (+price.value + +tax.value + +ads.value) - +discount.value;
        total.innerHTML = result; // Display total
        total.style.background = '#040'; // Set background to green
    } else {
        total.innerHTML = ''; // Clear total
        total.style.background = 'red'; // Set background to red
    }
}

// Initialize data array from localStorage or create an empty array
let datapro;
if (localStorage.product != null) {
    datapro = JSON.parse(localStorage.product);
} else {
    datapro = [];
}

// Handle the submit button click event
submit.onclick = function () {
    // Create a new product object from form inputs
    let newpro = {
        title: title.value.toLowerCase(),
        price: price.value,
        tax: tax.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value.toLowerCase(),
    };

    // Validate required fields
    if (title.value != '' && price.value != '' && category.value != '' && newpro.count < 100) {
        if (mood === 'create') { // Handle create mode
            if (newpro.count > 1) {
                for (let i = 0; i < newpro.count; i++) {
                    datapro.push(newpro); // Add multiple items
                }
            } else {
                datapro.push(newpro); // Add a single item
            }
            DataClear(); // Clear the form
        } else { // Handle update mode
            datapro[temp] = newpro; // Update the item
            submit.innerHTML = 'create';
            count.style.display = 'block';
            mood = 'create'; // Reset to create mode
        }

        // Save data to localStorage and update the table
        localStorage.setItem('product', JSON.stringify(datapro));
        showData();
    }
};

// Clear the form inputs
function DataClear() {
    title.value = '';
    price.value = '';
    tax.value = '';
    ads.value = '';
    discount.value = '';
    total.innerHTML = '';
    count.value = '';
    category.value = '';
}

// Display the data in a table format starting with 1
function showData() {
    getTotal(); // Ensure total is updated
    let table = '';
    for (let i = 0; i < datapro.length; i++) {
        table += `<tr>
                    <td>${i + 1}</td>
                    <td>${datapro[i].title}</td>
                    <td>${datapro[i].price}</td>
                    <td>${datapro[i].tax}</td>
                    <td>${datapro[i].ads}</td>
                    <td>${datapro[i].discount}</td>
                    <td>${datapro[i].total}</td>
                    <td>${datapro[i].category}</td>
                    <td><button onclick="updateData(${i})" id="update">Update</button></td>
                    <td><button onclick="deleteData(${i})" id="delete">Delete</button></td>
                </tr>`;
    }
    let btnDeleteAll = document.getElementById('deleteAll');
    if (datapro.length > 0) {
        btnDeleteAll.innerHTML = `<button onclick="deleteAll()">Delete All (${datapro.length})</button>`;
    } else {
        btnDeleteAll.innerHTML = '';
    }
    document.getElementById('tbody').innerHTML = table; // Update the table body
}

// Delete a specific product by index
function deleteData(i) {
    datapro.splice(i, 1); // Remove the item from the array
    localStorage.product = JSON.stringify(datapro); // Update localStorage
    showData(); // Refresh the table
}

// Delete all products
function deleteAll() {
    datapro.splice(0); // Clear the array
    localStorage.clear(); // Clear localStorage
    showData(); // Refresh the table
}

// Update a product's details
function updateData(i) {
    title.value = datapro[i].title;
    price.value = datapro[i].price;
    tax.value = datapro[i].tax;
    ads.value = datapro[i].ads;
    discount.value = datapro[i].discount;
    getTotal(); // Update the total
    count.style.display = 'none'; // Hide count input
    category.value = datapro[i].category;
    submit.innerHTML = 'update'; // Change button text to 'update'
    mood = 'update'; // Set mode to update
    temp = i; // Store index of item being updated
    scroll({ top: 0, behavior: 'smooth' }); // Scroll to top
}

// Change search mode between Title and Category
function getSearchMood(id) {
    let search = document.getElementById('search');
    if (id === 'searchByTitle') {
        searchMood = 'Title';
    } else {
        searchMood = 'Category';
    }
    search.placeholder = 'Search By ' + searchMood; // Update placeholder
    search.focus(); // Focus the search input
    search.value = ''; // Clear search input
    showData(); // Refresh the table
}

// Search data based on Title or Category
function searchData(value) {
    let table = '';
    for (let i = 0; i < datapro.length; i++) {
        if (searchMood == 'Title') {
            if (datapro[i].title.includes(value.toLowerCase())) {
                table += generateTableRow(i);
            }
        } else {
            if (datapro[i].category.includes(value.toLowerCase())) {
                table += generateTableRow(i);
            }
        }
    }
    document.getElementById('tbody').innerHTML = table; // Update the table body
}

// Generate a single table row
function generateTableRow(i) {
    return `<tr>
                <td>${i}</td>
                <td>${datapro[i].title}</td>
                <td>${datapro[i].price}</td>
                <td>${datapro[i].tax}</td>
                <td>${datapro[i].ads}</td>
                <td>${datapro[i].discount}</td>
                <td>${datapro[i].total}</td>
                <td>${datapro[i].category}</td>
                <td><button onclick="updateData(${i})" id="update">Update</button></td>
                <td><button onclick="deleteData(${i})" id="delete">Delete</button></td>
            </tr>`;
}

// Display the current time and update every second
const myClock = () => {
    const now = new Date();
    let sec = now.getSeconds();
    let min = now.getMinutes();
    let hour = now.getHours();

    if (hour < 10) hour = `0${hour}`;
    if (min < 10) min = `0${min}`;
    if (sec < 10) sec = `0${sec}`;

    clock.innerHTML = `
    <span>${hour}</span> :
    <span>${min}</span> :
    <span>${sec}</span>`;
};

setInterval(myClock, 1000); // Update clock every second
