import React from 'react';
import styled from 'styled-components'
import Loadable from 'react-loadable';
import firebase from 'firebase';

//State

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {NotePreview_Show, NotePreview_Set} from '../../state/actions/index';

const ItemOnlyText = Loadable({
  loader: () => import ('../Item_OnlyText.js'),
  loading: () => null
});
const ItemOnlyImage = Loadable({
  loader: () => import ('../Item_OnlyImage.js'),
  loading: () => null
});
const ItemTextImage = Loadable({
  loader: () => import ('../Item_TextImage.js'),
  loading: () => null
});

//Set global state to prop
function mapStateToProps(state) {
  return {items: state.NewNote_Items, id: state.PlaybackSelection_ID, audioControl: state.AudioControl}
}
//define actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    NotePreview_Show,
    NotePreview_Set
  }, dispatch)
}
class RecItemView extends React.Component {

  //initial state
  constructor(props) {
    super(props)
    this.state = {
      items: 'initial',
      list: []
    }
  }

  //Methods
  componentWillMount() {
    this.getItems();
  }
  showPreview = (e) => {
    // console.log(e.currentTarget.dataset);
    this.props.NotePreview_Show();
    let data = {
      time: e.currentTarget.dataset.time,
      title: e.currentTarget.dataset.title,
      desc: e.currentTarget.dataset.desc,
      image: e.currentTarget.dataset.image
    }
    // console.log(data);
    this.props.NotePreview_Set(data);
  }
  getItems = () => {

    let list = {},
      array = [],
      userId = firebase.auth().currentUser.uid;

    firebase.database().ref('/users/' + userId + '/notes').orderByChild('masterNote_id').equalTo(this.props.id).once('value').then((snap) => {
    // firebase.database().ref('/users/' + userId + '/masterNotes/' + this.props.id).orderByValue().once('value').then((snap) => {
      let snapValue = snap.val();
      // console.log(snapValue);

      for (var prop in snapValue) {
        // console.log(snapValue[prop]);
        list.desc = snapValue[prop].comment;
        list.time = snapValue[prop].time;
        list.imageUrl = snapValue[prop].imageUrl;
        list.image = snapValue[prop].image || '';
        list.name = snapValue[prop].name;
        list.title = snapValue[prop].title;
        list.timeSeconds = snapValue[prop].timeSeconds;

        // console.log(list);
        array.push(list);
        list = {};
      }
      this.setState({list: array});

    });
  }

  setTime = (e) => {
    let audioControl = this.props.audioControl;
    audioControl.currentTime = e
  }
  render() {
    //Properties
    let list = this.state.list.map((item, i) => {
      // console.log(item);
      if (item.desc && item.imageUrl !== 'none') {

        list = <Item key={i}>
          <span data-time={item.time} data-title={item.title} data-image={item.imageUrl} data-desc={item.desc} onClick={this.showPreview}>
            <ItemTextImage time={item.time} title={item.title} desc={item.desc} image={item.imageUrl}/>
          </span>
          <TimeCon onClick={() => (this.setTime(item.timeSeconds))}></TimeCon>
        </Item>;

      } else if (item.desc === '') {

        list = <Item key={i}>
          <span data-time={item.time} data-title={item.title} data-image={item.imageUrl} onClick={this.showPreview}>
            <ItemOnlyImage time={item.time} title={item.title} image={item.imageUrl}/>
          </span>
          <TimeCon onClick={() => (this.setTime(item.timeSeconds))}></TimeCon>
        </Item>;

      } else if (item.imageUrl === 'none') {

        list = <Item key={i}>
          <span data-time={item.time} data-title={item.title} data-desc={item.desc} onClick={this.showPreview}>
            <ItemOnlyText time={item.time} title={item.title} desc={item.desc}/>
          </span>
          <TimeCon onClick={() => (this.setTime(item.timeSeconds))}></TimeCon>
        </Item>;

      }
      return list

    });
    //Template
    return (
      <Wrapper id="ItemViewCon">
        {list}
      </Wrapper>
    );
  }

}

//Style
const Wrapper = styled.div `
display: grid;
grid-row-gap: 10px;
`;
const Item = styled.span `
position: relative;

 `;
const TimeCon = styled.div `
width: 70px;
height: 100%;
position: absolute;
z-index: 2;
bottom: 0;
cursor: pointer;
 `;
export default connect(mapStateToProps, mapDispatchToProps)(RecItemView);
