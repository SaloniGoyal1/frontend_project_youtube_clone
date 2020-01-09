import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      searchKeyword: 'reactjs',
      listOfVideos: [],
      loading: null ,
      VideoUrl: '',
      name: '',
      comment: '',
      listofNamesComment: [],
      listOfComments: [],
      likeStatus: 'Like',
      LoadingError: false
    };
  }

setSearchValue = (event) => {
this.setState({
  searchKeyword: event.target.value
})
console.log(this.state.searchKeyword)
}

searchVideo = async () => {
    this.setState({
    loading: "LOADING",
    LoadingError: false
})
const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&order=viewCount&q=${this.state.searchKeyword}&type=video&videoDefinition=high&key=AIzaSyCH763PTQN_B0LQVXdoIGt9T2w4MZ2AZJE`);
const myJson = await response.json();
console.log("myJson " , myJson);
if(myJson.items.length == 0) {
  this.setState({
    LoadingError: true
  })
}
this.setState({
  listOfVideos: myJson.items
})
console.log(this.state.listOfVideos)
  this.setState({
    loading: "LOADED"
  })
}

showMostPopularVideos = async () => {
  this.setState({
    loading: 'LOADING'
  })
  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&chart=mostPopular&maxResults=15&regionCode=IN&key=AIzaSyCH763PTQN_B0LQVXdoIGt9T2w4MZ2AZJE`);
const myJson = await response.json();
console.log("myJson " , myJson);
this.setState({
  listOfVideos: myJson.items,
  loading: "LOADED"
})
console.log(this.state.listOfVideos)
this.setState({
  VideoUrl: this.state.listOfVideos[0].id.videoId
})
console.log("currentVideoUrl" , this.state.VideoUrl)
}

componentDidMount() {
  this.showMostPopularVideos()
  console.log("listOfVideos" , this.state.listOfVideos)
}

setCurrentUrl = (id) => {

  this.setState({
    VideoUrl: id
  })
}

setName = (event) => {
  this.setState({
    name: event.target.value
  })
}

setComment = (event) => {
  this.setState({
    comment: event.target.value
  })
}

addComment = () => {
  this.setState({
    listofNamesComment: [...this.state.listofNamesComment, this.state.name],
    listOfComments: [...this.state.listOfComments, this.state.comment],
    name: '',
    comment: ''
  })
}

likeButton = () => {
  if(this.state.likeStatus == "Like"){
  this.setState({
    likeStatus: 'Liked'
  })
  } else {
      this.setState({
    likeStatus: 'Like'
  })
  }
}
  render() {
    let videos = this.state.listOfVideos.map(eachVideo => (
      <img src={eachVideo.snippet.thumbnails.high.url} onClick={()=> this.setCurrentUrl(eachVideo.id.videoId)}/>
      ))
    return (
    
      <div >
        <input className="search" placeholder="Search" onChange={this.setSearchValue} /> &nbsp;
        <button  onClick={this.searchVideo} style={{padding:'5px'}}>Search</button>

      <div>
      <hr/>
      {
        this.state.LoadingError ? (<h1>No search found</h1>):(
        <iframe src={`https://www.youtube.com/embed/${this.state.VideoUrl}`}/>
      )}
      </div>

      <div style={{width: '350px', float : 'right'}}>
        {this.state.loading == "LOADING" ? (<h1>Loading...</h1>) : (videos) }
      </div>
      <div style={{display: 'block', float: 'left'}}>
      <button className="likebutton" onClick={this.likeButton}>{this.state.likeStatus}</button>
    
    <h3>Comments</h3>
    <input className="name" onChange={this.setName} placeholder= "Your Name" value={this.state.name}/>
    <input className="comment" onChange={this.setComment} placeholder="Your Comment" value={this.state.comment}/> 
    <br/><br/>
    <button className="commentbutton" onClick={this.addComment}> Comment</button>&nbsp;
    <button onClick={this.addComment} style={{height:'20px'}}> Cancel</button>
    <br/><br/>

    <div style={{marginLeft:'25px'}}>
    {this.state.listofNamesComment.map((eachName, index) => (<li><b>{eachName}</b><br/>{this.state.listOfComments[index]}</li>))}
    </div>
    </div>
    </div>
    );
  }
}

render(<App />, document.getElementById('root'));