// Copyright © 2024 apcnwc
// SPDX-License-Identifier: Apache-2.0

function handleMessage(request, sender, sendResponse) {
    
    let url = new URL('http://localhost:7070/');
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, false);
    xhr.send([request.data]);

    sendResponse({ response: xhr.status });
}
  
browser.runtime.onMessage.addListener(handleMessage);