
import { useGlobalQuery, useGlobalMutation } from 'state/query-client/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from 'hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useErrorHandler } from 'hooks/use-error-handler';
import { AddStudentParams, UpdateStudentParams } from '../types/students.types';
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from '../services/students.service';

/**
 * GraphQL Students Hooks
 *
 * Mirrors the Inventory hooks file exactly in structure and options.
 */

interface StudentsQueryParams {
  pageNo: number;
  pageSize: number;
}

/**
 * Hook to fetch students with pagination
 */
export const useGetStudents = (params: StudentsQueryParams) => {
  return useGlobalQuery({
    queryKey: ['students', params],
    queryFn: getStudents,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    onError: (error) => {
      throw error;
    },
  });
};

/**
 * Hook to insert a new student
 * @example
 * const { mutate: insertStudent, isPending } = useAddStudent();
 * insertStudent({ input: studentData });
 */

export const useAddStudent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useGlobalMutation({
    mutationFn: (params: AddStudentParams) => addStudent(params),
    onSuccess: (data: any) => {
      // exactly like inventory
      queryClient.invalidateQueries({ predicate: (q) => q.queryKey[0] === 'students' });
      queryClient.refetchQueries({ predicate: (q) => q.queryKey[0] === 'students', type: 'active' });

      if (data.insertStudentInfo?.acknowledged) {
        toast({ variant: 'success', title: t('STUDENT_ADDED'), description: t('STUDENT_SUCCESSFULLY_CREATED') });
      }
    },
    onError: (error) => {
      throw error;
    }
  });
};

/**
 * Hook to update an existing student
 * @example
 * const { mutate: updateStudentMut, isPending } = useUpdateStudent();
 * updateStudentMut({ filter: 'item-123', input: { Name: 'Updated Name' } });
 */
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation({
    mutationFn: (params: UpdateStudentParams) => updateStudent(params),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'students',
      });

      queryClient.refetchQueries({
        predicate: (query) => query.queryKey[0] === 'students',
        type: 'active',
      });

      if (data.updateStudentInfo?.acknowledged) {
        toast({
          variant: 'success',
          title: t('STUDENT_UPDATED'),
          description: t('STUDENT_SUCCESSFULLY_UPDATED'),
        });
      } else {
        handleError(
          { error: { title: 'UNABLE_UPDATE_STUDENT', message: t('UNABLE_UPDATE_STUDENT') } },
          { variant: 'destructive' }
        );
      }
    },
    onError: (error) => {
      handleError(error, { variant: 'destructive' });
    },
  });
};

/**
 * Hook to delete a student by filter (e.g., itemId)
 * @example
 * const { mutate: deleteStudentMut, isPending } = useDeleteStudent();
 * deleteStudentMut({ filter: 'item-123', input: { isHardDelete: false } });
 */
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation({
    mutationFn: ({ filter, input }: { filter: string; input: { isHardDelete: boolean } }) =>
      deleteStudent(filter, input),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'students',
      });

      queryClient.refetchQueries({
        predicate: (query) => query.queryKey[0] === 'students',
        type: 'active',
      });

      if (data.deleteStudentInfo?.acknowledged) {
        toast({
          variant: 'success',
          title: t('STUDENT_DELETED'),
          description: t('STUDENT_SUCCESSFULLY_DELETED'),
        });
      } else {
        handleError(
          { error: { title: 'UNABLE_DELETE_STUDENT', message: t('UNABLE_DELETE_STUDENT') } },
          { variant: 'destructive' }
        );
      }
    },
    onError: (error) => {
      handleError(error, { variant: 'destructive' });
    },
  });
};
