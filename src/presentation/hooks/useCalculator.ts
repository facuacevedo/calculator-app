import {useEffect, useRef, useState} from 'react';

enum Operator {
  add = '+',
  subtract = '-',
  multiply = 'x',
  divide = '÷',
}

export const useCalculator = () => {
  const [formula, setFormula] = useState('');

  const [number, setNumber] = useState('0');
  const [prevNumber, setPrevNumber] = useState(' ');

  const lastOperation = useRef<Operator>();

  useEffect(() => {
    if (lastOperation.current) {
      const firstFormulaPart = formula.split(' ').at(0);
      setFormula(`${firstFormulaPart} ${lastOperation.current} ${number}`);
    } else {
      setFormula(number);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [number]);

  useEffect(() => {
    const subResult = calculateSubResult();
    if (lastOperation.current !== undefined) {
      if (subResult === 0) {
        return setPrevNumber('0');
      } else {
        return setPrevNumber(`${subResult}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formula]);

  const toggleSign = () => {
    if (number.includes('-')) {
      return setNumber(number.replace('-', ''));
    }
    return setNumber('-' + number);
  };

  const deleteOperation = () => {
    let currentSign = '';
    let temporalNumber = number;

    if (number.includes('-')) {
      currentSign = '-';
      temporalNumber = number.substring(1);
    }

    if (temporalNumber.length > 1) {
      return setNumber(currentSign + temporalNumber.slice(0, -1));
    }

    setNumber('0');
  };

  const clean = () => {
    if (number === '0' && prevNumber === ' ') {
      return;
    } else {
      setNumber('0');
      setPrevNumber(' ');
      lastOperation.current = undefined;
      setFormula('');
    }
  };

  const buildNumber = (numberString: string) => {
    if (number.includes('.') && numberString === '.') return;

    if (number.startsWith('0') || number.startsWith('-0')) {
      if (numberString === '.') {
        return setNumber(number + numberString);
      }
      if (numberString === '0' && number.includes('.')) {
        return setNumber(number + numberString);
      }

      if (numberString === '0' && !number.includes('.')) {
        return;
      }

      if (numberString !== '0' && !number.includes('.')) {
        if (number.startsWith('-0')) {
          return setNumber('-' + numberString);
        } else {
          return setNumber(numberString);
        }
      }

      return setNumber(number + numberString);
    }

    setNumber(number + numberString);
  };

  const setLastNumber = () => {
    calculateResult();
    if (number.endsWith('.')) {
      setPrevNumber(number.slice(0, -1));
    } else {
      setPrevNumber(number);
    }

    setNumber('0');
  };

  const divideOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.divide;
  };

  const multiplyOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.multiply;
  };

  const subtractOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.subtract;
  };

  const addOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.add;
  };

  const calculateResult = () => {
    const result = calculateSubResult();
    setFormula(`${result}`);

    lastOperation.current = undefined;
    setPrevNumber(' ');
  };

  const calculateSubResult = (): number => {
    const [firstValue, operation, secondValue] = formula.split(' ');

    const actualNumber = Number(firstValue);
    const previousNumber = Number(secondValue);

    if (isNaN(previousNumber)) {
      return actualNumber;
    }

    switch (operation) {
      case Operator.add:
        return actualNumber + previousNumber;
      case Operator.subtract:
        return actualNumber - previousNumber;
      case Operator.multiply:
        return actualNumber * previousNumber;
      case Operator.divide:
        return actualNumber / previousNumber;
      default:
        throw new Error('Operation not implemented');
    }
  };

  return {
    number,
    prevNumber,
    formula,

    buildNumber,
    toggleSign,
    clean,
    deleteOperation,

    divideOperation,
    multiplyOperation,
    subtractOperation,
    addOperation,
    calculateResult,
  };
};
