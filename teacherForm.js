<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teacher Timetable Form</title>
    <link rel="stylesheet" href="school-form.css">
    <link rel="stylesheet" href="teacher-form.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Teacher Timetable Form</h1>
            <p>Please provide your teaching details and timetable preferences</p>
        </div>

        <div class="form-container">
            <div class="step-indicator">
                <div class="step-item active" data-step="1">1. Teacher Details</div>
                <div class="step-item" data-step="2">2. Classes & Subjects</div>
                <div class="step-item" data-step="3">3. Timetable Periods</div>
                <div class="step-item" data-step="4">4. Review & Submit</div>
            </div>

            <form id="teacherForm">
                <!-- Step 1: Teacher Details -->
                <div class="step active" id="step1">
                    <h2>Step 1: Teacher Information</h2>
                    
                    <div class="form-group">
                        <label for="teacherName">Your name as it should appear in the planner *</label>
                        <input type="text" id="teacherName" name="teacherName" required placeholder="e.g., Mr. Smith, Dr. Johnson, Ms. Brown">
                    </div>

                    <div class="section">
                        <h2>Planner Preferences</h2>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="plannerSize">Preferred planner size *</label>
                                <select id="plannerSize" name="plannerSize" required>
                                    <option value="">Select planner size</option>
                                    <option value="A4">A4 (Larger format)</option>
                                    <option value="A5">A5 (Compact format)</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="plannerLayout">Preferred layout *</label>
                                <select id="plannerLayout" name="plannerLayout" required>
                                    <option value="">Select layout preference</option>
                                    <option value="day">One day per page</option>
                                    <option value="week">Week to a view</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="navigation">
                        <button type="button" class="btn btn-primary" onclick="teacherFormInstance.nextStep()">Next</button>
                    </div>
                </div>

                <!-- Step 2: Classes and Subjects -->
                <div class="step" id="step2">
                    <h2>Step 2: Classes and Subjects</h2>
                    <p>Add each class you teach, the subject, and how many lessons per cycle.</p>

                    <div id="classContainer">
                        <div class="class-entry">
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
                        </div>
                    </div>

                    <button type="button" class="btn btn-secondary" onclick="teacherFormInstance.addClass()">Add Another Class</button>

                    <div class="navigation">
                        <button type="button" class="btn btn-secondary" onclick="teacherFormInstance.prevStep()">Previous</button>
                        <button type="button" class="btn btn-primary" onclick="teacherFormInstance.nextStep()">Next</button>
                    </div>
                </div>

                <!-- Step 3: Timetable Selection -->
                <div class="step" id="step3">
                    <h2>Step 3: Select Teaching Periods</h2>
                    <p>For each class, click on the periods when you teach that class.</p>
                    
                    <div id="timetableContainer">
                        <!-- Timetable grids will be generated here -->
                    </div>

                    <div class="navigation">
                        <button type="button" class="btn btn-secondary" onclick="teacherFormInstance.prevStep()">Previous</button>
                        <button type="button" class="btn btn-primary" onclick="teacherFormInstance.nextStep()">Review</button>
                    </div>
                </div>

                <!-- Step 4: Review and Submit -->
                <div class="step" id="step4">
                    <h2>Step 4: Review Your Information</h2>
                    
                    <div class="review-section">
                        <h3>Teacher Details</h3>
                        <div id="reviewTeacherInfo"></div>
                    </div>

                    <div class="review-section">
                        <h3>Classes and Timetable</h3>
                        <div id="reviewClasses"></div>
                    </div>

                    <div class="navigation">
                        <button type="button" class="btn btn-secondary" onclick="teacherFormInstance.prevStep()">Previous</button>
                        <button type="button" class="btn btn-primary" onclick="teacherFormInstance.editTimetable()">Edit Timetable</button>
                        <button type="submit" class="btn btn-success">Submit Teacher Information</button>
                    </div>
                </div>
            </form>

            <div id="successMessage" class="success-message" style="display: none;">
                <!-- Success message will appear here -->
            </div>
        </div>
    </div>

    <script src="school-form.js"></script>
    <script src="teacher-form.js"></script>
</body>
</html>