/**
 * Stepper component provides a multi-step navigation interface, displaying the steps and allowing the user to
 * navigate through them by clicking on steps that are prior to the current step.
 *
 * @component
 * @example
 * const steps = ['General info', 'Additional info'];
 * const [currentStep, setCurrentStep] = useState(0);
 *
 * return (
 *   <Stepper
 *     steps={steps}
 *     currentStep={currentStep}
 *     onStepChange={setCurrentStep}
 *   />
 * );
 *
 * @param {Object} props - The props for the Stepper component.
 * @param {string[]} props.steps - List of step labels.
 * @param {number} props.currentStep - The current active step.
 * @param {function} props.onStepChange - Callback function to change the current step.
 *
 * @returns {JSX.Element} The rendered Stepper component.
 */


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import API_CONFIG from 'config/api';
import { Button } from 'components/ui/button';
import { Card, CardContent } from 'components/ui/card';
import { GeneralInfoForm } from './general-info-form';
import { ImageUploader } from '../image-uploader/image-uploader';
import { useGetPreSignedUrlForUpload } from 'features/students/hooks/use-storage';
import { useAddStudent } from 'features/students/hooks/use-students';
import { courseOptions, sectionOptions, gradeOptions } from '../../types/students.types';

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

/**
 * StudentForm component is a multi-step form that allows users to add a new student. It includes steps for
 * entering general information (name, student ID, email, course, etc.) and an additional step for optional notes.
 * It handles image uploading (profile photo), basic validation, and submitting the data via GraphQL (mirroring inventory style).
 *
 * @component
 * @example
 * return (
 *   <StudentForm />
 * );
 *
 * @returns {JSX.Element} The rendered StudentForm component.
 */

interface StudentFormData {
  name: string;
  studentId: string;
  email: string;
  course: string;
  section: string;
  grade: string;
  images: string[];
  profileImageUrl: string;
  profileImageUrls: string[];
  notes?: string;
}

export function StudentForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const steps = [t('GENERAL_INFO'), t('ADDITIONAL_INFO')];
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { mutate: addStudent } = useAddStudent();
  const { mutate: getPreSignedUrl } = useGetPreSignedUrlForUpload();

  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    studentId: '',
    email: '',
    course: courseOptions[0],
    section: sectionOptions[0],
    grade: gradeOptions[0],
    images: [],
    profileImageUrl: '',
    profileImageUrls: [],
    notes: '',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
            if (!data.isSuccess || !data.uploadUrl) {
              return resolve(null);
            }
            try {
              const { uploadUrl } = await uploadFile(data.uploadUrl, file);
              resolve({ fileId: data.fileId ?? '', uploadUrl });
            } catch (error) {
              console.error('Error uploading file:', error);
              resolve(null);
            }
          },
          onError: () => resolve(null),
        }
      );
    });

  const handleAddImages = async (files: (File | string)[]) => {
    const fileObjects = files.filter((file): file is File => file instanceof File);
    if (fileObjects.length === 0) return;

    setIsUploading(true);
    try {
      const uploadResults = await Promise.all(fileObjects.map(getPresignedUrlAndUpload));
      const successfulUploads = uploadResults.filter(
        (result): result is { fileId: string; uploadUrl: string } =>
          result !== null && Boolean(result.fileId) && Boolean(result.uploadUrl)
      );

      if (successfulUploads.length > 0) {
        const uploadUrls = successfulUploads.map((upload) => upload.uploadUrl);

        setFormData((prev) => ({
          ...prev,
          profileImageUrl: uploadUrls[0],
          profileImageUrls: [...(prev.profileImageUrls || []), ...uploadUrls],
          images: [...prev.images, ...uploadUrls],
        }));
      }
    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== imageUrl),
      profileImageUrls: prev.profileImageUrls?.filter((url) => url !== imageUrl) || [],
      profileImageUrl: prev.profileImageUrl === imageUrl ? '' : prev.profileImageUrl,
    }));
  };

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const input = {
      Name: formData.name,
      StudentId: formData.studentId,
      Email: formData.email,
      Course: formData.course,
      Section: formData.section,
      Grade: formData.grade,
      ProfileImageFileId: formData.profileImageUrl,
      ProfileImageFileIds: formData.profileImageUrls,
      Notes: formData.notes,
    };

    addStudent(
      { input },
      {
        onSuccess: (result: any) => {
          if (result.insertStudentInfo?.acknowledged) {
            navigate(`/students/${result.insertStudentInfo.itemId}`);
          }
          setLoading(false);
        },
        onError: () => setLoading(false),
      }
    );
  };

  const isGeneralInfoValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.studentId.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.course.trim() !== '' &&
      formData.section.trim() !== ''
    );
  };

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
        <h3 className="text-2xl font-bold tracking-tight">{t('ADD_STUDENT')}</h3>
      </div>

      <div className="container mx-auto py-6">
        <Stepper steps={steps} currentStep={currentStep} onStepChange={setCurrentStep} />

        <form onSubmit={handleSubmit}>
          {currentStep === 0 && (
            <Card className="w-full border-none rounded-lg justify-center flex shadow-sm mb-6">
              <CardContent className="pt-6 w-[774px]">
                <GeneralInfoForm
                  formData={{
                    Name: formData.name,
                    StudentId: formData.studentId,
                    Email: formData.email,
                    Course: formData.course,
                    Section: formData.section,
                    Grade: formData.grade,
                  }}
                  handleInputChange={handleInputChange}
                  courseOptions={courseOptions}
                  sectionOptions={sectionOptions}
                  gradeOptions={gradeOptions}
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
                {/* Additional info: keep minimal and optional for students */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    {t('NOTES')}
                  </label>
                  <textarea
                    id="notes"
                    className="w-full min-h-28 rounded-md border p-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    placeholder={t('ENTER_NOTES')}
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
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

export default StudentForm;
