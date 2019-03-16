import React from 'react';
import { Magnetometer, Accelerometer, Gyroscope } from 'expo';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default class MagnetometerSensor extends React.Component {
  state = {
    MagnetometerData: {},
    AccelerometerData: {},
    GyroscopeData: {},
  };

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
      {/*</View>
      <View style={styles.sensor}>*/}
      

      {/*View style={styles.buttonContainer}>
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
    </View>
    <View style={styles.sensor}>*/}
    

    {/*<View style={styles.buttonContainer}>
      <TouchableOpacity onPress={this._toggle} style={styles.button}>
        <Text>Toggle</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={this._slow} style={[styles.button, styles.middleButton]}>
        <Text>Slow</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={this._fast} style={styles.button}>
        <Text>Fast</Text>
      </TouchableOpacity>
    </View>*/}
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
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
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
