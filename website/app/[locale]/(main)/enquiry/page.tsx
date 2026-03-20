'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { Locale } from '@/i18n';

interface EnquiryPageProps {
  params: Promise<{ locale: Locale }>;
}

interface EnquiryData {
  productId?: string;
  productName?: { en: string; hi: string; mr: string };
  customization?: {
    size?: string;
    material?: string;
    quantity?: number;
    notes?: string;
  };
}

export default function EnquiryPage({ params }: EnquiryPageProps) {
  const t = useTranslations();
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  
  useEffect(() => {
    params.then((p) => setCurrentLocale(p.locale));
  }, [params]);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    productId: '',
    productName: { en: '', hi: '', mr: '' },
    size: '',
    material: '',
    quantity: 1,
    notes: '',
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load pre-filled data from sessionStorage (from product page)
  useState(() => {
    if (typeof window !== 'undefined') {
      const savedData = sessionStorage.getItem('enquiryData');
      if (savedData) {
        const enquiryData: EnquiryData = JSON.parse(savedData);
        setFormData((prev) => ({
          ...prev,
          productId: enquiryData.productId || '',
          productName: enquiryData.productName || { en: '', hi: '', mr: '' },
          size: enquiryData.customization?.size || '',
          material: enquiryData.customization?.material || '',
          quantity: enquiryData.customization?.quantity || 1,
          notes: enquiryData.customization?.notes || '',
        }));
      }
    }
  });

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error.code === 'file-too-large') {
        setErrors((prev) => ({ ...prev, file: t('validation.fileTooLarge') }));
      } else if (error.code === 'file-invalid-type') {
        setErrors((prev) => ({ ...prev, file: t('validation.invalidFileType') }));
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.type !== 'application/pdf') {
        setErrors((prev) => ({ ...prev, file: t('validation.invalidFileType') }));
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, file: t('validation.fileTooLarge') }));
        return;
      }
      setFile(selectedFile);
      setErrors((prev) => ({ ...prev, file: '' }));
    }
  }, [t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('validation.required');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('validation.required');
    } else if (!/^[0-9+\-\s()]{10,}$/.test(formData.phone)) {
      newErrors.phone = t('validation.invalidPhone');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('validation.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.invalidEmail');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      let fileUrl = '';
      let fileName = '';

      // Upload file if exists
      if (file) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });

        if (!uploadRes.ok) {
          throw new Error('File upload failed');
        }

        const uploadData = await uploadRes.json();
        fileUrl = uploadData.url;
        fileName = file.name;
      }

      // Submit enquiry
      const enquiryData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        productId: formData.productId || undefined,
        productName: formData.productId ? formData.productName : {
          en: 'General Enquiry',
          hi: 'सामान्य पूछताछ',
          mr: 'सामान्य चौकशी',
        },
        customization: {
          size: formData.size || undefined,
          material: formData.material || undefined,
          quantity: formData.quantity,
          notes: formData.notes || undefined,
        },
        fileUrl: fileUrl || undefined,
        fileName: fileName || undefined,
      };

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enquiryData),
      });

      if (!res.ok) {
        throw new Error('Failed to submit enquiry');
      }

      const result = await res.json();

      // Set success status
      setSubmitStatus('success');

      // Redirect to WhatsApp
      const whatsappMessage = `
*New Enquiry from Website*

*Name:* ${enquiryData.name}
*Phone:* ${enquiryData.phone}
*Email:* ${enquiryData.email}
*Product:* ${enquiryData.productName.en}
*Size:* ${enquiryData.customization.size || 'N/A'}
*Material:* ${enquiryData.customization.material || 'N/A'}
*Quantity:* ${enquiryData.customization.quantity}
*Notes:* ${enquiryData.customization.notes || 'N/A'}
${fileUrl ? `*Design File:* ${fileUrl}` : ''}
      `.trim();

      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

      // Open WhatsApp after a short delay
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1500);

      // Clear form and session storage
      sessionStorage.removeItem('enquiryData');

      // Redirect to home after WhatsApp opens
      setTimeout(() => {
        router.push(`/${currentLocale}/home`);
      }, 3000);

    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setErrors((prev) => ({ ...prev, file: '' }));
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('enquiry.title')}
          </h1>
          <p className="text-gray-600">{t('enquiry.subtitle')}</p>
        </div>

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center">
            <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-green-900">{t('enquiry.submitSuccess')}</p>
              <p className="text-sm text-green-700">{t('enquiry.whatsappRedirect')}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center">
            <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
            <p className="font-medium text-red-900">{t('enquiry.submitError')}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t('enquiry.personalInfo')}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('enquiry.name')} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('enquiry.namePlaceholder')}
                  className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('enquiry.phone')} *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={t('enquiry.phonePlaceholder')}
                  className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('enquiry.email')} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t('enquiry.emailPlaceholder')}
                  className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Product Information */}
          {formData.productId && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t('enquiry.productInfo')}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('enquiry.selectProduct')}
                  </label>
                  <input
                    type="text"
                    value={formData.productName.en}
                    disabled
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Customization Details */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t('enquiry.customization')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('enquiry.size')}
                </label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('enquiry.material')}
                </label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('enquiry.quantity')}
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('enquiry.notes')}
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder={t('enquiry.notesPlaceholder')}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t('enquiry.uploadDesign')}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {t('enquiry.uploadDesignDesc')}
            </p>

            {!file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-100'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  {isDragActive
                    ? 'Drop your file here...'
                    : t('enquiry.dragDrop')}
                </p>
                <p className="text-sm text-gray-500">PDF only, max 10MB</p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            )}

            {errors.file && (
              <p className="mt-2 text-sm text-red-600">{errors.file}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                {t('common.submit')}
                <Send className="ml-2 w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
