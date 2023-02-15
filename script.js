window.addEventListener('load', onLoad);

function onLoad() {
    setButtons();
}

const currentCalculation = {
    num1: '',
    num2: '',
    operator: '',
    previousButton: '',
}

function setButtons() {
    let container = document.querySelector("#container");
    let buttons = [...container.querySelectorAll("button:not(#githubButton):not(#clearButton)")];
    let clearButton = container.querySelector("#clearButton");
    let githubButton = container.querySelector("#githubButton");

    buttons.map((button) => button.addEventListener("click", onButtonClick));
    githubButton.addEventListener("click", navigateToGithub);
    clearButton.addEventListener("click", clearCalculation)
}

function onButtonClick(ev) {
    let buttonValue = ev.target.value;
    let isNumber = !isNaN(Number(buttonValue));
    let isOperateSuccessful = true;
    let isOperatorPickedAlready = currentCalculation.operator;
    let isOperatorMisclicked = buttonValue === currentCalculation.previousButton;
    let isEqualClicked = buttonValue === '=';

    if (isNumber && !isOperatorPickedAlready) {
        updateNum(buttonValue, "num1");
        return;
    }

    if (isNumber && isOperatorPickedAlready) {
        updateNum(buttonValue, "num2");
        return;
    }

    let isValueDotOrPlusMinus = buttonValue === "+/-" || buttonValue === ".";

    if (isValueDotOrPlusMinus) {
        otherOperate(buttonValue);
        return;
    }    

    if (isOperatorPickedAlready && !isOperatorMisclicked) {
        isOperateSuccessful = operate();
    }

    if (isOperateSuccessful && !isEqualClicked) {
        currentCalculation.operator = buttonValue;
    }

    currentCalculation.previousButton = buttonValue;
}

function add(num1, num2) {
    return num1 + num2;
}

function subtract(num1, num2) {
    return num1 - num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function divide(num1, num2) {
    return num1 / num2;
}

function operate() {
    let num1 = Number(currentCalculation.num1);
    let num2 = Number(currentCalculation.num2);    
    let result = "Invalid op";

    switch (currentCalculation.operator) {
        case "+":
            result = add(num1, num2);
            break;
        case "-":
            result = subtract(num1, num2);
            break;
        case "/":
            if (num2 === 0) {
                result = "Can't / by 0";
                break;
            }
            result = divide(num1, num2);
            break;
        case "*":
            result = multiply(num1, num2);
            break;
        default:
            break;
    }
    
    let isValidNumber = !isNaN(result);

    clearCalculation();

    if (!isValidNumber) {            
        updateDisplay(result);
        return false;
    }

    updateNum(result, "num1");
    return true;
}

function otherOperate(symbol) {    
    let isOperatorPickedAlready = currentCalculation.operator;
    let numProperty = !isOperatorPickedAlready ? "num1" : "num2";
    let isValidCondition = false;
    let newNum = currentCalculation[numProperty];
    currentCalculation.previousButton = symbol;

    switch (symbol) {
        case "+/-":
            // is current num negative
            isValidCondition = currentCalculation[numProperty].includes("-");
            newNum = `-${currentCalculation[numProperty]}`;

            if (isValidCondition) {
                newNum = currentCalculation[numProperty].replace('-', '');
            }
            break;
        case ".":
            // is num already a decimal
            isValidCondition = currentCalculation[numProperty].includes(".");
            newNum = `${currentCalculation[numProperty]}.`;

            if (isValidCondition) {
                return;
            }            
            break;
        default:
            return;
    }

    currentCalculation[numProperty] = '';            
    updateNum(newNum, numProperty);   
}

function updateNum(num, numProperty = "num1") {
    currentCalculation[numProperty] += num;
    currentCalculation.previousButton = num;
    updateDisplay(currentCalculation[numProperty]);
}

function updateDisplay(num = '') {
    let display = document.querySelector("#display");
    display.innerText = num;
}

function clearCalculation() {
    currentCalculation.num1 = '';
    currentCalculation.num2 = '';
    currentCalculation.operator = '';
    updateDisplay();
}

function navigateToGithub() {
    window.open("https://github.com/stchao/Calculator", "_blank");
}