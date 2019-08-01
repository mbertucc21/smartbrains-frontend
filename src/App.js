import React, { Component } from 'react';
import Particles from 'react-particles-js';
// import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

// MOVED BELOW TO THE BACKEND
// const app = new Clarifai.App({
//  apiKey: '73c2b57f77cd4379a3964a9c2e0bdb35'
// });

const particlesOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  numFaces: 0,
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    password: '',
    entries: 0,
    joined: ''
  }
}

// Class App
class App extends Component {

// STATE
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      numFaces: 0,
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        password: '',
        entries: 0,
        joined: ''
      }
    }
  }

  // FUNCTIONS
  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
      }
    })
  }


  // componentDidMount() {
  //   fetch('http://localhost:3000/')
  //     .then(response => response.json())
  //     .then(console.log)
  //     // above is same as .then(data => console.log(data)), just a short way of doing it
  // }

  calculateFaceLocation = (data) => {
    // console.log(data);

    // For a Single Face:
    // const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;

    // For Multiple Faces:
    const clarifaiFaceArray = data.outputs[0].data.regions.map((faces, i) => {
      return (
        data.outputs[0].data.regions[i].region_info.bounding_box
      );
    })
    // console.log("clarifaiFaceArray: ", clarifaiFaceArray);
    // console.log("clarifaiFaceArrayLength: ", clarifaiFaceArray.length);
    // console.log("clarifaiFace: ", clarifaiFace);

    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(width, height);

    let boxArray = []

    for (var i = 0; i < clarifaiFaceArray.length; i++) {
      boxArray.push({
        leftCol: clarifaiFaceArray[i].left_col * width,
        topRow: clarifaiFaceArray[i].top_row * height,
        rightCol: width - (clarifaiFaceArray[i].right_col * width),
        bottomRow: height - (clarifaiFaceArray[i].bottom_row * height)
      });
    }

    // console.log("box Array: ", boxArray);
    return boxArray;

    // return {
    //   leftCol: clarifaiFace.left_col * width,
    //   topRow: clarifaiFace.top_row * height,
    //   rightCol: width - (clarifaiFace.right_col * width),
    //   bottomRow: height - (clarifaiFace.bottom_row * height)
    // }
  }

  displayFaceBox = (box) => {
    // console.log(box);
    // console.log(box.length);
    this.setState({box: box});
    this.setState({numFaces: box.length})
  }

  onInputChange = (event) => {
    // console.log(event.target.value);
    this.setState({input: event.target.value});
  }

  enterPictureSubmit = (e) => {
    // Browser specific for .which and .keyCode
    let x = e.which || e.keyCode;
    if (x === 13) {
      this.onPictureSubmit();
    }
  }

  onPictureSubmit = () => {
    // console.log('click');
    this.setState({imageUrl: this.state.input});
    // app.models
    //   .predict(
    //   Clarifai.FACE_DETECT_MODEL,
    //   this.state.input)
      fetch('https://boiling-thicket-12985.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
    .then(response => response.json())
    .then(response => {
      if (response) {
        fetch('https://boiling-thicket-12985.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch(console.log);
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
      route = 'signin'
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={ this.state.isSignedIn } onRouteChange={ this.onRouteChange }/>
        { this.state.route === 'home'
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm
                onInputChange={ this.onInputChange }
                enterPictureSubmit={ this.enterPictureSubmit }
                onPictureSubmit={ this.onPictureSubmit }
              />
              <FaceRecognition numFaces={this.state.numFaces} box={this.state.box} imageUrl={ this.state.imageUrl } />
            </div>
          : (
            this.state.route === 'signin'
            ? <SignIn loadUser={this.loadUser} onRouteChange={ this.onRouteChange } />
            : <Register loadUser={this.loadUser} onRouteChange={ this.onRouteChange } />
            )
        }
      </div>
    );
  }
}

export default App;
