// Path: src/features/books/pages/books-form.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import API_CONFIG from 'config/api';
import { Button } from 'components/ui/button';
import { Card, CardContent } from 'components/ui/card';

import { GeneralInfoForm } from './general-info-form';
import { ImageUploader } from '../image-uploader/image-uploader';

import { useGetPreSignedUrlForUpload } from 'features/books/hooks/use-storage';
import { useAddBook } from 'features/books/hooks/use-books';
import type { AddBookInput } from '../../types/books.types';
import { categoryOptions } from '../../types/books.types';

/* ────────────────────────────────────────────────────────────────────────── */
/* Stepper (same as students)                                                */
/* ────────────────────────────────────────────────────────────────────────── */
export function Stepper({
  steps,
  currentStep,
  onStepChange,
}: Readonly<{ steps: string[]; currentStep: number; onStepChange: (s: number) => void }>) {
  return (
    <div className="w-full flex justify-center mb-6">
      <div className="w-96">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-base font-semibold mb-2 ${
                    index <= currentStep ? 'bg-primary text-white' : 'bg-card text-black'
                  } ${index < currentStep ? 'cursor-pointer' : ''}`}
                  onClick={() => index < currentStep && onStepChange(index)}
                >
                  {index < currentStep ? <Check size={16} /> : index + 1}
                </button>
                <span className="text-base font-semibold text-center">{step}</span>
              </div>

              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 -mt-8">
                  <div className={`h-full ${index < currentStep ? 'bg-primary' : 'bg-gray-200'}`} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* BooksForm                                                                  */
/* ────────────────────────────────────────────────────────────────────────── */

interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  publicationYear: string | number;
  totalCopies: string | number;
  availableCopies: string | number;

  images: string[];
  coverImageUrl: string;

  description?: string;
}

const toNumberOrUndefined = (v: unknown): number | undefined => {
  if (v === '' || v === null || v === undefined) return undefined;
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? (n as number) : undefined;
};

export function BooksForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const steps = [t('GENERAL_INFO'), t('ADDITIONAL_INFO')];
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { mutate: addBook } = useAddBook();
  const { mutate: getPreSignedUrl } = useGetPreSignedUrlForUpload();

  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    isbn: '',
    category: categoryOptions?.[0] ?? '',
    publisher: '',
    publicationYear: '',
    totalCopies: '',
    availableCopies: '',
    images: [],
    coverImageUrl: '',
    description: '',
  });

  // Match child prop signature: (field: string, value: any) => void
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* ---- upload helpers (same as students) --------------------------------- */
  const uploadFile = async (url: string, file: File) => {
    await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
        'x-ms-blob-type': 'BlockBlob',
      },
    });
    return { uploadUrl: url.split('?')[0] };
  };

  const getPresignedUrlAndUpload = (
    file: File
  ): Promise<{ fileId: string; uploadUrl: string } | null> =>
    new Promise((resolve) => {
      getPreSignedUrl(
        {
          name: file.name,
          projectKey: API_CONFIG.blocksKey,
          itemId: '',
          metaData: '',
          accessModifier: 'Public',
          configurationName: 'Default',
          parentDirectoryId: '',
          tags: '',
        },
        {
          onSuccess: async (data) => {
            if (!data.isSuccess || !data.uploadUrl) return resolve(null);
            try {
              const { uploadUrl } = await uploadFile(data.uploadUrl, file);
              resolve({ fileId: data.fileId ?? '', uploadUrl });
            } catch (err) {
              console.error('Error uploading file:', err);
              resolve(null);
            }
          },
          onError: () => resolve(null),
        }
      );
    });

  const handleAddImages = async (files: (File | string)[]) => {
    const fileObjects = files.filter((f): f is File => f instanceof File);
    if (fileObjects.length === 0) return;

    setIsUploading(true);
    try {
      const uploadResults = await Promise.all(fileObjects.map(getPresignedUrlAndUpload));
      const ok = uploadResults.filter(
        (r): r is { fileId: string; uploadUrl: string } => !!r && !!r.fileId && !!r.uploadUrl
      );
      if (ok.length > 0) {
        const uploadUrls = ok.map((u) => u.uploadUrl);
        setFormData((prev) => ({
          ...prev,
          coverImageUrl: prev.coverImageUrl || uploadUrls[0],
          images: [...prev.images, ...uploadUrls],
        }));
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== imageUrl),
      coverImageUrl: prev.coverImageUrl === imageUrl ? '' : prev.coverImageUrl,
    }));
  };

  const goToNextStep = () => currentStep < steps.length - 1 && setCurrentStep(currentStep + 1);
  const goToPreviousStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const input: AddBookInput = {
      Title: formData.title.trim(),
      Author: formData.author.trim(),
      ISBN: formData.isbn.trim(),
      Category: formData.category,
      Publisher: formData.publisher.trim(),
      PublicationYear: toNumberOrUndefined(formData.publicationYear),
      TotalCopies: toNumberOrUndefined(formData.totalCopies),
      AvailableCopies: toNumberOrUndefined(formData.availableCopies),
      CoverImageId: formData.coverImageUrl || undefined,
      Description: formData.description?.trim() || undefined,
    };

    addBook(
      { input },
      {
        onSuccess: (result: any) => {
          if (result?.insertBooks?.acknowledged) {
            navigate(`/books/${result.insertBooks.itemId}`);
          }
          setLoading(false);
        },
        onError: () => setLoading(false),
      }
    );
  };

  const isGeneralInfoValid = () =>
    formData.title.trim() !== '' &&
    formData.author.trim() !== '' &&
    formData.isbn.trim() !== '' &&
    formData.category.trim() !== '' &&
    formData.publisher.trim() !== '';

  return (
    <div className="flex flex-col w-full">
      <div className="mb-[18px] flex items-center text-base text-high-emphasis md:mb-[24px] gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-card/60 rounded-full"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft />
        </Button>
        <h3 className="text-2xl font-bold tracking-tight">{t('ADD_BOOK')}</h3>
      </div>

      <div className="container mx-auto py-6">
        <Stepper steps={steps} currentStep={currentStep} onStepChange={setCurrentStep} />

        <form onSubmit={handleSubmit}>
          {currentStep === 0 && (
            <Card className="w-full border-none rounded-lg justify-center flex shadow-sm mb-6">
              <CardContent className="pt-6 w-[774px]">
                <GeneralInfoForm
                  formData={{
                    Title: formData.title,
                    Author: formData.author,
                    ISBN: formData.isbn,
                    Category: formData.category,
                    Publisher: formData.publisher,
                    PublicationYear: formData.publicationYear,
                    TotalCopies: formData.totalCopies,
                    AvailableCopies: formData.availableCopies,
                  }}
                  handleInputChange={handleInputChange}
                  categoryOptions={categoryOptions}
                />

                <ImageUploader
                  images={formData.images}
                  onAddImages={handleAddImages}
                  onDeleteImage={handleDeleteImage}
                  isPending={isUploading}
                />

                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    className="h-10 font-bold"
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    {t('CANCEL')}
                  </Button>
                  <Button
                    type="button"
                    onClick={goToNextStep}
                    className="bg-primary h-10 font-bold"
                    disabled={!isGeneralInfoValid()}
                  >
                    {t('NEXT')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 1 && (
            <Card className="w-full border-none rounded-lg flex justify-center shadow-sm mb-6">
              <CardContent className="w-[774px]">
                <div className="flex flex-col gap-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    {t('DESCRIPTION')}
                  </label>
                  <textarea
                    id="description"
                    className="w-full min-h-28 rounded-md border p-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    placeholder={t('ENTER_DESCRIPTION')}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>

                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    className="h-10 font-bold"
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    {t('CANCEL')}
                  </Button>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      className="h-10 font-bold"
                      variant="outline"
                      onClick={goToPreviousStep}
                    >
                      {t('PREVIOUS')}
                    </Button>
                    <Button type="submit" className="h-10 bg-primary font-bold" disabled={loading}>
                      {t('FINISH')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </div>
    </div>
  );
}

export default BooksForm;

