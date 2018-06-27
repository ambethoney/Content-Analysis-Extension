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

  render () {
    return (
      <div>
        <h1>Analyze This!</h1>
        <p> How positive or negative is the content you're about to read? Click the button below to find out!</p>
        <button onClick={() => {this.startAnalyzer()}}>Analyze</button>
        <p>Sentiment: <span className={`bold ${this.state.sentiment > 0 ? 'positive' : 'negative'}`}>{this.state.sentiment}</span></p>
        <p>Positive words: <span className="bold">{this.state.positive}</span></p>
        <p>Negative words: <span className="bold">{this.state.negative}</span></p>
      </div>
    )
  }
};

export default hot(module)(Greeting)
