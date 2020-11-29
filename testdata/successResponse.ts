export const successResponse = {
  config: {
    connectionString: 'Endpoint={ENDPOINT};Secret={SECRET}=',
    toggles: [
      { label: 'Feature', name: '.appconfig.featureflag/HappyResponse' },
      { label: 'Feature', name: '.appconfig.featureflag/EmojiResponse' }
    ]
  },
  fallbackUserGroup: 'Public',
  toggles: [
    {
      description: 'Response with happier tone',
      enabled: true,
      id: 'HappyResponse',
      isRolledOutForCurrentUser: true,
      rolloutPercentage: 100
    },
    {
      description: 'Send emoji response',
      enabled: true,
      id: 'EmojiResponse',
      isRolledOutForCurrentUser: true,
      rolloutPercentage: 100
    }
  ],
  userGroup: 'Developers'
};
