chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        return new Promise((resolve) => {
            chrome.storage.sync.get({ blockedDomains: [] }, (data) => {
                let url = new URL(details.url);
                if (data.blockedDomains.includes(url.hostname)) {
                    resolve({ cancel: true });
                } else {
                    resolve({ cancel: false });
                }
            });
        });
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);

chrome.runtime.onInstalled.addListener(() => {
    console.log("Cookie Manager Extension Installed.");
});
