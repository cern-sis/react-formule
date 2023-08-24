# Moses demo

This is a small application that serves as a playground to test cap-moses.

## How to run locally

Run `yarn link-local` in cap-moses, then run `yarn link-local-libraries` in moses-demo. This will link both the react and react-dom dependencies to avoid duplicates and will also add cap-moses as a linked local dependency, meaning that on new builds of the library you won't have to reinstall the dependency manually in moses-demo, yarn will update it automatically, without you even having to restart the application. To run the playground app, execute `yarn dev`.
