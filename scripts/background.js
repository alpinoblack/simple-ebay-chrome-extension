chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    console.log('background.js running2');
    console.log("request is " + request);
    if (request.action === "saveBookmarkForSeller") {
        // Perform actions in response to the 'b' key press
        console.log("Background script received 'b' key press notification");
        console.log(`${request.seller}`)

        const ebayFolderId = await findEBayFolderIdCreateIfMissing();
        if (ebayFolderId === undefined || ebayFolderId === null) {
            console.log("Couldn't find and/or create the main EBay folder");
        }

        const sellerFolderId = await findSellerFolderIdCreateIfMissing(ebayFolderId, request.seller);
        if (sellerFolderId === null) {
            console.log(`Couldn't find and/or create the folder for seller ${request.seller}`);
        }

        await chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
            let currentTab = tabs[0];
            await chrome.bookmarks.create({
                parentId: sellerFolderId,
                title: currentTab.title,
                url: currentTab.url
            }, function (newBookmark) {
                console.log("Added bookmark: " + newBookmark.title);
            });
        });
    }
});

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

