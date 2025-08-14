
import { useTranslation } from 'react-i18next';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from 'components/ui/select';

/**
 * GeneralInfoForm (Students)
 *
 * Mirrors the inventory GeneralInfoForm structure and styling, but for student fields.
 * Uses capitalized keys in `formData` for display values and lowercase keys for `handleInputChange`,
 * matching the inventory pattern (e.g., ItemName -> 'itemName').
 */

interface StudentGeneralInfoFormProps {
  formData: {
    Name: string;
    StudentId: string;
    Email: string;
    Course: string;
    Section: string;
    Grade: string;
  };
  handleInputChange: (field: string, value: any) => void;
  courseOptions: string[];
  sectionOptions: string[];
  gradeOptions?: string[];
}

const DEFAULT_GRADE_OPTIONS = ['A+', 'A', 'B+', 'B', 'C', 'D', 'F'];

export function GeneralInfoForm({
  formData,
  handleInputChange,
  courseOptions,
  sectionOptions,
  gradeOptions = DEFAULT_GRADE_OPTIONS,
}: Readonly<StudentGeneralInfoFormProps>) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">{t('NAME')}</Label>
          <Input
            id="name"
            value={formData.Name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder={t('ENTER_NAME')}
          />
        </div>

        {/* Student ID */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="studentId">{t('STUDENT_ID')}</Label>
          <Input
            id="studentId"
            value={formData.StudentId}
            onChange={(e) => handleInputChange('studentId', e.target.value)}
            placeholder={t('ENTER_STUDENT_ID')}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">{t('EMAIL')}</Label>
          <Input
            id="email"
            type="email"
            value={formData.Email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder={t('ENTER_EMAIL')}
          />
        </div>

        {/* Course */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="course">{t('COURSE')}</Label>
          <Select value={formData.Course} onValueChange={(value) => handleInputChange('course', value)}>
            <SelectTrigger id="course">
              <SelectValue placeholder={t('SELECT_COURSE')} />
            </SelectTrigger>
            <SelectContent>
              {courseOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Section */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="section">{t('SECTION')}</Label>
          <Select value={formData.Section} onValueChange={(value) => handleInputChange('section', value)}>
            <SelectTrigger id="section">
              <SelectValue placeholder={t('SELECT_SECTION')} />
            </SelectTrigger>
            <SelectContent>
              {sectionOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grade */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="grade">{t('GRADE')}</Label>
          <Select value={formData.Grade} onValueChange={(value) => handleInputChange('grade', value)}>
            <SelectTrigger id="grade">
              <SelectValue placeholder={t('SELECT_GRADE')} />
            </SelectTrigger>
            <SelectContent>
              {gradeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default GeneralInfoForm;
