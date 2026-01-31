# Bulk Student Upload Feature

## Overview
Added CSV bulk upload functionality to allow admins to add multiple students at once. The age field is already visible in the students table.

## Features Implemented

### 1. CSV Bulk Upload
- **Upload Button** - New "Bulk Upload" button in Students page header
- **Modal Interface** - Clean modal with instructions and file upload
- **Template Download** - Download pre-formatted CSV template with sample data
- **File Validation** - Only accepts .csv files
- **Progress Indicator** - Shows uploading state with animation

### 2. CSV Template
The template includes all student fields:

**Required Fields:**
- `full_name` - Student's full name
- `phone` - Contact number (10 digits minimum)

**Optional Fields:**
- `email` - Email address
- `time_slot` - MORNING, AFTERNOON, EVENING, or FULL_DAY
- `gender` - MALE, FEMALE, or OTHER
- `date_of_birth` - YYYY-MM-DD or DD/MM/YYYY format
- `father_name` - Father's name
- `emergency_contact` - Emergency contact number
- `preparing_for` - What exam/course (e.g., UPSC, JEE)
- `qualification` - Current qualification/class
- `education_level` - SCHOOL, COLLEGE, UNIVERSITY, COMPETITIVE_EXAM, or OTHER
- `institution_name` - School/College name
- `address` - Full address

### 3. Backend Processing
- **CSV Parser** - Reads and validates CSV data
- **Error Handling** - Collects errors for each row
- **Batch Creation** - Creates all valid students
- **Response** - Returns count of created students and any errors

### 4. Age Display
The age field is already visible in the students table:
- Calculated from `date_of_birth` field
- Displayed in "Age" column
- Shows "-" if date of birth not provided
- Format: "25 yrs"

## Technical Implementation

### Backend Changes

**File**: `apps/students/views.py`

Added `StudentBulkUploadView` class:
- Accepts CSV file upload
- Validates file type (.csv only)
- Parses CSV using Python's csv.DictReader
- Validates required fields (full_name, phone)
- Handles optional fields with defaults
- Parses dates in multiple formats (YYYY-MM-DD, DD/MM/YYYY)
- Validates enum fields (time_slot, gender, education_level)
- Creates students with library association
- Returns success count and error list

**File**: `apps/students/urls.py`
- Added URL: `POST /api/v1/students/bulk-upload/`

### Frontend Changes

**File**: `frontend-web/src/pages/admin/Students.jsx`

Added:
- `showBulkUploadModal` state
- `csvFile` state
- `uploading` state
- `handleBulkUpload()` function
- `downloadCSVTemplate()` function
- Bulk Upload button in header
- Bulk Upload modal with:
  - Instructions section
  - Download template button
  - File upload input
  - Field information
  - Upload button with loading state

**File**: `frontend-web/src/services/studentService.js`
- Added `bulkUploadStudents(file)` method

**File**: `frontend-web/src/config/api.js`
- Added `STUDENT_BULK_UPLOAD` endpoint

## How to Use

### Step 1: Download Template
1. Login as library owner
2. Go to Students page
3. Click "Bulk Upload" button
4. Click "Download CSV Template"
5. Template file `students_template.csv` downloads

### Step 2: Fill Template
Open the CSV in Excel or Google Sheets:
```csv
full_name,phone,email,time_slot,gender,date_of_birth,father_name,emergency_contact,preparing_for,qualification,education_level,institution_name,address
"John Doe","9876543210","john@example.com","MORNING","MALE","2000-01-15","Robert Doe","9876543211","UPSC","12th Grade","SCHOOL","ABC School","123 Main St, City"
"Jane Smith","9876543212","jane@example.com","AFTERNOON","FEMALE","1999-05-20","Michael Smith","9876543213","JEE","12th Grade","SCHOOL","XYZ School","456 Oak Ave, Town"
```

