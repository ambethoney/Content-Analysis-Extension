import React from 'react'
import { hot } from 'react-hot-loader'

import Analyzer from './Analyzer.jsx'

class Popup extends React.Component {

  constructor(state) {
    super(state)
    this.state = {
      sentiment: '',
      sentimentNum: null,
      negative: {count: null, words: []},
      positive: {count: null, words: []},
    }
  }

  startAnalyzer () {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {message: "text"}, (response) => {

        let sentiment
        // -50+ = Very Negative
        // -49 - -10 = Negative
        // -10 - 10 = Neutral
        // 10 - 49 = Positive
        // 50+  = Very Positive
        if (response.data.score > 49) {
          sentiment = 'Very Positive'
        } else if (response.data.score > 9) {
          sentiment = 'Positive'
        } else if (response.data.score < -49) {
          sentiment = 'Very Negative'
        } else if (response.data.score < -9) {
          sentiment = 'Negative'
        } else {
          sentiment = 'Neutral'
        }

        this.setState({
          sentiment: sentiment,
          sentimentNum: response.data.score,
          negative: {
            count: response.data.negative.length,
            words: response.data.negative,
          },
          positive: {
            count: response.data.positive.length,
            words: response.data.positive,
          },
        })
      })
    });
  }
  // let words = ["legal","talent","help","romance","aboard","want","solved","increase","recommended","♥","active","want","welcome","like","like","accepted","active","appreciated","help","welcome","certain","favorite","♥", "share","join"]

  showPositiveWords(){
    return this.countDupes(this.state.positive.words)
    // let txt = ''
    // let arr = this.countDupes(words)
    // return arr.join(' ')
  }

  countDupes(arr){
    let counts = {}
    arr.forEach((elem) => counts[elem] = (counts[elem] || 0)+1 )
    let sorted = this.sortDupes(counts)
    return sorted.join(' ')
  }

  sortDupes(counts){
    let sortable = [];
    for (let word in counts) {
        sortable.push([word, counts[word]]);
    }
    sortable.sort(function(a, b) {
        return a[1] - b[1];
    });
    return sortable.reverse().slice(0, 3)
  }

  showNegativeWords () {
    return this.countDupes(this.state.negative.words)
  }

  render () {
    return (
      <div>
        <h1>Analyze This!</h1>
        <p> How positive or negative is the content you're about to read? Click the button below to find out!</p>
        <button onClick={() => this.startAnalyzer()}>Analyze</button>
        <p>Sentiment: <span className={`bold ${this.state.sentimentNum > 0 ? 'positive' : 'negative'}`}>{this.state.sentiment}, {this.state.sentimentNum}</span></p>
        <p>Positive words: <span className="bold">{this.state.positive.count}</span></p>
        <p>The three most used positive words are:</p>
        <p>{this.showPositiveWords()}</p>
        <p>Negative words: <span className="bold">{this.state.negative.count}</span></p>
        <p>The three most used negative words are:</p>
        <p>{this.showNegativeWords()}</p>
      </div>
    )
  }
};

export default hot(module)(Popup)
