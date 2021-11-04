//DOM Access Variables
const calcKeys = document.querySelector(".calc-keys");
const displayScreen = document.querySelector(".display-screen");

//Object to help keep track of values
const calculator = {
  displayValue: "0",
  firstValue: null,
  operator: null,
  waitForSecondValue: false,
};

//Updates value of element with the contents of 'displayValue'
function updateDisplay() {
  displayScreen.value = calculator.displayValue;
}

//Invokes above function upon opening page
updateDisplay();

//eventListener called when a calculator button is clicked
calcKeys.addEventListener("click", event => {
  const target = event.target;

  //If they click area of calculator that is not a button
  if (!target.matches("button")) {
    return;
  }

  //if operator button is clicked
  if (target.classList.contains("operator-btn")) {
    operatorHandler(target.value);
    updateDisplay();
    return;
  }

  //if decimal button is clicked
  if (target.classList.contains("decimal")) {
    inputDecimal(target.value);
    updateDisplay();
    return;
  }

  //if clear button is clicked
  if (target.classList.contains("all-clear")) {
    resetCalculator();
    updateDisplay();
    return;
  }

  //otherwise it would assume numbered button is clicked and invokes the below functions
  addDigit(target.value);
  updateDisplay();
});

//Function takes in the button value clicked as parameter
function addDigit(digit) {
  //Destructures calculator object value into variables
  const { displayValue, waitForSecondValue } = calculator;

  //If true, 'displayValue' is overwritten with the digit that was clicked
  if (waitForSecondValue === true) {
    calculator.displayValue = digit;
    calculator.waitForSecondValue = false;
  } else {
    //Overwrite 'displayValue' if the current value is 0 otherwise append to it
    calculator.displayValue =
      displayValue === "0" ? digit : displayValue + digit;
  }
}

//Takes operator button as parameter
function operatorHandler(nextOperator) {
  //Destructure properties in calculator object
  const { displayValue, firstValue, operator } = calculator;
  // `parseFloat` converts the string contents of `displayValue` to a floating-point number
  const inputValue = parseFloat(displayValue);

  /*Conditional checks if an operator already exists. If waitingFSO is true the 
    operator is replaced with a new operator*/
  if (operator && calculator.waitForSecondValue === true) {
    calculator.operator = nextOperator;
    return;
  }

  if (firstValue == null && !isNaN(inputValue)) {
    //Update firstValue property and value is placed into calculator object
    calculator.firstValue = inputValue;
  } else if (operator) {
    //If operator has been assigned, calculate function is invoked
    const result = calculate(firstValue, inputValue, operator);
    /*To solve the binary issue of 0.1 + 0.2, use toFixed to restrict digits
        after decimal to seven digits. Then ParseFloat will get rid of the 0's
        on display screen*/
    calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
    calculator.firstValue = result;
  }
  calculator.waitForSecondValue = true;
  calculator.operator = nextOperator;
}

/*Performs relevant calculators between 
    first and second value depending on operator inputted*/
function calculate(firstValue, secondValue, operator) {
  if (operator === "+") {
    return firstValue + secondValue;
  } else if (operator === "-") {
    return firstValue - secondValue;
  } else if (operator === "*") {
    return firstValue * secondValue;
  } else if (operator === "/") {
    return firstValue / secondValue;
  }
  return secondValue;
}

//if 'displayValue' does not contain decimal then it appends a decimal to value
function inputDecimal(decimal) {
  if (!calculator.displayValue.includes(".")) {
    calculator.displayValue += decimal;
  }
}

//Resets entire Calculator object back to its default state
function resetCalculator() {
  calculator.displayValue = "0";
  calculator.firstValue = null;
  calculator.operator = null;
  calculator.waitForSecondValue = false;
}
