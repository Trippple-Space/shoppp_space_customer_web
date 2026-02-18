import { FC, useState } from 'react';
import { ConfigurationRecord } from '../../utility/types/product.interface';
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
    return (
      <input
        type="file"
        multiple
        accept="image/*"
        style={commonStyle}
        onChange={(e) =>
          handleConfigChange(
            fieldKey,
            e.target.files ? Array.from(e.target.files) : []
          )
        }
      />
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

    const customerFields =
      record.customerDataForm?.filter(
        (f: any) => f.valueFormat?.targetUserType === 'customer'
      ) || [];

    const vendorFields =
      record.customerDataForm?.filter(
        (f: any) => f.valueFormat?.targetUserType !== 'customer'
      ) || [];

    const valuesForSchema: Record<string, any> = {};

    customerFields.forEach((field: any) => {
      const { fieldName, type } = field.valueFormat;
      const value = configurationValues[fieldName];

      if (isEmptyValue(value)) return;

      if (type === 'string' || type === 'number') {
        valuesForSchema[fieldName] = value;
        return;
      }

      if (type === 'array') {
        valuesForSchema[fieldName] = value;
        return;
      }
    });

    vendorFields.forEach((field: any) => {
      const { fieldName, defaultValue } = field.valueFormat;

      if (isEmptyValue(defaultValue)) return;

      valuesForSchema[fieldName] = defaultValue;
    });

    if (Object.keys(valuesForSchema).length > 0) {
      result[schemaName] = valuesForSchema;
    }
  });

  return result;
};

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
  return (
    configurationRecords.length > 0 && (
      <div className="flex flex-col gap-16">
        {configurationRecords.map((record) => {
          const customerFields =
            record.customerDataForm?.filter(
              (f: any) => f.valueFormat?.targetUserType === 'customer'
            ) || [];

          const vendorFields =
            record.customerDataForm?.filter(
              (f: any) => f.valueFormat?.targetUserType !== 'customer'
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
                <p className="text-12 weight-400 color-#003A8C">
                  This product is a{' '}
                  <span className="weight-500">{record.description}</span>{' '}
                  product.
                </p>

                {visibleVendorFields.length > 0 && (
                  <div className="flex flex-col gap-4">
                    {visibleVendorFields.map((field: any) => {
                      const value = field.valueFormat?.defaultValue;

                      const displayValue = Array.isArray(value)
                        ? value.join(', ')
                        : String(value);

                      return (
                        <div
                          key={field.valueFormat.fieldName}
                          className="text-12 color-#003A8C"
                        >
                          <span className="weight-500">
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
                    <p className="text-11 color-#003A8C">
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
                      onEdit={onEditConfiguration ?? (() => {})}
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

                            return isEmptyValue(val);
                          })();

                        return (
                          <div
                            key={field.valueFormat.fieldName}
                            className="flex flex-col gap-4"
                          >
                            <label className="text-12 weight-400">
                              {field.keyFormat?.defaultValue}
                              {field.valueFormat?.required && (
                                <span style={{ color: 'red' }}> *</span>
                              )}
                            </label>

                            {renderCustomerField(
                              field,
                              configurationValues,
                              handleConfigChange
                            )}

                            {hasError && (
                              <span className="text-11 color-#D4380D">
                                This field is required
                              </span>
                            )}
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
    )
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
              ([key, value]) => {
                const display =
                  typeof value === 'object'
                    ? Object.entries(value)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(', ')
                    : String(value);

                return (
                  <div key={key} className="flex justify-between gap-3 text-12">
                    <span className="color-#00000099 weight-400 capitalize">
                      {key.replaceAll('_', ' ')}:
                    </span>

                    <span className="weight-500 color-#000000">{display}</span>
                  </div>
                );
              }
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
        {Array.isArray(value) ? value.join(', ') : String(value)}
      </span>
    );
  }

  return Object.entries(value).map(([k, v]) => {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      return (
        <span key={k} className="flex flex-col gap-2">
          <span className="text-12 color-#00000099 capitalize">
            {k.replaceAll('_', ' ')}
          </span>

          <span className="flex flex-col gap-1 ml-6">
            {Object.entries(v).map(([nk, nv]) => (
              <span
                key={nk}
                className="flex space-between gap-12 text-12 color-#00000099"
              >
                <span className="capitalize">{nk.replaceAll('_', ' ')}</span>
                <span className="weight-500 color-#000000E0">{String(nv)}</span>
              </span>
            ))}
          </span>
        </span>
      );
    }

    return (
      <div key={k} className="flex gap-12 space-between text-12">
        <span className="capitalize color-#00000099">
          {k.replaceAll('_', ' ')}
        </span>
        <span className="weight-500 color-#000000E0">{String(v)}</span>
      </div>
    );
  });
};

export const ConfigPill = ({ title, value }: { title: string; value: any }) => {
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    middleware: [offset(8), flip(), shift({ padding: 8 })],
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
