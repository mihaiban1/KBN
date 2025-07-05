/**
 * Form Wizard JavaScript for KBN Financial Boutique
 * Handles multi-step forms for loan applications and membership
 */

class FormWizard {
    constructor(selector) {
        this.wizard = document.querySelector(selector);
        if (!this.wizard) return;
        
        this.steps = this.wizard.querySelectorAll('.wizard-step');
        this.contents = this.wizard.querySelectorAll('.wizard-content');
        this.nextButtons = this.wizard.querySelectorAll('.btn-next');
        this.prevButtons = this.wizard.querySelectorAll('.btn-prev');
        this.submitButton = this.wizard.querySelector('.btn-submit');
        this.currentStep = 0;
        this.formData = {};
        
        this.init();
    }
    
    init() {
        this.showStep(0);
        this.attachEventListeners();
        this.loadSavedData();
    }
    
    attachEventListeners() {
        // Next button events
        this.nextButtons.forEach((button, index) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextStep();
            });
        });
        
        // Previous button events
        this.prevButtons.forEach((button, index) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.prevStep();
            });
        });
        
        // Submit button event
        if (this.submitButton) {
            this.submitButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.submitForm();
            });
        }
        
        // Step click events
        this.steps.forEach((step, index) => {
            step.addEventListener('click', () => {
                if (this.canGoToStep(index)) {
                    this.showStep(index);
                }
            });
        });
        
        // Auto-save form data
        this.wizard.addEventListener('input', () => {
            this.saveFormData();
        });
        
        // File upload handling
        this.wizard.addEventListener('change', (e) => {
            if (e.target.type === 'file') {
                this.handleFileUpload(e.target);
            }
        });
    }
    
    showStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.steps.length) return;
        
        // Hide all contents
        this.contents.forEach((content, index) => {
            content.style.display = index === stepIndex ? 'block' : 'none';
        });
        
        // Update step indicators
        this.steps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index === stepIndex) {
                step.classList.add('active');
            } else if (index < stepIndex) {
                step.classList.add('completed');
            }
        });
        
        this.currentStep = stepIndex;
        this.updateButtons();
        this.updateProgressBar();
        
        // Populate summary if this is the review step (step 4, index 4)
        if (stepIndex === 4) {
            this.populateSummary();
        }
        
        // Focus first input in current step
        const firstInput = this.contents[stepIndex].querySelector('input, select, textarea');
        if (firstInput) {
            firstInput.focus();
        }
    }
    
    nextStep() {
        if (this.validateCurrentStep()) {
            this.saveStepData();
            if (this.currentStep < this.steps.length - 1) {
                this.showStep(this.currentStep + 1);
            }
        }
    }
    
    prevStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }
    
    validateCurrentStep() {
        const currentContent = this.contents[this.currentStep];
        const requiredFields = currentContent.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        // Custom validation for specific steps
        if (this.currentStep === 0) {
            isValid = this.validatePersonalInfo() && isValid;
        } else if (this.currentStep === 1) {
            isValid = this.validateBusinessInfo() && isValid;
        } else if (this.currentStep === 2) {
            isValid = this.validateFinancialInfo() && isValid;
        }
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        let errorMessage = '';
        
        // Clear previous errors
        this.clearFieldError(field);
        
        // Required field check
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        // Email validation
        else if (type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
        // Phone validation
        else if (type === 'tel' && value && !this.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
        // Number validation
        else if (type === 'number' && value && (isNaN(value) || parseFloat(value) < 0)) {
            isValid = false;
            errorMessage = 'Please enter a valid number';
        }
        // File validation
        else if (type === 'file' && field.hasAttribute('required') && !field.files.length) {
            isValid = false;
            errorMessage = 'Please select a file';
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    validatePersonalInfo() {
        const currentContent = this.contents[this.currentStep];
        const dateOfBirth = currentContent.querySelector('[name="dateOfBirth"]');
        const nationalId = currentContent.querySelector('[name="nationalId"]');
        let isValid = true;
        
        // Age validation (must be 18+)
        if (dateOfBirth && dateOfBirth.value) {
            const birthDate = new Date(dateOfBirth.value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            if (age < 18) {
                this.showFieldError(dateOfBirth, 'You must be at least 18 years old');
                isValid = false;
            }
        }
        
        // National ID validation (basic format check)
        if (nationalId && nationalId.value) {
            const idPattern = /^[0-9]{16}$/; // Rwanda National ID format
            if (!idPattern.test(nationalId.value)) {
                this.showFieldError(nationalId, 'Please enter a valid National ID (16 digits)');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    validateBusinessInfo() {
        const currentContent = this.contents[this.currentStep];
        const businessType = currentContent.querySelector('[name="businessType"]');
        const registrationNumber = currentContent.querySelector('[name="registrationNumber"]');
        let isValid = true;
        
        // Business registration validation
        if (businessType && businessType.value === 'registered' && registrationNumber) {
            if (!registrationNumber.value.trim()) {
                this.showFieldError(registrationNumber, 'Registration number is required for registered businesses');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    validateFinancialInfo() {
        const currentContent = this.contents[this.currentStep];
        const loanAmount = currentContent.querySelector('[name="loanAmount"]');
        const monthlyIncome = currentContent.querySelector('[name="monthlyIncome"]');
        let isValid = true;
        
        // Loan amount validation
        if (loanAmount && loanAmount.value) {
            const amount = parseFloat(loanAmount.value);
            if (amount < 50000 || amount > 5000000) { // 50k to 5M RWF
                this.showFieldError(loanAmount, 'Loan amount must be between 50,000 and 5,000,000 RWF');
                isValid = false;
            }
        }
        
        // Income vs loan amount validation
        if (loanAmount && monthlyIncome && loanAmount.value && monthlyIncome.value) {
            const loan = parseFloat(loanAmount.value);
            const income = parseFloat(monthlyIncome.value);
            const ratio = loan / (income * 12); // Annual income ratio
            
            if (ratio > 5) { // Loan should not exceed 5 times annual income
                this.showFieldError(loanAmount, 'Loan amount is too high compared to your income');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        field.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
        
        // Scroll to error
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    updateButtons() {
        const currentContent = this.contents[this.currentStep];
        const nextButton = currentContent.querySelector('.btn-next');
        const prevButton = currentContent.querySelector('.btn-prev');
        const submitButton = currentContent.querySelector('.btn-submit');
        
        // Show/hide previous button
        if (prevButton) {
            prevButton.style.display = this.currentStep > 0 ? 'inline-flex' : 'none';
        }
        
        // Show/hide next button
        if (nextButton) {
            nextButton.style.display = this.currentStep < this.steps.length - 1 ? 'inline-flex' : 'none';
        }
        
        // Show/hide submit button
        if (submitButton) {
            submitButton.style.display = this.currentStep === this.steps.length - 1 ? 'inline-flex' : 'none';
        }
    }
    
    updateProgressBar() {
        const progressBar = this.wizard.querySelector('.progress-bar');
        if (progressBar) {
            const progress = ((this.currentStep + 1) / this.steps.length) * 100;
            progressBar.style.width = progress + '%';
        }
    }
    
    canGoToStep(stepIndex) {
        // Can go to previous steps or next step if current is valid
        return stepIndex <= this.currentStep || 
               (stepIndex === this.currentStep + 1 && this.validateCurrentStep());
    }
    
    saveStepData() {
        const currentContent = this.contents[this.currentStep];
        const formData = new FormData();
        const inputs = currentContent.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input.type === 'file') {
                if (input.files.length > 0) {
                    this.formData[input.name] = input.files[0];
                }
            } else if (input.type === 'checkbox') {
                this.formData[input.name] = input.checked;
            } else if (input.type === 'radio') {
                if (input.checked) {
                    this.formData[input.name] = input.value;
                }
            } else {
                this.formData[input.name] = input.value;
            }
        });
        
        this.saveFormData();
    }
    
    saveFormData() {
        const formId = this.wizard.dataset.formId || 'wizard-form';
        try {
            localStorage.setItem(formId, JSON.stringify(this.formData));
        } catch (e) {
            console.warn('Could not save form data:', e);
        }
    }
    
    loadSavedData() {
        const formId = this.wizard.dataset.formId || 'wizard-form';
        try {
            const savedData = localStorage.getItem(formId);
            if (savedData) {
                this.formData = JSON.parse(savedData);
                this.populateForm();
            }
        } catch (e) {
            console.warn('Could not load saved form data:', e);
        }
    }
    
    populateForm() {
        Object.keys(this.formData).forEach(key => {
            const input = this.wizard.querySelector(`[name="${key}"]`);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = this.formData[key];
                } else if (input.type === 'radio') {
                    if (input.value === this.formData[key]) {
                        input.checked = true;
                    }
                } else if (input.type !== 'file') {
                    input.value = this.formData[key];
                }
            }
        });
    }
    
    handleFileUpload(fileInput) {
        const file = fileInput.files[0];
        if (!file) return;
        
        // File size validation (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showFieldError(fileInput, 'File size must be less than 5MB');
            fileInput.value = '';
            return;
        }
        
        // File type validation
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            this.showFieldError(fileInput, 'Only JPEG, PNG, GIF, and PDF files are allowed');
            fileInput.value = '';
            return;
        }
        
        // Clear any previous errors
        this.clearFieldError(fileInput);
        
        // Show file preview
        this.showFilePreview(fileInput, file);
    }
    
    showFilePreview(fileInput, file) {
        const preview = fileInput.parentNode.querySelector('.file-preview');
        if (preview) {
            preview.remove();
        }
        
        const previewContainer = document.createElement('div');
        previewContainer.className = 'file-preview';
        
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.style.maxWidth = '100px';
            img.style.maxHeight = '100px';
            previewContainer.appendChild(img);
        } else {
            const icon = document.createElement('div');
            icon.className = 'file-icon';
            icon.textContent = '📄';
            previewContainer.appendChild(icon);
        }
        
        const fileName = document.createElement('div');
        fileName.className = 'file-name';
        fileName.textContent = file.name;
        previewContainer.appendChild(fileName);
        
        const fileSize = document.createElement('div');
        fileSize.className = 'file-size';
        fileSize.textContent = this.formatFileSize(file.size);
        previewContainer.appendChild(fileSize);
        
        fileInput.parentNode.appendChild(previewContainer);
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    async submitForm() {
        if (!this.validateCurrentStep()) {
            return;
        }
        
        this.saveStepData();
        
        // Show loading state
        if (this.submitButton) {
            this.submitButton.classList.add('loading');
            this.submitButton.disabled = true;
        }
        
        try {
            // Simulate API call
            await this.simulateSubmission();
            
            // Show success message
            this.showSuccessMessage();
            
            // Clear saved data
            this.clearSavedData();
            
        } catch (error) {
            this.showErrorMessage(error.message);
        } finally {
            // Remove loading state
            if (this.submitButton) {
                this.submitButton.classList.remove('loading');
                this.submitButton.disabled = false;
            }
        }
    }
    
    async simulateSubmission() {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate random success/failure for demo
        if (Math.random() < 0.9) { // 90% success rate
            return { success: true, applicationId: 'KBN-' + Date.now() };
        } else {
            throw new Error('Submission failed. Please try again.');
        }
    }
    
    showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'wizard-success';
        successDiv.innerHTML = `
            <div class="success-icon">✓</div>
            <h3>Application Submitted Successfully!</h3>
            <p>Thank you for your application. We will review it and get back to you within 3-5 business days.</p>
            <p>Your application ID: <strong>KBN-${Date.now()}</strong></p>
            <div class="success-actions">
                <a href="dashboard/member.html" class="btn btn--primary">View Dashboard</a>
                <a href="index.html" class="btn btn--secondary">Back to Home</a>
            </div>
        `;
        
        this.wizard.innerHTML = '';
        this.wizard.appendChild(successDiv);
    }
    
    showErrorMessage(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert--error';
        alert.innerHTML = `
            <strong>Error:</strong> ${message}
            <button class="alert-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        this.wizard.insertBefore(alert, this.wizard.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }
    
    clearSavedData() {
        const formId = this.wizard.dataset.formId || 'wizard-form';
        try {
            localStorage.removeItem(formId);
        } catch (e) {
            console.warn('Could not clear saved form data:', e);
        }
    }
    
    // Utility methods
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }
    
    populateSummary() {
        // Personal Information
        this.setSummaryValue('summary-name', this.getFieldValue('firstName', 'lastName'));
        this.setSummaryValue('summary-email', this.getFieldValue('email'));
        this.setSummaryValue('summary-phone', this.getFieldValue('phone'));
        
        // Business Information
        this.setSummaryValue('summary-business-name', this.getFieldValue('businessName'));
        this.setSummaryValue('summary-business-type', this.getFieldValue('businessType'));
        this.setSummaryValue('summary-business-sector', this.getFieldValue('businessSector'));
        
        // Loan Details
        this.setSummaryValue('summary-loan-type', this.getFieldValue('loanType'));
        this.setSummaryValue('summary-loan-amount', this.getFieldValue('loanAmount'));
        this.setSummaryValue('summary-loan-purpose', this.getFieldValue('loanPurpose'));
        this.setSummaryValue('summary-repayment-term', this.getFieldValue('repaymentTerm'));
    }
    
    setSummaryValue(summaryId, value) {
        const element = document.getElementById(summaryId);
        if (element) {
            element.textContent = value || '-';
        }
    }
    
    getFieldValue(...fieldNames) {
        if (fieldNames.length === 1) {
            // Single field
            const field = this.wizard.querySelector(`[name="${fieldNames[0]}"]`);
            if (field) {
                if (field.type === 'radio') {
                    const checked = this.wizard.querySelector(`[name="${fieldNames[0]}"]:checked`);
                    return checked ? checked.value : '';
                } else if (field.type === 'select-one') {
                    return field.options[field.selectedIndex]?.text || field.value;
                } else {
                    return field.value;
                }
            }
        } else if (fieldNames.length === 2) {
            // Combined fields (like firstName + lastName)
            const field1 = this.wizard.querySelector(`[name="${fieldNames[0]}"]`);
            const field2 = this.wizard.querySelector(`[name="${fieldNames[1]}"]`);
            const value1 = field1 ? field1.value : '';
            const value2 = field2 ? field2.value : '';
            return `${value1} ${value2}`.trim();
        }
        return '';
    }
}

// Initialize form wizards when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const wizards = document.querySelectorAll('.form-wizard');
    wizards.forEach(wizard => {
        new FormWizard(`#${wizard.id}`);
    });
});

// Export for use in other scripts
window.FormWizard = FormWizard; 