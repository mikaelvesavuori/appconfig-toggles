/**
 * @description Data coming from Azure App Configuration when you pull toggles
 */
export type AzureToggleConfiguration = {
  id: string;
  description: string;
  enabled: boolean;
  conditions: Conditions;
};

type Conditions = {
  client_filters: ClientFilters[];
};

type ClientFilters = {
  name: string;
  parameters: Parameters;
};

type Parameters = {
  Audience: Audience;
};

type Audience = {
  Users: string[];
  Groups: Group[];
  DefaultRolloutPercentage: number;
};

export type Group = {
  Name: string;
  RolloutPercentage: number;
};
