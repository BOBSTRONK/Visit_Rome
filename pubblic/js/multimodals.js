// Get DOM Elements
const modals = document.querySelectorAll(".my-modal");
const modalBtns = document.querySelectorAll(".modal-btn");
const closeBtns = document.querySelectorAll(".close");

// Events

modalBtns.forEach(function (modalBtn) {
  modalBtn.addEventListener("click", openModal);
});
closeBtns.forEach(function (closeBtn) {
  closeBtn.addEventListener("click", closeModal);
});

window.addEventListener("click", outsideClick);

// Open
function openModal() {
  modals.forEach(function (modal) {
    modal.style.display = "block";
  });
}

// Close
function closeModal() {
  modals.forEach(function (modal) {
    modal.style.display = "none";
  });
}

// Close If Outside Click
function outsideClick(e) {
  modals.forEach(function (modal) {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  });
}
