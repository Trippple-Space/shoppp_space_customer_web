import { FC } from 'react';
import { ConfigurationRecord } from '../../utility/types/product.interface';

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

interface IDisplayProductConfigurations {
  configurationRecords: ConfigurationRecord[];
  configurationValues: Record<string, any>;
  handleConfigChange: (key: string, value: any) => void;
}

export const DisplayProductConfigurations: FC<IDisplayProductConfigurations> = ({
  configurationRecords,
  configurationValues,
  handleConfigChange,
}) => {
  return (
    configurationRecords.length > 0 && (
      <div className="mt-20 flex flex-col gap-16">
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
            <div key={record.id} className="flex flex-col gap-12">
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

                {customerFields.some((f: any) => f.valueFormat?.required) && (
                  <p className="text-11 color-#003A8C">
                    Please fill all required fields below to continue.
                  </p>
                )}
              </div>

              {customerFields.length > 0 && (
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
            </div>
          );
        })}
      </div>
    )
  );
};
