function calculatePrice() {
  console.log("Price Alert");
}

window.addEventListener("load", () => {
  document
    .getElementById("calculateTotal")
    .addEventListener("click", calculatePrice);

  //... your code goes here
});

// let button = document.getElementById("calculateTotal");

// button.onclick = function () {
//   console.log("Test");
// };
