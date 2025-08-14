/**
 * GraphQL Types for Students Management
 *
 * This file contains TypeScript interfaces and types for GraphQL operations
 * related to students management, following the same patterns as REST API types.
 */

export enum StudentStatus {
    ACTIVE = 'Active',
    INACTIVE = 'Inactive',
  }
  
  export const statusColors: Record<StudentStatus, string> = {
    [StudentStatus.ACTIVE]: 'success',
    [StudentStatus.INACTIVE]: 'low-emphasis',
  };
  
  export const courseOptions = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Economics',
  ];
  
  export const sectionOptions = ['A', 'B', 'C', 'D'];

  export const gradeOptions = ['A+', 'A', 'B+', 'B', 'C', 'D', 'F'];
  
  export interface StudentItem {
    ItemId: string;
    Name: string;
    StudentId: string;
    Email: string;
    Course: string;
    Section: string;
    Grade?: string;
    CreatedBy?: string;
    CreatedDate?: string;
    LastUpdatedBy?: string;
    LastUpdatedDate?: string;
    IsDeleted?: boolean;
  }
  
  export interface GetStudentsResponse {
    students: {
      items: StudentItem[];
      totalCount: number;
      pageInfo: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor: string;
        endCursor: string;
      };
    };
  }
  
  export interface GetStudentItemResponse {
    student: StudentItem;
  }
  
  export interface AddStudentInput {
    Name: string;
    StudentId: string;
    Email: string;
    Course: string;
    Section: string;
    Grade?: string;

  }
  
  export interface AddStudentParams {
    input: AddStudentInput;
  }
  
  export interface AddStudentResponse {
    insertStudentInfo: {
      itemId: string;
      totalImpactedData: number;
      acknowledged: boolean;
    };
  }
  
  export interface UpdateStudentInput {
    Name?: string;
    StudentId?: string;
    Email?: string;
    Course?: string;
    Section?: string;
    Grade?: string;
  }
  
  export interface UpdateStudentParams {
    filter: string;
    input: UpdateStudentInput;
  }
  
  export interface UpdateStudentResponse {
    updateStudentInfo: {
      itemId: string;
      totalImpactedData: number;
      acknowledged: boolean;
    };
  }
  
  export interface DeleteStudentResponse {
    deleteStudentInfo: {
      itemId: string;
      totalImpactedData: number;
      acknowledged: boolean;
    };
  }