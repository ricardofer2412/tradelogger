function calculatePrice() {
  console.log("Price Alert");
  const marketPrice = document.querySelector("#marketPrice");
  console.log(marketPrice);
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
