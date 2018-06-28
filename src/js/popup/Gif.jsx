import React from 'react'
import Gifs from '../gifs'
import { hot } from 'react-hot-loader'

class Gif extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      url: '',
      title: '',
    }
  }

  getGif () {
    let gif = Gifs[Math.floor(Math.random()*Gifs.length)]
    this.setState({
      url: gif.url,
      title: gif.title,
    })
  }

  render () {
    return(
      <main className="gifContain">
        <p> Reading negative content can really affect your mood. Don’t forget to take a break with something cute. :)</p>
        <button
        className="toggleGif"
        onClick={() => this.getGif()}>Show me something cute!</button>
        <div className="theGif">
          <iframe src={this.state.url} title={this.state.title} frameBorder="0" className="giphyEmbed" allowFullScreen></iframe>
        </div>
      </main>
    )
  }
}

export default hot(module)(Gif)
