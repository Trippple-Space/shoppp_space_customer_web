import {
  FC,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { IoMdClose } from 'react-icons/io';
import { HiPlus } from 'react-icons/hi2';
import { ConfigurationRecord } from '../../utility/types/product.interface';
import {
  isCustomerConfigurationInput,
  isVendorOnlyConfigurationField,
} from '../../utility/configuration-field-target';
import { uploadPublicConfigurationImage } from '../../utility/services/configuration-image-upload.service';
import SpinLoader from '../spin-loader/SpinLoader';
import {
  useFloating,
  offset,
  flip,
  shift,
  useHover,
  useDismiss,
  useInteractions,
  safePolygon,
  FloatingPortal,
} from '@floating-ui/react';
import { usePersonalizationStore } from '../../utility/store/personalization.store';
import {
  buildPersonalizationPrefill,
  countPersonalizationPrefillMatches,
} from '../../utility/personalization-prefill';

export const isEmptyValue = (v: any) => {
  if (v === null || v === undefined) return true;
  if (typeof v === 'string') return v.trim() === '';
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object') return Object.keys(v).length === 0;
  return false;
};

export const isCustomerInputForField = (field: any): boolean => {
  return isCustomerConfigurationInput(field?.valueFormat?.targetUserType);
};

const CustomerBlobThumb = ({ file }: { file: File }) => {
  const [src, setSrc] = useState('');
  useEffect(() => {
    const u = URL.createObjectURL(file);
    setSrc(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  if (!src) return null;
  return (
    <img src={src} alt="" className="h-full w-full object-cover" style={{ objectFit: 'cover', objectPosition: 'top' }} />
  );
};

export const renderCustomerField = (
  field: any,
  configurationValues: Record<string, any>,
  handleConfigChange: (key: string, value: any) => void,
  onPreviewImage?: (url: string) => void
) => {
  const vf = field.valueFormat;
  const fieldKey = vf.fieldName;

  const commonClass =
    'w-full radius-6 border border-#00000014 bg-#FAFAFA px-10 py-8 text-12 color-#000000 outline-none';

  if (vf.type === 'string' || vf.type === 'number') {
    const isNotesField = /note/i.test(
      `${field?.keyFormat?.fieldName ?? ''} ${field?.keyFormat?.defaultValue ?? ''}`
    );
    if (isNotesField && vf.type === 'string') {
      return (
        <textarea
          placeholder={vf.placeholder || ''}
          required={vf.required}
          value={configurationValues[fieldKey] ?? ''}
          className={`${commonClass} mt-2 min-h-90 resize-none`}
          onChange={(e) => handleConfigChange(fieldKey, e.target.value)}
          style={{ minHeight: '90px' }}
        />
      );
    }
    return (
      <input
        type={vf.type === 'number' ? 'number' : 'text'}
        placeholder={vf.placeholder || ''}
        required={vf.required}
        value={configurationValues[fieldKey] ?? ''}
        className={commonClass}
        onChange={(e) =>
          handleConfigChange(
            fieldKey,
            vf.type === 'number' ? Number(e.target.value) : e.target.value
          )
        }
      />
    );
  }

  if (vf.type === 'array') {
    const keys: string[] = Array.isArray(vf.defaultValue)
      ? vf.defaultValue
      : [];

    const valueObj =
      (configurationValues[fieldKey] as Record<string, any>) || {};

    return (
      <div className="flex flex-col gap-8">
        {keys.map((k) => (
          <div key={k} className="flex flex-col gap-4">
            <label className="text-11 color-#00000099">{k}</label>

            <input
              type="text"
              placeholder={k}
              value={valueObj[k] ?? ''}
              className={commonClass}
              onChange={(e) => {
                handleConfigChange(fieldKey, {
                  ...valueObj,
                  [k]: e.target.value,
                });
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (vf.type === 'arrayOfImages') {
    return (
      <CustomerImagesUploader
        fieldKey={fieldKey}
        value={configurationValues[fieldKey]}
        onChange={handleConfigChange}
        onPreviewImage={onPreviewImage}
      />
    );
  }

  return null;
};

const CustomerImagesUploader: FC<{
  fieldKey: string;
  value: unknown;
  onChange: (key: string, value: any) => void;
  onPreviewImage?: (url: string) => void;
}> = ({ fieldKey, value, onChange, onPreviewImage }) => {
  const list: unknown[] = Array.isArray(value)
    ? value
    : value === undefined || value === null
      ? []
      : [value];

  const listRef = useRef<unknown[]>(list);
  useEffect(() => {
    listRef.current = list;
  }, [list]);

  const [uploadingFiles, setUploadingFiles] = useState<Set<File>>(new Set());

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(new Error('Could not preview image'));
      reader.readAsDataURL(file);
    });

  const startUpload = async (file: File) => {
    setUploadingFiles((prev) => {
      const next = new Set(prev);
      next.add(file);
      return next;
    });
    try {
      const url = await uploadPublicConfigurationImage(file);
      const current = listRef.current;
      if (current.includes(file)) {
        onChange(
          fieldKey,
          current.map((it) => (it === file ? url : it))
        );
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not upload image';
      toast.error(msg);
    } finally {
      setUploadingFiles((prev) => {
        const next = new Set(prev);
        next.delete(file);
        return next;
      });
    }
  };

  const removeAt = (idx: number) => {
    const item = list[idx];
    if (item instanceof File && uploadingFiles.has(item)) return;
    onChange(
      fieldKey,
      list.filter((_, i) => i !== idx)
    );
  };

  const uploadInputId = `cfg-array-images-${fieldKey}`;

  return (
    <div className="flex flex-wrap gap-10 a-items-start">
      {list.map((item, idx) => {
        const isFile = item instanceof File;
        const isUploadingThis = isFile && uploadingFiles.has(item);

        return (
          <div
            key={`${fieldKey}-img-${idx}`}
            className="flex flex-col a-items-center gap-4"
          >
            <div className="relative h-46 w-46 shrink-0 overflow-hidden radius-8 border border-#ddd bg-#fafafa">
              <button
                type="button"
                className="h-full w-full border-none bg-transparent p-0 cursor-zoom-in"
                aria-label="View image full size"
                onClick={async () => {
                  if (!onPreviewImage) return;
                  if (typeof item === 'string') {
                    onPreviewImage(item);
                    return;
                  }
                  if (item instanceof File) {
                    try {
                      const dataUrl = await readFileAsDataUrl(item);
                      onPreviewImage(dataUrl);
                    } catch (e) {
                      const msg =
                        e instanceof Error ? e.message : 'Could not preview image';
                      toast.error(msg);
                    }
                  }
                }}
              >
                {typeof item === 'string' ? (
                  <img
                    src={item}
                    alt=""
                    className="h-full w-full object-cover"
                    style={{ objectFit: 'cover', objectPosition: 'top' }}
                  />
                ) : isFile ? (
                  <CustomerBlobThumb file={item} />
                ) : null}
              </button>
              <button
                type="button"
                className="absolute r-2 t-2 radius-999 bg-red flex flex-col a-items-center j-content-center p-2 text-10 text-white border-none disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Remove"
                disabled={isUploadingThis}
                onClick={() => removeAt(idx)}
              >
                <IoMdClose className="h-10 w-10 color-#FFFFFF" aria-hidden />
              </button>
            </div>
            {isFile && (
              <button
                type="button"
                disabled={isUploadingThis}
                onClick={() => startUpload(item)}
                className="bg-transparent border-none p-0 text-10 weight-500 color-#0B9378 underline cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex a-items-center gap-3"
              >
                {isUploadingThis ? (
                  <>
                    <SpinLoader size={10} color="#0B9378" loading />
                    <span>Uploading…</span>
                  </>
                ) : (
                  <span>Upload</span>
                )}
              </button>
            )}
          </div>
        );
      })}
      <label
        htmlFor={uploadInputId}
        aria-label="Add images"
        style={{ position: 'relative' }}
        className="flex h-44 w-44 shrink-0 cursor-pointer a-items-center j-content-center radius-8 border border-dashed border-#0B9378 bg-#fafafa color-#0B9378 hover:bg-#EDFCF7"
      >
        <HiPlus className="h-24 w-24" aria-hidden />
        <input
          id={uploadInputId}
          type="file"
          multiple
          accept="image/*"
          tabIndex={-1}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
          }}
          onChange={(e) => {
            const files = e.target.files;
            if (!files?.length) return;
            onChange(fieldKey, [...list, ...Array.from(files)]);
            e.target.value = '';
          }}
        />
      </label>
    </div>
  );
};

export const buildUserConfigurations = (
  configurationValues: Record<string, any>,
  configurationRecords: ConfigurationRecord[]
) => {
  const result: Record<string, any> = {};

  configurationRecords.forEach((record: any) => {
    const schemaName = record?.description?.toLowerCase().replaceAll(' ', '_');

    const valuesForSchema: Record<string, any> = {};

    for (const field of record.customerDataForm ?? []) {
      const vf = field.valueFormat;
      const fieldName = vf.fieldName;
      const target = vf.targetUserType as string | undefined;
      const vendorDefault = vf.defaultValue;
      const customerInput = configurationValues[fieldName];

      if (target === 'vendor') {
        if (!isEmptyValue(vendorDefault)) {
          valuesForSchema[fieldName] = vendorDefault;
        }
        continue;
      }

      if (target === 'customer') {
        if (!isEmptyValue(customerInput)) {
          valuesForSchema[fieldName] = customerInput;
        }
        continue;
      }

      if (target === 'both') {
        if (!isEmptyValue(customerInput)) {
          valuesForSchema[fieldName] = customerInput;
        } else if (!isEmptyValue(vendorDefault)) {
          valuesForSchema[fieldName] = vendorDefault;
        }
      }
    }

    if (Object.keys(valuesForSchema).length > 0) {
      result[schemaName] = valuesForSchema;
    }
  });

  return result;
};

export function hasPendingConfigurationImageUploads(
  configurationValues: Record<string, any>
): boolean {
  for (const value of Object.values(configurationValues ?? {})) {
    if (!Array.isArray(value)) continue;
    if (value.some((x) => x instanceof File)) return true;
  }
  return false;
}

export async function resolveConfigurationImageFilesForCart(
  configurationValues: Record<string, any>,
  configurationRecords: ConfigurationRecord[],
  upload: (file: File) => Promise<string>
): Promise<Record<string, any>> {
  const next = { ...configurationValues };
  const fieldNames = new Set<string>();

  for (const record of configurationRecords ?? []) {
    for (const field of record.customerDataForm ?? []) {
      const vf = field.valueFormat;
      if (vf.type !== 'arrayOfImages') continue;
      if (!isCustomerInputForField(field)) continue;
      fieldNames.add(vf.fieldName);
    }
  }

  for (const key of Array.from(fieldNames)) {
    const val = next[key];
    if (val == null) continue;
    const arr = Array.isArray(val) ? val : [val];
    const urls: string[] = [];
    for (const item of arr) {
      if (item instanceof File) {
        urls.push(await upload(item));
      } else if (typeof item === 'string' && item.trim().length > 0) {
        urls.push(item);
      }
    }
    next[key] = urls;
  }

  return next;
}

interface IDisplayProductConfigurations {
  configurationRecords: ConfigurationRecord[];
  configurationValues: Record<string, any>;
  handleConfigChange: (key: string, value: any) => void;
  userConfigurations?: Record<string, any>;
  isEditingConfiguration?: boolean;
  onEditConfiguration?: () => void;
}

export const DisplayProductConfigurations: FC<
  IDisplayProductConfigurations
> = ({
  configurationRecords,
  configurationValues,
  handleConfigChange,
  userConfigurations,
  isEditingConfiguration = true,
  onEditConfiguration,
}) => {
    const [fullViewUrl, setFullViewUrl] = useState<string | null>(null);
    const [measurementsApplied, setMeasurementsApplied] = useState(false);
    const isPersonalizationSetup = usePersonalizationStore(
      (state) => state.isPersonalizationSetup
    );
    const dimensions = usePersonalizationStore((state) => state.dimensions);
    const unit = usePersonalizationStore((state) => state.unit);
    const shoeScale = usePersonalizationStore((state) => state.shoeScale);

    const canPrefill =
      isPersonalizationSetup &&
      (!userConfigurations || isEditingConfiguration) &&
      countPersonalizationPrefillMatches(
        configurationRecords,
        dimensions,
        unit,
        shoeScale
      ) > 0;

    const applyMeasurements = () => {
      const patch = buildPersonalizationPrefill(
        configurationRecords,
        dimensions,
        unit,
        shoeScale
      );
      Object.entries(patch).forEach(([key, value]) => {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          handleConfigChange(key, {
            ...(configurationValues[key] ?? {}),
            ...value,
          });
          return;
        }
        handleConfigChange(key, value);
      });
      setMeasurementsApplied(true);
    };

    useEffect(() => {
      setMeasurementsApplied(false);
    }, [configurationRecords]);

    useEffect(() => {
      if (!fullViewUrl) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setFullViewUrl(null);
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [fullViewUrl]);

    if (!configurationRecords.length) return null;

    return (
      <>
        <div className="flex flex-col gap-16">
          {canPrefill && (
            <button
              type="button"
              onClick={applyMeasurements}
              className="flex a-items-center j-content-between gap-10 w-full px-12 py-10 radius-8 border border-#0B937833 bg-#DEFFF9 pointer"
            >
              <span className="flex flex-col a-items-start gap-2 text-left">
                <span className="text-12 weight-600 color-#0B9378">
                  {measurementsApplied
                    ? 'Measurements applied'
                    : 'Use my measurements'}
                </span>
                <span className="text-11 weight-400 color-#0B9378">
                  {measurementsApplied
                    ? 'Matching fields were filled from your saved profile. You can still edit them.'
                    : `Prefill matching fields from your saved profile${unit ? ` (${unit})` : ''}.`}
                </span>
              </span>
              <span className="text-11 weight-600 color-#0B9378 underline flex-shrink-0">
                {measurementsApplied ? 'Apply again' : 'Prefill'}
              </span>
            </button>
          )}
          {configurationRecords.map((record) => {
            const customerFields =
              record.customerDataForm?.filter((f: any) =>
                isCustomerInputForField(f)
              ) || [];

            const vendorFields =
              record.customerDataForm?.filter((f: any) =>
                isVendorOnlyConfigurationField(f.valueFormat?.targetUserType)
              ) || [];

            const visibleVendorFields = vendorFields.filter((f: any) => {
              const v = f.valueFormat?.defaultValue;
              return !isEmptyValue(v);
            });

            if (!customerFields.length && !visibleVendorFields.length)
              return null;

            return (
              <div
                key={record.id}
                className={`flex flex-col ${userConfigurations && !isEditingConfiguration ? 'gap-4' : 'gap-12'}`}
              >
                <div className="flex flex-col gap-6 p-10 radius-6 bg-#F0F9FF border border-#91D5FF">
                  <p className="text-12 weight-500 color-#003A8C mb-4">
                    This product is a{' '}
                    <span className="weight-700">{record.description}</span>{' '}
                    product.
                  </p>

                  {visibleVendorFields.length > 0 && (
                    <div className="flex flex-col gap-5">
                      {visibleVendorFields.map((field: any) => {
                        const value = field.valueFormat?.defaultValue;
                        const vf = field.valueFormat;

                        if (
                          vf?.type === 'arrayOfImages' &&
                          Array.isArray(value) &&
                          value.length > 0 &&
                          value.every((x: unknown) => typeof x === 'string')
                        ) {
                          return (
                            <div
                              key={field.valueFormat.fieldName}
                              className="text-12 color-#003A8C"
                            >
                              <span className="weight-700">
                                {field.keyFormat?.defaultValue}:
                              </span>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {(value as string[]).map((url, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    className="h-64 w-64 cursor-zoom-in overflow-hidden rounded border border-#91D5FF p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-#1677FF"
                                    onClick={() => setFullViewUrl(url)}
                                    aria-label="View image full size"
                                  >
                                    <img
                                      src={url}
                                      alt=""
                                      className="h-full w-full object-cover"
                                      style={{ objectFit: 'cover', objectPosition: 'top' }}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        }

                        const displayValue = Array.isArray(value)
                          ? value.join(', ')
                          : String(value);

                        return (
                          <div
                            key={field.valueFormat.fieldName}
                            className="text-12 color-#003A8C"
                          >
                            <span className="weight-700">
                              {field.keyFormat?.defaultValue}:
                            </span>{' '}
                            <span>{displayValue}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {!userConfigurations &&
                    customerFields.some((f: any) => f.valueFormat?.required) && (
                      <p className="text-11 color-#003A8C mt-5">
                        Please fill all required fields below to continue.
                      </p>
                    )}
                </div>
                {customerFields.length > 0 && (
                  <>
                    {userConfigurations &&
                      !isEditingConfiguration &&
                      record.description &&
                      userConfigurations[
                      record.description.toLowerCase().replaceAll(' ', '_')
                      ] ? (
                      <UserConfigurationSummary
                        userConfigurations={{
                          [record.description.toLowerCase().replaceAll(' ', '_')]:
                            userConfigurations[
                            record.description
                              .toLowerCase()
                              .replaceAll(' ', '_')
                            ],
                        }}
                        configurationFormFields={
                          record.customerDataForm ?? []
                        }
                        onPreviewImage={setFullViewUrl}
                        onEdit={onEditConfiguration ?? (() => { })}
                      />
                    ) : (
                      <div className="flex flex-col gap-10">
                        {customerFields.map((field: any) => {
                          const hasError =
                            field.valueFormat?.required &&
                            (() => {
                              const key = field.valueFormat.fieldName;
                              const val = configurationValues[key];

                              if (field.valueFormat.type === 'array') {
                                if (!val || typeof val !== 'object') return true;
                                return field.valueFormat.defaultValue.some(
                                  (k: string) => isEmptyValue(val[k])
                                );
                              }

                              if (field.valueFormat.type === 'arrayOfImages') {
                                if (!val) return true;
                                if (Array.isArray(val)) return val.length === 0;
                                return true;
                              }

                              return isEmptyValue(val);
                            })();

                          return (
                            <div
                              key={field.valueFormat.fieldName}
                              className="flex flex-col gap-5"
                            >
                              <label className="text-12 weight-500">
                                {field.keyFormat?.defaultValue}
                                {field.valueFormat?.required && (
                                  <span style={{ color: 'red' }}> {hasError ? '(required)' : '*'}</span>
                                )}
                              </label>

                              {renderCustomerField(
                                field,
                                configurationValues,
                                handleConfigChange,
                                setFullViewUrl
                              )}

                              {/* {hasError && (
                              <span className="text-11 color-#D4380D">
                                This field is required
                              </span>
                            )} */}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
        {fullViewUrl &&
          createPortal(
            <div
              className="fixed inset-0 flex items-center justify-center overflow-auto p-16"
              style={{ zIndex: 100_000, backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
              role="dialog"
              aria-modal="true"
              aria-label="Image preview"
              onClick={() => setFullViewUrl(null)}
            >
              <button
                type="button"
                className="absolute flex a-items-center j-content-center radius-99 bg-white pointer"
                style={{
                  top: 'max(12px, env(safe-area-inset-top, 0px))',
                  right: 'max(12px, env(safe-area-inset-right, 0px))',
                  minWidth: 48,
                  minHeight: 48,
                  padding: 10,
                  zIndex: 1,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
                }}
                aria-label="Close preview"
                onClick={(e) => {
                  e.stopPropagation();
                  setFullViewUrl(null);
                }}
              >
                <IoMdClose className="w-28 h-28 color-black" aria-hidden />
              </button>
              <img
                src={fullViewUrl}
                alt=""
                className="block h-auto w-auto object-contain"
                style={{
                  maxWidth: 'calc(100vw - 32px)',
                  maxHeight: 'calc(100vh - 32px)',
                  objectFit: 'contain',
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>,
            document.body
          )}
      </>
    );
  };

const unwrapMergedConfigurationValue = (value: any): any => {
  if (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    ('vendor' in value || 'customer' in value)
  ) {
    return !isEmptyValue(value.customer) ? value.customer : value.vendor;
  }
  return value;
};

const stringifyForSummary = (v: any): string => {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) {
    return v
      .map((item, i) => `${i}: ${stringifyForSummary(item)}`)
      .join(', ');
  }
  if (typeof v === 'object') {
    return Object.entries(v)
      .map(([k, val]) => `${k}: ${stringifyForSummary(val)}`)
      .join(', ');
  }
  return String(v);
};

const renderConfigurationValueForSummary = (value: any): ReactNode => {
  const v = unwrapMergedConfigurationValue(value);
  if (Array.isArray(v)) {
    const allHttpUrls =
      v.length > 0 &&
      v.every((x) => typeof x === 'string' && /^https?:\/\//i.test(x));
    if (allHttpUrls) {
      return (
        <span className="flex flex-wrap gap-1 justify-end">
          {(v as string[]).map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              className="h-12 w-12 rounded border object-cover"
              style={{ objectFit: 'cover', objectPosition: 'top' }}
            />
          ))}
        </span>
      );
    }
    return <span>{stringifyForSummary(v)}</span>;
  }
  if (v && typeof v === 'object') {
    return <span className="text-11">{stringifyForSummary(v)}</span>;
  }
  return <span>{String(v ?? '')}</span>;
};

const summarizeConfigurationEntry = (_key: string, value: any): ReactNode => {
  return (
    <span className="weight-500 color-#000000">
      {renderConfigurationValueForSummary(value)}
    </span>
  );
};

const looksLikeImageUrl = (v: unknown): v is string => {
  if (typeof v !== 'string') return false;
  const trimmed = v.trim();
  if (!trimmed) return false;
  if (/^https?:\/\//i.test(trimmed)) return true;
  return /\.(png|jpe?g|gif|webp|avif|svg|bmp)(\?.*)?$/i.test(trimmed);
};

const renderSummaryValue = (
  value: any,
  onPreviewImage?: (url: string) => void
): ReactNode => {
  if (looksLikeImageUrl(value)) {
    return (
      <button
        type="button"
        className="inline-block border-none bg-transparent p-0 cursor-zoom-in"
        aria-label="View image full size"
        onClick={() => onPreviewImage?.(value)}
      >
        <img
          src={value}
          alt=""
          className="h-32 w-32 radius-6 border border-#00000014 object-cover inline-block"
          style={{ objectFit: 'cover', objectPosition: 'top' }}
        />
      </button>
    );
  }

  if (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((x) => looksLikeImageUrl(x))
  ) {
    return (
      <span className="inline-flex flex-wrap gap-4 j-content-end">
        {(value as string[]).map((url, i) => (
          <button
            key={i}
            type="button"
            className="border-none bg-transparent p-0 cursor-zoom-in"
            aria-label="View image full size"
            onClick={() => onPreviewImage?.(url)}
          >
            <img
              src={url}
              alt=""
              className="h-32 w-32 radius-6 border border-#00000014 object-cover"
              style={{ objectFit: 'cover', objectPosition: 'top' }}
            />
          </button>
        ))}
      </span>
    );
  }

  if (value && typeof value === 'object') {
    return (
      <span>
        {Object.entries(value as Record<string, unknown>)
          .map(([k, v]) => `${k}: ${v}`)
          .join('; ')}
      </span>
    );
  }

  return <span>{String(value)}</span>;
};

const UserConfigurationSummary = ({
  userConfigurations,
  onEdit,
  configurationFormFields,
  onPreviewImage,
}: {
  userConfigurations: Record<string, any>;
  onEdit: () => void;
  configurationFormFields?: any[];
  onPreviewImage?: (url: string) => void;
}) => {
  const customerOrBothFieldNames = new Set(
    (configurationFormFields ?? [])
      .filter((f: any) =>
        isCustomerConfigurationInput(f.valueFormat?.targetUserType)
      )
      .map((f: any) => f.valueFormat?.fieldName)
      .filter(Boolean)
  );

  return (
    <div className="flex flex-col gap-10">
      {Object.entries(userConfigurations).map(([schemaName, fields]) => (
        <div
          key={schemaName}
          className="p-10 radius-6 border border-#0B9378 bg-#EDFCF7 flex flex-col gap-6"
        >
          <div className="flex flex-col gap-4">
            {Object.entries(fields as Record<string, any>)
              .filter(([key]) =>
                customerOrBothFieldNames.size === 0
                  ? true
                  : customerOrBothFieldNames.has(key)
              )
              .map(([key, value]) => (
                <div
                  key={key}
                  className="flex flex-col gap-4 text-12"
                >
                  <span
                    className="color-#000000 weight-400 capitalize"
                    style={{ textWrap: 'nowrap' }}
                  >
                    {key.replaceAll('_', ' ')}:
                  </span>

                  <span className="weight-500 color-#00000099">
                    {renderSummaryValue(value, onPreviewImage)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={onEdit}
        className="self-start text-12 color-#0B9378 weight-500 underline border-none bg-transparent cursor-pointer"
      >
        Edit user data
      </button>
    </div>
  );
};

const isHttpUrlArray = (v: unknown): v is string[] =>
  Array.isArray(v) &&
  v.length > 0 &&
  v.every((x) => typeof x === 'string' && /^https?:\/\//i.test(x));

const configDetailBreakStyle: CSSProperties = {
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
};

const renderConfigLeaf = (v: any): ReactNode => {
  if (v === undefined || v === null || v === '') return null;
  if (Array.isArray(v)) {
    if (v.length === 0) return null;
    if (isHttpUrlArray(v)) {
      return (
        <span className="inline-flex flex-wrap gap-3 justify-end">
          {v.map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              className="h-30 w-30 radius-6 border border-#00000014 object-cover"
              style={{ objectFit: 'cover', objectPosition: 'top' }}
            />
          ))}
        </span>
      );
    }
    return (
      <span
        className="weight-500 color-#000000E0 min-w-0 max-w-100p text-right"
        style={configDetailBreakStyle}
      >
        {v.join(', ')}
      </span>
    );
  }
  if (v && typeof v === 'object') {
    const vo = v as Record<string, unknown>;
    const hasVendor = 'vendor' in vo && vo.vendor != null && !isEmptyValue(vo.vendor);
    const hasCustomer =
      'customer' in vo && vo.customer != null && !isEmptyValue(vo.customer);
    if (hasVendor || hasCustomer) {
      return (
        <span
          className="flex max-w-100p min-w-0 flex-col gap-2 items-end text-right"
          style={configDetailBreakStyle}
        >
          {hasVendor && (
            <span className="flex max-w-100p min-w-0 flex-col gap-1 items-end">
              <span className="text-10 color-#00000099">Seller reference</span>
              {renderConfigLeaf(vo.vendor)}
            </span>
          )}
          {hasCustomer && (
            <span className="flex max-w-100p min-w-0 flex-col gap-1 items-end">
              <span className="text-10 color-#00000099">Customer</span>
              {renderConfigLeaf(vo.customer)}
            </span>
          )}
        </span>
      );
    }
    return (
      <span className="ml-6 flex max-w-100p min-w-0 flex-col gap-1">
        {Object.entries(v).map(([nk, nv]) => (
          <span
            key={nk}
            className="flex w-100p min-w-0 space-between gap-12 text-12 color-#00000099"
          >
            <span className="flex-shrink-0 capitalize">
              {nk.replaceAll('_', ' ')}
            </span>
            <span
              className="weight-500 color-#000000E0 min-w-0 max-w-100p flex-grow-1 text-right"
              style={configDetailBreakStyle}
            >
              {renderConfigLeaf(nv) ?? String(nv)}
            </span>
          </span>
        ))}
      </span>
    );
  }
  return (
    <span
      className="weight-500 color-#000000E0 min-w-0 max-w-100p"
      style={configDetailBreakStyle}
    >
      {String(v)}
    </span>
  );
};

const renderConfigDetails = (value: any) => {
  if (
    value === undefined ||
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return null;
  }

  if (typeof value !== 'object' || Array.isArray(value)) {
    return (
      <span
        className="block max-w-100p min-w-0 text-12 color-#00000099"
        style={configDetailBreakStyle}
      >
        {renderConfigLeaf(value)}
      </span>
    );
  }

  return Object.entries(value).map(([k, v]) => {
    if (Array.isArray(v) && isHttpUrlArray(v)) {
      return (
        <div key={k} className="flex w-100p min-w-0 flex-col gap-2 text-12">
          <span className="flex-shrink-0 capitalize color-#00000099">
            {k.replaceAll('_', ' ')}
          </span>
          <span className="min-w-0">{renderConfigLeaf(v)}</span>
        </div>
      );
    }

    if (!v || typeof v !== 'object' || Array.isArray(v)) {
      return (
        <div
          key={k}
          className="flex w-100p min-w-0 gap-12 space-between text-12"
        >
          <span className="flex-shrink-0 capitalize color-#00000099">
            {k.replaceAll('_', ' ')}
          </span>
          <span
            className="flex min-w-0 flex-grow-1 flex-col items-end text-right"
            style={configDetailBreakStyle}
          >
            {renderConfigLeaf(v)}
          </span>
        </div>
      );
    }

    const vo = v as Record<string, unknown>;
    const mergedBoth =
      ('vendor' in vo || 'customer' in vo) &&
      Object.keys(vo).every((key) => key === 'vendor' || key === 'customer');

    if (mergedBoth) {
      return (
        <div
          key={k}
          className="flex w-100p min-w-0 gap-12 space-between text-12"
        >
          <span className="flex-shrink-0 capitalize color-#00000099">
            {k.replaceAll('_', ' ')}
          </span>
          <span
            className="flex min-w-0 flex-grow-1 flex-col items-end text-right"
            style={configDetailBreakStyle}
          >
            {renderConfigLeaf(v)}
          </span>
        </div>
      );
    }

    return (
      <span key={k} className="flex max-w-100p min-w-0 flex-col gap-2">
        <span className="text-12 capitalize color-#00000099">
          {k.replaceAll('_', ' ')}
        </span>
        <span className="min-w-0" style={configDetailBreakStyle}>
          {renderConfigLeaf(v)}
        </span>
      </span>
    );
  });
};

export const ConfigPill = ({ title, value }: { title: string; value: any }) => {
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'top-start',
    middleware: [offset(8), flip({ fallbackPlacements: ['bottom-start'] }), shift({ padding: 8 })],
  });

  const hover = useHover(context, {
    handleClose: safePolygon(),
    move: false,
  });

  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    dismiss,
  ]);

  return (
    <>
      <span
        ref={refs.setReference}
        {...getReferenceProps()}
        data-modal-ignore-outside-click="true"
        className="text-12 weight-500 hover:pointer inline-block"
        style={{
          padding: '6px 10px',
          borderRadius: 999,
          background: '#F0F9FF',
          border: '1px solid #91D5FF',
          color: '#003A8C',
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </span>

      {open && (
        <FloatingPortal>
          <p
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              maxWidth: 'min(380px, calc(100vw - 24px))',
              overflowWrap: 'anywhere',
            }}
            {...getFloatingProps()}
            data-modal-ignore-outside-click="true"
            className="z-50 radius-6 border border-#00000014 bg-white p-10 flex flex-col gap-6 min-w-250 max-w-400"
          >
            <span className="inline-block text-12 weight-600 capitalize color-#000000E0">
              {title}
            </span>

            <span className="flex max-w-100p min-w-0 flex-col gap-4">
              {renderConfigDetails(value)}
            </span>
          </p>
        </FloatingPortal>
      )}
    </>
  );
};
