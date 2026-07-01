(function () {
  function setText(node, value) {
    if (node) node.textContent = value;
  }

  function setImage(node, src, alt) {
    if (!node || !src) return;
    node.src = src;
    if (alt !== undefined) node.alt = alt;
  }

  function updateCard(card, swatch) {
    var primaryImage = card.querySelector("[data-primary-image]");
    var secondaryImage = card.querySelector("[data-secondary-image]");
    var price = card.querySelector("[data-price-output]");
    var comparePrice = card.querySelector("[data-compare-price-output]");
    var priceWrap = card.querySelector("[data-price-wrap]");
    var badge = card.querySelector("[data-sale-badge]");
    var color = swatch.dataset.color || "";
    var priceValue = swatch.dataset.variantPrice || "";
    var compareValue = swatch.dataset.variantComparePrice || "";

    card.querySelectorAll("[data-swatch]").forEach(function (button) {
      var isSelected = button === swatch;
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });

    setImage(primaryImage, swatch.dataset.primaryImage, "Selected product color: " + color);
    setImage(secondaryImage, swatch.dataset.secondaryImage, "");
    setText(price, priceValue);
    setText(comparePrice, compareValue);

    if (priceWrap) priceWrap.classList.toggle("is-sale", Boolean(compareValue));
    if (badge) badge.hidden = !compareValue;
  }

  document.querySelectorAll("[data-product-card]").forEach(function (card) {
    card.querySelectorAll("[data-swatch]").forEach(function (swatch) {
      swatch.addEventListener("click", function () {
        updateCard(card, swatch);
      });
    });
  });
})();
