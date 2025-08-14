# Student Feature Documentation

This module implements the **Student Management** functionality in the project.

## Overview
The Student feature allows you to:
- View the list of students.
- Add a new student with details such as name, ID, email, grade, course, and section.
- Update student information.
- Delete students from the system.
- Search and filter students.

## File Structure
```
features/student/
┣ component/
┃ ┣ advance-data-table/
┃ ┣ advance-table-columns/
┃ ┣ advance-expand-row-content/
┃ ┣ ...
┣ student-page.tsx
┣ student-form.tsx
┣ index.ts
```

## Key Components
- **AdvanceDataTable** → Renders the student table with pagination and filters.
- **AdvanceStudentDetails** → Shows expanded student details.
- **StudentForm** → Handles creating and updating student information.

## API Integration
The feature uses GraphQL/REST (based on your setup) to:
- **Query**: Fetch all students with pagination.
- **Mutation**: Insert, update, and delete student records.

## Permissions
Actions can be controlled via RBAC:
- `students.read`
- `students.create`
- `students.update`
- `students.delete`

## Usage
To include this feature in routing:
```tsx
<Route path="/students" element={<StudentPage />} />
```
