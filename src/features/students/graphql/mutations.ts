
/**
 * GraphQL Mutations for Students Management
 */
export const INSERT_STUDENT_MUTATION = `
  mutation InsertStudent($input: StudentInfoInsertInput!) {
    insertStudentInfo(input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

export const UPDATE_STUDENT_MUTATION = `
  mutation UpdateStudent($filter: String!, $input: StudentInfoUpdateInput!) {
    updateStudentInfo(filter: $filter, input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

export const DELETE_STUDENT_MUTATION = `
  mutation DeleteStudent($filter: String!, $input: StudentInfoDeleteInput!) {
    deleteStudentInfo(filter: $filter, input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;
