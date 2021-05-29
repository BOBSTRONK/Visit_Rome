document.querySelector(".btn").onclick = function () {
  var password = document.querySelector(".password").value;
  var confirmPassword = document.querySelector(".confirmPassword").value;
  if (password != confirmPassword) {
    window.alert("Password didn't match try again.");
    return false;
  }
  return true;
};

const password = document.getElementById("defaultRegisterFormPassword");
const form = document.getElementById("form");
const errorElement = document.getElementById("error");

form.addEventListener("submit", (e) => {
  let messages = [];

  if (password.value.length <= 8) {
    messages.push("Password must be longer than 8 characters");
  }

  if (password.value.length >= 15) {
    messages.push("Password must be less than 15 characters");
  }

  if (password.value.search(/[A-Z]/) < 0) {
    messages.push("Password must contain at least 1 upperCase");
  }

  if (password.value.search(/[0-9]/) < 0) {
    messages.push("Password must contain at least 1 digit");
  }

  if (messages.length > 0) {
    e.preventDefault();
    errorElement.innerText = messages.join(", ");
  }
});
