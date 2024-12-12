// Copyright © 2024 apcnwc
// SPDX-License-Identifier: Apache-2.0

browser.tabs.executeScript(null, {
    file: "/content_scripts/cscript.js",
});
  
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("analyze")) {

      let category = document.getElementById("category").value;
    
      var gettingActiveTab = browser.tabs.query({
          active: true,
          currentWindow: true,
        });
      gettingActiveTab.then((tabs) => {
          browser.tabs.sendMessage(tabs[0].id, {category: category});
      });
      
    } 
});
  