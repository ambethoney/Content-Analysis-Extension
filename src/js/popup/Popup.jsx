import React from 'react'
import { hot } from 'react-hot-loader'

import Gif from './Gif'
import ReactSpeedometer from 'react-d3-speedometer'

class Popup extends React.Component {

  constructor(state) {
    super(state)
    this.state = {
      sentiment: '',
      sentimentNum: null,
      negative: {count: null, words: []},
      positive: {count: null, words: []},
      toggleWords: false,
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

  countDupes(arr){
    let counts = {}
    arr.forEach((elem) => counts[elem] = (counts[elem] || 0)+1 )
    let sorted = this.sortDupes(counts)
    return sorted
  }

  sortDupes(counts){
    let sortable = [];
    for (let word in counts) {
        sortable.push([word, counts[word]]);
    }
    sortable.sort(function(a, b) {
        return a[1] - b[1];
    });

    let reversed = sortable.reverse().slice(0, 3)
    return reversed
  }

  showPositiveWords(){
    let arr = this.countDupes(this.state.positive.words)
    return(
      <ul className={`wordList ${this.state.toggleWords}`}>
        {arr.map((elem, index) => <li key={ index }>{elem[0]} appears {elem[1]} times</li>)}
      </ul>
    )
  }

  showNegativeWords () {
    let arr = this.countDupes(this.state.negative.words)
    return(
      <ul className={`wordList ${this.state.toggleWords}`}>
        {arr.map((elem, index) => <li key={ index }>{elem[0]} appears {elem[1]} times</li>)}
      </ul>
    )
  }

  showSentiment () {
    if (this.state.sentimentNum > 10) {
      return this.positiveAnalysis()
    } else if (this.state.sentimentNum < -10) {
      return this.negativeAnalysis()
    } else if (this.state.sentimentNum === null) {
      return false
    } else {
      return this.neutralAnalysis()
    }
  }

  positiveAnalysis () {
    return(
      <section className="analysisContain">
        <p>There are <span className="bold">{this.state.positive.count}</span> positive words.</p>
        <button
          className="toggleBtn"
          onClick={() => this.toggleWords()}>Show me some of them!</button>
          {this.showPositiveWords()}
      </section>
    )
  }


  neutralAnalysis () {
    return(
      <section className="analysisContain">
        <p>There are <span className="bold positive">{this.state.positive.count}</span> positive words and <span className="bold negative">{this.state.negative.count}</span> negative words.</p>
      </section>
    )
  }

  negativeAnalysis () {
    return(
      <section className="analysisContain">
        <p>There are <span className="bold">{this.state.negative.count}</span> negative words.</p>
        <button
          className="toggleBtn"
          onClick={() => this.toggleWords()}>Show me some of them!</button>
          {this.showNegativeWords()}
      </section>
    )
  }

  toggleWords () {
    this.setState(prevState => ({
      toggleWords: !prevState.toggleWords
    }));
  }

  render () {

    // Cap super negative/positive numbers at 100, purely for aesthetics
    let sentVal
    if (this.state.sentimentNum > 100) {
      sentVal = 100
    } else if (this.state.sentimentNum < -100) {
      sentVal = -100
    } else {
      sentVal = this.state.sentimentNum
    }

    return (
      <main>
        <h1>Analyze This!</h1>
        <p> How positive or negative is the content you're about to read? Click the button below to find out!</p>
        <button
          className="analyzeBtn"
          onClick={() => this.startAnalyzer()}>
          Analyze
        </button>

        <fig className="speedometerContain">
          <ReactSpeedometer
            minValue={-100}
            maxValue={100}
            value={sentVal ? sentVal : 0}
            height={175}
          />
        </fig>

        <h2 className={`sentiment bold ${this.state.sentimentNum > 0 ? 'positive' : 'negative'}`}>{this.state.sentiment}</h2>
        {this.showSentiment()}
        {this.state.sentimentNum < -49 ? <Gif/> : ''}
      </main>
    )
  }
};

export default hot(module)(Popup)
