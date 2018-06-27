import React from 'react'
import { hot } from 'react-hot-loader'

class Greeting extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      sentiment: null,
      negative: null,
      positive: null,
    }
  }

  getCurrentWindowActiveTabIndex() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({
        currentWindow: true,
        active: true,
      }, (currentWindowActiveTabs = []) => {
        if (!currentWindowActiveTabs.length) reject();
        resolve(currentWindowActiveTabs[0].index);
      });
    });
  }

  startAnalyzer () {
    // this.getCurrentWindowActiveTabIndex()
    //   .then(tabIndex => {

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      // alert(tabs[0].id)
      chrome.tabs.sendMessage(tabs[0].id, {message: "text"}, (response) => {
        console.log(response.data.score)
        this.setState({
          sentiment: response.data.score
        })
      })
    });
  }

  render () {
    return (
      <div>
        <h1>Sentiment Analysis</h1>
        <p> How positive or negative is the content you're about to read? Click the button below to find out!</p>
        <button onClick={() => {this.startAnalyzer()}}>Analyze</button>
        <p>Sentiment:</p>
        {this.state.sentiment}
      </div>
    )
  }
};

export default hot(module)(Greeting)
