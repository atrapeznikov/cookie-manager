document.addEventListener("DOMContentLoaded", () => {
    loadBlockedDomains();
});

document.getElementById("viewCookies").addEventListener("click", () => {
    debugger
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let url = tabs[0].url;
        chrome.cookies.getAll({ url }, (cookies) => {
            let cookieList = document.getElementById("blockList");
            cookieList.innerHTML = "";
            cookies.forEach(cookie => {
                let li = document.createElement("li");
                li.textContent = `${cookie.name} = ${cookie.value}`;
                cookieList.appendChild(li);
            });
        });
    });
});

document.getElementById("deleteCookies").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let url = tabs[0].url;
        chrome.cookies.getAll({ url }, (cookies) => {
            cookies.forEach(cookie => {
                chrome.cookies.remove({ url, name: cookie.name });
            });
            alert("Cookies deleted!");
        });
    });
});

document.getElementById("blockDomain").addEventListener("click", () => {
    let domain = document.getElementById("blockDomainInput").value.trim();
    if (domain) {
        chrome.storage.sync.get({ blockedDomains: [] }, (data) => {
            let blockedDomains = new Set(data.blockedDomains);
            blockedDomains.add(domain);
            chrome.storage.sync.set({ blockedDomains: Array.from(blockedDomains) }, () => {
                loadBlockedDomains();
                alert(`Blocked ${domain}`);
            });
        });
    }
});

function loadBlockedDomains() {
    chrome.storage.sync.get({ blockedDomains: [] }, (data) => {
        let blockList = document.getElementById("blockList");
        blockList.innerHTML = "";
        data.blockedDomains.forEach(domain => {
            let li = document.createElement("li");
            li.textContent = domain;
            let removeBtn = document.createElement("button");
            removeBtn.textContent = "Unblock";
            removeBtn.onclick = () => unblockDomain(domain);
            li.appendChild(removeBtn);
            blockList.appendChild(li);
        });
    });
}

function unblockDomain(domain) {
    chrome.storage.sync.get({ blockedDomains: [] }, (data) => {
        let blockedDomains = data.blockedDomains.filter(d => d !== domain);
        chrome.storage.sync.set({ blockedDomains }, () => {
            loadBlockedDomains();
            alert(`Unblocked ${domain}`);
        });
    });
}
