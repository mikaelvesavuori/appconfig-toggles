# appconfig-toggles (ACT): a helper for Azure App Configuration toggles

Azure App Configuration is a neat product in the Azure portfolio. What it lacks is a more helpful utility/helper library. ACT tries to cover that case.

The library requires you to provide a configuration object containinga connection string to App Configuration and a list of toggles. On init, `appconfig-toggles` will proceed to getting all the toggles it can find from the list you provided. You should also seriously consider implementing local caching of any data you receive, for better speed and to save on any unnecessary usage of the service itself.

You may also want to refer to my [Demo for Azure App Configuration toggles using the Node/JS library](https://github.com/mikaelvesavuori/azure-appconfig-toggles-node-demo) for a way how to use App Config toggles in a more realistic app (however the example does not use ACT!).

## Example implementation

The below assumes a Node environment and that you have correctly created one or more Azure App Config toggles (feature flag format). The below example assumes you have one called `SomeToggle` and that it is labeled with `Feature`.

```
const ACT = require("appconfig-toggles");
const { AppConfigToggles } = ACT;

const config = {
  connectionString:
    "Endpoint={LONG_URL};Secret={LONG_SECRET}",
  toggles: [
    {
      toggleName: ".appconfig.featureflag/SomeToggle",
      toggleLabel: "Feature",
    }
  ],
};

const userGroup = "SomeGroup";

async function togglesDemo() {
  const act = new AppConfigToggles(config, userGroup);
  await act.init();
  console.log(act.canUseToggle("SomeToggle"));
  console.log(act.getToggleDescription("SomeToggle"));
}

togglesDemo();
```

## Available methods

### `canUseToggle()`

Check if a toggle is active. This check verifies group access, rollout for this group, and whether the toggle exists at all.

Example: `act.canUseToggle("SomeToggle")`, responds with a `boolean`.

### `getToggleDescription()`

Get the description for a named toggle. Only works if you can use/access the toggle, as per above.

You'll want to use this if, for example, you want the toggle to hold any data an application can act on.

Example: `act.getToggleDescription("SomeToggle")`, responds with a `string` if there is any data.

## Install

Install ACT with `npm install appconfig-toggles -S` or `yarn add appconfig-toggles -S`.
