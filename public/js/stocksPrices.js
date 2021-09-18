function calculatePrice() {
  console.log("Price Alert");
  const marketPrice = document.querySelector("#marketPrice").value;
  console.log(marketPrice);
  const shareNumber = document.querySelector("#sharesNumber").value;
  console.log("Shares: ", shareNumber);

  let estimate = Number(marketPrice) * Number(shareNumber);

  console.log(`$${estimate}`);
  document.getElementById("estimateValue").innerText = `$${estimate}`;
}

window.addEventListener("load", () => {
  document
    .getElementById("calculateTotal")
    .addEventListener("click", calculatePrice);
});
