import $ from 'jquery';
import {getAllTextNodes} from "../utils";

export function addTotalPriceForAllItems() {

    const items = $('div.s-item__details-section--primary')

    items.each((_, item) => {

        const itemPriceElement = $(item).find('span.s-item__price').first();
        const itemDeliveryCostElement = $(item).find('span.s-item__shipping.s-item__logisticsCost').first();

        const itemPrice = extractPriceFromPriceElement(itemPriceElement);
        const itemDeliveryCost = extractPriceFromPriceElement(itemDeliveryCostElement);

        if (itemPrice && itemDeliveryCost) {

            const currency = getCurrency(itemPriceElement)

            const combinedPrice: HTMLSpanElement = document.createElement('span');
            combinedPrice.style.fontWeight = 'bold';
            combinedPrice.textContent = `Price including delivery ${currency ? currency : ''} ${(itemPrice + itemDeliveryCost).toFixed(2)}`;
            item.appendChild(combinedPrice);

        }

    });

}

//utility functions
function extractPriceFromPriceElement(priceElement: JQuery): number | undefined {
    const rawPrice = getAllTextNodes(priceElement).at(0);
    if (rawPrice) {
        // Extract the number from the text content
        const priceNumber = parseFloat(rawPrice.replace(/[^0-9.]/g, ''));
        if (!isNaN(priceNumber)) {
            return priceNumber;
        } else {
            return undefined;
        }
    }
    return undefined;
}

function getCurrency(priceElement: JQuery) {
    const rawPrice = getAllTextNodes(priceElement).at(0);
    if (rawPrice) {
        return extractFirstCurrency(rawPrice);
    }
}


function extractFirstCurrency(text: string): string | null {
    const pattern = /(?:EUR|\$|ILS)?/; //todo add more currency options, whether it's symbols or initials
    const match = text.match(pattern);
    return match ? match[0] : null;
}