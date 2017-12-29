//window.onload = function(){
var addressBookMessages = {};
var messagesContainer = null;
var addressBookForm = null;

// In order to save ourselves from a hassle of dealing with DOM elements
// we define delete callbacks immediately by passing the element itself and the ID
// that should be removed. 
function removeAddressBookRecord(elem, id) {
    // Delete message from the local variable {addressBookMessages}
    delete addressBookMessages[id];
    // Update the local storage
    localStorage.setItem('address_book_messages', JSON.stringify(addressBookMessages));
    // Remove the HTML DOM element (we delete the parent node of the a.remove, which is div.message)
    elem.parentElement.remove();
}

// this function should edit the data
function editAddressBookRecord(elem, id) {
    // Copy the fields to the form

    document.getElementById('fullname').value = addressBookMessages[id]['fullname'];
    document.getElementById('phone').value = addressBookMessages[id]['phone'];
    document.getElementById('address').value = addressBookMessages[id]['address'];
    document.getElementById('email').value = addressBookMessages[id]['email'];
    document.getElementById('comment').value = addressBookMessages[id]['comment'];
    document.getElementById('record').value = id;
}

// Start listening to DOM events when DOM content is laoded
document.addEventListener('DOMContentLoaded', function() {

    // On page load get all existing address book messages saved in the local storage.
    // If no messages or problem with loading the message, we return an empty object.
    try {
        addressBookMessages = JSON.parse(localStorage.getItem('address_book_messages'));
    } catch(exception) {
        addressBookMessages = {};
    }

    // Just checking. If object is null or empty list, make an empty object of it.
    if (addressBookMessages == null || addressBookMessages == []) {
        addressBookMessages = {};
    }

    // Create a new HTML child element - a single HTML representation of a single message
    function createChildElement(id, record) {
        var elem = document.createElement('div');
        elem.className = "message entry";
        elem.id = "m" + id;
        elem.innerHTML = "" + 
        // "<a href='mailto:" + record.email + "'>Name/e-mail: " + record.fullname + "</a>" +
        "<span class='name'> " + record.fullname + "</span>" +
        "<span class='email'> " + record.email + "</span>" +
        "<span class='phone'> " + record.phone + "</span>" +
        "<span class='address'> " + record.address + "</span>" +
        "<a class='remove' href='#' data-id='" + id + "' onclick='removeAddressBookRecord(this, " + id + ")'>Delete</a>" + 
        "<a class='edit' href='#' data-id='" + id + "' onclick='editAddressBookRecord(this, " + id + ")'>Edit</a>" +
        "<p class='message'> " + record.comment + "</p>";
        return elem;
    }

    // This is the container which holds all the HTML messages
    messagesContainer = document.getElementById('messages');
    // This is the form HTML element
    addressBookForm = document.getElementById('address-book-form');
    
    // Loop through all the address book messages and add corespondent HTML elements.
    for (var index in addressBookMessages) {
        // Create the HTML element from data given
        var child = createChildElement(index, addressBookMessages[index]);
        
        // Add the created HTML element to the list of HTML elements
        messagesContainer.appendChild(child);
    }


    // Save the address book record
    function saveAddressBookRecord(event) {
        // The {event} we have here is the form "submit" event and by default it does a POST request
        // to the same page, which results a page reload. I don't want that. What I want is on submit
        // add the address book record to the local storage and add it to the bottom of the page.
        event.preventDefault();

        // console.log("Check if we go so far!");

        var addressBookRecordId = document.getElementById('record').value;
        var editAction = null;
        // Preparing the address book record to add to the local storage
        if (addressBookRecordId === "") {
            addressBookRecordId = Date.now();
            editAction = false;
        } else {
            editAction = true;
        }

        var addressBookRecordData = {
            fullname: document.getElementById('fullname').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            email: document.getElementById('email').value,
            comment: document.getElementById('comment').value
        }

        addressBookMessages[addressBookRecordId] = addressBookRecordData;

        if (editAction === true) {
            // Create new HTML element from data given
            var child = createChildElement(addressBookRecordId, addressBookRecordData);
            // console.log(child);

            var oldChild = document.getElementById('m' + addressBookRecordId);
            oldChild.replaceWith(child);
            // Append the new element to the HTML DOM
//            messagesContainer.appendChild(child);
        } else {
            // Create new HTML element from data given
            var child = createChildElement(addressBookRecordId, addressBookRecordData);
            // console.log(child);

            // Append the new element to the HTML DOM
            messagesContainer.appendChild(child);
        }

        // console.log(addressBookMessages);

        // Update the local storage
        localStorage.setItem('address_book_messages', JSON.stringify(addressBookMessages));
 
        // Reset form data
        addressBookForm.reset();

        document.getElementById('record').value = "";
    }


    document.getElementById('address-book-form').addEventListener('submit', saveAddressBookRecord);
    var allRemoveLinkElements = document.querySelectorAll('a.remove');
    

}, false);
//}