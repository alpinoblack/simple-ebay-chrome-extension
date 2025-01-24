import $ from "jquery";

export function getAllTextNodes(element: JQuery): string[] {
    const textNodes: string[] = [];

    $(element).contents().each(function () {
        if (this.nodeType === Node.TEXT_NODE && this.textContent !== null && this.textContent.trim().length > 0) {
            textNodes.push(this.textContent.trim());
        } else if (this.nodeType === Node.ELEMENT_NODE) {
            getAllTextNodes($(this).children());
        }
    });

    return textNodes;
}