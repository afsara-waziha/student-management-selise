
/**
 * GraphQL Queries for Students Management
 */
export const GET_STUDENTS_QUERY = `
  query StudentInfos($input: DynamicQueryInput) {
    StudentInfos(input: $input) {
      hasNextPage
      hasPreviousPage
      totalCount
      totalPages
      pageSize
      pageNo
      items {
        ItemId
        Name
        StudentId
        Email
        Course
        Section
        Grade
        CreatedBy
        CreatedDate
        LastUpdatedBy
        LastUpdatedDate
        OrganizationIds
        IsDeleted
        Tags
        Language
      }
    }
  }
`;



// export const GET_STUDENTS_QUERY = `
//   query STUDENTS($input: DynamicQueryInput) {
//     STUDENTS(input: $input) {
//       hasNextPage
//       hasPreviousPage
//       totalCount
//       totalPages
//       pageSize
//       pageNo
//       items {
//         ItemId
//         Name
//         StudentId
//         Email
//         Course
//         Section
//         Grade
//       }
//     }
//   }
// `;


// src/features/students/graphql/queries.ts
// export const GET_STUDENTS_QUERY = `
//   query Students($input: DynamicQueryInput) {
//     Students(input: $input) {
//       hasNextPage
//       hasPreviousPage
//       totalCount
//       totalPages
//       pageSize
//       pageNo
//       items {
//         StudentId
//         Name
//         Email
//         Course
//         Section
//         Grade
//         Status
//         ProfileImageFileId
//         ProfileImageFileIds
//         CreatedBy
//         CreatedDate
//         LastUpdatedBy
//         LastUpdatedDate
//         OrganizationIds
//         IsDeleted
//         Tags
//         Language
//       }
//     }
//   }
// `;

