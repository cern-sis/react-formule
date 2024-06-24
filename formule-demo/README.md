# Formule demo

This is a small application that serves as a playground to test react-formule.

## How to run locally

### The easy way

Simply run `yarn install` and `yarn dev` in react-formule and visit `localhost:3030`. You will see any changes in react-formule immediately in the demo app.

**Note:** If you look at `formule-demo/vite.config.local.ts` you will see an alias for `react-formule`. What this does is essentially equivalent to using `yarn link` with `./src/index.ts` as entry point.

### The advanced way

If you want to test the actual bundle or if you want to link react-formule to a more complex application and you find any issues with the above approach, you can **comment out the alias** mentioned above, run `yarn link` in react-formule and then `yarn link react-formule` in formule-demo. This will point to the formule bundle, so you will need to build formule.

To make the dev experience more confortable you can run `yarn build:watch` in react-formule, which will be triggered after any change to the formule code and will rebuild the bundle. For even more automation, you can use [vite-plugin-restart](https://github.com/antfu/vite-plugin-restart) in formule-demo (or in your own project using react-formule and Vite) and watch the bundle file inside `react-formule/dist/react-formule.js`, so that the Vite dev server is automatically reloaded once the new bundle is built (otherwise you would have to run `vite dev --force` yourself every time).
