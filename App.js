import React from 'react';
import { Magnetometer, Accelerometer, Gyroscope } from 'expo';
import { StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';



export default class MagnetometerSensor extends React.Component {
  state = {
    MagnetometerData: {},
    AccelerometerData: {},
    GyroscopeData: {},
    barWidth: 300,
    barHeight: 50, 
    flexWidth: 30,
    animatedValue: new Animated.Value(0),
  };

  constructor(props) {
    super(props);
    this._animatedValue = new Animated.Value(0);

    this._translateX = this._animatedValue.interpolate({
      inputRange: [-1, 1],
      outputRange: [15, 269],
      extrapolate: 'clamp'
    });
  }

  
  componentDidMount() {
    this._toggle();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe();
    } else {
      this._subscribe();
    }
  };

  _slow = () => {
    Magnetometer.setUpdateInterval(1000);
    Gyroscope.setUpdateInterval(1000);
    Accelerometer.setUpdateInterval(1000);
  };

  _fast = () => {
    Magnetometer.setUpdateInterval(16);
    Gyroscope.setUpdateInterval(16);
    Accelerometer.setUpdateInterval(16);
  };

  _subscribe = () => {
    this._subscription = Magnetometer.addListener(result => {
      this.setState({ MagnetometerData: result });
    });
    this._subscription = Accelerometer.addListener(result => {
      this.setState({ AccelerometerData: result });
      this._animatedValue.setValue(result.z)
    });
    this._subscription = Gyroscope.addListener(result => {
      this.setState({ GyroscopeData: result });
    });
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  render() {
    let m = this.state.MagnetometerData;
    let a = this.state.AccelerometerData; 
    let g = this.state.GyroscopeData;


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

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this._toggle} style={styles.button}>
            <Text>Toggle</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._slow} style={[styles.button, styles.middleButton]}>
            <Text>Slow</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._fast} style={styles.button}>
            <Text>Fast</Text>
          </TouchableOpacity>
        </View>
        <View style = {styles.container}>
            <View style = {[styles.bar, {width: this.state.barWidth, height: this.state.barHeight}]}>
               <Animated.View style = {[styles.flex, {width: this.state.flexWidth, height: this.state.barHeight, transform: [{translateX: this._translateX}, {rotateX: '40deg'}]}]}/>
            </View> 
        </View>
  </View>
    );
  }
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
