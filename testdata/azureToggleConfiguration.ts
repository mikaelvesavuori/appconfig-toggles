export const azureToggleConfiguration = {
  id: 'EmojiResponse',
  description: 'Send emoji response',
  enabled: true,
  conditions: {
    client_filters: [
      {
        Parameters: {
          Audience: {
            Users: ['User 1', 'User 2'],
            Groups: [
              {
                Name: 'Group 1',
                RolloutPercentage: 50
              }
            ],
            DefaultRolloutPercentage: 0
          }
        }
      }
    ]
  }
};
