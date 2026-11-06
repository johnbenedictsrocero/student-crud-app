const API_URL = "/api/Items";

const itemForm = document.getElementById("itemForm");
const itemMongoId = document.getElementById("itemMongoId");

const itemInput = document.getElementById("itemname");
const nameInput = document.getElementById("name");
const contactInput = document.getElementById("contact");
const imageInput = document.getElementById("image");

const itemTableBody = document.getElementById("itemTableBody");

const submitButton = document.getElementById("submitButton");
const cancelButton = document.getElementById("cancelButton");

const formTitle = document.getElementById("formTitle");
const message = document.getElementById("message");

// Keep track of existing image URL when editing
let currentImageBase64 = "";

// LOAD ITEMS
async function loadItems() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch Items.`);
        }

        const items = await response.json();

        itemTableBody.innerHTML = "";

        if (!Array.isArray(items) || items.length === 0) {
            itemTableBody.innerHTML = "<tr><td colspan='5'>No item records found.</td></tr>";
            return;
        }

        items.forEach(item => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${item.itemname || "N/A"}</td>
                <td>${item.name || "N/A"}</td>
                <td>${item.contact || "N/A"}</td>
                <td>
                    ${item.image 
                        ? `<img src="${item.image}" alt="Item Image" style="max-width: 120px; max-height: 120px; width: auto; height: auto; object-fit: contain; border-radius: 4px; display: block; cursor: pointer;" onclick="openImageModal('${item.image}')" title="Click to view full size">` 
                        : "No Image"
                    }
                </td>
                <td>
                    <button
                        type="button"
                        class="edit-button"
                        onclick="editItem('${item._id}')">
                        Edit
                    </button>
                    <button
                        type="button"
                        class="delete-button"
                        onclick="deleteItem('${item._id}')">
                        Delete
                    </button>
                </td>
            `;

            itemTableBody.appendChild(row);
        });

    } catch (error) {
        showMessage(
            error.message || "Unable to load item records.",
            true
        );
        console.error("loadItems Error:", error);
    }
}

// HELPER: Convert file to Base64
function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// ADD / UPDATE ITEM
itemForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    try {
        let imageString = currentImageBase64;

        // If a new file is chosen, convert it to Base64
        if (imageInput.files && imageInput.files[0]) {
            imageString = await convertFileToBase64(imageInput.files[0]);
        }

        const itemData = {
            itemname: itemInput.value.trim(),
            name: nameInput.value.trim(),
            contact: contactInput.value.trim(),
            image: imageString
        };

        let response;

        // UPDATE
        if (itemMongoId.value) {
            response = await fetch(
                `${API_URL}/${itemMongoId.value}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(itemData)
                }
            );
        }
        // CREATE
        else {
            response = await fetch(
                API_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(itemData)
                }
            );
        }

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Something went wrong."
            );
        }

        if (itemMongoId.value) {
            showMessage("Item updated successfully.");
        } else {
            showMessage("Item added successfully.");
        }

        resetForm();
        loadItems();

    } catch (error) {
        showMessage(
            error.message,
            true
        );
        console.error("Submit Error:", error);
    }
});

// EDIT ITEM
async function editItem(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const item = await response.json();

        if (!response.ok) {
            throw new Error(
                item.message || "Item not found."
            );
        }

        itemMongoId.value = item._id;
        itemInput.value = item.itemname || "";
        nameInput.value = item.name || "";
        contactInput.value = item.contact || "";
        
        // Save existing image string in case user doesn't pick a new file on edit
        currentImageBase64 = item.image || "";
        // Note: File inputs can't be programmatically set for security reasons, 
        // but currentImageBase64 ensures the old image isn't lost if left unchanged.

        formTitle.textContent = "Edit Item";
        submitButton.textContent = "Update Item";
        cancelButton.style.display = "inline-block";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {
        showMessage(
            error.message,
            true
        );
        console.error("Edit Error:", error);
    }
}

// DELETE ITEM
async function deleteItem(id) {
    const confirmed = confirm("Are you sure you want to delete this item?");

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Unable to delete item."
            );
        }

        showMessage("Item deleted successfully.");
        loadItems();

    } catch (error) {
        showMessage(
            error.message,
            true
        );
        console.error("Delete Error:", error);
    }
}

// CANCEL EDIT
cancelButton.addEventListener("click", function () {
    resetForm();
});

// RESET FORM
function resetForm() {
    itemForm.reset();
    itemMongoId.value = "";
    currentImageBase64 = "";
    formTitle.textContent = "Post Items";
    submitButton.textContent = "Submit";
    cancelButton.style.display = "none";
}

// DISPLAY MESSAGE
function showMessage(text, isError = false) {
    message.textContent = text;

    if (isError) {
        message.style.color = "red";
    } else {
        message.style.color = "green";
    }

    setTimeout(() => {
        message.textContent = "";
    }, 3000);
}

// OPEN IMAGE MODAL POPUP
function openImageModal(imageSrc) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    if (modal && modalImg) {
        modalImg.src = imageSrc;
        modal.style.display = "flex";
    }
}

// CLOSE IMAGE MODAL POPUP
function closeImageModal() {
    const modal = document.getElementById("imageModal");
    if (modal) {
        modal.style.display = "none";
    }
}

// INITIAL LOAD
loadItems();