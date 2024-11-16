function extractPrices() {

  function flattenUntilTextNode(element) {
    const result = [];

    function flatten(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        // If it's a text node, add it to the result
        result.push(node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // If it's an element node, recurse through its children
        Array.from(node.childNodes).forEach(flatten);
      }
      // Ignore comment nodes and other node types
    }

    flatten(element);
    return result;
  }

  function extractFirstCurrency(text) {
    const pattern = /(?:EUR|\$|ILS)?/;
    const match = text.match(pattern);
    return match ? match[0] : null;
  }

  function getCurrency(priceSpan) {
    const childNodes = priceSpan.childNodes;
    const textNode = Array.from(childNodes).find(node => node.nodeType === Node.TEXT_NODE);
    if (textNode) {
      const priceText = textNode.textContent.trim();
      const currency = extractFirstCurrency(priceText);
      return currency;
    }
  }

  function extractPricesFromSpan(priceSpan) {
    // Get all child nodes of the price span
    const childNodes = priceSpan.childNodes;

    const textNodes = flattenUntilTextNode(priceSpan);

    if (textNodes && textNodes.length > 0) {
      // Extract the number from the text content
      const priceText = textNodes[0].textContent.trim();
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

      const currency = getCurrency(itemPriceSpan);

      if (itemPrice !== undefined && delieveryPrice !== undefined) {
        const combinedPrice = document.createElement('span');
        combinedPrice.style.fontWeight = 'bold';
        combinedPrice.textContent = `Price including delivery ${currency ? currency : ''} ${(itemPrice + delieveryPrice).toFixed(2)}`;
        div.appendChild(combinedPrice);
      }
    }

  });

}

extractPrices();