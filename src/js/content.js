chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const Sentiment = require('sentiment');
    const sentiment = new Sentiment();
    const content = document.body.innerText;
    const result = sentiment.analyze(content);
    sendResponse({data: result, success: true});
});
