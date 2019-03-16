import React from 'react';
import { Magnetometer, Accelerometer, Gyroscope } from 'expo';
import { StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import Svg,{Polyline,} from 'react-native-svg';

export default class MagnetometerSensor extends React.Component {
  state = {
    magnetometerData: { x: 0, y: 0, z: 0 },
    accelerometerData: { x: 0, y: 0, z: 0 },
    gyroscopeData: { x: 0, y: 0, z: 0 },
    barWidth: 300,
    barHeight: 50, 
    flexWidth: 30,
  };

  constructor(props) {
    super(props);
    this._scaleValue = new Animated.Value(0);
    this._rotateValue = new Animated.Value(0);
    //this._translateX = this._animatedValue.interpolate({
      //inputRange: [-1, 1],
      //outputRange: [15, 269],
      //extrapolate: 'clamp'
    //});

    this._rotate = this._rotateValue.interpolate({
      inputRange: [0,360],
      outputRange: ['0deg', '360deg'],
      extrapolate: 'clamp'
    });

    /*this._scaleX = this._scaleValue.interpolate({
      inputRange: [0,1],
      outputTange: [0,1],
      extrapolate: 'clamp'
    })*/
  }

  
  componentDidMount() {
    Magnetometer.setUpdateInterval(50);
    Gyroscope.setUpdateInterval(50);
    Accelerometer.setUpdateInterval(50);
    this._subscribe();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _subscribe = () => {
    this._subscriptions = [
      Magnetometer.addListener(result => {
        this.setState({ magnetometerData: result })
        this._rotateValue.setValue(angle(result));
      }),
      Accelerometer.addListener(
        result => {this.setState({ accelerometerData: result });
      }),
      Gyroscope.addListener(result => this.setState({ gyroscopeData: result }))
    ];
  };

  _unsubscribe = () => {
    this._subscriptions && this._subscriptions.forEach(sub => sub.remove());
    this._subscriptions = [];
  };

  render() {
    let m = this.state.magnetometerData;
    let a = this.state.accelerometerData; 
    let g = this.state.gyroscopeData;

    return (
      <View style={styles.sensor}>
        <Text>Magnetometer:</Text>
        <Text>
          xM: {round(m.x)} yM: {round(m.y)} zM: {round(m.z)}
        </Text>
        <Text>Gyroscope:</Text>
        <Text>
          xG: {round(g.x)} yG: {round(g.y)} zG: {round(g.z)}
        </Text>
        <Text>Accelerometer:</Text>
        <Text>
          xA: {round(a.x)} yA: {round(a.y)} zA: {round(a.z)}
        </Text>

        <Text>Angle: </Text>
        <Text>
          { round(angle(m)) }
        </Text>

        <Animated.View style = {[{transform: [{rotateZ: this._rotate}/*, {scaleX: this._scaleX}*/]}]}>
          <Svg height="100%" width="100%" viewBox="0 0 1000 1000">
            <Polyline fill="black" points="500 0, 933 250, 933 750, 824.75 812.5, 824.75 437.5, 500 625, 175.25 437.5, 175.25 500, 500 687.5, 770.625  531.25, 770.625 843.75, 500 1000, 67 750, 67 625, 500 875, 662.375 781.25, 662.375 718.75, 500 812.5, 67 562.5, 67 250"/>
          </Svg>
        </Animated.View>
      </View>
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

function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  bar: {
    backgroundColor: 'green',
  },
  flex: {
    position: 'absolute',
    backgroundColor: 'red',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  sensor: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
});
