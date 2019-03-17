import React from 'react';
import { Magnetometer, Accelerometer } from 'expo';
import { View, Animated } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

export default class MagnetometerSensor extends React.Component {
  state = {
    isFlat: false,
    magnetometerData: {x: 1, y: 0, z: 0},
    accelerometerData: {x: 0, y: 0, z: 1},
  }

  constructor(props) {
    super(props);
    this._rotateZValue = new Animated.Value(0);
    this._rotateXValue = new Animated.Value(0);
    this._rotateYValue = new Animated.Value(0);
    this._rotateZ = this._rotateZValue.interpolate({
      inputRange: [0,360],
      outputRange: ['0deg', '360deg'],
    });
    this._rotateX = this._rotateXValue.interpolate({
      inputRange: [0,360],
      outputRange: ['0deg', '360deg'],
    });
    this._rotateY = this._rotateYValue.interpolate({
      inputRange: [0,360],
      outputRange: ['0deg', '360deg'],
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
        const ang = angle(this.state.accelerometerData, result);
        Animated.spring(this._rotateZValue,
        {
          toValue: ang,
          useNativeDriver:true
        }).start();
		this.setState({magnetometerData: result});
        }),
        Accelerometer.addListener(result => {
          let len = length(result);
          let flatness = result.z / len;
          const target1 = crossProduct({x: 1, y: 0, z: 0}, result);
        Animated.spring(this._rotateXValue,
        {
          toValue: anglet({x:1, y:0, z:0}, target1, {x: 0, y: 1, z: 0}),
          useNativeDriver:true
        }).start();
        const target2 = crossProduct(target1, result);
        Animated.spring(this._rotateYValue,
        {
          toValue: - anglet(target1, target2, {x: 1, y: 0, z: 0}),
          useNativeDriver:true
        }).start();
        this.setState({isFlat: flatness > 0.9999, accelerometerData: result});
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
      <View style = {{backgroundColor: bgColor}}>
        <Animated.View style = {{transform: [{rotateX: this._rotateX}, {rotateY: this._rotateY}, {rotate: this._rotateZ}]}}>
          <Svg height="100%" width="100%" viewBox="0 0 1000 1000" rotation={180}>
            <Polyline fill={logoColor} points="500 0, 933 250, 933 750, 824.75 812.5, 824.75 437.5, 500 625, 175.25 437.5, 175.25 500, 500 687.5, 770.625  531.25, 770.625 843.75, 500 1000, 67 750, 67 625, 500 875, 662.375 781.25, 662.375 718.75, 500 812.5, 67 562.5, 67 250"/>
          </Svg>
        </Animated.View>
      </View>
    );
  }
}

function dotProduct(a, b) {
  return a.x*b.x + a.y*b.y + a.z*b.z;
}

function crossProduct(a, b) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  };
}

function ang(a, b) {
  return 180 / 3.14159 * Math.acos(dotProduct(a, b) / (length(a) * length(b)));
}

function length({x, y, z}) {
    return Math.sqrt(x*x + y*y + z*z);
}

function anglet(axis, target, source) {
  if (ang(crossProduct(axis, target), source) > 90)
    return 360 - ang(source, target);
  else
    return ang(source, target);
}

function angle(a, m) {
  const target = crossProduct({x: 1, y: 0, z: 0}, a, {x: 0, y: 1, z: 0});
  const down = a;
  const mag = m;
  const left = crossProduct(down, mag);
  const front = crossProduct(left, down);
  if (ang(left, target) > 90)
    return 360 - ang(front, target);
  else
	return ang(front, target);
}
