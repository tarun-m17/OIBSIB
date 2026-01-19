/* ========================================
   TEMPERATURE CONVERTER - JAVASCRIPT LOGIC
   ======================================== */

// Get all HTML elements we'll need to interact with
const temperatureInput = document.getElementById('temperature-input');
const inputUnitRadios = document.querySelectorAll('input[name="input-unit"]');
const outputUnitRadios = document.querySelectorAll('input[name="output-unit"]');
const convertBtn = document.getElementById('convert-btn');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');
const inputDisplay = document.getElementById('input-display');
const outputDisplay = document.getElementById('output-display');

/* ========================================
   EVENT LISTENERS
   ======================================== */

// Listen for button click to trigger conversion
convertBtn.addEventListener('click', convertTemperature);

// Allow pressing Enter key in input field to convert
temperatureInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        convertTemperature();
    }
});

/* ========================================
   MAIN CONVERSION FUNCTION
   ======================================== */

/**
 * Main conversion function that:
 * 1. Gets the input values from the form
 * 2. Validates the temperature input
 * 3. Converts the temperature
 * 4. Displays the result or error message
 */
function convertTemperature() {
    // Clear previous messages
    clearMessages();
    
    // Get the temperature value from input field
    const temperatureValue = parseFloat(temperatureInput.value);
    
    // Get selected input unit (which radio button is checked)
    const inputUnit = document.querySelector('input[name="input-unit"]:checked').value;
    
    // Get selected output unit
    const outputUnit = document.querySelector('input[name="output-unit"]:checked').value;
    
    // STEP 1: Validate the input
    if (temperatureInput.value === '' || isNaN(temperatureValue)) {
        showError('Please enter a valid number');
        return;
    }
    
    // STEP 2: Prevent same unit conversion
    if (inputUnit === outputUnit) {
        showError('Please select different input and output units');
        return;
    }
    
    // STEP 3: Convert the temperature
    let result = convertTo(temperatureValue, inputUnit, outputUnit);
    
    // Round to 2 decimal places for cleaner display
    result = Math.round(result * 100) / 100;
    
    // STEP 4: Display the result
    displayResult(temperatureValue, inputUnit, result, outputUnit);
    
    // STEP 5: Show success message
    showSuccess('Temperature converted successfully!');
}

/* ========================================
   TEMPERATURE CONVERSION LOGIC
   ======================================== */

/**
 * Convert temperature from one unit to another
 * 
 * Strategy: Convert everything through Celsius as an intermediate step
 * This simplifies the conversion logic and prevents code duplication
 * 
 * @param {number} value - The temperature value to convert
 * @param {string} fromUnit - The input unit (celsius, fahrenheit, kelvin)
 * @param {string} toUnit - The output unit (celsius, fahrenheit, kelvin)
 * @returns {number} - The converted temperature value
 */
function convertTo(value, fromUnit, toUnit) {
    // STEP 1: Convert input value to Celsius
    let celsius = convertToCelsius(value, fromUnit);
    
    // STEP 2: Convert from Celsius to output unit
    let result = convertFromCelsius(celsius, toUnit);
    
    return result;
}

/**
 * Convert any temperature TO Celsius
 * 
 * @param {number} value - The temperature value
 * @param {string} unit - The unit of the input value (celsius, fahrenheit, kelvin)
 * @returns {number} - Temperature in Celsius
 */
function convertToCelsius(value, unit) {
    switch(unit) {
        case 'celsius':
            // Already in Celsius, no conversion needed
            return value;
        
        case 'fahrenheit':
            // Formula: °C = (°F - 32) × 5/9
            return (value - 32) * 5 / 9;
        
        case 'kelvin':
            // Formula: °C = K - 273.15
            return value - 273.15;
        
        default:
            return value;
    }
}

/**
 * Convert FROM Celsius to any temperature unit
 * 
 * @param {number} celsius - Temperature in Celsius
 * @param {string} unit - The target unit (celsius, fahrenheit, kelvin)
 * @returns {number} - Temperature in the target unit
 */
function convertFromCelsius(celsius, unit) {
    switch(unit) {
        case 'celsius':
            // Already in Celsius, no conversion needed
            return celsius;
        
        case 'fahrenheit':
            // Formula: °F = (°C × 9/5) + 32
            return (celsius * 9 / 5) + 32;
        
        case 'kelvin':
            // Formula: K = °C + 273.15
            return celsius + 273.15;
        
        default:
            return celsius;
    }
}

/* ========================================
   DISPLAY & MESSAGE FUNCTIONS
   ======================================== */

/**
 * Display the conversion result in the result card
 * 
 * @param {number} inputValue - Original temperature value
 * @param {string} inputUnit - Original unit
 * @param {number} outputValue - Converted temperature value
 * @param {string} outputUnit - Converted unit
 */
function displayResult(inputValue, inputUnit, outputValue, outputUnit) {
    // Format the input unit with its symbol
    const inputUnitDisplay = getUnitSymbol(inputUnit);
    inputDisplay.textContent = `${inputValue}°${inputUnitDisplay}`;
    
    // Format the output unit with its symbol
    const outputUnitDisplay = getUnitSymbol(outputUnit);
    outputDisplay.textContent = `${outputValue}°${outputUnitDisplay}`;
}

/**
 * Get the symbol for a temperature unit
 * 
 * @param {string} unit - The unit (celsius, fahrenheit, kelvin)
 * @returns {string} - The unit symbol
 */
function getUnitSymbol(unit) {
    switch(unit) {
        case 'celsius':
            return 'C';
        case 'fahrenheit':
            return 'F';
        case 'kelvin':
            return 'K';
        default:
            return '';
    }
}

/**
 * Display error message to the user
 * 
 * @param {string} message - The error message to display
 */
function showError(message) {
    errorMessage.textContent = '❌ ' + message;
    errorMessage.classList.add('show');
}

/**
 * Display success message to the user
 * 
 * @param {string} message - The success message to display
 */
function showSuccess(message) {
    successMessage.textContent = '✓ ' + message;
    successMessage.classList.add('show');
}

/**
 * Clear all error and success messages
 */
function clearMessages() {
    errorMessage.classList.remove('show');
    successMessage.classList.remove('show');
    errorMessage.textContent = '';
    successMessage.textContent = '';
}

/* ========================================
   KEYBOARD & INPUT INTERACTION
   ======================================== */

// Allow real-time validation as user types
temperatureInput.addEventListener('input', function() {
    // Clear messages when user starts typing new value
    clearMessages();
});

// Auto-focus on input field when page loads
window.addEventListener('load', function() {
    temperatureInput.focus();
});
