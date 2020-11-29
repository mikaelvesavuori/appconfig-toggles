/**
 * @description The final toggle, such as the user will get it
 */
export type Toggle = {
  id: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  isRolledOutForCurrentUser: boolean;
};
