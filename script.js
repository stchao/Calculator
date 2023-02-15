window.addEventListener('load', onLoad);

const storedValues = {
    num1: '',
    num2: '',
    operator: '',
    operatorButtonName: '',
}

function onLoad() {
    setButtons();
}

function setButtons() {
    let container = document.querySelector("#container");
    let buttons = [...container.querySelectorAll("button:not(#githubButton):not(#clearButton)")];
    let clearButton = container.querySelector("#clearButton");
    let githubButton = container.querySelector("#githubButton");

    window.addEventListener("keydown", onKeyPress);
    buttons.map((button) => button.addEventListener("click", onButtonClick));
    githubButton.addEventListener("click", navigateToGithub);
    clearButton.addEventListener("click", clearCalculation)
}

function onKeyPress(ev) {
    switch (ev.key) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '0':
        case '+':
        case '-':
        case '=':
        case '*':
        case '/':
        case 'Enter':
            ev.preventDefault();
            onButtonClick(ev);
            break;
        default:
    }
}

function onButtonClick(ev) {
    let buttonValue = ev.key || ev.target.value;
    let isNumber = !isNaN(Number(buttonValue));
    let isOperateSuccessful = true;
    let isOperatorPickedAlready = storedValues.operator;
    let isEqualClicked = buttonValue === '=';

    if (isNumber && !isOperatorPickedAlready) {
        updateNum(buttonValue, "num1");
        toggleOperatorButton(); // toggle existing disabled, if any 
        return;
    }

    if (isNumber && isOperatorPickedAlready) {
        updateNum(buttonValue, "num2");
        toggleOperatorButton(); // toggle existing disabled, if any 
        return;
    }

    let isValueDotOrPlusMinus = buttonValue === "+/-" || buttonValue === ".";

    if (isValueDotOrPlusMinus) {
        otherOperate(buttonValue);
        return;
    }    

    if (isOperatorPickedAlready && storedValues.num2) {
        isOperateSuccessful = operate();
    }

    if (isOperateSuccessful && !isEqualClicked) {
        toggleOperatorButton(); // toggle existing disabled, if any  
        storedValues.operator = buttonValue;        
        storedValues.operatorButtonName = getButtonNameByValue(buttonValue);
        toggleOperatorButton(); // toggle new operator
    }
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
    let num1 = Number(storedValues.num1);
    let num2 = Number(storedValues.num2);    
    let result = "Invalid op";
    

    switch (storedValues.operator) {
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
    let buttonName = getButtonNameByValue(storedValues.operator);

    clearCalculation();

    if (!isValidNumber) {            
        updateDisplay(result);
        return false;
    }
    
    storedValues.operatorButtonName = buttonName;
    toggleOperatorButton();
    updateNum(result, "num1");
    return true;
}

function otherOperate(symbol) {    
    let isOperatorPickedAlready = storedValues.operator;
    let numProperty = !isOperatorPickedAlready ? "num1" : "num2";
    let isValidCondition = false;
    let newNum = storedValues[numProperty];

    switch (symbol) {
        case "+/-":
            // is current num negative
            isValidCondition = storedValues[numProperty].includes("-");
            newNum = `-${storedValues[numProperty]}`;

            if (isValidCondition) {
                newNum = storedValues[numProperty].replace('-', '');
            }
            break;
        case ".":
            // is num already a decimal
            isValidCondition = storedValues[numProperty].includes(".");
            // adds 0 in front, if no num before decimal
            newNum = `${(storedValues[numProperty] || '0')}.`;

            if (isValidCondition) {
                return;
            }            
            break;
        default:
            return;
    }

    storedValues[numProperty] = '';            
    updateNum(newNum, numProperty);   
}

function updateNum(num, numProperty = "num1") {
    let isDecimal = String(num).includes(".") || storedValues[numProperty].includes(".");
    let tempNum = storedValues[numProperty] + num;
    storedValues[numProperty] = isDecimal ? tempNum : String(Number(tempNum));
    updateDisplay(storedValues[numProperty]);
}

function toggleOperatorButton() {
    if (!storedValues.operatorButtonName || !storedValues.operator) {
        return;
    }

    let operatorButton = document.getElementById(storedValues.operatorButtonName);
    operatorButton.disabled = !operatorButton.disabled;

    if (!operatorButton.disabled) {
        storedValues.operatorButtonName = '';
    }
}

function getButtonNameByValue(value) {
    switch (value) {
        case "+":
            return "addButton";
        case "-":
            return "subtractButton";
        case "/":
            return "divideButton";
        case "*":
            return "multiplyButton";
        default:
            return "";
    }
}

function updateDisplay(num = '') {
    let display = document.querySelector("#display");
    display.innerText = num;
}

function clearCalculation() {
    toggleOperatorButton();    
    for (let calcProp in storedValues) {
        storedValues[calcProp] = '';
    }
    updateDisplay("0");
}

function navigateToGithub() {
    window.open("https://github.com/stchao/Calculator", "_blank");
}