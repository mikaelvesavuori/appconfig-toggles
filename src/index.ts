import { AppConfigurationClient } from '@azure/app-configuration';

import { Config, ToggleInfo } from './contracts/Config';
import { Toggle } from './contracts/AppConfigToggles';
import { AzureToggleConfiguration, Group } from './contracts/AzureToggleConfiguration';

export class AppConfigToggles {
  config: Config;
  userGroup: string;
  fallbackUserGroup: string;
  toggles: Toggle[] | undefined = undefined;

  constructor(config: Config, userGroup: string) {
    if (!config || !userGroup)
      throw new Error('Missing config and/or userGroup when creating AppConfigToggles!');

    this.config = config;
    this.fallbackUserGroup = config.fallbackUserGroup ? config.fallbackUserGroup : 'Public'; // "Public" is our fallback if no user group is passed
    this.userGroup = userGroup ? userGroup : this.fallbackUserGroup;
  }

  /**
   * Do initialization for feature toggles
   * Happens after creating the class because this needs to be an async operation
   */
  public async init(): Promise<void> {
    const toggles = await this.loadToggles(this.config);
    if (toggles) this.toggles = toggles;
  }

  /**
   * Helper to get map of toggles from App Configuration
   */
  private async loadToggles(config: Config): Promise<Toggle[] | void> {
    const { connectionString } = config;
    const client = new AppConfigurationClient(connectionString);

    //console.log('APP_CONFIG_TOGGLES_TEST --->', process.env.APP_CONFIG_TOGGLES_TEST);

    const userToggles = config.toggles;
    if (!userToggles) throw new Error('Missing userToggles in loadToggles()!');

    const toggles: Toggle[] | void = await Promise.all(
      userToggles.map(async (toggle) => {
        const { name, label } = toggle;
        return await this.loadToggle(client, { name, label });
      })
    ).catch((error) => {
      throw new Error(error);
    });

    // Make sure to filter out any empties or "not-found" toggles
    if (toggles) return toggles.filter((a: Toggle) => a !== null);
    return;
  }

  /**
   * Retrieve an individual toggle from App Configuration and return in our custom format
   */
  private async loadToggle(
    client: AppConfigurationClient,
    toggle: ToggleInfo
  ): Promise<Toggle | any> {
    const { name, label } = toggle;
    const retrievedSetting: any = await client.getConfigurationSetting({
      key: name,
      label
    });

    const parsedSetting: AzureToggleConfiguration = JSON.parse(retrievedSetting.value);

    // Get user's matched group
    const group: Group | undefined = this.getMatchedUserGroup(
      parsedSetting,
      this.userGroup,
      this.fallbackUserGroup
    );

    // Bail out if no match
    if (!group) return;

    // Get some nicer names
    const { id, description, enabled } = parsedSetting;
    const rolloutPercentage: number = group.RolloutPercentage;

    const isRolledOutForCurrentUser: boolean = this.checkIfToggleIsRolledOutForCurrentUser(
      rolloutPercentage
    );

    return {
      id,
      description,
      enabled,
      rolloutPercentage,
      isRolledOutForCurrentUser
    };
  }

  /**
   * Get the group that matches the user's group
   */
  private getMatchedUserGroup(
    parsedSetting: AzureToggleConfiguration,
    userGroup: string | undefined,
    fallbackUserGroup: string
  ): Group | undefined {
    if (!userGroup) userGroup = fallbackUserGroup;

    const groups = parsedSetting.conditions.client_filters[0].parameters.Audience.Groups;
    return groups.find((group: Group) => group.Name === userGroup);
  }

  /**
   * Check if rollout allows user to use toggle
   */
  private checkIfToggleIsRolledOutForCurrentUser(rolloutPercentage: number): boolean {
    if (rolloutPercentage === undefined || rolloutPercentage === null)
      throw new Error('Missing rolloutPercentage in checkIfToggleisRolledOutForCurrentUser()!');

    if (rolloutPercentage === 0) return false;
    if (rolloutPercentage === 100) return true;

    const RANDOM_CHANCE = Math.round(Math.random() * 100);
    if (RANDOM_CHANCE >= rolloutPercentage) return true;

    return false;
  }

  /**
   * Can the user actually use this toggle?
   */
  public canUseToggle(toggleName: string): boolean {
    const toggles = this.toggles;
    if (!toggles || toggles.length === 0) return false;

    const VALID_TOGGLE_EXISTS = toggles?.find(
      (toggle) => toggle.id === toggleName && toggle.isRolledOutForCurrentUser
    )
      ? true
      : false;

    return VALID_TOGGLE_EXISTS;
  }

  /**
   * Get the description for a named toggle
   */
  public getToggleDescription(toggleName: string): string | null {
    const toggles = this.toggles;
    if (!toggles || toggles.length === 0) return null;

    const ERROR_MESSAGE = `Either the toggle "${toggleName}" could not be found, or you lack permission to access it`;

    const CAN_USE_TOGGLE = this.canUseToggle(toggleName);
    if (!CAN_USE_TOGGLE) {
      console.warn(ERROR_MESSAGE);
      return null;
    }

    const filteredToggles = toggles.filter((toggle) => toggle.id === toggleName);
    if (!filteredToggles || filteredToggles.length === 0) {
      console.warn(ERROR_MESSAGE);
      return null;
    }

    // Return description of first match
    return filteredToggles[0].description;
  }
}
