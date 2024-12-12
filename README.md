# Qparser
Small Firefox extension for parsing questions with answers and images from web pages with special markup for testing purpose.

## Question HTML structure
This extension works only with local stored pages with specific HTML markup. You can change algorithm of searching question in browser/content_script/cscript.js
```
<div class=”que”>
    <div class=”content”>
        <div class="formulation">
            <div class="qtext">
                QUESTION TEXT
                <img src="LOCAL_IMAGE_PATH">
            </div>
            <div class="ablock">
                <div class="answer">
                    <label>1. ANSWER 1</label>
                    ...
                    <label>n. ANSWER n</label>
                </div>
            </div>
        </div>
        <div class="outcome">
            <div class="feedback">
                <div class="rightanswer">
                    TEXT: RIGHT ANSWER TEXT
                </div>
            </div>
        </div>
    </div>
</div>
```
## Steps
1. Set sqlite database name in main.py file from server folder.  
2. Start main.py python script.
3. Go to about:debugging#/runtime/this-firefox in Firefox browser.
4. Load addon via "Load Temporary Add-on..." by opening manifest.json file from project browser folder.
5. Go to questions page.
6. Open add-on popup by clicking its icon.
7. If necessary, input category of questions. It will be applied to all questions on page.
8. Click analyze button. On success it will alert with 200 code. 
9. Use sqlite database data for confirmation of testing system correct work.

## Extension structure 
Extension consists of multiple parts:
1. Python script receives JSON with array of questions and writes them with images to sqlite database.
2. Browser extension parse questions from page and assemble them to JSON. It consists of 3 parts:
2.1 Popup loads on extension icon click, inject content script into active tab scripts and send to it message with category name to start parse.
2.2 Content script finds specified HTML classes on page, get questions data and assemble them into JSON. Then it sends it as message to extension’s backend script.
2.3 Backend script receives message from content script and sends it as XMLHttpRequest to python script.

![structure](https://github.com/user-attachments/assets/f2537b4b-c603-4b19-8419-e0c1c89b66f7)





