import {SellerAction} from "./seller-action.interface";

window.addEventListener('keydown', async function (event) {
    if (event.key === 'b') {
        // Your code here to respond to the 'b' key press
        console.log("The 'b' key was pressed!");

        const div = document.querySelector('div.x-sellercard-atf__info__about-seller');
        const span = div?.querySelector('span.ux-textspans.ux-textspans--BOLD');
        const textNode = span?.childNodes[0];
        const seller = textNode?.textContent!;

        // Example: Send a message to the background script
        await chrome.runtime.sendMessage<SellerAction>({
            action: "saveBookmarkForSeller",
            seller: seller
        });
    }
});