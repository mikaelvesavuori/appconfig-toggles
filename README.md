# appconfig-toggles (ACT): a helper for Azure App Configuration toggles

Azure App Configuration is a neat product in the Azure portfolio. What is lacks is a more helpful utility/helper library. ACT tries to cover that case.

You may also want to refer to my [Demo for Azure App Configuration toggles using the Node/JS library](https://github.com/mikaelvesavuori/azure-appconfig-toggles-node-demo) for a way how to use App Config toggles in a more realistic app (however the example does not use ACT!).

## Example implementation

The below assumes a Node environment, and that you have correctly created an Azure App Config toggle (feature flag format). The below example assumes it's called `SomeToggle` and is labeled `Feature`.

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

Example: `act.canUseToggle("SomeToggle")`

### `getToggleDescription()`

Get the description for a named toggled. Good if you, for example, would want that to contain data an application can act on.

Example: `act.getToggleDescription("SomeToggle")`

## Install

Install ACT with `npm install appconfig-toggles -S` or `yarn add appconfig-toggles -S`.
