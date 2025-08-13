# Age Calculator

## Overview

This is a frontend-only age calculator web application that allows users to calculate their age in years, months, and days. The application features a modern, responsive design with real-time validation, automatic calculations, and accessibility features. Built with vanilla HTML, CSS, and JavaScript, it provides an intuitive interface for date input and displays formatted age results.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Single Page Application (SPA)**: Built with vanilla HTML, CSS, and JavaScript without any frameworks
- **Component-based JavaScript**: Uses ES6 class-based architecture with the `AgeCalculator` class as the main controller
- **Event-driven Design**: Implements event listeners for form interactions, real-time validation, and automatic calculations
- **Responsive Design**: CSS-based responsive layout that adapts to different screen sizes

### Design Patterns
- **Object-Oriented Programming**: Main functionality encapsulated in the `AgeCalculator` class
- **Separation of Concerns**: Clear separation between HTML structure, CSS styling, and JavaScript functionality
- **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with interactive features
- **Debouncing**: Implements debounced auto-calculation to prevent excessive function calls during user input

### User Interface Design
- **Modern Gradient Background**: CSS gradient background for visual appeal
- **Form-based Input**: Structured form with day, month, and year inputs
- **Real-time Validation**: Immediate feedback on input validation errors
- **Accessibility Features**: ARIA labels, semantic HTML, and proper form structure
- **Icon Integration**: Font Awesome icons for enhanced visual elements

### Validation and Error Handling
- **Client-side Validation**: Real-time input validation for date fields
- **Error Display**: Dedicated error message containers with ARIA roles
- **Input Constraints**: HTML5 input attributes for basic validation (min, max, required)
- **Date Logic Validation**: Custom JavaScript validation for leap years and valid date combinations

## External Dependencies

### CDN Dependencies
- **Font Awesome 6.0.0**: Icon library loaded via CDN for calculator and other UI icons
- **Google Fonts (implied)**: Uses system fonts with fallbacks (Segoe UI, Tahoma, Geneva, Verdana, sans-serif)

### Browser APIs
- **DOM API**: Core browser API for DOM manipulation and event handling
- **Date API**: JavaScript Date object for age calculations and date validation
- **Form API**: HTML5 form validation and submission handling

### No Backend Dependencies
- **Static Hosting**: Application can be hosted on any static file server
- **No Database**: All calculations performed client-side with no data persistence
- **No Server-side Processing**: Pure frontend application with no API calls or server dependencies