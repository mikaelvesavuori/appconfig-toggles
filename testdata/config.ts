export const config = {
  connectionString: 'Endpoint={ENDPOINT};Secret={SECRET}=',
  toggles: [
    {
      name: '.appconfig.featureflag/HappyResponse',
      label: 'Feature'
    },
    {
      name: '.appconfig.featureflag/EmojiResponse',
      label: 'Feature'
    }
  ]
};

export const invalidConfig = {
  connectionString: 'Endpoint={ENDPOINT};Secret={SECRET}=',
  toggles: [
    {
      name: '.appconfig.featureflag/asdf',
      label: 'Feature'
    }
  ]
};
