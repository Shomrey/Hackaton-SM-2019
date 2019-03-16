import React from 'react';
import { Magnetometer, Accelerometer, } from 'expo';
import { StyleSheet, Text, TouchableOpacity, View, Animated, } from 'react-native';
import Svg,{Polyline,} from 'react-native-svg';

export default class MagnetometerSensor extends React.Component {
  state = {
    isFlat: false
  }

  constructor(props) {
    super(props);
    this._scaleX = new Animated.Value(0);
    this._scaleY = new Animated.Value(0);
    this._rotateValue = new Animated.Value(0);
    this._rotate = this._rotateValue.interpolate({
      inputRange: [0,360],
      outputRange: ['0deg', '360deg'],
      extrapolate: 'clamp'
    });
  }
  
  componentDidMount() {
    Magnetometer.setUpdateInterval(500);
    Accelerometer.setUpdateInterval(500);
    this._subscribe();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _subscribe = () => {
    this._subscriptions = [
      Magnetometer.addListener(result => {
        const ang = angle(result);
        Animated.spring(this._rotateValue,
        {
          toValue: ang,
          useNativeDriver:true
        }).start()
        //this._rotateValue.setValue(
        
        //angle(result)
        }),
      Accelerometer.addListener(result => {
        let flatness = result.z / Math.sqrt(result.x * result.x + result.y * result.y + result.z * result.z);
        Animated.spring(this._scaleY,
          {
            toValue: flatness,
            useNativeDriver:true
          }).start()
        this.setState({isFlat: flatness > 0.9999})
      })
    ];
  };

  _unsubscribe = () => {
    this._subscriptions && this._subscriptions.forEach(sub => sub.remove());
    this._subscriptions = [];
  };

  render() {
    let bgColor = this.state.isFlat ? "#378e88" : "#fff";
    let logoColor = this.state.isFlat ? "#fff" : "#000";
    return (
      <Animated.View style = {{backgroundColor: bgColor}}>
        <Animated.View style = {{transform: [{rotate: this._rotate}, {scaleY: this._scaleY}]}}>
          <Svg height="100%" width="100%" viewBox="0 0 1000 1000" rotation={180}>
            <Polyline fill={logoColor} points="500 0, 933 250, 933 750, 824.75 812.5, 824.75 437.5, 500 625, 175.25 437.5, 175.25 500, 500 687.5, 770.625  531.25, 770.625 843.75, 500 1000, 67 750, 67 625, 500 875, 662.375 781.25, 662.375 718.75, 500 812.5, 67 562.5, 67 250"/>
          </Svg>
        </Animated.View>
      </Animated.View>      
    );
  }
}


function angle(m) {
  let angle;
  if (m.y == 0 && m.x > 0) angle = 180;
  else if (m.y == 0 && m.x <= 0) angle = 0;
  else if (m.y > 0) angle = -Math.atan(m.x/m.y) * 180 / 3.14159;
  else angle = 180 - Math.atan(m.x/m.y) * 180 / 3.14159;
  return 360 - ((angle > 0 ? angle : 360 + angle) + 5.61);
} 