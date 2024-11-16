function extractPrices() {

  function extractPricesFromSpan(priceSpan) {
    // Get all child nodes of the price span
    const childNodes = priceSpan.childNodes;

    // Find the first text node
    const textNode = Array.from(childNodes).find(node => node.nodeType === Node.TEXT_NODE);
      
    if (textNode) {
      // Extract the number from the text content
      const priceText = textNode.textContent.trim();
      const priceNumber = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      
      if (!isNaN(priceNumber)) {
        return priceNumber;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }

  }

  // Select all div elements with class 's-item__details-section--primary'
  const primaryDivs = document.querySelectorAll('div.s-item__details-section--primary');

  const unorderedListNode = document.querySelector('ul.srp-results,srp-list clearfix');
  const pageScrollSizeButton = document.querySelector('div.srp-ipp');

  unorderedListNode.prepend(pageScrollSizeButton);

  primaryDivs.forEach(div => {
    // Find the span with class 's-item__price' within each div
    const itemPriceSpan = div.querySelector('span.s-item__price');
    const deliveryPriceSpan = div.querySelector('span.s-item__shipping,s-item__logisticsCost');

    if (itemPriceSpan) {
      const itemPrice = extractPricesFromSpan(itemPriceSpan);
      let delieveryPrice;
      if (deliveryPriceSpan) {
        delieveryPrice = extractPricesFromSpan(deliveryPriceSpan)
      }

      if (itemPrice !== undefined && delieveryPrice !== undefined) {
        const combinedPrice = document.createElement('span');
        combinedPrice.style.fontWeight = 'bold';
        combinedPrice.textContent = `Price including delivery $${(itemPrice + delieveryPrice).toFixed(2)}`;
        div.appendChild(combinedPrice);
      }
    }

  });

}

extractPrices();