import { FC, useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { IoMdClose } from 'react-icons/io';
import { HiPlus } from 'react-icons/hi2';
import { ConfigurationRecord } from '../../utility/types/product.interface';
import {
  isCustomerConfigurationInput,
  isVendorConfigurationDefault,
} from '../../utility/configuration-field-target';
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

export const isEmptyValue = (v: any) => {
  if (v === null || v === undefined) return true;
  if (typeof v === 'string') return v.trim() === '';
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object') return Object.keys(v).length === 0;
  return false;
};

export const isCustomerInputForField = (field: any): boolean => {
  const vf = field?.valueFormat;
  if (!vf) return false;
  if (isCustomerConfigurationInput(vf.targetUserType)) return true;
  if (vf.type === 'arrayOfImages') return true;
  return false;
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
    <img src={src} alt="" className="h-full w-full object-cover" />
  );
};

export const renderCustomerField = (
  field: any,
  configurationValues: Record<string, any>,
  handleConfigChange: (key: string, value: any) => void
) => {
  const vf = field.valueFormat;
  const fieldKey = vf.fieldName;

  const commonStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px',
    borderRadius: 6,
    border: '1px solid #ddd',
  };

  if (vf.type === 'string' || vf.type === 'number') {
    return (
      <input
        type={vf.type === 'number' ? 'number' : 'text'}
        placeholder={vf.placeholder || ''}
        required={vf.required}
        value={configurationValues[fieldKey] ?? ''}
        style={commonStyle}
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
              style={commonStyle}
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
    const raw = configurationValues[fieldKey];
    const list: unknown[] = Array.isArray(raw)
      ? raw
      : raw === undefined || raw === null
        ? []
        : [raw];

    const uploadInputId = `cfg-array-images-${fieldKey}`;

    return (
      <div className="flex flex-wrap gap-6 a-items-center">
        {list.map((item, idx) => (
          <div
            key={`${fieldKey}-img-${idx}`}
            className="relative h-46 w-46 shrink-0 overflow-hidden radius-8 border border-#ddd bg-#fafafa"
          >
            {typeof item === 'string' ? (
              <img
                src={item}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : item instanceof File ? (
              <CustomerBlobThumb file={item} />
            ) : null}
            <button
              type="button"
              className="absolute r-0 t-0 radius-bl-8 bg-black opacity-50 px-1 text-10 text-white"
              aria-label="Remove"
              onClick={() =>
                handleConfigChange(
                  fieldKey,
                  list.filter((_, i) => i !== idx)
                )
              }
            >
              <IoMdClose className="h-10 w-10" aria-hidden />
            </button>
          </div>
        ))}
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
              handleConfigChange(fieldKey, [...list, ...Array.from(files)]);
              e.target.value = '';
            }}
          />
        </label>
      </div>
    );
  }

  return null;
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
        const hasVendor = !isEmptyValue(vendorDefault);
        const hasCustomer = !isEmptyValue(customerInput);

        if (!hasVendor && !hasCustomer) continue;

        if (hasVendor && hasCustomer) {
          valuesForSchema[fieldName] = {
            vendor: vendorDefault,
            customer: customerInput,
          };
        } else if (hasVendor) {
          valuesForSchema[fieldName] = vendorDefault;
        } else {
          valuesForSchema[fieldName] = customerInput;
        }
      }
    }

    if (Object.keys(valuesForSchema).length > 0) {
      result[schemaName] = valuesForSchema;
    }
  });

  return result;
};

/** Upload File entries for customer/both arrayOfImages fields before JSON cart payload */
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
          {configurationRecords.map((record) => {
            const customerFields =
              record.customerDataForm?.filter((f: any) =>
                isCustomerInputForField(f)
              ) || [];

            const vendorFields =
              record.customerDataForm?.filter((f: any) =>
                isVendorConfigurationDefault(f.valueFormat?.targetUserType)
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
                                handleConfigChange
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
              className="fixed inset-0 flex items-center justify-center bg-black/85 p-16"
              style={{ zIndex: 100_000 }}
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
                className="max-h-[90vh] max-w-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>,
            document.body
          )}
      </>
    );
  };

const renderConfigurationValueForSummary = (value: any): ReactNode => {
  if (Array.isArray(value)) {
    const allHttpUrls = value.every(
      (x) => typeof x === 'string' && /^https?:\/\//i.test(x)
    );
    if (allHttpUrls) {
      return (
        <span className="flex flex-wrap gap-1 justify-end">
          {(value as string[]).map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              className="h-12 w-12 rounded border object-cover"
            />
          ))}
        </span>
      );
    }
    return <span>{value.join(', ')}</span>;
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return (
      <span className="text-11">
        {Object.entries(value)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ')}
      </span>
    );
  }
  return <span>{String(value)}</span>;
};

