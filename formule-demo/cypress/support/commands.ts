/// <reference types="cypress" />

import { expandAll } from "./utils";

Cypress.Commands.add("getByDataCy", (value) => {
  cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add(
  "clearTypeBlur",
  { prevSubject: true },
  (subject, text, options) => {
    cy.wrap(subject).as("subject").clear(options);
    cy.get("@subject").type(text, options);
    cy.get("@subject").blur();
  },
);

Cypress.Commands.add("addField", (fieldType, targetAlias) => {
  cy.getByDataCy(`field-${fieldType}`).as("field").trigger("dragstart");
  cy.get("@field").trigger("dragleave");

  cy.get(targetAlias || '[data-cy="dropArea"]')
    .as("target")
    .trigger("dragenter");
  cy.get("@target").trigger("dragover");
  cy.get("@target").trigger("drop");
  cy.get("@target").trigger("dragend");

  expandAll();
});

// Warning: can cause issues with collections
// Tip: By default it moves a field to be ON TOP OF another field. You can pass the drop area as second param
//  AND the alias of the last element as third param if you want to move a field to the bottom (this happens
//  because the drop area itself is not inside of the same dnd div, so we need to hover over the last element first)
Cypress.Commands.add("moveField", (fromAlias, toAlias, overAlias) => {
  cy.get(fromAlias).trigger("dragstart");
  cy.get(fromAlias).trigger("dragleave");

  cy.get(toAlias).trigger("dragenter");
  if (overAlias) {
    cy.get(overAlias).trigger("dragover");
  }
  cy.get(toAlias).trigger("dragover");
  cy.get(toAlias).trigger("drop");
  cy.get(toAlias).trigger("dragend");
});

// Warning: the renaming only works when it's the only or last element of the tree
Cypress.Commands.add("addFieldWithName", (fieldType, name, targetAlias) => {
  cy.addField(fieldType, targetAlias);
  cy.getByDataCy("treeItem").last().click();
  cy.getByDataCy("editFieldId").find("button").click();
  cy.getByDataCy("editFieldId").find("textarea").clearTypeBlur(name);
  cy.getByDataCy("fieldSettings").find(".anticon-arrow-left").click();
});

Cypress.Commands.add(
  "hasErrorMessage",
  { prevSubject: true },
  (subject, message) => {
    cy.wrap(subject)
      .find(".ant-form-item-explain-error")
      .should("have.text", message);
  },
);

Cypress.Commands.add("hasNoErrorMessage", { prevSubject: true }, (subject) => {
  cy.wrap(subject).find(".ant-form-item-explain-error").should("not.exist");
});
