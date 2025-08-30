
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
 * GeneralInfoForm (Books)
 *
 * Mirrors the students/inventory GeneralInfoForm structure and styling, but for book fields.
 * Uses capitalized keys in `formData` for display values and lowercase keys for `handleInputChange`,
 * matching the established pattern (e.g., Title -> 'title').
 */

interface BookGeneralInfoFormProps {
  formData: {
    Title: string;
    Author: string;
    ISBN: string;
    Category: string;
    Publisher: string;
    PublicationYear: string | number;
    TotalCopies: string | number;
    AvailableCopies: string | number;
  };
  handleInputChange: (field: string, value: any) => void;
  categoryOptions: string[];
}

export function GeneralInfoForm({
  formData,
  handleInputChange,
  categoryOptions,
}: Readonly<BookGeneralInfoFormProps>) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">{t('TITLE')}</Label>
          <Input
            id="title"
            value={formData.Title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder={t('ENTER_TITLE')}
          />
        </div>

        {/* Author */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="author">{t('AUTHOR')}</Label>
          <Input
            id="author"
            value={formData.Author}
            onChange={(e) => handleInputChange('author', e.target.value)}
            placeholder={t('ENTER_AUTHOR')}
          />
        </div>

        {/* ISBN */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="isbn">{t('ISBN')}</Label>
          <Input
            id="isbn"
            value={formData.ISBN}
            onChange={(e) => handleInputChange('isbn', e.target.value)}
            placeholder={t('ENTER_ISBN')}
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="category">{t('CATEGORY')}</Label>
          <Select
            value={formData.Category}
            onValueChange={(value) => handleInputChange('category', value)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder={t('SELECT_CATEGORY')} />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Publisher */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="publisher">{t('PUBLISHER')}</Label>
          <Input
            id="publisher"
            value={formData.Publisher}
            onChange={(e) => handleInputChange('publisher', e.target.value)}
            placeholder={t('ENTER_PUBLISHER')}
          />
        </div>

        {/* Publication Year */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="publicationYear">{t('PUBLICATION_YEAR')}</Label>
          <Input
            id="publicationYear"
            type="number"
            value={formData.PublicationYear}
            onChange={(e) => handleInputChange('publicationYear', e.target.value)}
            placeholder={t('ENTER_PUBLICATION_YEAR')}
          />
        </div>

        {/* Total Copies */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="totalCopies">{t('TOTAL_COPIES')}</Label>
          <Input
            id="totalCopies"
            type="number"
            value={formData.TotalCopies}
            onChange={(e) => handleInputChange('totalCopies', e.target.value)}
            placeholder={t('ENTER_TOTAL_COPIES')}
          />
        </div>

        {/* Available Copies */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="availableCopies">{t('AVAILABLE_COPIES')}</Label>
          <Input
            id="availableCopies"
            type="number"
            value={formData.AvailableCopies}
            onChange={(e) => handleInputChange('availableCopies', e.target.value)}
            placeholder={t('ENTER_AVAILABLE_COPIES')}
          />
        </div>
      </div>
    </div>
  );
}

export default GeneralInfoForm;