const summarizeConfigurationEntry = (_key: string, value: any): ReactNode => {
  if (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    ('vendor' in value || 'customer' in value)
  ) {
    return (
      <span className="flex flex-col gap-2 items-end text-right max-w-[min(280px,85vw)]">
        {value.vendor != null && !isEmptyValue(value.vendor) && (
          <span className="flex flex-col gap-1 items-end">
            <span className="text-10 color-#00000099">Seller reference</span>
            {renderConfigurationValueForSummary(value.vendor)}
          </span>
        )}
        {value.customer != null && !isEmptyValue(value.customer) && (
          <span className="flex flex-col gap-1 items-end">
            <span className="text-10 color-#00000099">Your details</span>
            {renderConfigurationValueForSummary(value.customer)}
          </span>
        )}
      </span>
    );
  }
  return (
    <span className="weight-500 color-#000000">
      {renderConfigurationValueForSummary(value)}
    </span>
  );
};

const UserConfigurationSummary = ({
  userConfigurations,
  onEdit,
}: {
  userConfigurations: Record<string, any>;
  onEdit: () => void;
}) => {
  return (
    <div className="flex flex-col gap-10">
      {Object.entries(userConfigurations).map(([schemaName, fields]) => (
        <div
          key={schemaName}
          className="p-10 radius-6 border border-#0B9378 bg-#EDFCF7 flex flex-col gap-6"
        >
          <div className="flex flex-col gap-4">
            {Object.entries(fields as Record<string, any>).map(
              ([key, value]) => (
                <div key={key} className="flex justify-between gap-3 text-12">
                  <span className="color-#00000099 weight-400 capitalize shrink-0">
                    {key.replaceAll('_', ' ')}:
                  </span>

                  {summarizeConfigurationEntry(key, value)}
                </div>
              )
            )}
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

const renderConfigLeaf = (v: any): ReactNode => {
  if (v === undefined || v === null || v === '') return null;
  if (Array.isArray(v)) {
    if (v.length === 0) return null;
    if (isHttpUrlArray(v)) {
      return (
        <span className="inline-flex flex-wrap gap-1 justify-end">
          {v.map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              className="h-10 w-10 rounded border border-#00000014 object-cover"
            />
          ))}
        </span>
      );
    }
    return (
      <span className="weight-500 color-#000000E0">{v.join(', ')}</span>
    );
  }
  if (v && typeof v === 'object') {
    const vo = v as Record<string, unknown>;
    const hasVendor = 'vendor' in vo && vo.vendor != null && !isEmptyValue(vo.vendor);
    const hasCustomer =
      'customer' in vo && vo.customer != null && !isEmptyValue(vo.customer);
    if (hasVendor || hasCustomer) {
      return (
        <span className="flex flex-col gap-2 items-end text-right">
          {hasVendor && (
            <span className="flex flex-col gap-1 items-end">
              <span className="text-10 color-#00000099">Seller reference</span>
              {renderConfigLeaf(vo.vendor)}
            </span>
          )}
          {hasCustomer && (
            <span className="flex flex-col gap-1 items-end">
              <span className="text-10 color-#00000099">Customer</span>
              {renderConfigLeaf(vo.customer)}
            </span>
          )}
        </span>
      );
    }
    return (
      <span className="flex flex-col gap-1 ml-6">
        {Object.entries(v).map(([nk, nv]) => (
          <span
            key={nk}
            className="flex space-between gap-12 text-12 color-#00000099"
          >
            <span className="capitalize">{nk.replaceAll('_', ' ')}</span>
            <span className="weight-500 color-#000000E0">
              {renderConfigLeaf(nv) ?? String(nv)}
            </span>
          </span>
        ))}
      </span>
    );
  }
  return (
    <span className="weight-500 color-#000000E0">{String(v)}</span>
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
      <span className="inline-block text-12 color-#00000099">
        {renderConfigLeaf(value)}
      </span>
    );
  }

  return Object.entries(value).map(([k, v]) => {
    if (!v || typeof v !== 'object' || Array.isArray(v)) {
      return (
        <div key={k} className="flex gap-12 space-between text-12">
          <span className="capitalize color-#00000099 shrink-0">
            {k.replaceAll('_', ' ')}
          </span>
          <span className="flex flex-col items-end min-w-0">
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
        <div key={k} className="flex gap-12 space-between text-12">
          <span className="capitalize color-#00000099 shrink-0">
            {k.replaceAll('_', ' ')}
          </span>
          <span className="flex flex-col items-end min-w-0">{renderConfigLeaf(v)}</span>
        </div>
      );
    }

    return (
      <span key={k} className="flex flex-col gap-2">
        <span className="text-12 color-#00000099 capitalize">
          {k.replaceAll('_', ' ')}
        </span>
        {renderConfigLeaf(v)}
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
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-50 radius-6 border border-#00000014 bg-white p-10 flex flex-col gap-6 min-w-250"
          >
            <span className="inline-block text-12 weight-600 capitalize color-#000000E0">
              {title}
            </span>

            <span className="flex flex-col gap-4">
              {renderConfigDetails(value)}
            </span>
          </p>
        </FloatingPortal>
      )}
    </>
  );
};
