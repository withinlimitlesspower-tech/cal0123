class Calculator {
    constructor() {
        this.previousOperandElement = document.querySelector('.previous-operand');
        this.currentOperandElement = document.querySelector('.current-operand');
        this.clear();
        this.setupEventListeners();
        this.setupKeyboardSupport();
    }
    
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }
    
    delete() {
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }
    
    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        
        // Prevent multiple decimal points
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        // Replace initial zero (unless it's a decimal)
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }
    
    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }
    
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    this.clear();
                    this.updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            case 'percentage':
                computation = prev * (current / 100);
                break;
            default:
                return;
        }
        
        // Format result to avoid floating point issues
        this.currentOperand = this.formatResult(computation);
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }
    
    formatResult(number) {
        // If it's an integer, don't show decimal places
        if (Number.isInteger(number)) {
            return number.toString();
        }
        
        // Otherwise, limit to 10 decimal places
        return parseFloat(number.toFixed(10)).toString();
    }
    
    getOperationSymbol(operation) {
        switch (operation) {
            case 'add': return '+';
            case 'subtract': return '−';
            case 'multiply': return '×';
            case 'divide': return '÷';
            case 'percentage': return '%';
            default: return '';
        }
    }
    
    updateDisplay() {
        this.currentOperandElement.innerText = this.currentOperand;
        
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.previousOperand} ${this.getOperationSymbol(this.operation)}`;
        } else {
            this.previousOperandElement.innerText = this.previousOperand;
        }
    }
    
    // Additional functions
    calculateSquare() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        this.currentOperand = this.formatResult(current * current);
        this.shouldResetScreen = true;
    }
    
    calculateSquareRoot() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        if (current < 0) {
            alert('Cannot calculate square root of negative number!');
            return;
        }
        
        this.currentOperand = this.formatResult(Math.sqrt(current));
        this.shouldResetScreen = true;
    }
    
    toggleSign() {
        if (this.currentOperand === '0' || this.currentOperand === '') return;
        
        if (this.currentOperand.startsWith('-')) {
            this.currentOperand = this.currentOperand.slice(1);
        } else {
            this.currentOperand = '-' + this.currentOperand;
        }
    }
    
    calculatePercentage() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        this.currentOperand = this.formatResult(current / 100);
        this.shouldResetScreen = true;
    }
    
    setupEventListeners() {
        // Number buttons
        document.querySelectorAll('[data-number]').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.getAttribute('data-number'));
                this.updateDisplay();
            });
        });
        
        // Operation buttons
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.getAttribute('data-action');
                
                switch (action) {
                    case 'clear':
                        this.clear();
                        break;
                    case 'backspace':
                        this.delete();
                        break;
                    case 'equals':
                        this.compute();
                        break;
                    case 'add':
                    case 'subtract':
                    case 'multiply':
                    case 'divide':
                        this.chooseOperation(action);
                        break;
                    case 'percentage':
                        if (this.previousOperand === '') {
                            this.calculatePercentage();
                        } else {
                            this.chooseOperation(action);
                        }
                        break;
                    case 'square':
                        this.calculateSquare();
                        break;
                    case 'squareRoot':
                        this.calculateSquareRoot();
                        break;
                    case 'toggleSign':
                        this.toggleSign();
                        break;
                }
                
                this.updateDisplay();
            });
        });
    }
    
    setupKeyboardSupport() {
        document.addEventListener('keydown', event => {
            // Prevent default behavior for calculator keys
            if (/[0-9+\-*/.=]|Enter|Backspace|Escape/.test(event.key)) {
                event.preventDefault();
            }
            
            // Number keys
            if (/[0-9]/.test(event.key)) {
                this.appendNumber(event.key);
                this.updateDisplay();
            }
            
            // Decimal point
            if (event.key === '.' || event.key === ',') {
                this.appendNumber('.');
                this.updateDisplay();
            }
            
            // Operations
            if (event.key === '+') {
                this.chooseOperation('add');
                this.updateDisplay();
            }
            
            if (event.key === '-') {
                this.chooseOperation('subtract');
                this.updateDisplay();
            }
            
            if (event.key === '*') {
                this.chooseOperation('multiply');
                this.updateDisplay();
            }
            
            if (event.key === '/') {
                this.chooseOperation('divide');
                this.updateDisplay();
            }
            
            // Percentage
            if (event.key === '%') {
                if (this.previousOperand === '') {
                    this.calculatePercentage();
                } else {
                    this.chooseOperation('percentage');
                }
                this.updateDisplay();
            }
            
            // Equals or Enter
            if (event.key === '=' || event.key === 'Enter') {
                this.compute();
                this.updateDisplay();
            }
            
            // Clear or Escape
            if (event.key === 'Escape' || event.key === 'Delete') {
                this.clear();
                this.updateDisplay();
            }
            
            // Backspace
            if (event.key === 'Backspace') {
                this.delete();
                this.updateDisplay();
            }
        });
    }
}

// Initialize calculator when page loads
window.addEventListener('DOMContentLoaded', () => {
    const calculator = new Calculator();
    calculator.updateDisplay();
});