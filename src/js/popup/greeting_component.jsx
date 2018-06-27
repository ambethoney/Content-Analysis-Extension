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
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {message: "text"}, (response) => {
        this.setState({
          sentiment: response.data.score,
          negative: response.data.negative.length,
          positive: response.data.positive.length,
        })
      })
    });
  }

  componentDidUpdate() {
    this.setState({
      sentiment: response.data.score,
      negative: response.data.negative.length,
      positive: response.data.positive.length,
    })
  }


  render () {
    return (
      <div>
        <h1>Sentiment Analysis</h1>
        <p> How positive or negative is the content you're about to read? Click the button below to find out!</p>
        <button onClick={() => {this.startAnalyzer()}}>Analyze</button>
        <p>Sentiment:</p>
        {this.state.sentiment}
        <p>Based on:</p>
        <p>Positive words: {this.state.positive}</p>
        <p>Negative words: {this.state.negative}</p>
      </div>
    )
  }
};

export default hot(module)(Greeting)
