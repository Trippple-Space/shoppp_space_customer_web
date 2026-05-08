export function isCustomerConfigurationInput(
  targetUserType?: string | null
): boolean {
  return targetUserType === 'customer' || targetUserType === 'both';
}

export function isVendorConfigurationDefault(
  targetUserType?: string | null
): boolean {
  return targetUserType === 'vendor' || targetUserType === 'both';
}

export function isVendorOnlyConfigurationField(
  targetUserType?: string | null
): boolean {
  return targetUserType === 'vendor';
}
