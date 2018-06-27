chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const Sentiment = require('sentiment');
    const sentiment = new Sentiment();
    const content = document.body.innerText;
    console.log(content)
    const result = sentiment.analyze(content);
    console.log(result)
    sendResponse({data: result, success: true});
});
