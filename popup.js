/*
Copyright <2020> <GUILLAUME FELLER>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

chrome.tabs.query({active: true, currentWindow:true}, (tab) => {

    //We get the url of the page currently viewed by the user
    let currUrl = tab[0].url;
    let trimmedURL = currUrl.split('?')[0]

    //The Wayback Machine is very sensitive to parameters, so it is easier to remove them altogether
    let waybackUrl = "http://archive.org/wayback/available?url=" + trimmedURL;

    fetch(waybackUrl, { method: 'GET' })
    .then((response) => {
        //The structure of the returned JSON is described here: https://archive.org/help/wayback_api.php
        return response.json();
    })
    .then((value) => {      
        if(!Object.keys(value.archived_snapshots).length) {
            //If there is no archive, the user is offered the possibility to archive the page
            document.getElementById('noArchive').innerHTML = "Webpage not archived yet";
            document.getElementById('selectButton').onclick = function() { 
                let targ = "https://web.archive.org/save/" + trimmedURL; 
                chrome.tabs.create({url:targ})
            };
            document.getElementById('selectButton').textContent = "Archive the page and access the archived version of the page";
            
        }
        else {
            //Else clicking on the button leads us to the most recent archived version of the current page
            document.getElementById('selectButton').onclick = function() {chrome.tabs.create({url:value.archived_snapshots.closest.url})};
            document.getElementById('selectButton').innerHTML = "Access the archived version of the page";
        }
    })
    .catch((err) => {
        alert(err);
    });
});

