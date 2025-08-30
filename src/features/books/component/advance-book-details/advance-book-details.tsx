// Path: src/features/books/pages/advance-book-details.tsx

import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Pen, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from 'components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Separator } from 'components/ui/separator';
import { Label } from 'components/ui/label';
import { Input } from 'components/ui/input';
import { Textarea } from 'components/ui/textarea';
import { Skeleton } from 'components/ui/skeleton';
import PlaceHolderImage from 'assets/images/image_off_placeholder.webp';

import { useGetBooks, useUpdateBook, useDeleteBook } from 'features/books/hooks/use-books';
import type { BookItem } from 'features/books/types/books.types';

export function AdvanceBookDetails() {
  const [selectedImage, setSelectedImage] = useState('');
  const [editDetails, setEditDetails] = useState(false);
  const [editedFields, setEditedFields] = useState<Record<string, any>>({});

  const navigate = useNavigate();
  const { t } = useTranslation();

  const { bookId: id } = useParams();


  const { data, isLoading } = useGetBooks({ pageNo: 1, pageSize: 1000 });
  
  const list = data as { Bookss?: { items: BookItem[] } } | undefined;
  const items = list?.Bookss?.items ?? [];

 

  const selectedBook = useMemo(
    () => items.find(b => String(b.ItemId).trim() === String(id ?? '').trim()),
    [items, id]
  );
  

  const { mutate: updateBook, isPending: isUpdatePending } = useUpdateBook();
  const { mutate: deleteBook, isPending: isDeletePending } = useDeleteBook();

  useEffect(() => {
    setSelectedImage(PlaceHolderImage);
  }, [selectedBook?.ItemId]);

  const handleEditDetails = () => setEditDetails(true);
  const handleCancelEdit = () => {
    setEditDetails(false);
    setEditedFields({});
  };

  const handleUpdateDetails = () => {
    if (!selectedBook) return;

    // Map edited UI fields to API field names (keep exact casing)
    const editedInput: any = {
      ...(editedFields.title && { Title: editedFields.title }),
      ...(editedFields.author && { Author: editedFields.author }),
      ...(editedFields.isbn && { ISBN: editedFields.isbn }),
      ...(editedFields.category && { Category: editedFields.category }),
      ...(editedFields.publisher && { Publisher: editedFields.publisher }),
      ...(editedFields.publicationYear && { PublicationYear: Number(editedFields.publicationYear) }),
      ...(editedFields.totalCopies !== undefined && { TotalCopies: Number(editedFields.totalCopies) }),
      ...(editedFields.availableCopies !== undefined && { AvailableCopies: Number(editedFields.availableCopies) }),
      ...(editedFields.description !== undefined && { Description: editedFields.description }),
      ...(editedFields.coverImageId !== undefined && { CoverImageId: editedFields.coverImageId }),
    };

    updateBook(
      {
        // ✅ UpdateBookParams expects { filter, input }
        filter: JSON.stringify({ _id: String(selectedBook.ItemId) }),
        input: editedInput,
      },
      {
        onSuccess: () => {
          setEditDetails(false);
          setEditedFields({});
        },
        onError: (error) => {
          console.error('Error updating book:', error);
        },
      }
    );
    
  };

  const handleFieldChange = (field: string, value: string | number) => {
    setEditedFields((prev) => ({ ...prev, [field]: value }));
  };

  const renderField = (
    label: string,
    field: string,
    value: string | number | undefined,
    editable: boolean,
    type: 'text' | 'number' = 'text'
  ) => {
    const safeValue = value ?? '';

    return (
      <div className="flex flex-col gap-2">
        <Label>{label}</Label>
        {editable ? (
          type === 'number' ? (
            <Input
              type="number"
              placeholder={`${t('ENTER')} ${label.toLowerCase()}`}
              defaultValue={String(safeValue)}
              onChange={(e) => handleFieldChange(String(field), e.target.value)}
            />
          ) : field === 'description' ? (
            <Textarea
              placeholder={`${t('ENTER')} ${label.toLowerCase()}`}
              defaultValue={String(safeValue)}
              onChange={(e) => handleFieldChange(String(field), e.target.value)}
              rows={4}
            />
          ) : (
            <Input
              placeholder={`${t('ENTER')} ${label.toLowerCase()}`}
              defaultValue={String(safeValue)}
              onChange={(e) => handleFieldChange(String(field), e.target.value)}
            />
          )
        ) : (
          <span className="text-base">{String(safeValue || '-')}</span>
        )}
      </div>
    );
  };



  const handleDelete = () => {
    if (!id) return;
  

    deleteBook(
      { filter: JSON.stringify({ _id: String(id) }), input: { isHardDelete: true } },
      {
        onSuccess: () => {
          navigate('/books');
        },
      }
    );
  };

  const bookToShow = selectedBook;

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
          <h3 className="text-2xl font-bold tracking-tight">{bookToShow?.Title || t('BOOKS')}</h3>
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

      <div className="flex flex-col gap-4 w/full">
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
                  {[...Array(8)].map((_, i) => (
                    <div key={`field-skeleton-${i}`} className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-24 rounded" />
                      <Skeleton className="h-10 w-full rounded" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-14">
                {/* Left: Cover image (placeholder) */}
                <div className="flex w-full gap-6 flex-col md:w-[30%]">
                  <div className="flex p-3 items-center justify-center w-full h-64 rounded-lg border">
                    <img
                      src={selectedImage || PlaceHolderImage}
                      alt="Book"
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
                {bookToShow ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-[70%]">
                    {renderField(t('TITLE'), 'title', bookToShow.Title, editDetails)}
                    {renderField(t('AUTHOR'), 'author', bookToShow.Author, editDetails)}
                    {renderField(t('ISBN'), 'isbn', bookToShow.ISBN, editDetails)}
                    {renderField(t('CATEGORY'), 'category', bookToShow.Category, editDetails)}
                    {renderField(t('PUBLISHER'), 'publisher', bookToShow.Publisher, editDetails)}
                    {renderField(t('PUBLICATION_YEAR'), 'publicationYear', bookToShow.PublicationYear ?? '', editDetails, 'number')}
                    {renderField(t('TOTAL_COPIES'), 'totalCopies', bookToShow.TotalCopies ?? 0, editDetails, 'number')}
                    {renderField(t('AVAILABLE_COPIES'), 'availableCopies', bookToShow.AvailableCopies ?? 0, editDetails, 'number')}
                    {renderField(t('COVER_IMAGE_ID'), 'coverImageId', bookToShow.CoverImageId ?? '', editDetails)}
                    {/* Full-width description */}
                    <div className="md:col-span-2">
                      {renderField(t('DESCRIPTION'), 'description', bookToShow.Description ?? '', editDetails)}
                    </div>
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
            ) : bookToShow ? (
              <>
                <div className="flex flex-col gap-2">
                  <Label>{t('CREATED_DATE')}</Label>
                  <Input disabled defaultValue={bookToShow.CreatedDate ?? '-'} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>{t('LAST_UPDATED')}</Label>
                  <Input disabled defaultValue={bookToShow.LastUpdatedDate ?? '-'} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>{t('CREATED_BY')}</Label>
                  <Input disabled defaultValue={bookToShow.CreatedBy ?? '-'} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>{t('LAST_UPDATED_BY')}</Label>
                  <Input disabled defaultValue={bookToShow.LastUpdatedBy ?? '-'} />
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

export default AdvanceBookDetails;


