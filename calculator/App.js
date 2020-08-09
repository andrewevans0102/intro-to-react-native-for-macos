/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';

import CalcButton from './components/CalcButton';

const operators = {
  clearEntry: 'CE',
  clear: 'C',
  backspace: '⌫',
  decimal: '.',
  sign: '±',
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
  equals: '=',
};

let calc = {
  stackValue: NaN,
  pendingOperator: '',
  decimalPressed: false,
  showingPreviousResult: false,
};

const App: () => React$Node = () => {
  const [displayText, setDisplayText] = useState('0');

  const buttonPress = (btn) => {
    let text = displayText;

    if (btn === operators.clearEntry) {
      // Clear entry
      clearEntry();
    } else if (btn === operators.clear) {
      // Clear
      calc.stackValue = NaN;
      calc.pendingOperator = '';
      clearEntry();
    } else if (btn === operators.backspace) {
      // Backspace
      if (calc.decimalPressed) {
        calc.decimalPressed = false;
      } else {
        if (isFinite(Number(text))) {
          text = text.substring(0, text.length - 1);

          if (text.length === 0) {
            text = '0';
          } else if (text[text.length - 1] === operators.decimal) {
            text = text.substring(0, text.length - 1);
          }

          setDisplayText(text);
        }
      }
    } else if (btn === operators.decimal) {
      // Decimal
      if (isFinite(Number(text))) {
        if (!calc.decimalPressed && text.indexOf(operators.decimal) === -1) {
          calc.decimalPressed = true;
        }
      }
    } else if (btn === operators.sign) {
      // Sign change
      if (isFinite(Number(text))) {
        let num = Number(text);
        num *= -1.0;
        setDisplayText(num.toString());
      }
    } else if (
      btn === operators.add ||
      btn === operators.subtract ||
      btn === operators.multiply ||
      btn === operators.divide
    ) {
      // Add, Subrtract, Multiply, or Divide
      if (isFinite(Number(text))) {
        computeAndUpdate(btn);
        setDisplayText(calc.stackValue);
      }
    } else if (btn === operators.equals) {
      // Equals
      if (isFinite(Number(text))) {
        computeAndUpdate(btn);
        setDisplayText(calc.stackValue);
        calc.stackValue = NaN;
      }
    } else if (!isNaN(Number(btn))) {
      // Number
      if (isFinite(Number(text))) {
        if (calc.showingPreviousResult) {
          text = '0';
          calc.showingPreviousResult = false;
        }

        if (calc.decimalPressed) {
          text += '.';
          calc.decimalPressed = false;
        }

        if (text === '0') {
          text = '';
        }

        text += btn;
        setDisplayText(text);
      }
    } else {
      alert('error occured');
    }
  };

  const clearEntry = () => {
    calc.decimalPressed = false;
    calc.showingPreviousResult = false;
    setDisplayText('0');
  };

  const computeAndUpdate = (nextOperator) => {
    if (!isNaN(calc.stackValue)) {
      // There's something on the stack, let's compute
      let o1 = calc.stackValue;
      let o2 = Number(displayText);

      if (calc.pendingOperator === operators.add) {
        o1 = o1 + o2;
      } else if (calc.pendingOperator === operators.subtract) {
        o1 = o1 - o2;
      } else if (calc.pendingOperator === operators.multiply) {
        o1 = o1 * o2;
      } else if (calc.pendingOperator === operators.divide) {
        o1 = o1 / o2;
      }

      calc.stackValue = o1;
    } else {
      let num = Number(displayText);
      calc.stackValue = num;
    }
    calc.pendingOperator = nextOperator;
    calc.showingPreviousResult = true;
  };

  return (
    <View style={styles.container}>
      <View style={styles.textRow}>
        <Text style={styles.text}>{displayText}</Text>
      </View>
      <View style={styles.buttonRow}>
        <CalcButton
          name={operators.clearEntry}
          onPress={(n) => buttonPress(n)}
        />
        <CalcButton name={operators.clear} onPress={(n) => buttonPress(n)} />
        <CalcButton
          name={operators.backspace}
          onPress={(n) => buttonPress(n)}
        />
        <CalcButton name={operators.divide} onPress={(n) => buttonPress(n)} />
      </View>
      <View style={styles.buttonRow}>
        <CalcButton name="7" onPress={(n) => buttonPress(n)} />
        <CalcButton name="8" onPress={(n) => buttonPress(n)} />
        <CalcButton name="9" onPress={(n) => buttonPress(n)} />
        <CalcButton name={operators.multiply} onPress={(n) => buttonPress(n)} />
      </View>
      <View style={styles.buttonRow}>
        <CalcButton name="4" onPress={(n) => buttonPress(n)} />
        <CalcButton name="5" onPress={(n) => buttonPress(n)} />
        <CalcButton name="6" onPress={(n) => buttonPress(n)} />
        <CalcButton name={operators.subtract} onPress={(n) => buttonPress(n)} />
      </View>
      <View style={styles.buttonRow}>
        <CalcButton name="1" onPress={(n) => buttonPress(n)} />
        <CalcButton name="2" onPress={(n) => buttonPress(n)} />
        <CalcButton name="3" onPress={(n) => buttonPress(n)} />
        <CalcButton name={operators.add} onPress={(n) => buttonPress(n)} />
      </View>
      <View style={styles.buttonRow}>
        <CalcButton name={operators.sign} onPress={(n) => buttonPress(n)} />
        <CalcButton name="0" onPress={(n) => buttonPress(n)} />
        <CalcButton name={operators.decimal} onPress={(n) => buttonPress(n)} />
        <CalcButton name={operators.equals} onPress={(n) => buttonPress(n)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dddddd',
  },
  textRow: {
    padding: 5,
    alignItems: 'flex-end',
  },
  text: {
    padding: 5,
    fontSize: 36,
  },
  buttonRow: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default App;
