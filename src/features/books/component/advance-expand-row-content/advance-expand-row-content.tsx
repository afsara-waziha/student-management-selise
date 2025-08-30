
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TableCell, TableRow } from 'components/ui/table';
import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';
import { Skeleton } from 'components/ui/skeleton';
import { cn } from 'lib/utils';
import PlaceHolderImage from 'assets/images/image_off_placeholder.webp';
import type { BookItem } from '../../types/books.types';

interface AdvanceExpandRowContentProps {
  rowId?: string;
  colSpan?: number;
  data: BookItem[];
}

/**
 * AdvanceExpandRowContent (Books)
 *
 * Mirrors the Inventory/Students expand-row component structure and styling,
 * but displays book-specific fields.
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
      // If you later wire CoverImageId to a storage URL, replace this with the resolved URL.
      setSelectedImage(PlaceHolderImage);
      setLoadingImage(true);
      setImageError(false);
    }
  }, [currentItem]);

  const handleBookDetails = () => {
    if (currentItem?.ItemId) {
      navigate(`/books/${currentItem.ItemId}`);
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
            {/* Left: Cover image */}
            <div className="flex gap-4 flex-col">
              <div className="relative w-44 h-44">
                {loadingImage && <Skeleton className="w-full h-full rounded-lg" />}
                <img
                  src={imageError ? PlaceHolderImage : selectedImage}
                  alt="book-cover"
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
                <span className="text-sm text-medium-emphasis">{t('TITLE')}</span>
                <span className="font-medium truncate">{currentItem?.Title ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-medium-emphasis">{t('AUTHOR')}</span>
                <span className="font-medium truncate">{currentItem?.Author ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-medium-emphasis">{t('ISBN')}</span>
                <span className="font-medium truncate">{currentItem?.ISBN ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-medium-emphasis">{t('CATEGORY')}</span>
                <span className="font-medium truncate">{currentItem?.Category ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-medium-emphasis">{t('PUBLISHER')}</span>
                <span className="font-medium truncate">{currentItem?.Publisher ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-medium-emphasis">{t('PUBLICATION_YEAR')}</span>
                <span className="font-medium truncate">{currentItem?.PublicationYear ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-medium-emphasis">{t('TOTAL_COPIES')}</span>
                <span className="font-medium truncate">{currentItem?.TotalCopies ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-medium-emphasis">{t('AVAILABLE_COPIES')}</span>
                <span className="font-medium truncate">{currentItem?.AvailableCopies ?? '-'}</span>
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

              {/* Optional: expose CoverImageId if helpful to copy/debug */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-medium-emphasis">{t('COVER_IMAGE_ID')}</span>
                <span className="truncate">
                  {currentItem?.CoverImageId ?? '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Description full width */}
          <div className="mt-6">
            <div className="text-sm text-medium-emphasis mb-1">{t('DESCRIPTION')}</div>
            <div className="text-sm">{currentItem?.Description || '-'}</div>
          </div>

          <Separator className="mt-6" />
        </div>

        <div ref={actionRef} className="flex fixed right-[24px] md:right-[46px] gap-4 py-6">
          <Button variant="outline" onClick={handleBookDetails}>
            {t('VIEW_DETAILS')}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default AdvanceExpandRowContent;
