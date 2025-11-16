// School Form JavaScript
class SchoolForm {
    constructor() {
        this.form = document.getElementById('schoolForm');
        this.successMessage = document.getElementById('successMessage');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        
        // Set up period fields generator
        const numPeriodsSelect = document.getElementById('numPeriods');
        if (numPeriodsSelect) {
            numPeriodsSelect.addEventListener('change', () => this.generatePeriodFields());
        }

        // Add form validation styling
        this.setupFormValidation();
    }

    generatePeriodFields() {
        const numPeriods = document.getElementById('numPeriods').value;
        const container = document.getElementById('periodNamesContainer');
        const fieldsContainer = document.getElementById('periodFields');
        
        if (numPeriods && numPeriods > 0) {
            container.style.display = 'block';
            fieldsContainer.innerHTML = '';
            
            for (let i = 1; i <= parseInt(numPeriods); i++) {
                const fieldDiv = document.createElement('div');
                fieldDiv.className = 'form-group';
                fieldDiv.innerHTML = `
                    <label for="period${i}">Period ${i} *</label>
                    <input type="text" id="period${i}" name="period${i}" required placeholder="e.g., ${i}, P${i}, Break, Lunch">
                `;
                fieldsContainer.appendChild(fieldDiv);
            }
        } else {
            container.style.display = 'none';
        }
    }

    setupFormValidation() {
        const inputs = document.querySelectorAll('input[required], textarea[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.value.trim() === '') {
                    this.style.borderColor = '#ff6b6b';
                } else {
                    this.style.borderColor = '#51cf66';
                }
            });

            input.addEventListener('input', function() {
                if (this.value.trim() !== '') {
                    this.style.borderColor = '#51cf66';
                }
            });
        });
    }

    parseAddress(addressText) {
        const lines = addressText.split('\n').map(line => line.trim()).filter(line => line);
        
        let postcode = '';
        let city = '';
        let address_line1 = lines[0] || '';
        let address_line2 = lines[1] || '';
        
        if (lines.length > 0) {
            const lastLine = lines[lines.length - 1];
            const postcodeMatch = lastLine.match(/([A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2})/i);
            
            if (postcodeMatch) {
                postcode = postcodeMatch[1].toUpperCase();
                city = lastLine.replace(postcodeMatch[1], '').trim().replace(/,$/, '');
            } else {
                city = lastLine;
            }
        }

        return { address_line1, address_line2, city, postcode };
    }

    collectPeriodNames(data) {
        const numPeriods = parseInt(data.numPeriods);
        const periodNames = [];
        
        for (let i = 1; i <= numPeriods; i++) {
            const periodName = data[`period${i}`] || `Period ${i}`;
            periodNames.push(periodName);
        }
        
        return periodNames;
    }

    createSchoolData(formData) {
        const data = {};
        
        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Parse address
        const addressInfo = this.parseAddress(data.address);
        
        // Collect period names
        const periodNames = this.collectPeriodNames(data);

        // Create school data structure
        return {
            schoolInfo: {
                name: data.schoolName,
                address_line1: addressInfo.address_line1,
                address_line2: addressInfo.address_line2,
                city: addressInfo.city,
                postcode: addressInfo.postcode,
                phone: data.contactNumber || '',
                email: data.contactEmail || '',
                website: "",
                period_names: JSON.stringify(periodNames)
            },
            academicCalendar: {
                autumnTerm: {
                    startDate: data.autumnStart || '',
                    endDate: data.autumnEnd || '',
                    halfTermHoliday: {
                        startDate: data.autumnHalfStart || null,
                        endDate: data.autumnHalfEnd || null
                    }
                },
                springTerm: {
                    startDate: data.springStart || '',
                    endDate: data.springEnd || '',
                    halfTermHoliday: {
                        startDate: data.springHalfStart || null,
                        endDate: data.springHalfEnd || null
                    }
                },
                summerTerm: {
                    startDate: data.summerStart || '',
                    endDate: data.summerEnd || '',
                    halfTermHoliday: {
                        startDate: data.summerHalfStart || null,
                        endDate: data.summerHalfEnd || null
                    }
                }
            },
            submissionDate: new Date().toISOString()
        };
    }

    downloadJSON(data, filename) {
        try {
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = filename;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
            
            return { success: true, jsonString };
        } catch (error) {
            console.error('Download failed:', error);
            return { success: false, error, jsonString: JSON.stringify(data, null, 2) };
        }
    }

    showSuccessMessage(filename, downloadResult) {
        if (downloadResult.success) {
            this.successMessage.innerHTML = `
                <h3>🎉 Thank You!</h3>
                <p>Your school information has been successfully submitted.</p>
                <p><strong>✓ File Downloaded:</strong> ${filename}</p>
                <p style="margin-top: 15px; padding: 15px; background: #e8f5e8; border-radius: 8px; border-left: 4px solid #28a745;">
                    <strong>Next Steps:</strong><br>
                    • Check your Downloads folder for the JSON file<br>
                    • Share this file with your timetable coordinator<br>
                    • You can now set up teacher timetable forms
                </p>
                <details style="margin-top: 15px;">
                    <summary style="cursor: pointer; font-weight: bold; color: #4facfe;">📄 View Generated Data</summary>
                    <textarea id="jsonOutput" style="width: 100%; height: 200px; font-family: monospace; font-size: 11px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; margin-top: 10px;" readonly>${downloadResult.jsonString}</textarea>
                    <button onclick="schoolFormInstance.copyToClipboard()" style="padding: 6px 12px; background: #4facfe; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 8px; font-size: 14px;">Copy JSON</button>
                </details>
            `;
        } else {
            this.successMessage.innerHTML = `
                <h3>🎉 Thank You!</h3>
                <p>Your school information has been successfully submitted.</p>
                <p><strong>⚠️ Automatic download not available</strong></p>
                <p>Please copy the JSON data below and save it as: <strong>${filename}</strong></p>
                <textarea id="jsonOutput" style="width: 100%; height: 250px; font-family: monospace; font-size: 12px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; margin: 10px 0;" readonly>${downloadResult.jsonString}</textarea>
                <button onclick="schoolFormInstance.copyToClipboard()" style="padding: 8px 16px; background: #4facfe; color: white; border: none; border-radius: 5px; cursor: pointer;">Copy JSON</button>
                <p style="margin-top: 10px; font-size: 14px; color: #666;">
                    Right-click in the text area above → Select All → Copy, then paste into a text file and save as ${filename}
                </p>
            `;
        }
        
        this.successMessage.style.display = 'block';
        this.successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    copyToClipboard() {
        const textarea = document.getElementById('jsonOutput');
        if (textarea) {
            textarea.select();
            textarea.setSelectionRange(0, 99999);
            
            try {
                document.execCommand('copy');
                alert('JSON copied to clipboard!');
            } catch (err) {
                alert('Failed to copy. Please select the text and copy manually.');
            }
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        // Collect form data
        const formData = new FormData(this.form);
        
        // Create school data structure
        const schoolData = this.createSchoolData(formData);
        
        // Generate filename
        const schoolName = formData.get('schoolName');
        const filename = schoolName.replace(/\s+/g, '') + 'Info.json';
        
        // Download file and show success message
        const downloadResult = this.downloadJSON(schoolData, filename);
        this.showSuccessMessage(filename, downloadResult);
    }
}

// Initialize the form when the page loads
let schoolFormInstance;

document.addEventListener('DOMContentLoaded', function() {
    schoolFormInstance = new SchoolForm();
});

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchoolForm;
}










