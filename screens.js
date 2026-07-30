function showScreen(id) {
  document.querySelectorAll(".screen").forEach((el) => {
    el.classList.toggle("is-hidden", el.id !== id);
  });
}
