import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import {
  Animated,
  PanResponder,
  Easing, Image, TouchableWithoutFeedback, UIManager,
} from 'react-native'
import ReactNative from 'react-native'
import SelectedPhoto from './SelectedPhoto'

const SCALE_MULTIPLIER = 1
const RESTORE_ANIMATION_DURATION = 200

export default class Photo extends Component {
  static propTypes = {
    source: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
  }

  constructor (props) {
    super(props)
    this._gesturePosition = new Animated.ValueXY()
    this._scaleValue = new Animated.Value(1)
    this._selectedPhotoMeasurement = this.props.selectedPhotoMeasurement
    this._generatePanHandlers()
  }

  // componentWillReceiveProps (nextProps) {
  //   this._selectedPhotoMeasurement = nextProps.selectedPhotoMeasurement
  //   this._generatePanHandlers()
  // }

  measureNode = async (index) => {
    let _imageComponent = ReactNative.findNodeHandle(this['_imageComponent' + index])

    return new Promise((resolve) => {
      UIManager.measureInWindow(
        _imageComponent,
        (x, y, w, h) => {
          resolve({ x, y, w, h })
        },
      )
    })
  }

  pow2abs = (a, b) => {
    return Math.pow(Math.abs(a - b), 2)
  }

  getDistance = (touches) => {
    const [a, b] = touches

    if (a == null || b == null) {
      return 0
    }
    return Math.sqrt(
      this.pow2abs(a.pageX, b.pageX) + this.pow2abs(a.pageY, b.pageY),
    )
  }

  getScale = (currentDistance, initialDistance) => {
    return currentDistance / initialDistance * SCALE_MULTIPLIER
  }

  _generatePanHandlers () {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: this._startGesture,
      onPanResponderMove: this._onGestureMove,
      onPanResponderRelease: this._onGestureRelease,
    })
  }

  _startGesture = (event, gestureState) => {
    console.log('_startGesture')
    this._gesturePosition.setOffset({
      x: 0,
      y: this._selectedPhotoMeasurement.y,
    })

    this._gesturePosition.setValue({
      x: 0,
      y: 0,
    })
    this.setState({ isDragging: true })

    this._initialTouches = event.nativeEvent.touches
  }

  _onGestureMove = (event, gestureState) => {
    console.log('_onGestureMove')
    let { touches } = event.nativeEvent

    if (touches.length < 2) {
      this._onGestureRelease(event, gestureState)
      return
    }

    // for moving photo around
    let { dx, dy } = gestureState

    this._gesturePosition.x.setValue(dx)
    this._gesturePosition.y.setValue(dy)

    // for scaling photo
    let currentDistance = this.getDistance(touches)
    let initialDistance = this.getDistance(this._initialTouches)
    let newScale = this.getScale(currentDistance, initialDistance)
    console.log(newScale)
    this._scaleValue.setValue(newScale)
  }

  _onGestureRelease = (event, gestureState) => {
    console.log('_onGestureRelease')

    Animated.parallel([
      Animated.timing(this._gesturePosition.x, {
        toValue: 0,
        duration: RESTORE_ANIMATION_DURATION,
        easing: Easing.ease,
      }),
      Animated.timing(this._gesturePosition.y, {
        toValue: 0,
        duration: RESTORE_ANIMATION_DURATION,
        easing: Easing.ease,
      }),
      Animated.timing(this._scaleValue, {
        toValue: 1,
        duration: RESTORE_ANIMATION_DURATION,
        easing: Easing.ease,
      }),
    ]).start(() => {
      this._gesturePosition.setOffset({
        x: 0,
        y: this._selectedPhotoMeasurement.y // - this._scrollValue.y,
      })
      this.setState({ isDragging: false })
      this._initialTouches = []
    })
  }

  render () {
    const { source, index } = this.props



    return (
      <Fragment>
        <TouchableWithoutFeedback
          onPress={async () => {
            let measurement = await this.measureNode(index)
            console.log(measurement)
            this.props.selectedPhotoMeasurement = measurement
          }}
        >
          <Image
            ref={(node) => (this['_imageComponent' + index] = node)}
            style={{ width: 250, height: 200, marginBottom: 20 }}
            source={source}
          />
        </TouchableWithoutFeedback>
      </Fragment>
    )
  }
}

