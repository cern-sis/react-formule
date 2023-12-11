# Formule demo

This is a small application that serves as a playground to test react-formule.

## How to run locally

### The easy way

Run `yarn link-local` in react-formule, then run `yarn link-local-lib` and `yarn install` in formule-demo. To run the playground app, execute `yarn dev` and visit `localhost:3030`. You will see any changes in react-formule immediately in the playground app.

### The advanced way

Another option (if you want to test the actual bundle, or if you want to link react-formule to a more complex application, which can be trickier) would be to remove `resolve.alias` from `vite.config.ts` and to instead use [yalc](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&ved=2ahUKEwiEh4L_nMuCAxWG6gIHHYMAB38QFnoECAsQAQ&url=https%3A%2F%2Fgithub.com%2Fwclr%2Fyalc&usg=AOvVaw0iR17wRcI1T2OQnWaU1BUh&opi=89978449). Run `yarn build` and `yalc publish` in react-formule, then run `yalc add react-formule` in formule-demo. If you make changes in react-formule and want to update formule-demo with those changes, run `yarn build` and `yalc push` in react-formule, and then `yarn dev --force` in formule-demo. Read the yalc docs for more info.

For more confort, you can also run `yarn build:watch` in react-formule, which will rebuild the bundle and push the changes to yalc automatically. For even more automation, you can use [vite-plugin-restart](https://github.com/antfu/vite-plugin-restart) in formule-demo (or in your own project using react-formule and Vite) and watch the bundle file inside of the `.yalc` folder, so that the Vite dev server is automatically reloaded once the new bundle is published.
