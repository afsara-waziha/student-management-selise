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
src/features/students/
 ├── component/
 │   ├── advance-student-details/advance-student-details.tsx
 │   ├── advance-data-table/advance-data-table.tsx
 │   ├── advance-expand-row-content/advance-expand-row-content.tsx
 │   ├── advance-table-columns-toolbar/advance-table-columns-toolbar.tsx
 │   ├── advance-table-columns/advance-table-columns.tsx
 │   ├── advance-table-filter-toolbar/advance-table-filter-toolbar.tsx
 │   ├── advance-table-view-options/advance-table-view-options.tsx
 │   ├── student-form/student-form.tsx
 │   └── student-form/general-info-form.tsx
 ├── graphql/
 │   ├── mutations.ts
 │   └── queries.ts
 ├── hooks/
 │   ├── use-students.ts
 │   └── use-storage.ts
 ├── services/
 │   ├── students.service.ts
 │   └── storage.service.ts
 ├── types/
 │   └── students.types.ts
 └── index.ts

```

```
src/pages/students/
 ├── students-details.tsx
 └── students.tsx
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
