/**
 * @description The user-provided configuration object
 */
export type Config = {
  connectionString: string;
  toggles: ToggleInfo[];
  fallbackUserGroup?: string;
};

/**
 * @description The required information to retrieve a toggle
 */
export type ToggleInfo = {
  name: string;
  label: string;
};
