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
    let isOperatorPickedAlready = currentCalculation.operator;    

    if (isNumber && !isOperatorPickedAlready) {
        currentCalculation.num1 += buttonValue;
        currentCalculation.previousButton = buttonValue;
        updateDisplay(currentCalculation.num1)
        return;
    }

    if (isNumber && isOperatorPickedAlready) {
        currentCalculation.num2 += buttonValue;
        currentCalculation.previousButton = buttonValue;
        updateDisplay(currentCalculation.num2)
        return;
    }

    if (isOperatorPickedAlready && buttonValue !== currentCalculation.previousButton) {
        let result = operate();
        let isValidNumber = !isNaN(result);
        clearCalculation();

        if (!isValidNumber) {            
            updateDisplay(result);
            return;
        }

        currentCalculation.num1 = result;
        updateDisplay(result);
    }

    currentCalculation.operator = buttonValue;
    currentCalculation.previousButton = buttonValue;
}

function updateDisplay(num = '') {
    let display = document.querySelector("#display");
    display.innerText = num;
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

    switch(currentCalculation.operator) {
        case "+":
            return add(num1, num2);
        case "-":
            return subtract(num1, num2);
        case "/":
            if (num2 === 0) {
                return "Can't / by 0";
            }
            return divide(num1, num2);
        case "*":
            return multiply(num1, num2);

    }
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