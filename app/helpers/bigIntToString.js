/**
 * Transforms numbers into physics notation if they are longer than 6 digits
 * @param {number|string|bigint} value - The number to format
 * @param {number} maxDigits - Maximum digits before switching to physics notation (default: 6)
 * @param {number} precision - Decimal places in physics notation (default: 3)
 * @returns {string} Formatted number string
 */
function bigIntToString(value, maxDigits = 6, precision = 3) {
    // Convert to number if it's a string or bigint
    let num;
    if (typeof value === 'bigint') {
        num = Number(value);
    } else if (typeof value === 'string') {
        num = parseFloat(value);
    } else {
        num = value;
    }
    
    // Handle invalid numbers
    if (isNaN(num) || !isFinite(num)) {
        return '0';
    }
    
    // Handle zero and very small numbers
    if (num === 0) {
        return '0';
    }
    
    // Get the absolute value for digit counting
    const absNum = Math.abs(num);
    
    // Count digits in the integer part
    const integerPart = Math.floor(absNum);
    const digitCount = integerPart === 0 ? 1 : Math.floor(Math.log10(integerPart)) + 1;
    
    // If number has more digits than maxDigits, use physics notation
    if (digitCount > maxDigits) {
        return toPhysicsNotation(num, precision);
    }
    
    // For smaller numbers, return with appropriate formatting
    if (absNum >= 1) {
        // For whole numbers or numbers >= 1, remove unnecessary decimals
        return num % 1 === 0 ? num.toString() : num.toLocaleString();
    } else {
        // For decimal numbers less than 1, show with reasonable precision
        return num.toFixed(Math.min(precision, 8));
    }
}

/**
 * Converts a number to physics notation (e.g., 2.34 × 10¹⁰)
 * @param {number} num - The number to convert
 * @param {number} precision - Decimal places for the coefficient
 * @returns {string} Physics notation string
 */
function toPhysicsNotation(num, precision = 3) {
    if (num === 0) return '0';
    
    const sign = num < 0 ? '-' : '';
    const absNum = Math.abs(num);
    
    // Calculate the exponent (power of 10)
    const exponent = Math.floor(Math.log10(absNum));
    
    // Calculate the coefficient (mantissa)
    const coefficient = absNum / Math.pow(10, exponent);
    
    // Format coefficient with specified precision
    const formattedCoefficient = coefficient.toFixed(precision);
    
    // Convert exponent to superscript
    const superscriptExponent = toSuperscript(exponent);
    
    // Handle special cases
    if (exponent === 0) {
        return `${sign}${formattedCoefficient}`;
    }
    
    if (exponent === 1) {
        return `${sign}${formattedCoefficient} × 10`;
    }
    
    return `${sign}${formattedCoefficient} × 10${superscriptExponent}`;
}

/**
 * Converts a number to superscript Unicode characters
 * @param {number} num - Number to convert to superscript
 * @returns {string} Superscript string
 */
function toSuperscript(num) {
    const superscriptMap = {
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
        '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
        '-': '⁻', '+': '⁺'
    };
    
    return num.toString().split('').map(char => superscriptMap[char] || char).join('');
}

/**
 * Transforms numbers with currency-specific formatting
 * @param {number|string|bigint} value - The number to format
 * @param {string} currency - Currency type ('$', 'ETH', 'gwei', 'wei')
 * @returns {string} Formatted currency string
 */
function bigIntToFormat(value, currency = 'wei') {
    const formattedNumber = bigIntToString(value);
    
    switch (currency.toLowerCase()) {
        case '$':
        case 'usd':
        case 'dollar':
            // For dollar amounts, add currency symbol and proper decimal formatting
            const dollarNum = typeof value === 'string' ? parseFloat(value) : Number(value);
            if (dollarNum >= 1000000) {
                return `$${bigIntToString(dollarNum)}`;
            }
            return `$${dollarNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            
        case 'eth':
        case 'ether':
            return `${formattedNumber} ETH`;
            
        case 'gwei':
            return `${formattedNumber} gwei`;
            
        case 'wei':
        default:
            return `${formattedNumber} wei`;
    }
}

export default bigIntToString;
export { bigIntToFormat };