### Step 3: Upload CSV
1. Click "Select CSV File" in the modal
2. Choose your filled CSV file
3. Click "Upload Students"
4. Wait for processing
5. Success message shows count of created students
6. If errors occur, check browser console for details

## CSV Format Rules

### Required Fields
- **full_name**: Cannot be empty
- **phone**: Cannot be empty, must be digits

### Time Slot Values
- MORNING
- AFTERNOON
- EVENING
- FULL_DAY
- Default: MORNING (if invalid or empty)

### Gender Values
- MALE
- FEMALE
- OTHER
- Default: null (if invalid or empty)

### Date Format
- YYYY-MM-DD (e.g., 2000-01-15)
- DD/MM/YYYY (e.g., 15/01/2000)
- Invalid dates are ignored (set to null)

### Education Level Values
- SCHOOL
- COLLEGE
- UNIVERSITY
- COMPETITIVE_EXAM
- OTHER
- Default: null (if invalid or empty)

## Error Handling

### Frontend
- Validates file type (.csv only)
- Shows uploading state
- Displays success/error toasts
- Logs errors to console

### Backend
- Validates CSV format
- Checks required fields per row
- Validates enum values
- Parses dates safely
- Collects errors per row
- Returns detailed error messages

### Error Response Format
```json
{
  "message": "Successfully created 8 students",
  "created_count": 8,
  "errors": [
    "Row 3: Missing required fields (full_name, phone)",
    "Row 5: Invalid phone number"
  ]
}
```

## Age Calculation

The age is automatically calculated from `date_of_birth`:
- Calculated in the Student model's `age` property
- Accounts for leap years
- Returns null if date_of_birth not set
- Displayed in students table

## Example CSV Data

```csv
full_name,phone,email,time_slot,gender,date_of_birth,father_name,emergency_contact,preparing_for,qualification,education_level,institution_name,address
"Rahul Kumar","9876543210","rahul@example.com","MORNING","MALE","2000-01-15","Suresh Kumar","9876543211","UPSC","B.A.","UNIVERSITY","Delhi University","123 Main St, Delhi"
"Priya Sharma","9876543212","priya@example.com","AFTERNOON","FEMALE","1999-05-20","Rajesh Sharma","9876543213","JEE","12th Grade","SCHOOL","DPS School","456 Oak Ave, Mumbai"
"Amit Patel","9876543214","","EVENING","MALE","2001-08-10","Vijay Patel","9876543215","NEET","12th Grade","SCHOOL","","789 Park Rd, Ahmedabad"
"Sneha Reddy","9876543216","sneha@example.com","FULL_DAY","FEMALE","","Ramesh Reddy","","CA","B.Com","COLLEGE","Commerce College","321 Lake View, Hyderabad"
```

## Benefits

1. **Time Saving** - Add 100+ students in seconds
2. **Bulk Operations** - Import entire batches at once
3. **Data Migration** - Easy to migrate from other systems
4. **Template Based** - Consistent data format
5. **Error Reporting** - Know exactly which rows failed
6. **Flexible** - Optional fields can be left empty

## Testing

1. **Valid CSV**:
   - Create CSV with 5 students
   - All required fields filled
   - Upload and verify all created

2. **Missing Required Fields**:
   - Create CSV with empty full_name
   - Upload and verify error message

3. **Invalid Enum Values**:
   - Use invalid time_slot (e.g., "NIGHT")
   - Verify defaults to MORNING

4. **Date Formats**:
   - Test YYYY-MM-DD format
   - Test DD/MM/YYYY format
   - Verify age calculation

5. **Large File**:
   - Upload CSV with 100+ students
   - Verify all created successfully

## Future Enhancements

Possible improvements:
- Update existing students via CSV
- Export students to CSV
- Validate phone numbers more strictly
- Support Excel (.xlsx) files
- Preview data before upload
- Drag and drop file upload
- Progress bar for large uploads
- Duplicate detection
- Auto-assign seats during upload
- Send welcome SMS/email after upload
