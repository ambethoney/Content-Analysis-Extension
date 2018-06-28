import React from 'react'
import { hot } from 'react-hot-loader'

class Gif extends React.Component {

  getGif () {

  }

  render () {
    return(
      <main className="gif">
        <p> Reading negative content can really affect your mood. Don’t forget to take a break with something cute. :)</p>
        <button onClick={() => this.getGif()}>Show me the animals!</button>
      </main>
    )
  }
}

export default hot(module)(Gif)
