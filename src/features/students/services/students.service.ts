/**
 * GraphQL Students Service
 *
 * This service provides GraphQL-based operations for students management.
 * It follows the same patterns as the existing inventory service but uses StudentInfo schema.
 */

import { graphqlClient } from 'lib/graphql-client';
import {
  AddStudentResponse,
  AddStudentParams,
  UpdateStudentResponse,
  UpdateStudentParams,
  DeleteStudentResponse,
} from '../types/students.types';
import { GET_STUDENTS_QUERY } from '../graphql/queries';
import {
  INSERT_STUDENT_MUTATION,
  UPDATE_STUDENT_MUTATION,
  DELETE_STUDENT_MUTATION,
} from '../graphql/mutations';

/**
 * Fetches paginated students with filtering and sorting
 */
export const getStudents = async (context: {
  queryKey: [string, { pageNo: number; pageSize: number }];
}) => {
  const [, { pageNo, pageSize }] = context.queryKey;
  return graphqlClient.query({
    query: GET_STUDENTS_QUERY,
    variables: {
      input: {
        filter: '{}',
        sort: '{}',
        pageNo,
        pageSize,
      },
    },
  });
};

/**
 * Inserts a new student (GraphQL)
 */
export const addStudent = async (
  params: AddStudentParams
): Promise<AddStudentResponse> => {
  const response = await graphqlClient.mutate<AddStudentResponse>({
    query: INSERT_STUDENT_MUTATION,
    variables: params,
  });
  return response;
};

/**
 * Updates an existing student
 */
export const updateStudent = async (
  params: UpdateStudentParams
): Promise<UpdateStudentResponse> => {
  const response = await graphqlClient.mutate<UpdateStudentResponse>({
    query: UPDATE_STUDENT_MUTATION,
    variables: params,
  });
  return response;
};

/**
 * Deletes a student by ID
 */
export const deleteStudent = async (
  filter: string,
  input: { isHardDelete: boolean }
): Promise<DeleteStudentResponse> => {
  const response = await graphqlClient.mutate<DeleteStudentResponse>({
    query: DELETE_STUDENT_MUTATION,
    variables: { filter, input },
  });
  return response;
};