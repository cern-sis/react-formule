// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import "./commands";

/// <reference types="cypress" />

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      getByDataCy(value: string): Chainable<JQuery<HTMLElement>>;
      clearTypeBlur(
        text: string,
        options?: Partial<TypeOptions>,
      ): Chainable<JQuery<HTMLElement>>;
      addField(
        fieldType: string,
        targetAlias?: string,
      ): Chainable<JQuery<HTMLElement>>;
      addFieldWithName(
        fieldType: string,
        name: string,
        targetAlias?: string,
      ): Chainable<JQuery<HTMLElement>>;
      moveField(
        fromAlias: string,
        toAlias: string,
        overAlias?: string,
      ): Chainable<JQuery<HTMLElement>>;
      hasErrorMessage(message: string): Chainable<JQuery<HTMLElement>>;
      hasNoErrorMessage(): Chainable<JQuery<HTMLElement>>;
    }
  }
}
