/**
 * Age Calculator Application
 * Calculates user age in years, months, and days
 * Includes validation and real-time updates
 */

class AgeCalculator {
    constructor() {
        this.form = document.getElementById('age-form');
        this.dayInput = document.getElementById('day');
        this.monthSelect = document.getElementById('month');
        this.yearInput = document.getElementById('year');
        this.calculateBtn = document.getElementById('calculate-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.resultContainer = document.getElementById('result-container');
        this.errorContainer = document.getElementById('error-container');
        
        this.initializeEventListeners();
        this.setMaxYear();
    }

    /**
     * Initialize all event listeners
     */
    initializeEventListeners() {
        // Calculate button click
        this.calculateBtn.addEventListener('click', () => this.calculateAge());
        
        // Reset button click
        this.resetBtn.addEventListener('click', () => this.resetForm());
        
        // Real-time input validation
        this.dayInput.addEventListener('input', () => this.validateDay());
        this.monthSelect.addEventListener('change', () => this.validateMonth());
        this.yearInput.addEventListener('input', () => this.validateYear());
        
        // Real-time calculation on valid input
        [this.dayInput, this.monthSelect, this.yearInput].forEach(input => {
            input.addEventListener('input', () => this.debounce(this.autoCalculate.bind(this), 500)());
            input.addEventListener('change', () => this.debounce(this.autoCalculate.bind(this), 500)());
        });
        
        // Form submission prevention
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculateAge();
        });
    }

    /**
     * Set maximum year to current year
     */
    setMaxYear() {
        const currentYear = new Date().getFullYear();
        this.yearInput.setAttribute('max', currentYear);
    }

    /**
     * Validate day input
     */
    validateDay() {
        const day = parseInt(this.dayInput.value);
        const month = parseInt(this.monthSelect.value);
        const year = parseInt(this.yearInput.value);
        const errorElement = document.getElementById('day-error');
        
        // Clear previous error
        errorElement.textContent = '';
        this.dayInput.classList.remove('invalid');
        
        if (!day || day < 1 || day > 31) {
            this.showFieldError('day-error', 'Please enter a valid day (1-31)');
            return false;
        }
        
        // Check if day is valid for the selected month
        if (month && year) {
            const daysInMonth = this.getDaysInMonth(month, year);
            if (day > daysInMonth) {
                this.showFieldError('day-error', `${this.getMonthName(month)} ${year} only has ${daysInMonth} days`);
                return false;
            }
        }
        
        return true;
    }

    /**
     * Validate month selection
     */
    validateMonth() {
        const month = parseInt(this.monthSelect.value);
        const errorElement = document.getElementById('month-error');
        
        // Clear previous error
        errorElement.textContent = '';
        this.monthSelect.classList.remove('invalid');
        
        if (!month || month < 1 || month > 12) {
            this.showFieldError('month-error', 'Please select a valid month');
            return false;
        }
        
        // Re-validate day when month changes
        this.validateDay();
        
        return true;
    }

    /**
     * Validate year input
     */
    validateYear() {
        const year = parseInt(this.yearInput.value);
        const currentYear = new Date().getFullYear();
        const errorElement = document.getElementById('year-error');
        
        // Clear previous error
        errorElement.textContent = '';
        this.yearInput.classList.remove('invalid');
        
        if (!year || year < 1900 || year > currentYear) {
            this.showFieldError('year-error', `Please enter a valid year (1900-${currentYear})`);
            return false;
        }
        
        // Re-validate day when year changes (leap year consideration)
        this.validateDay();
        
        return true;
    }

    /**
     * Show field-specific error message
     */
    showFieldError(errorElementId, message) {
        const errorElement = document.getElementById(errorElementId);
        const inputElement = errorElement.previousElementSibling;
        
        errorElement.textContent = message;
        inputElement.classList.add('invalid');
    }

    /**
     * Get number of days in a specific month/year
     */
    getDaysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    /**
     * Get month name from month number
     */
    getMonthName(month) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[month - 1];
    }

    /**
     * Validate all form inputs
     */
    validateForm() {
        const isDayValid = this.validateDay();
        const isMonthValid = this.validateMonth();
        const isYearValid = this.validateYear();
        
        return isDayValid && isMonthValid && isYearValid;
    }

    /**
     * Validate if the entered date is not in the future
     */
    validateDateNotFuture(birthDate) {
        const today = new Date();
        if (birthDate > today) {
            this.showGeneralError('Birth date cannot be in the future. Please enter a valid date.');
            return false;
        }
        return true;
    }

    /**
     * Calculate age based on input values
     */
    calculateAge() {
        // Hide previous results and errors
        this.hideResults();
        this.hideGeneralError();
        
        // Validate form inputs
        if (!this.validateForm()) {
            return;
        }
        
        const day = parseInt(this.dayInput.value);
        const month = parseInt(this.monthSelect.value);
        const year = parseInt(this.yearInput.value);
        
        const birthDate = new Date(year, month - 1, day);
        
        // Validate that the constructed date is correct (handles invalid dates like Feb 30)
        if (birthDate.getDate() !== day || birthDate.getMonth() !== month - 1 || birthDate.getFullYear() !== year) {
            this.showGeneralError('Please enter a valid date. The date you entered does not exist.');
            return;
        }
        
        // Check if date is not in the future
        if (!this.validateDateNotFuture(birthDate)) {
            return;
        }
        
        const age = this.computeAge(birthDate);
        this.displayResults(age, birthDate);
    }

    /**
     * Compute age in years, months, and days
     */
    computeAge(birthDate) {
        const today = new Date();
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();
        
        // Adjust for negative days
        if (days < 0) {
            months--;
            const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += prevMonth.getDate();
        }
        
        // Adjust for negative months
        if (months < 0) {
            years--;
            months += 12;
        }
        
        // Calculate total days lived
        const totalDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
        
        // Calculate next birthday
        let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        if (nextBirthday < today) {
            nextBirthday.setFullYear(today.getFullYear() + 1);
        }
        const daysToNextBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
        
        return {
            years,
            months,
            days,
            totalDays,
            daysToNextBirthday,
            nextBirthday
        };
    }

    /**
     * Display calculated results
     */
    displayResults(age, birthDate) {
        // Update age display
        document.getElementById('years').textContent = age.years;
        document.getElementById('months').textContent = age.months;
        document.getElementById('days').textContent = age.days;
        
        // Update additional information
        document.getElementById('total-days').textContent = 
            `You have lived for ${age.totalDays.toLocaleString()} days`;
        
        const nextBirthdayText = age.daysToNextBirthday === 0 
            ? "🎉 Happy Birthday! Today is your special day!"
            : `Your next birthday is in ${age.daysToNextBirthday} days`;
        
        document.getElementById('next-birthday').textContent = nextBirthdayText;
        
        // Show results with animation
        this.resultContainer.style.display = 'block';
        this.resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Auto-calculate if all inputs are valid (for real-time updates)
     */
    autoCalculate() {
        if (this.dayInput.value && this.monthSelect.value && this.yearInput.value) {
            if (this.validateForm()) {
                this.calculateAge();
            }
        }
    }

    /**
     * Reset form and hide results
     */
    resetForm() {
        this.form.reset();
        this.hideResults();
        this.hideGeneralError();
        this.clearFieldErrors();
        this.dayInput.focus();
    }

    /**
     * Hide result container
     */
    hideResults() {
        this.resultContainer.style.display = 'none';
    }

    /**
     * Show general error message
     */
    showGeneralError(message) {
        document.getElementById('general-error').textContent = message;
        this.errorContainer.style.display = 'block';
        this.errorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Hide general error message
     */
    hideGeneralError() {
        this.errorContainer.style.display = 'none';
    }

    /**
     * Clear all field error messages
     */
    clearFieldErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
        
        const inputElements = document.querySelectorAll('input, select');
        inputElements.forEach(element => {
            element.classList.remove('invalid');
        });
    }

    /**
     * Debounce function to limit API calls
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AgeCalculator();
});

// Add keyboard accessibility
document.addEventListener('keydown', (e) => {
    // Allow Enter key to calculate age when focus is on form elements
    if (e.key === 'Enter' && e.target.closest('#age-form')) {
        e.preventDefault();
        const calculator = new AgeCalculator();
        calculator.calculateAge();
    }
});

// Add service worker registration for PWA capabilities (optional enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker can be added later for offline functionality
        console.log('Age Calculator loaded successfully');
    });
}

// Add error handling for uncaught errors
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    // Could show user-friendly error message here
});

// Add visibility change handler to update calculation when user returns to tab
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Refresh max year in case user left tab open overnight and it's now a new year
        const yearInput = document.getElementById('year');
        if (yearInput) {
            const currentYear = new Date().getFullYear();
            yearInput.setAttribute('max', currentYear);
        }
    }
});
