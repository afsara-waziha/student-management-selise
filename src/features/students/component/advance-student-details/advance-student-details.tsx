
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Pen, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from 'components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Separator } from 'components/ui/separator';
import { Label } from 'components/ui/label';
import { Input } from 'components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from 'components/ui/select';
import { Skeleton } from 'components/ui/skeleton';
import PlaceHolderImage from 'assets/images/image_off_placeholder.webp';

import { useGetStudents, useUpdateStudent, useDeleteStudent } from 'features/students/hooks/use-students';
import { StudentItem } from 'features/students/types/students.types';

type GradeOption = string;

const gradeOptions: GradeOption[] = ['A+', 'A', 'B+', 'B', 'C', 'D', 'F'];

export function AdvanceStudentDetails() {
  const [selectedImage, setSelectedImage] = useState('');
  const [editDetails, setEditDetails] = useState(false);
  const [editedFields, setEditedFields] = useState<Record<string, any>>({});
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { studentId: id } = useParams(); // route: /students/:studentId
  
  const { studentId } = useParams(); // route is /students/:studentId
  // Fetch a big page and find the student locally (mirrors inventory pattern)
  const { data, isLoading } = useGetStudents({ pageNo: 1, pageSize: 1000 });
  const list = data as { StudentInfos?: { items: StudentItem[] } };
  const items = list?.StudentInfos?.items ?? [];

  const selectedStudent = useMemo(

    () => items.find((s) => String(s.ItemId) === String(studentId)),
    [items, studentId]
  );

  const { mutate: updateStudent, isPending: isUpdatePending } = useUpdateStudent();
  const { mutate: deleteStudent, isPending: isDeletePending } = useDeleteStudent();

  useEffect(() => {
    setSelectedImage(PlaceHolderImage);
  }, [selectedStudent?.ItemId]);

  const handleEditDetails = () => setEditDetails(true);
  const handleCancelEdit = () => {
    setEditDetails(false);
    setEditedFields({});
  };

  const handleUpdateDetails = async () => {
    if (!selectedStudent) return;

    const editedInput: any = {
      ...(editedFields.name && { Name: editedFields.name }),
      ...(editedFields.studentId && { StudentId: editedFields.studentId }),
      ...(editedFields.email && { Email: editedFields.email }),
      ...(editedFields.course && { Course: editedFields.course }),
      ...(editedFields.section && { Section: editedFields.section }),
      ...(editedFields.grade && { Grade: editedFields.grade }),
    };

    updateStudent(
      {
        // same style as Inventory; stringify to avoid quoting issues
        filter: JSON.stringify({ _id: String(selectedStudent.ItemId) }),
        input: editedInput,
      },
      {
        onSuccess: () => {
          setEditDetails(false);
          setEditedFields({});
        },
        onError: (error) => {
          console.error('Error updating student:', error);
        },
      }
    );
  };

  const handleFieldChange = (field: string, value: string | number) => {
    setEditedFields((prev) => ({ ...prev, [field]: value }));
  };

  const renderField = (
    label: string,
    field: keyof StudentItem | string,
    value: string | number | undefined,
    editable: boolean,
    isSelect = false,
    options: string[] = []
  ) => {
    const safeOptions = options.filter((o) => !!o && o !== '');
    const safeValue = value ?? '';

    const renderContent = () => {
      if (!editable) {
        return <span className="text-base">{String(value ?? '-')}</span>;
      }

      if (isSelect) {
        return (
          <Select defaultValue={String(safeValue)} onValueChange={(newValue) => handleFieldChange(String(field), newValue)}>
            <SelectTrigger>
              <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent>
              {safeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      return (
        <Input
          placeholder={`${t('ENTER')} ${label.toLowerCase()}`}
          defaultValue={String(safeValue)}
          onChange={(e) => handleFieldChange(String(field), e.target.value)}
        />
      );
    };

    return (
      <div className="flex flex-col gap-2">
        <Label>{label}</Label>
        {renderContent()}
      </div>
    );
  };

  const handleDelete = () => {
    if (id) {
      deleteStudent(
        { filter: `{_id: "${id}"}`, input: { isHardDelete: true } },
        {
          onSuccess: () => {
            navigate('/students');
          },
        }
      );
    }
  };

  const studentToShow = selectedStudent;

  return (
    <div className="flex flex-col w-full">
      <div className="mb-[18px] flex items-center justify-between md:mb-[24px]">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="bg-card hover:bg-card/60 rounded-full"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft />
          </Button>
          <h3 className="text-2xl font-bold tracking-tight">{studentToShow?.Name || t('STUDENTS')}</h3>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleDelete}
          disabled={isDeletePending || !id}
          aria-label={t('DELETE')}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleDelete();
          }}
        >
          <Trash className="w-3 h-3 text-destructive" />
          <span className="text-destructive text-sm font-bold sr-only sm:not-sr-only sm:whitespace-nowrap">
            {t('DELETE')}
          </span>
        </Button>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <Card className="w-full border-none rounded-[4px] shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('GENERAL_INFO')}</CardTitle>
              {!editDetails ? (
                <Button size="sm" variant="ghost" onClick={handleEditDetails}>
                  <Pen className="w-3 h-3 text-primary" />
                  <span className="text-primary text-sm font-bold sr-only sm:not-sr-only sm:whitespace-nowrap">
                    {t('EDIT')}
                  </span>
                </Button>
              ) : (
                <div className="flex items-center gap-4">
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    {t('CANCEL')}
                  </Button>
                  <Button size="sm" onClick={handleUpdateDetails} disabled={isUpdatePending}>
                    {t('UPDATE')}
                  </Button>
                </div>
              )}
            </div>
            <Separator className="mt-4" />
          </CardHeader>

          <CardContent className="w-full !pt-0">
            {isLoading ? (
              <div className="flex flex-col md:flex-row gap-14">
                <div className="flex w-full gap-6 flex-col md:w-[30%]">
                  <Skeleton className="flex p-3 items-center justify-center w-full h-64 rounded-lg border bg-muted" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-[70%]">
                  {[...Array(6)].map((_, i) => (
                    <div key={`field-skeleton-${i}`} className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-24 rounded" />
                      <Skeleton className="h-10 w-full rounded" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-14">
                {/* Left: Profile image (placeholder) */}
                <div className="flex w-full gap-6 flex-col md:w-[30%]">
                  <div className="flex p-3 items-center justify-center w-full h-64 rounded-lg border">
                    <img
                      src={selectedImage || PlaceHolderImage}
                      alt="Student"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = PlaceHolderImage;
                      }}
                    />
                  </div>
                </div>

                {/* Right: Editable fields */}
                {studentToShow ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-[70%]">
                    {renderField(t('NAME'), 'name', studentToShow.Name, editDetails)}
                    {renderField(t('STUDENT_ID'), 'studentId', studentToShow.StudentId, editDetails)}
                    {renderField(t('EMAIL'), 'email', studentToShow.Email, editDetails)}
                    {renderField(t('COURSE'), 'course', studentToShow.Course, editDetails)}
                    {renderField(t('SECTION'), 'section', studentToShow.Section, editDetails)}
                    {renderField(t('GRADE'), 'grade', studentToShow.Grade ?? '', editDetails, true, gradeOptions)}
                  </div>
                ) : (
                  <p>{t('ITEM_NOT_FOUND')}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Info (Metadata) */}
        <Card className="w-full border-none rounded-[4px] shadow-sm">
          <CardHeader>
            <CardTitle>{t('ADDITIONAL_INFO')}</CardTitle>
            <Separator className="mt-4" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 !pt-0">
            {isLoading ? (
              [...Array(4)].map((_, i) => <Skeleton key={`meta-skeleton-${i}`} className="h-10 w-full rounded" />)
            ) : studentToShow ? (
              <>
                <div className="flex flex-col gap-2">
                  <Label>{t('CREATED_DATE')}</Label>
                  <Input disabled defaultValue={studentToShow.CreatedDate ?? '-'} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>{t('LAST_UPDATED')}</Label>
                  <Input disabled defaultValue={studentToShow.LastUpdatedDate ?? '-'} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>{t('CREATED_BY')}</Label>
                  <Input disabled defaultValue={studentToShow.CreatedBy ?? '-'} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>{t('LAST_UPDATED_BY')}</Label>
                  <Input disabled defaultValue={studentToShow.LastUpdatedBy ?? '-'} />
                </div>
              </>
            ) : (
              <p>{t('NO_RESULTS_FOUND')}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdvanceStudentDetails;
