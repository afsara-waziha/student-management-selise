// Path: src/features/students/component/advance-expand-row-content.tsx

import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TableCell, TableRow } from 'components/ui/table';
import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';
import { Skeleton } from 'components/ui/skeleton';
import { cn } from 'lib/utils';
import PlaceHolderImage from 'assets/images/image_off_placeholder.webp';
import { StudentItem } from '../../types/students.types';

interface AdvanceExpandRowContentProps {
  rowId?: string;
  colSpan?: number;
  data: StudentItem[];
}

/**
 * AdvanceExpandRowContent (Students)
 *
 * Mirrors the Inventory expand-row component structure and styling,
 * but displays student-specific fields (no warranty/discount/tags/stock).
 */
export const AdvanceExpandRowContent = ({
  rowId,
  colSpan,
  data,
}: AdvanceExpandRowContentProps) => {
  const [selectedImage, setSelectedImage] = useState(PlaceHolderImage);
  const [loadingImage, setLoadingImage] = useState(true);
  const [imageError, setImageError] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const actionRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const currentItem = useMemo(() => {
    if (!rowId || !data || data.length === 0) return null;
    const index = Number(rowId);
    if (isNaN(index)) return null;
    return data[index];
  }, [rowId, data]);

  useEffect(() => {
    if (currentItem) {
      // If your schema later adds a profile image, set it here. For now use placeholder.
      setSelectedImage(PlaceHolderImage);
      setLoadingImage(true);
      setImageError(false);
    }
  }, [currentItem]);

  const handleStudentDetails = () => {
    if (currentItem?.ItemId) {
      navigate(`/students/${currentItem.ItemId}`);
    }
  };

  useEffect(() => {
    const updateActionRefPosition = () => {
      if (actionRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const bottomValue = window.innerHeight - containerRect.bottom;
        actionRef.current.style.bottom = `${bottomValue}px`;
      }
    };
    updateActionRefPosition();
    window.addEventListener('scroll', updateActionRefPosition);
    return () => {
      window.removeEventListener('scroll', updateActionRefPosition);
    };
  }, []);

  return (
    <TableRow key={`expanded-${rowId}`} className="hover:bg-transparent">
      <TableCell colSpan={colSpan} className="!p-0 bg-neutral-25">
        <div ref={containerRef} className="flex flex-col pt-4 px-4 pb-[90px]">
          <div className="flex gap-6 justify-between">
            {/* Left: Image */}
            <div className="flex gap-4 flex-col">
              <div className="relative w-44 h-44">
                {loadingImage && <Skeleton className="w-full h-full rounded-lg" />}
                <img
                  src={imageError ? PlaceHolderImage : selectedImage}
                  alt="student"
                  className={cn(
                    'w-full h-full object-cover rounded-lg border',
                    loadingImage && 'hidden'
                  )}
                  onLoad={() => setLoadingImage(false)}
                  onError={() => {
                    setImageError(true);
                    setLoadingImage(false);
                  }}
                />
              </div>
            </div>

            {/* Middle: Key properties */}
            <div className="flex flex-col gap-4 w-[40%]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-medium-emphasis">{t('NAME')}</span>
                <span className="font-medium truncate">{currentItem?.Name ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-medium-emphasis">{t('STUDENT_ID')}</span>
                <span className="font-medium truncate">{currentItem?.StudentId ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-medium-emphasis">{t('EMAIL')}</span>
                <span className="font-medium truncate">{currentItem?.Email ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-medium-emphasis">{t('COURSE')}</span>
                <span className="font-medium truncate">{currentItem?.Course ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-medium-emphasis">{t('SECTION')}</span>
                <span className="font-medium truncate">{currentItem?.Section ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-medium-emphasis">{t('GRADE')}</span>
                <span className="font-medium truncate">{currentItem?.Grade ?? '-'}</span>
              </div>
            </div>

            {/* Right: Meta */}
            <div className="flex flex-col w-[30%] gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-medium-emphasis">{t('CREATED_DATE')}</span>
                <span className="truncate">
                  {currentItem?.CreatedDate ?? '-'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-medium-emphasis">{t('LAST_UPDATED')}</span>
                <span className="truncate">
                  {currentItem?.LastUpdatedDate ?? '-'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-medium-emphasis">{t('CREATED_BY')}</span>
                <span className="truncate">
                  {currentItem?.CreatedBy ?? '-'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-medium-emphasis">{t('LAST_UPDATED_BY')}</span>
                <span className="truncate">
                  {currentItem?.LastUpdatedBy ?? '-'}
                </span>
              </div>
            </div>
          </div>

          <Separator className="mt-6" />
        </div>

        <div ref={actionRef} className="flex fixed right-[24px] md:right-[46px] gap-4 py-6">
          <Button variant="outline" onClick={handleStudentDetails}>
            {t('VIEW_DETAILS')}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default AdvanceExpandRowContent;
