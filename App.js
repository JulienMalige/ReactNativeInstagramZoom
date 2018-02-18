// https://medium.com/@audytanudjaja/react-native-ui-challenge-building-instagram-zoom-draggable-photo-9127413b1d29
// https://github.com/AudyOdi/react-native-instagram-photo/blob/master/src/Photo.js
// https://github.com/facebook/react-native/blob/master/ReactAndroid/src/main/java/com/facebook/react/uimanager/UIManagerModule.java

import React, { Component } from 'react';
import ReactNative, {
  FlatList, Image,
  StyleSheet, TouchableWithoutFeedback,
  UIManager,
  View,
  Animated,
  PanResponder
} from 'react-native';
import SelectedPhoto from "./SelectedPhoto";

let photos = [
  'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F27714985%2F33790035043%2F1%2Foriginal.jpg?w=1000&rect=295%2C0%2C3214%2C1607&s=fb087ad58b8596660f243dc4523acbca',
  'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F33376779%2F119397753453%2F1%2Foriginal.jpg?w=1000&rect=0%2C57%2C7220%2C3610&s=c439fda7b39fc1d98a23f5cf1b4dfd8e',
  'https://mm.creativelive.com/fit/https%3A%2F%2Fagc.creativelive.com%2Fagc%2Fcourses%2F5222-1.jpg/1200',
  'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F27714985%2F33790035043%2F1%2Foriginal.jpg?w=1000&rect=295%2C0%2C3214%2C1607&s=fb087ad58b8596660f243dc4523acbca',
  'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F33376779%2F119397753453%2F1%2Foriginal.jpg?w=1000&rect=0%2C57%2C7220%2C3610&s=c439fda7b39fc1d98a23f5cf1b4dfd8e',
  'https://mm.creativelive.com/fit/https%3A%2F%2Fagc.creativelive.com%2Fagc%2Fcourses%2F5222-1.jpg/1200',
  'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F27714985%2F33790035043%2F1%2Foriginal.jpg?w=1000&rect=295%2C0%2C3214%2C1607&s=fb087ad58b8596660f243dc4523acbca',
  'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F33376779%2F119397753453%2F1%2Foriginal.jpg?w=1000&rect=0%2C57%2C7220%2C3610&s=c439fda7b39fc1d98a23f5cf1b4dfd8e',
  'https://mm.creativelive.com/fit/https%3A%2F%2Fagc.creativelive.com%2Fagc%2Fcourses%2F5222-1.jpg/1200'
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5FCFF',
    paddingHorizontal: 50,
    paddingVertical: 50
  }
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPhotoMeasurement: null,
      isDragging: null
    };
  }

  measureNode = async (index) => {
    let _imageComponent = ReactNative.findNodeHandle(this['_imageComponent' + index]);

    return new Promise((resolve) => {
      UIManager.measureInWindow(
        _imageComponent,
        (x, y, w, h) => {
          resolve({ x, y, w, h });
        }
      );
    });
  };

  _keyExtractor = (item, index) => index;

  _renderItem = ({ item, index }) => (
    <TouchableWithoutFeedback
      onPress={async (event) => {
        console.log(event);
        let measurement = await this.measureNode(index);
        console.log(measurement);
        this.setState({ selectedPhotoMeasurement: measurement });
      }}
    >
      <Image
        ref={(node) => (this['_imageComponent' + index] = node)}
        style={{ width: 250, height: 200, marginBottom: 20 }}
        source={{ uri: item }}
      />
    </TouchableWithoutFeedback>
  );

  render() {
    const { selectedPhotoMeasurement } = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          data={photos}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
        {selectedPhotoMeasurement &&
        <SelectedPhoto selectedPhotoMeasurement={selectedPhotoMeasurement}/>
        }
      </View>
    );
  }
}
