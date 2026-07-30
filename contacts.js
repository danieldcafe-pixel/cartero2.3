const contactRows = document.querySelectorAll(".contact-row");

contactRows.forEach((row) => {
  row.addEventListener("click", () => {
    if (row.dataset.contact === "linda") {
      showScreen("messageScreen");
      if (typeof resetForRetake === "function") resetForRetake();
    }
  });
});
