export const expandAll = () => {
    cy.get(".schemaTree").then($treeElements => {
      if ($treeElements.find(".anticon-down").length) {
        cy.wrap($treeElements).find(".anticon-down").then($expandableElements => {
          cy.wrap($expandableElements).click({multiple: true})
          expandAll()
        })
      }
    });
  }