// Teacher Form JavaScript
class TeacherForm {
    constructor() {
        this.currentStep = 1;
        this.teacherData = {
            classes: [],
            timetable: {}
        };
        this.periods = ['1', '2', '3', '4', '5A', '5B', '6', '7', '8']; // Default periods
        this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        
        this.form = document.getElementById('teacherForm');
        this.successMessage = document.getElementById('successMessage');
        
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        
        // Load school periods if available (from localStorage or API)
        this.loadSchoolPeriods();
    }

    loadSchoolPeriods() {
        // Try to load periods from school data (you can customize this)
        const schoolData = localStorage.getItem('schoolData');
        if (schoolData) {
            try {
                const data = JSON.parse(schoolData);
                if (data.schoolInfo && data.schoolInfo.period_names) {
                    this.periods = JSON.parse(data.schoolInfo.period_names);
                }
            } catch (e) {
                console.log('Using default periods');
            }
        }
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep === 2) {
                this.collectClassData();
                this.generateTimetables();
            }
            if (this.currentStep === 3) {
                this.collectTimetableData();
                this.generateReview();
            }
            
            this.currentStep++;
            this.showStep(this.currentStep);
        }
    }

    prevStep() {
        this.currentStep--;
        this.showStep(this.currentStep);
    }

    showStep(step) {
        document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.step-item').forEach(s => s.classList.remove('active'));
        
        document.getElementById(`step${step}`).classList.add('active');
        document.querySelector(`[data-step="${step}"]`).classList.add('active');
    }

    validateCurrentStep() {
        const currentStepEl = document.getElementById(`step${this.currentStep}`);
        const requiredFields = currentStepEl.querySelectorAll('[required]');
        
        for (let field of requiredFields) {
            if (!field.value.trim()) {
                alert('Please fill in all required fields');
                field.focus();
                return false;
            }
        }

        if (this.currentStep === 2) {
            const classEntries = document.querySelectorAll('.class-entry');
            if (classEntries.length === 0) {
                alert('Please add at least one class');
                return false;
            }
        }

        return true;
    }

    addClass() {
        const container = document.getElementById('classContainer');
        const newClass = document.createElement('div');
        newClass.className = 'class-entry';
        newClass.innerHTML = `
            <div class="class-row">
                <div class="form-group">
                    <label>Class Name *</label>
                    <input type="text" name="className" required placeholder="e.g., 7A, 10 History, Year 9 Science">
                </div>
                <div class="form-group">
                    <label>Subject *</label>
                    <input type="text" name="subject" required placeholder="e.g., Mathematics, English, Science">
                </div>
                <div class="form-group">
                    <label>Lessons per cycle *</label>
                    <input type="number" name="lessonsPerCycle" required min="1" max="20" placeholder="3">
                </div>
                <div class="form-group">
                    <button type="button" class="btn btn-danger" onclick="teacherFormInstance.removeClass(this)">Remove</button>
                </div>
            </div>
        `;
        container.appendChild(newClass);
    }

    removeClass(button) {
        const container = document.getElementById('classContainer');
        if (container.children.length > 1) {
            button.closest('.class-entry').remove();
        } else {
            alert('You must have at least one class');
        }
    }

    collectClassData() {
        this.teacherData.classes = [];
        const classEntries = document.querySelectorAll('.class-entry');
        
        classEntries.forEach((entry, index) => {
            const className = entry.querySelector('[name="className"]').value;
            const subject = entry.querySelector('[name="subject"]').value;
            const lessonsPerCycle = parseInt(entry.querySelector('[name="lessonsPerCycle"]').value);
            
            this.teacherData.classes.push({
                id: index,
                name: className,
                subject: subject,
                lessonsPerCycle: lessonsPerCycle,
                periods: []
            });
        });
    }

    generateTimetables() {
        const container = document.getElementById('timetableContainer');
        container.innerHTML = '';

        this.teacherData.classes.forEach((classInfo, classIndex) => {
            const classSection = document.createElement('div');
            classSection.innerHTML = `
                <div class="class-header">
                    ${classInfo.name} - ${classInfo.subject} (${classInfo.lessonsPerCycle} lessons per cycle)
                </div>
            `;

            const weekTable = this.createTimetableTable(classIndex, 'Week 1');
            classSection.appendChild(weekTable);
            container.appendChild(classSection);
        });
    }

    createTimetableTable(classIndex, weekLabel) {
        const tableContainer = document.createElement('div');
        tableContainer.className = 'timetable-grid';
        
        const table = document.createElement('table');
        table.className = 'timetable-table';
        
        // Header row
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `<th>${weekLabel}</th>` + this.days.map(day => `<th>${day}</th>`).join('');
        table.appendChild(headerRow);

        // Period rows
        this.periods.forEach(period => {
            const row = document.createElement('tr');
            row.innerHTML = `<td><strong>${period}</strong></td>`;
            
            this.days.forEach(day => {
                const cell = document.createElement('td');
                cell.className = 'period-cell';
                cell.textContent = 'Click to select';
                cell.dataset.class = classIndex;
                cell.dataset.week = weekLabel;
                cell.dataset.day = day;
                cell.dataset.period = period;
                
                cell.addEventListener('click', function() {
                    this.classList.toggle('selected');
                });
                
                row.appendChild(cell);
            });
            
            table.appendChild(row);
        });

        tableContainer.appendChild(table);
        return tableContainer;
    }

    collectTimetableData() {
        this.teacherData.classes.forEach(classInfo => {
            classInfo.periods = [];
        });

        document.querySelectorAll('.period-cell.selected').forEach(cell => {
            const classIndex = parseInt(cell.dataset.class);
            const week = cell.dataset.week;
            const day = cell.dataset.day;
            const period = cell.dataset.period;
            
            this.teacherData.classes[classIndex].periods.push({
                week: week,
                day: day,
                period: period
            });
        });
    }

    generateReview() {
        const teacherName = document.getElementById('teacherName').value;
        const plannerSize = document.getElementById('plannerSize').value;
        const plannerLayout = document.getElementById('plannerLayout').value;
        
        document.getElementById('reviewTeacherInfo').innerHTML = `
            <p><strong>Name:</strong> ${teacherName}</p>
            <p><strong>Planner Size:</strong> ${plannerSize}</p>
            <p><strong>Planner Layout:</strong> ${plannerLayout === 'day' ? 'One day per page' : 'Week to a view'}</p>
        `;

        const reviewClasses = document.getElementById('reviewClasses');
        reviewClasses.innerHTML = '';

        this.teacherData.classes.forEach(classInfo => {
            const classDiv = document.createElement('div');
            classDiv.className = 'review-class';
            
            const periodsList = classInfo.periods.map(p => 
                `${p.day} ${p.period}`
            ).join(', ');

            classDiv.innerHTML = `
                <h4>${classInfo.name} - ${classInfo.subject}</h4>
                <p><strong>Lessons per cycle:</strong> ${classInfo.lessonsPerCycle}</p>
                <p><strong>Selected periods:</strong> ${periodsList || 'None selected'}</p>
                <div class="period-list">
                    ${classInfo.periods.map(p => 
                        `<span class="period-badge">${p.day} ${p.period}</span>`
                    ).join('')}
                </div>
            `;
            
            reviewClasses.appendChild(classDiv);
        });
    }

    editTimetable() {
        this.currentStep = 3;
        this.showStep(this.currentStep);
    }

    createTeacherData() {
        const teacherName = document.getElementById('teacherName').value;
        const plannerSize = document.getElementById('plannerSize').value;
        const plannerLayout = document.getElementById('plannerLayout').value;

        return {
            teacherInfo: {
                name: teacherName,
                plannerPreferences: {
                    size: plannerSize,
                    layout: plannerLayout
                }
            },
            classes: this.teacherData.classes,
            submissionDate: new Date().toISOString()
        };
    }

    downloadJSON(data, filename) {
        try {
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = filename;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
            
            return { success: true, jsonString };
        } catch (error) {
            console.error('Download failed:', error);
            return { success: false, error, jsonString: JSON.stringify(data, null, 2) };
        }
    }

    showSuccessMessage(filename, downloadResult) {
        if (downloadResult.success) {
            this.successMessage.innerHTML = `
                <h3>🎉 Thank You!</h3>
                <p>Your teacher timetable has been successfully submitted.</p>
                <p><strong>✓ File Downloaded:</strong> ${filename}</p>
                <p style="margin-top: 15px; padding: 15px; background: #e8f5e8; border-radius: 8px; border-left: 4px solid #28a745;">
                    <strong>Next Steps:</strong><br>
                    • Check your Downloads folder for the JSON file<br>
                    • Share this file with your timetable coordinator<br>
                    • Your planner will be prepared according to your preferences
                </p>
                <details style="margin-top: 15px;">
                    <summary style="cursor: pointer; font-weight: bold; color: #4facfe;">📄 View Generated Data</summary>
                    <textarea id="jsonOutput" style="width: 100%; height: 200px; font-family: monospace; font-size: 11px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; margin-top: 10px;" readonly>${downloadResult.jsonString}</textarea>
                    <button onclick="teacherFormInstance.copyToClipboard()" style="padding: 6px 12px; background: #4facfe; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 8px; font-size: 14px;">Copy JSON</button>
                </details>
            `;
        } else {
            this.successMessage.innerHTML = `
                <h3>🎉 Thank You!</h3>
                <p>Your teacher timetable has been successfully submitted.</p>
                <p><strong>⚠️ Automatic download not available</strong></p>
                <p>Please copy the JSON data below and save it as: <strong>${filename}</strong></p>
                <textarea id="jsonOutput" style="width: 100%; height: 250px; font-family: monospace; font-size: 12px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; margin: 10px 0;" readonly>${downloadResult.jsonString}</textarea>
                <button onclick="teacherFormInstance.copyToClipboard()" style="padding: 8px 16px; background: #4facfe; color: white; border: none; border-radius: 5px; cursor: pointer;">Copy JSON</button>
            `;
        }
        
        this.successMessage.style.display = 'block';
        this.successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide the form
        document.querySelector('.step.active').style.display = 'none';
    }

    copyToClipboard() {
        const textarea = document.getElementById('jsonOutput');
        if (textarea) {
            textarea.select();
            textarea.setSelectionRange(0, 99999);
            
            try {
                document.execCommand('copy');
                alert('JSON copied to clipboard!');
            } catch (err) {
                alert('Failed to copy. Please select the text and copy manually.');
            }
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Create final data structure
        const finalData = this.createTeacherData();
        
        // Generate filename
        const teacherName = document.getElementById('teacherName').value;
        const cleanTeacherName = teacherName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        const today = new Date();
        const dateString = today.getFullYear() + '-' + 
                          String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(today.getDate()).padStart(2, '0');

        const filename = `teacher-timetable-${cleanTeacherName}-${dateString}.json`;
        
        // Download file and show success message
        const downloadResult = this.downloadJSON(finalData, filename);
        this.showSuccessMessage(filename, downloadResult);
    }
}

// Initialize the teacher form when the page loads
let teacherFormInstance;

document.addEventListener('DOMContentLoaded', function() {
    teacherFormInstance = new TeacherForm();
});

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TeacherForm;
}