import React, { Component } from 'react';

import { Route, Switch, Redirect } from 'react-router-dom';

import firebase from 'firebase';
import { withStyles } from '@material-ui/core';
import uuid from 'uuid';

import BottomBar from '../components/BottomBar';
import TopBar from '../components/TopBar';
import { SymptomsRatingForm } from '../components/SymptomsRatingForm';
import { SymptomsExtraForm } from '../components/SymptomsExtraForm';

import { uploadImage } from '../utils/FirebaseHandler';


export default withStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  content: {
    flexGrow: 1,
    flexShrink: 0,
  },
  bottom: {
    flexGrow: 0,
    flexShrink: 0,
  },
  top: {
    flexGrow: 0,
    flexShrink: 0
  }
})(class SymptomsPage extends Component { 
  constructor() {
    super();
    this.state = {
      extras: {
        imgFiles: [],
        note: ''
      },
      ratings: {
        pain: 0,
        swelling: 0,
        itchiness: 0
      }
    }
  }

  onRatingPageNext = (data) => {
    this.setState({
      ratings: data
    });
    return this.props.history.push(`${this.props.match.url}/extras`);
  }

  onExtraPageNext = async (data) => {
    let imgUrl = null;
    // TODO: hur hur, should be more than 1 img ref
    if(data.imgFiles.length > 0) {
      const file = data.imgFiles[0];
      const imgRef = firebase.storage().ref().child(uuid.v4());
      await uploadImage(imgRef, file);  
      imgUrl = await imgRef.getDownloadURL();
    }

    const dataRef = firebase.database().ref('/painSpots/Jul');
    const painPointRef = await dataRef.push();

    await painPointRef.set({
      ratings: this.state.ratings,
      note: data.note,
      imgUrl
    });
    // TODO: Check if this is right
    return this.props.history.push('/new');
  }

  render() {
    return (
      <div className={this.props.classes.page}>
        <div className={this.props.classes.top}>
          <TopBar />
        </div>
        <div className={this.props.classes.content}>
          <Switch>
            <Route exact strict path={`${this.props.match.url}`} render={() => <Redirect to={`${this.props.match.url}/rate`}/>}/>
            <Route path={`${this.props.match.url}/rate`} render={() => (
              <SymptomsRatingForm onNext={this.onRatingPageNext}/>
            )}/>
            <Route path={`${this.props.match.url}/extras`} render={() =>(
              <SymptomsExtraForm onNext={this.onExtraPageNext}/>
            )}/>
          </Switch>
        </div>
        <div className={this.props.classes.bottom}>
          <BottomBar/>
        </div>
      </div>
    );
  }
});
