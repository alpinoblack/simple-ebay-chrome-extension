import $ from "jquery";

export function moveResultsPerPageToTopOfPage() {
    const theListOfItemsElement = $('ul.srp-results.srp-list.clearfix').first();
    const pageScrollSizeButton = $('div.srp-ipp');
    theListOfItemsElement.prepend(pageScrollSizeButton);
}