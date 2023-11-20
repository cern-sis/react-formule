# Moses demo

This is a small application that serves as a playground to test cap-moses.

## How to run locally

### The easy way

Run `yarn link-local` in cap-moses, then run `yarn link-local-lib` and `yarn install` in moses-demo. To run the playground app, execute `yarn dev`. You will see any changes in cap-moses immediately in the playground app.

### The advanced way

Another option (if you want to test the actual bundle, or if you want to link cap-moses to a more complex application, which can be trickier) would be to remove `resolve.alias` from `vite.config.ts` and to instead use [yalc](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&ved=2ahUKEwiEh4L_nMuCAxWG6gIHHYMAB38QFnoECAsQAQ&url=https%3A%2F%2Fgithub.com%2Fwclr%2Fyalc&usg=AOvVaw0iR17wRcI1T2OQnWaU1BUh&opi=89978449). Run `yarn build` and `yalc publish` in cap-moses, then run `yalc add cap-moses` in moses-demo. If you make changes in cap-moses and want to update moses-demo with those changes, run `yarn build` and `yalc push` in cap-moses, and then `yarn dev --force` in moses-demo. Read the yalc docs for more info.

For more confort, you can also run `yarn build:watch` in cap-moses, which will rebuild the bundle and push the changes to yalc automatically. For even more automation, you can use [vite-plugin-restart](https://github.com/antfu/vite-plugin-restart) in moses-demo (or in your own project using cap-moses and Vite) and watch the bundle file inside of the `.yalc` folder, so that the Vite dev server is automatically reloaded once the new bundle is published.
