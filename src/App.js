import {evaluate} from 'mathjs';
import React from 'react';
import './App.scss';
import { Button } from './components/Button';

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formula: '',
      output: '0',
      lastAction: ''
    };

    this.clickButtonHandler = this.clickButtonHandler.bind(this);
    this.keyDownHandler = this.keyDownHandler.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.keyDownHandler);
  }
  
  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyDownHandler);
  }

  isMathOperator(action) {
    return ['+', '-', '*', '/'].indexOf(action) > -1;
  }

  isLastActionAMathOperator() {
    return this.isMathOperator(this.state.lastAction);
  }

  isLastActionTheEqualsSign() {
    return (this.state.lastAction === '=');
  }

  evaluateCurrentValueAndTakeAction(currentValueAsString) {
    const currentValueAsNumber = Number.parseInt(currentValueAsString);
    let output = this.state.output;
    let formula = this.state.formula;

    if (isNaN(currentValueAsNumber)) {
      switch (currentValueAsString) {
        case 'AC':
          output = '0';
          formula = '';
          break;
        case '+':
        case '-':
        case '*':
        case '/':
          output = currentValueAsString;
          if(this.isLastActionTheEqualsSign()) {
            formula = this.state.output.concat(currentValueAsString);
          }
          else {
            let formulaLastCharMathOperator = formula[formula.length - 1];
            if (
              (currentValueAsString === '-' && formulaLastCharMathOperator === '-') ||
              (currentValueAsString !== '-' && this.isMathOperator(formulaLastCharMathOperator))
            ) {
              while (this.isMathOperator(formulaLastCharMathOperator)) {
                formula = formula.substr(0, formula.length - 1);
                formulaLastCharMathOperator = formula[formula.length - 1];
              }
            }

            formula = formula.concat(currentValueAsString);
          }
          break;
        case '=':
          if (!this.state.formula.match(new RegExp('=','g'))) {
            try {
              output = evaluate(this.state.formula).toString();
              formula = formula.concat('=').concat(output);  
            }
            catch(error) {
              console.error(error);
              formula = 'Malformed expression';
            }
          }
          break;
        case '.':
          if(!this.state.output.includes('.') && this.isLastActionTheEqualsSign()) {
            output = this.state.output.concat(currentValueAsString);
            formula = this.state.output.concat(currentValueAsString);
          }
          else if (!this.state.output.includes('.')) {
            output = this.state.output.concat(currentValueAsString);
            formula = this.state.formula.concat(currentValueAsString);
          }
          break;
        default:
          break;
      }
    }
    else {
      if ((this.state.output === '0') || this.isLastActionAMathOperator()) {
        output = currentValueAsString;
        formula = this.state.formula.concat(currentValueAsString);
      }
      else if (this.isLastActionTheEqualsSign()) {
        output = currentValueAsString;
        formula = currentValueAsString;
      }
      else {
        output = this.state.output.concat(currentValueAsString);
        formula = this.state.formula.concat(currentValueAsString);
      }
    }

    this.setState({
      output,
      formula,
      lastAction: currentValueAsString
    });
  }

  mapLabelsToMathOperators(currentValueAsString) {
    let labelOperatorsMap = new Map();
    labelOperatorsMap.set('+', '+');
    labelOperatorsMap.set('-', '-');
    labelOperatorsMap.set('x', '*');
    labelOperatorsMap.set('/', '/');

    return labelOperatorsMap.get(currentValueAsString) || currentValueAsString;
  }

  mapKeyCodesToMathOperators(currentValueAsString) {
    let labelOperatorsMap = new Map();
    labelOperatorsMap.set('Enter', '=');
    labelOperatorsMap.set('Delete', 'AC');
    labelOperatorsMap.set('Escape', 'AC');

    return labelOperatorsMap.get(currentValueAsString) || currentValueAsString;
  }

  clickButtonHandler(event) {
    const currentValueAsString = this.mapLabelsToMathOperators(event.target.innerHTML);
    this.evaluateCurrentValueAndTakeAction(currentValueAsString);
  }

  keyDownHandler(event) {
    const currentValueAsString = this.mapKeyCodesToMathOperators(event.key);
    this.evaluateCurrentValueAndTakeAction(currentValueAsString);
  };

  render() {
    return (
      <div className="App">
        <div className="calculator" >
          <div className="formula-screen" >{this.state.formula}</div>
          <div className="output-screen" id="display" >{this.state.output}</div>
          <div className="main-buttons-container" > 
            <Button className="button" label="AC" bgColor="#AC393A" width="122px" onClick={this.clickButtonHandler} id="clear" ></Button>
            <Button className="button" label="/" bgColor="#4D4D4D" onClick={this.clickButtonHandler} id="divide" ></Button>
            <Button className="button" label="x" bgColor="#4D4D4D" onClick={this.clickButtonHandler} id="multiply" ></Button>
            <Button className="button" label="7" bgColor="#999999" onClick={this.clickButtonHandler} id="seven" ></Button>
            <Button className="button" label="8" bgColor="#999999" onClick={this.clickButtonHandler} id="eight" ></Button>
            <Button className="button" label="9" bgColor="#999999" onClick={this.clickButtonHandler} id="nine" ></Button>
            <Button className="button" label="-" bgColor="#4D4D4D" onClick={this.clickButtonHandler} id="subtract" ></Button>
            <Button className="button" label="4" bgColor="#999999" onClick={this.clickButtonHandler} id="four" ></Button>
            <Button className="button" label="5" bgColor="#999999" onClick={this.clickButtonHandler} id="five" ></Button>
            <Button className="button" label="6" bgColor="#999999" onClick={this.clickButtonHandler} id="six" ></Button>
            <Button className="button" label="+" bgColor="#4D4D4D" onClick={this.clickButtonHandler} id="add" ></Button>
            <div className="secondary-buttons-container" >
              <div className="anomaly-buttons-wrapper" >
                <Button className="button" label="1" bgColor="#999999" onClick={this.clickButtonHandler} id="one" ></Button>
                <Button className="button" label="2" bgColor="#999999" onClick={this.clickButtonHandler} id="two" ></Button>
                <Button className="button" label="3" bgColor="#999999" onClick={this.clickButtonHandler} id="three" ></Button>
                <Button className="button" label="0" bgColor="#999999" width="122px" onClick={this.clickButtonHandler} id="zero" ></Button>
                <Button className="button" label="." bgColor="#999999" onClick={this.clickButtonHandler} id="decimal" ></Button>
              </div>
              <div>
                <Button className="button" label="=" bgColor="darkorange" height="120px" onClick={this.clickButtonHandler} id="equals" ></Button>
              </div>
            </div>
          </div>
        </div>
     </div>
    );
  }
}