chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.action === "saveBookmarkForSeller") {
        const ebayFolderId = await findEBayFolderIdCreateIfMissing();
        if (ebayFolderId === undefined || ebayFolderId === null) {
            console.log("Couldn't find and/or create the main EBay folder");
        }

        const sellerFolderId = await findSellerFolderIdCreateIfMissing(ebayFolderId, request.seller);
        if (sellerFolderId === null) {
            console.log(`Couldn't find and/or create the folder for seller ${request.seller}`);
        }

        createBookmarkIfMissing(sellerFolderId);
    }
});

async function createBookmarkIfMissing(sellerFolderId) {
    const [currentTab] = await chrome.tabs
    .query({ active: true, currentWindow: true});

    const potentialBookmark = await chrome.bookmarks.search({title: currentTab.title});
    if (potentialBookmark.length <= 0 
        || !potentialBookmark[0].url
         || potentialBookmark[0].parentId !== sellerFolderId ) {
            await chrome.bookmarks.create({
                parentId: sellerFolderId,
                title: currentTab.title,
                url: currentTab.url
            }, function (newBookmark) {
                console.log("Added bookmark: " + newBookmark.title);
            });
    }

}

async function findSellerFolderIdCreateIfMissing(ebayFolderId, sellerName) {
    console.log(ebayFolderId + "asdasdasd ")
    const sellerFolderResults = await chrome.bookmarks.search({title: sellerName});
    if (sellerFolderResults.length > 0) {
        if (sellerFolderResults[0].url) {
            console.log(`found seller folder but it is not an actual folder`)
            return;
        }

        if (sellerFolderResults[0].parentId !== ebayFolderId) {
            console.log(`found seller folder but in the wrong location ${folder},
                pleas delete`);
            return;
        }

        return sellerFolderResults[0].id;
    } else {
        return await chrome.bookmarks.create({
            title: sellerName,
            parentId: ebayFolderId
        }).then((newFolder) => newFolder.id);
    }
}

async function findEBayFolderIdCreateIfMissing() {

    const results = await chrome.bookmarks.search({title: "EBay"});
    if (results.length > 0 && !results[0].url) {
        return results[0].id
    }

    //folder doesn't exist
    return await chrome.bookmarks.create({
        title: "EBay"
    }).then((newFolder) => newFolder.id);
}

