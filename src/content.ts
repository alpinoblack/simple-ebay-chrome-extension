function addTotalPriceForAllItems() {

  function getCurrency(priceSpan: Element) {
    const childNodes = priceSpan.childNodes;
    const textNode = Array.from(childNodes).find(node => node.nodeType === Node.TEXT_NODE);
    if (textNode) {
      const priceText = textNode.textContent?.trim()!;
      const currency = extractFirstCurrency(priceText);
      return currency;
    }
  }

  function extractPricesFromSpan(priceSpan: Element): number | undefined {
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

  //get all items <div>s
  const itemDivs = document.querySelectorAll('div.s-item__details-section--primary');
  itemDivs.forEach(itemDiv => {

    function createNewCombinedPriceSpan(itemPrice: number, delieveryPrice: number, currency: string | null | undefined) {
      const combinedPrice = document.createElement('span');
      combinedPrice.style.fontWeight = 'bold';
      combinedPrice.textContent = `Price including delivery ${currency ? currency : ''} ${(itemPrice + delieveryPrice).toFixed(2)}`;
      itemDiv.appendChild(combinedPrice);
    }

    const itemPriceSpan = itemDiv.querySelector('span.s-item__price')!;
    const deliveryPriceSpan = itemDiv.querySelector('span.s-item__shipping,s-item__logisticsCost');

    if (itemPriceSpan) {
      const itemPrice = extractPricesFromSpan(itemPriceSpan);
      let deliveryPrice;
      if (deliveryPriceSpan) {
        deliveryPrice = extractPricesFromSpan(deliveryPriceSpan)
      }

      const currency = getCurrency(itemPriceSpan);

      if (itemPrice !== undefined && deliveryPrice !== undefined) {
        // const combinedPrice = document.createElement('span');
        // combinedPrice.style.fontWeight = 'bold';
        // combinedPrice.textContent = `Price including delivery ${currency ? currency : ''} ${(itemPrice + delieveryPrice).toFixed(2)}`;
        // itemDiv.appendChild(combinedPrice);
        createNewCombinedPriceSpan(itemPrice, deliveryPrice, currency)
      }
    }

  });

}

function moveResultsPerPageToTopOfPage() {
  const unorderedListNode = document.querySelector('ul.srp-results,srp-list clearfix')!;
  const pageScrollSizeButton = document.querySelector('div.srp-ipp')!;
  unorderedListNode.prepend(pageScrollSizeButton);
}

//main program
moveResultsPerPageToTopOfPage();
addTotalPriceForAllItems();


//utility functions

function flattenUntilTextNode(element: Element) {
  const result: any[] = [];

  function flatten(node: Element) {
    if (node.nodeType === Node.TEXT_NODE) {
      // If it's a text node, add it to the result
      result.push(node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // If it's an element node, recurse through its children
      // @ts-ignore
      Array.from(node.childNodes).forEach(flatten);
    }
    // Ignore comment nodes and other node types
  }

  flatten(element);
  return result;
}

function extractFirstCurrency(text: string): string | null {
  const pattern = /(?:EUR|\$|ILS)?/; //todo add more currency options, wheather it\s symbols or initials
  const match = text.match(pattern);
  return match ? match[0] : null;
}