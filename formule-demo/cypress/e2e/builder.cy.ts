/// <reference types="cypress" />

const SEP = "\\:\\:";

describe("test basic functionality", () => {
  beforeEach(() => {
    cy.visit("localhost:3030");
  });

  it("allows drag and drop to the SchemaTree", () => {
    cy.addField("text");

    cy.getByDataCy("treeItem").should("have.length", 1);
    cy.getByDataCy("treeItem")
      .find(".anticon-font-size")
      .should("have.length", 1);
  });

  it("allows deleting a field from the tree", () => {
    cy.addField("text");

    cy.getByDataCy("treeItem").should("have.length", 1);
    cy.getByDataCy("treeItem").click();
    cy.getByDataCy("deleteField").click();
    cy.get("div.ant-popconfirm").find("button").contains("Delete").click();
    cy.getByDataCy("treeItem").should("have.length", 0);
  });

  it("allows drag and drop inside objects", () => {
    cy.addFieldWithName("object", "myobject");
    cy.addField("text");

    cy.getByDataCy("treeItem")
      .contains("myobject")
      .as("objectField")
      .should("have.length", 1);

    cy.addField("text", "@objectField");

    // Total number of elements in the schema tree
    cy.getByDataCy("treeItem").should("have.length", 3);
    // Number of text elements inside the object element. first() is needed since otherwise we would also get the hoverBox of the root field.
    cy.get("@objectField")
      .parents("[data-cy=hoverBox]")
      .first()
      .find(".anticon-font-size")
      .should("have.length", 1);
    // Total number of text elements
    cy.getByDataCy("treeItem")
      .find(".anticon-font-size")
      .should("have.length", 2);
  });

  it("allows moving elements up and down inside the SchemaTree", () => {
    cy.addFieldWithName("text", "mytext").as("textField");
    cy.getByDataCy("treeItem").contains("mytext").as("textField");
    cy.addFieldWithName("textarea", "mytextarea").as("textAreaField");
    cy.getByDataCy("treeItem").contains("mytextarea").as("textAreaField");
    cy.addFieldWithName("number", "mynumber").as("numberField");
    cy.getByDataCy("treeItem").contains("mynumber").as("numberField");

    cy.getByDataCy("treeItem").eq(0).contains("mytext");
    cy.getByDataCy("treeItem").eq(1).contains("mytextarea");
    cy.getByDataCy("treeItem").eq(2).contains("mynumber");

    cy.moveField("@numberField", "@textAreaField");

    cy.getByDataCy("treeItem").eq(0).contains("mytext");
    cy.getByDataCy("treeItem").eq(1).contains("mynumber");
    cy.getByDataCy("treeItem").eq(2).contains("mytextarea");

    cy.moveField("@textField", "@textAreaField", '[data-cy="dropArea"]');

    cy.getByDataCy("treeItem").eq(0).contains("mynumber");
    cy.getByDataCy("treeItem").eq(1).contains("mytextarea");
    cy.getByDataCy("treeItem").eq(2).contains("mytext");
  });

  it("changes root field settings", () => {
    cy.addField("text");

    cy.getByDataCy("rootSettings").click();
    cy.getByDataCy("fieldSettings").should("exist");

    // Testing root schema settings
    cy.get(`input#root${SEP}title`).clearTypeBlur("Test root title");
    cy.getByDataCy("rootTitle").should("contain.text", "Test root title");
    cy.get(`input#root${SEP}description`).clearTypeBlur(
      "Test root description",
    );
    cy.getByDataCy("rootDescription").should(
      "contain.text",
      "Test root description",
    );

    // Testing root uiSchema settings
    cy.getByDataCy("fieldSettings")
      .find(".scrollableTabs .ant-tabs-nav-list")
      .find("[data-node-key=2]")
      .click();

    cy.getByDataCy("formPreview")
      .find(".ant-row-end .ant-col-xs-8")
      .should("not.exist");

    cy.getByDataCy("fieldSettings").find("span").contains("xsmall").click();
    cy.getByDataCy("fieldSettings").find("span").contains("end").click();

    // TODO: Ideally this should be tested with snapshot/visual testing
    cy.getByDataCy("formPreview")
      .find(".ant-row-end .ant-col-xs-8")
      .should("exist");
  });

  it("tests common field settings", () => {
    cy.addField("text");

    cy.getByDataCy("treeItem").click();
    cy.getByDataCy("fieldSettings").should("exist");

    // Edit field id
    cy.getByDataCy("editFieldId").find("button").click();
    cy.getByDataCy("editFieldId").find("textarea").clearTypeBlur("myfield");
    cy.get(`div#root${SEP}myfield-title`)
      .find("span")
      .should("have.text", "myfield");

    // Edit field title
    cy.get(`input#root${SEP}title`).clearTypeBlur("Test title");
    cy.get(`div#root${SEP}myfield-title`)
      .find("span")
      .should("have.text", "Test title");

    // Edit field description
    cy.get(`input#root${SEP}description`).clearTypeBlur("Test description");
    cy.get(`span#root${SEP}myfield-description`).should(
      "have.text",
      "Test description",
    );

    // Edit readOnly
    cy.getByDataCy("formPreview")
      .find(`input#root${SEP}myfield`)
      .clearTypeBlur("sample text");

    cy.get(`button#root${SEP}readOnly`).click();
    cy.getByDataCy("formPreview")
      .find(`input#root${SEP}myfield`)
      .should("be.disabled");

    // Edit uiSchema > field width
    cy.getByDataCy("fieldSettings")
      .find(".scrollableTabs .ant-tabs-nav-list")
      .find("[data-node-key=2]")
      .click();
    cy.getByDataCy("spanColWrapper").should("have.class", "ant-col-24");
    cy.get(".ant-slider-mark").contains("50%").click();
    cy.getByDataCy("spanColWrapper").should("have.class", "ant-col-12");
  });

  it("tests text field", () => {
    cy.addFieldWithName("text", "myfield");
    cy.getByDataCy("treeItem").click();

    // Test pattern allowing only one character
    cy.get(`input#root${SEP}pattern`).clearTypeBlur("^.$");
    cy.getByDataCy("formPreview")
      .find(`input#root${SEP}myfield`)
      .as("myfield")
      .clearTypeBlur("a");
    cy.getByDataCy("formPreview").hasNoErrorMessage();
    cy.get("@myfield").clearTypeBlur("asd");
    cy.getByDataCy("formPreview").hasErrorMessage('must match pattern "^.$"');
    cy.get(`input#root${SEP}pattern`).clear();

    // Test uiSchema > convertToUppercase
    cy.getByDataCy("fieldSettings")
      .find(".scrollableTabs .ant-tabs-nav-list")
      .find("[data-node-key=2]")
      .click();
    cy.get(`button#root${SEP}ui\\:options${SEP}convertToUppercase`).click(); // Need to double escape the colon
    cy.get("@myfield").clearTypeBlur("asdf");
    cy.get("@myfield").should("have.value", "ASDF");
    cy.get(`button#root${SEP}ui\\:options${SEP}convertToUppercase`).click();
    cy.get("@myfield").clear();

    // Test uiSchema > mask
    cy.get(`input#root${SEP}ui\\:options${SEP}mask`).clearTypeBlur("BA-00/a");
    cy.get("@myfield").focus();
    cy.get("@myfield").should("have.value", "B_-__/_");
    cy.get("@myfield").type("NWW5j34r");
    cy.get("@myfield").should("have.value", "BN-53/r");

    // TODO test also suggestion endpoint, after that feature is migrated to formule
  });

  it("tests email field", () => {
    cy.addFieldWithName("email", "myfield");
    cy.getByDataCy("treeItem").click();

    // Test pattern allowing only one character
    cy.getByDataCy("formPreview")
      .find(`input#root${SEP}myfield`)
      .as("myfield")
      .clearTypeBlur("a");
    cy.getByDataCy("formPreview").hasErrorMessage('must match format "email"');
    cy.get("@myfield").clearTypeBlur("test@example.com");
    cy.getByDataCy("formPreview").hasNoErrorMessage();
  });

  it("tests number field", () => {
    cy.addFieldWithName("number", "myfield");
    cy.getByDataCy("treeItem").click();

    // Test number type
    cy.getByDataCy("formPreview")
      .find(`input#root${SEP}myfield`)
      .as("myfield")
      .clearTypeBlur("123.45");
    cy.getByDataCy("formPreview")
      .find(".ant-form-item-explain-error")
      .should("not.exist");
    // select type integer
    cy.get(`input#root${SEP}type`).type("{downArrow}{enter}", { force: true });
    cy.get(`input#root${SEP}type`)
      .parent()
      .parent()
      .find("[title=Integer]")
      .should("exist");
    cy.getByDataCy("formPreview")
      .find(`input#root${SEP}myfield`)
      .as("myfield")
      .clearTypeBlur("123.45");
    cy.getByDataCy("formPreview").hasErrorMessage("must be integer");
  });

  it("tests checkbox field", () => {
    cy.addField("checkbox");
    cy.getByDataCy("treeItem").click();

    // Test checkbox type: one option
    cy.get(`input#root${SEP}title`).clearTypeBlur("Only option");
    cy.getByDataCy("formPreview")
      .find(".ant-checkbox-wrapper span")
      .contains("Only option")
      .should("exist");

    // Test checkbox type: multiple options
    cy.get(`input#root${SEP}type`).type("{downArrow}{enter}", { force: true });
    cy.get(`input#root${SEP}type`)
      .parent()
      .parent()
      .find('[title="Multiple Options"]')
      .should("exist");
    // rename options
    cy.get(`input#root${SEP}items${SEP}enum${SEP}0`).clearTypeBlur(
      "First option",
    );
    cy.get(`input#root${SEP}items${SEP}enum${SEP}1`).clearTypeBlur(
      "Second option",
    );
    // add extra option
    cy.get(`fieldset#root${SEP}items`).getByDataCy("addItemButton").click();
    cy.get(`input#root${SEP}items${SEP}enum${SEP}2`).clearTypeBlur(
      "Third option",
    );
    cy.getByDataCy("formPreview")
      .find(".ant-checkbox-wrapper span")
      .contains("First option")
      .should("exist");
    cy.getByDataCy("formPreview")
      .find(".ant-checkbox-wrapper span")
      .contains("Second option")
      .as("option2")
      .should("exist");
    cy.get(`input[id^=root${SEP}items${SEP}enum${SEP}`).should(
      "have.length",
      3,
    );
    // check option
    cy.getByDataCy("formPreview")
      .find(".ant-checkbox-wrapper span")
      .contains("Third option")
      .as("checkbox3")
      .parent()
      .should("not.have.class", "ant-checkbox-wrapper-checked");
    cy.get("@checkbox3").click();
    cy.get("@checkbox3")
      .parent()
      .should("have.class", "ant-checkbox-wrapper-checked");
    //remove option (eq(1) gets the second element)
    cy.get(`#root${SEP}items .arrayFieldRow`)
      .eq(1)
      .find(".anticon-delete")
      .click();
    cy.get(`input[id^=root${SEP}items${SEP}enum${SEP}`).should(
      "have.length",
      2,
    );
    cy.get("@option2").should("not.exist");

    // TODO: returned value when checked and unchecked should be tested in a unit/component test with access to formData
    // -> Now that we display formData in demo, we could access it directly and test this without needing another test type
  });

  it.skip("tests switch field", () => {
    // TODO: again, returned value type AND return undefined instead of false (in uiOptions) should be tested in a unit/component test with access to formData
    // -> Now that we display formData in demo, we could access it directly and test this without needing another test type
  });

  it.skip("tests radio field", () => {
    // We could test adding and removing options here, but it seems repetitive, as it is already done in general for the array field
  });

  it("tests select field", () => {
    cy.addFieldWithName("select", "myfield");
    cy.getByDataCy("treeItem").click();

    // Test select type: one value (text)
    cy.get(`input#root${SEP}type`)
      .parent()
      .parent()
      .find('[title="Select one value (text)"]')
      .should("exist");
    cy.get(`fieldset#root${SEP}enum`).getByDataCy("addItemButton").click();
    cy.get(`input#root${SEP}enum${SEP}0`).clearTypeBlur("First option");
    cy.get(`fieldset#root${SEP}enum`)
      .getByDataCy("addItemButton")
      .click({ force: true });
    cy.get(`input#root${SEP}enum${SEP}1`).clearTypeBlur("Second option");
    cy.get(`#root${SEP}enum .arrayFieldRow`)
      .eq(0)
      .find(".anticon-delete")
      .click();
    cy.getByDataCy("formPreview")
      .get(`input#root${SEP}myfield`)
      .as("dropdown")
      .type("{downArrow}");
    cy.get("@dropdown").type("{enter}");
    cy.get("@dropdown")
      .get(".ant-select-item-option-content")
      .contains("Second option")
      .should("exist");

    // Test select type: one value (number)
    cy.get(`input#root${SEP}type`).type("{downArrow}{enter}", { force: true });
    cy.get(`input#root${SEP}type`)
      .parent()
      .parent()
      .find('[title="Select one value (number)"]')
      .should("exist");
    cy.get(`fieldset#root${SEP}enum`)
      .getByDataCy("addItemButton")
      .click({ force: true });
    cy.get(`input#root${SEP}enum${SEP}0`).clearTypeBlur("asd");
    cy.get(`input#root${SEP}enum${SEP}0`).should("have.value", "");
    cy.get(`input#root${SEP}enum${SEP}0`).clearTypeBlur("1");
    cy.get(`input#root${SEP}enum${SEP}0`).should("have.value", "1");
    cy.get(`input#root${SEP}enum${SEP}1`).clearTypeBlur("2");
    cy.get(`#root${SEP}enum .arrayFieldRow`)
      .eq(0)
      .find(".anticon-delete")
      .click();
    cy.get("@dropdown").type("{downArrow}");
    cy.get("@dropdown").type("{enter}");
    cy.getByDataCy("formPreview")
      .get(".ant-select-item-option-content")
      .contains("2")
      .should("exist");

    // Test select type: multiple values
    cy.get(`input#root${SEP}type`).type("{downArrow}{enter}", { force: true });
    cy.get(`input#root${SEP}type`)
      .parent()
      .parent()
      .find('[title="Select multiple values"]')
      .should("exist");
    cy.get(`fieldset#root${SEP}items${SEP}enum`)
      .getByDataCy("addItemButton")
      .click();
    cy.get(`input#root${SEP}items${SEP}enum${SEP}0`).clearTypeBlur(
      "First option",
    );
    cy.get(`fieldset#root${SEP}items${SEP}enum`)
      .getByDataCy("addItemButton")
      .click();
    cy.get(`input#root${SEP}items${SEP}enum${SEP}1`).clearTypeBlur(
      "Second option",
    );
    cy.get(`fieldset#root${SEP}items${SEP}enum`)
      .getByDataCy("addItemButton")
      .click();
    cy.get(`input#root${SEP}items${SEP}enum${SEP}2`).clearTypeBlur(
      "Third option",
    );
    cy.get(`#root${SEP}items${SEP}enum .arrayFieldRow`)
      .eq(1)
      .find(".anticon-delete")
      .click();
    cy.getByDataCy("formPreview")
      .get(`input#root${SEP}myfield`)
      .type("{downArrow}{enter}", { force: true });
    cy.getByDataCy("formPreview")
      .get(`input#root${SEP}myfield`)
      .type("{downArrow}{enter}", { force: true });
    cy.getByDataCy("formPreview")
      .get(".ant-select-item-option-content")
      .contains("First option")
      .should("exist");
    cy.getByDataCy("formPreview")
      .get(".ant-select-item-option-content")
      .contains("Third option")
      .should("exist");
  });

  it("tests date field", () => {
    cy.addFieldWithName("date", "myfield");
    cy.getByDataCy("treeItem").click();

    // Test date type (format)
    cy.get(`input#root${SEP}myfield`).clearTypeBlur("11/10/2023", {
      force: true,
    });
    cy.get(`input#root${SEP}myfield`).should("have.value", "11/10/2023");
    cy.get(`input#root${SEP}myfield`).clearTypeBlur("11/10/2023 17:29:16", {
      force: true,
    });
    cy.get(`input#root${SEP}myfield`).should("have.value", "11/10/2023");
    cy.get(`input#root${SEP}format`).type("{downArrow}{enter}", {
      force: true,
    });
    cy.get(`input#root${SEP}myfield`).clearTypeBlur("11/10/2023 17:29:16", {
      force: true,
    });
    cy.get(`input#root${SEP}myfield`).should(
      "have.value",
      "11/10/2023 17:29:16",
    );

    // Test format (customFormat)
    cy.get(`input#root${SEP}customFormat`).type("hh:mm DD-MM-YYYY");
    cy.get(`input#root${SEP}myfield`).clearTypeBlur("11/10/2023 17:29:16", {
      force: true,
    });
    cy.get(`input#root${SEP}myfield`)
      .invoke("val")
      .should("match", /\d{2}:\d{2} 11-10-2023$/);
    cy.get(`input#root${SEP}myfield`).clearTypeBlur("17:29 11-10-2023", {
      force: true,
    });
    cy.get(`input#root${SEP}myfield`).should("have.value", "17:29 11-10-2023");

    // Test minDate
    cy.get(`input#root${SEP}customFormat`).clear();
    cy.get(`input#root${SEP}format`).type("{downArrow}{enter}", {
      force: true,
    });
    cy.get(`input#root${SEP}minDate`).type("10/05/2023", { force: true });
    cy.get(`input#root${SEP}myfield`).clearTypeBlur("9/05/2023", {
      force: true,
    });
    // cy.get(`input#root${SEP}myfield`).should("have.value", "");
    cy.getByDataCy("formPreview").hasErrorMessage('must match format "date"');
    cy.get(`input#root${SEP}myfield`).clearTypeBlur("10/05/2023", {
      force: true,
    });
    cy.get(`input#root${SEP}myfield`).should("have.value", "10/05/2023");

    // Test maxDate
    cy.get(`input#root${SEP}maxDate`).type("21/12/2023", { force: true });
    cy.get(`input#root${SEP}myfield`).clearTypeBlur("22/12/2023", {
      force: true,
    });
    cy.get(`input#root${SEP}myfield`).should("have.value", "10/05/2023");
    cy.get(`input#root${SEP}myfield`).clearTypeBlur("21/12/2023", {
      force: true,
    });
    cy.get(`input#root${SEP}myfield`).should("have.value", "21/12/2023");
  });

  it("tests uri field", () => {
    cy.get("span").contains("Advanced fields").click();
    cy.addFieldWithName("uri", "myfield");

    cy.getByDataCy("formPreview")
      .find("input[type=url]")
      .as("urlInput")
      .clearTypeBlur("notaurl");
    cy.get("@urlInput").clearTypeBlur("notaurl");
    cy.getByDataCy("formPreview").hasErrorMessage('must match format "uri"');
    cy.getByDataCy("formPreview")
      .find(".anticon-link")
      .parent()
      .parent()
      .as("linkButton")
      .should("have.class", "ant-btn-disabled");

    cy.get("@urlInput").clearTypeBlur("https://google.com");
    cy.getByDataCy("formPreview").hasNoErrorMessage();
    cy.getByDataCy("formPreview")
      .find(".anticon-link")
      .parent()
      .parent()
      .should("not.have.class", "ant-btn-disabled");
  });

  it("tests rich editor field", () => {
    cy.get("span").contains("Advanced fields").click();
    cy.addField("richeditor");

    cy.getByDataCy("formPreview")
      .get(".rc-md-editor")
      .as("editor")
      .find("textarea")
      .type("Some text");
    cy.get("@editor").find(".button-type-undo").click();
    cy.get("@editor").find("textarea").should("have.text", "");
    cy.get("@editor").find(".button-type-bold").click();
    cy.get("@editor").find("textarea").type("Bold text");
    cy.get("@editor").find("textarea").should("have.text", "**Bold text**");
  });

  it("tests tags field", () => {
    cy.get("span").contains("Advanced fields").click();
    cy.addFieldWithName("tags", "myfield");

    cy.getByDataCy("formPreview").find("span").contains("New Tag").click();
    cy.getByDataCy("formPreview")
      .find("input#tags_newTag")
      .type("tag 1{enter}");
    cy.getByDataCy("formPreview").find("span").contains("New Tag").click();
    cy.getByDataCy("formPreview")
      .find("input#tags_newTag")
      .type("tag 2{enter}");
    cy.getByDataCy("formPreview")
      .find(".ant-tag")
      .contains("tag 1")
      .as("tag1")
      .should("exist");
    cy.getByDataCy("formPreview")
      .find(".ant-tag")
      .contains("tag 2")
      .as("tag2")
      .should("exist");

    cy.get("@tag1").parent().find("span.anticon-close").click();
    cy.get("@tag1").should("not.exist");
    cy.get("@tag2").should("exist");
  });

  it("tests object field", () => {
    cy.addFieldWithName("object", "myobject");

    // TODO: see how to test the hidden

    cy.getByDataCy("treeItem").contains("myobject").as("objectField");
    cy.addFieldWithName("text", "myfield", "@objectField");

    cy.getByDataCy("formPreview")
      .find(`fieldset#root${SEP}myobject`)
      .find(`input#root${SEP}myobject${SEP}myfield`)
      .should("exist");
  });

  it("tests array field", () => {
    cy.addFieldWithName("array", "myarray");
    cy.getByDataCy("treeItem").contains("myarray").as("arrayField");
    cy.addField("text", "@arrayField");

    // Test basic add, move, delete functionality
    cy.getByDataCy("formPreview")
      .find(`fieldset#root${SEP}myarray`)
      .getByDataCy("addItemButton")
      .as("addItem")
      .click();
    cy.get("@addItem").click();
    cy.getByDataCy("formPreview")
      .find(`input#root${SEP}myarray${SEP}0`)
      .as("item0")
      .clearTypeBlur("First item");
    cy.getByDataCy("formPreview")
      .find(`input#root${SEP}myarray${SEP}1`)
      .as("item1")
      .clearTypeBlur("Second item");
    cy.getByDataCy("arrayUtils").first().find(".anticon-arrow-down").click();
    cy.get("@item0").should("have.value", "Second item");
    cy.get("@item1").should("have.value", "First item");
    cy.getByDataCy("arrayUtils").first().find(".anticon-delete").click();
    cy.getByDataCy("formPreview")
      .find(`input#root${SEP}myarray${SEP}0`)
      .should("have.value", "First item");
    cy.getByDataCy("formPreview")
      .find(`input#root${SEP}myarray${SEP}1`)
      .should("not.exist");

    // Test multiple fields inside
    // check that with one item the array contains the item as direct child
    cy.getByDataCy("treeItem")
      .contains("items")
      .parents("[data-cy=treeItem]")
      .find(".anticon-font-size");
    // check that with two items the array now contains an object containing the items
    cy.addField("text", "@arrayField");
    cy.getByDataCy("treeItem")
      .contains("items")
      .parents("[data-cy=treeItem]")
      .contains("{ }");
    cy.getByDataCy("treeItem")
      .find(".anticon-font-size")
      .should("have.length", 2);
    // remove one item and check that the object is removed and the remaining item is a direct child of the array
    cy.getByDataCy("treeItem").find(".anticon-font-size").first().click();
    cy.getByDataCy("deleteField").click();
    cy.get("div.ant-popconfirm").find("button").contains("Delete").click();
    cy.getByDataCy("treeItem")
      .contains("items")
      .parents("[data-cy=treeItem]")
      .find(".anticon-font-size")
      .should("have.length", 1);
    cy.getByDataCy("treeItem")
      .contains("items")
      .parents("[data-cy=treeItem]")
      .contains("{ }")
      .should("not.exist");
  });

  it("tests accordion field", () => {
    cy.addFieldWithName("accordion", "myaccordion");
    cy.getByDataCy("treeItem").contains("myaccordion").as("accordionField");
    cy.addField("text", "@accordionField");

    cy.getByDataCy("formPreview")
      .find(`fieldset#root${SEP}myaccordion`)
      .getByDataCy("addItemButton")
      .as("addItem")
      .click();
    cy.get("@addItem").click();
    cy.getByDataCy("formPreview")
      .find(".ant-collapse-item")
      .as("accordionItems")
      .first()
      .click();
    cy.getByDataCy("formPreview")
      .find(`input#root${SEP}myaccordion${SEP}0`)
      .clearTypeBlur("First item");
    cy.getByDataCy("formPreview")
      .find(`.ant-collapse-content`)
      .should("have.length", 1);
    cy.get("@accordionItems").last().click();
    cy.getByDataCy("formPreview")
      .find(`input#root${SEP}myaccordion${SEP}1`)
      .clearTypeBlur("Second item");
    cy.getByDataCy("formPreview")
      .find(`.ant-collapse-content`)
      .should("have.length", 2);
  });

  it("tests layer field", () => {
    cy.addFieldWithName("layer", "mylayer");
    cy.getByDataCy("treeItem").contains("mylayer").as("layerField");
    cy.addField("text", "@layerField");

    cy.getByDataCy("formPreview")
      .find(`fieldset#root${SEP}mylayer`)
      .getByDataCy("addItemButton")
      .as("addItem")
      .click();
    cy.get("@addItem").click();

    cy.getByDataCy("formPreview")
      .find("li.ant-list-item")
      .as("layerItem")
      .first()
      .click();
    cy.getByDataCy("layerModal")
      .find(`input#root${SEP}mylayer${SEP}0`)
      .as("input0")
      .clearTypeBlur("First item");
    cy.getByDataCy("layerModal").find("button").contains("OK").click();

    cy.get("@layerItem").last().click();
    cy.getByDataCy("layerModal")
      .find(`input#root${SEP}mylayer${SEP}1`)
      .as("input1")
      .should("exist");
    cy.getByDataCy("layerModal").find("button").contains("Cancel").click();

    cy.get("@layerItem").first().click();
    cy.get("@input0").should("have.value", "First item");
    cy.getByDataCy("layerModal").find("button").contains("Cancel").click();

    cy.get("@layerItem").last().click();
    cy.get("@input1").should("have.value", "");
    cy.getByDataCy("layerModal").find("button").contains("Cancel").click();
  });

  it("tests tab field", () => {
    cy.addFieldWithName("tabView", "mytab");
    cy.getByDataCy("treeItem").contains("mytab").as("tabField");
    cy.addFieldWithName("text", "myfield1", "@tabField");
    cy.addFieldWithName("checkbox", "myfield2", "@tabField");

    cy.getByDataCy("formPreview")
      .find(".ant-menu-item")
      .contains("myfield1")
      .click();
    cy.getByDataCy("formPreview")
      .find(`input#root${SEP}mytab${SEP}myfield1`)
      .should("exist");
    // Verify that the content refreshes properly
    cy.getByDataCy("formPreview")
      .find(".ant-menu-item")
      .contains("myfield2")
      .click();
    cy.getByDataCy("formPreview")
      .find(`input#root${SEP}mytab${SEP}myfield2`)
      .as("checkboxWidget")
      .should("exist");
    cy.get("@checkboxWidget").should("not.be.checked");
    cy.get("@checkboxWidget").click();
    cy.get("@checkboxWidget").should("be.checked");
  });

  it("tests steps field", () => {
    cy.addFieldWithName("stepsView", "mysteps");
    cy.getByDataCy("treeItem").contains("mysteps").as("stepsField");
    cy.addFieldWithName("text", "myfield1", "@stepsField");
    cy.addFieldWithName("text", "myfield2", "@stepsField");

    // Direct navigation
    cy.getByDataCy("formPreview")
      .find(`input#root${SEP}mysteps${SEP}myfield1`)
      .should("exist");
    cy.getByDataCy("formPreview")
      .find(".ant-steps-item")
      .contains("myfield2")
      .click();
    cy.getByDataCy("formPreview")
      .find(`input#root${SEP}mysteps${SEP}myfield2`)
      .should("exist");
    // Navigation with previous and next buttons
    cy.getByDataCy("formPreview").find("button").contains("Previous").click();
    cy.getByDataCy("formPreview")
      .find(`input#root${SEP}mysteps${SEP}myfield1`)
      .should("exist");
    cy.getByDataCy("formPreview").find("button").contains("Next").click();
    cy.getByDataCy("formPreview")
      .find(`input#root${SEP}mysteps${SEP}myfield2`)
      .should("exist");
  });

  it("tests code editor field", () => {
    const shouldHaveValidationErrors = (point: boolean, range: boolean) => {
      if (!point && !range) {
        // Needed to make sure the schema validation has enough time to run
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000);
      }
      cy.getByDataCy("formPreview")
        .get(".cm-content")
        .get("span.cm-lintPoint-error")
        .should(point ? "exist" : "not.exist");
      cy.getByDataCy("formPreview")
        .get(".cm-content")
        .get("span.cm-lintRange-error")
        .should(range ? "exist" : "not.exist");
    };

    const json1 = {
      test_field: 123,
    };

    const json2 = {
      test_field: "asd",
    };

    const validationSchema = {
      $schema: "http://json-schema.org/draft-04/schema#",
      properties: {
        test_field: {
          type: "string",
        },
      },
      title: "Test validation schema",
      type: "object",
    };

    cy.get("span").contains("Advanced fields").click();
    cy.addFieldWithName("codeEditor", "myfield");
    cy.getByDataCy("treeItem").click();

    // No validation
    cy.getByDataCy("formPreview")
      .find(".cm-content")
      .invoke("html", JSON.stringify(json1));
    shouldHaveValidationErrors(false, false);
    cy.getByDataCy("codeEditorFieldError").should("have.text", "");

    cy.getByDataCy("fieldSettings")
      .find(".scrollableTabs .ant-tabs-nav-list")
      .find("[data-node-key=2]")
      .click();

    // TODO: Test URL validation

    // JSON validation, wrong validation schema
    cy.get(`input#root${SEP}ui\\:options${SEP}validateWith`).type(
      "{downArrow}{downArrow}{enter}",
      {
        force: true,
      },
    );
    cy.get(`button#root${SEP}ui\\:options${SEP}validateWithJson`).click();
    cy.getByDataCy("fieldModal")
      .find(".cm-content")
      .invoke("html", "this is an invalid schema");
    cy.getByDataCy("fieldModal").find(".ant-modal-close").click();

    cy.getByDataCy("formPreview")
      .find(".cm-content")
      .invoke("html", JSON.stringify(json1));

    cy.getByDataCy("codeEditorFieldError").should(
      "have.text",
      "Error parsing validation JSON",
    );

    // JSON validation, good validation schema
    cy.get(`button#root${SEP}ui\\:options${SEP}validateWithJson`).click();
    cy.getByDataCy("fieldModal")
      .find(".cm-content")
      .invoke("html", JSON.stringify(validationSchema));
    cy.getByDataCy("fieldModal").find(".ant-modal-close").click();

    cy.getByDataCy("formPreview")
      .find(".cm-content")
      .invoke("html", JSON.stringify(json1));
    cy.getByDataCy("codeEditorFieldError").should("have.text", "");
    shouldHaveValidationErrors(false, true);

    cy.getByDataCy("formPreview")
      .find(".cm-content")
      .invoke("html", JSON.stringify(json2));
    shouldHaveValidationErrors(false, false);
  });

  it("tests file field", () => {
    cy.get("span").contains("Advanced fields").click();
    cy.addFieldWithName("file", "myfile");
    cy.getByDataCy("treeItem").click();

    // Test upload
    cy.get(".ant-upload-select input[type=file]").selectFile(
      "cypress/fixtures/sample.pdf",
      { force: true, action: "drag-drop" }, // testing also drag-drop upload
    );

    cy.getByDataCy("formPreview")
      .find(".ant-upload-list-item-name")
      .contains("sample.pdf")
      .should("exist");

    // Test thumbnails
    cy.get(".ant-upload-select input[type=file]").selectFile(
      "cypress/fixtures/sample.png",
      { force: true },
    );

    cy.getByDataCy("formPreview")
      .find(".ant-upload-list-item-name")
      .contains("sample.png")
      .parents(".ant-upload-list-item")
      .as("uploadItemPng");

    cy.get("@uploadItemPng")
      .find(".ant-upload-list-item-thumbnail img")
      .should("be.visible");

    // Test preview
    cy.get("@uploadItemPng").trigger("mouseover");
    cy.get("@uploadItemPng").find(".anticon-eye").click();

    cy.get(".ant-image-preview-wrap").should("be.visible");
    cy.get(".ant-image-preview-close").click();

    // Test deletion
    cy.get("@uploadItemPng").trigger("mouseover");
    cy.get("@uploadItemPng").find(".anticon-delete").click();

    cy.getByDataCy("formPreview")
      .find(".ant-upload-list-item-name")
      .contains("sample.png")
      .should("not.exist");

    // Test disable preview
    cy.get(`button#root${SEP}disablePreview`).click();

    cy.get(".ant-upload-select input[type=file]").selectFile(
      "cypress/fixtures/sample.png",
      { force: true },
    );

    cy.get("@uploadItemPng")
      .find(".ant-upload-list-item-thumbnail img")
      .should("not.exist");

    cy.get("@uploadItemPng").find(".anticon-picture").should("be.visible");

    cy.get("@uploadItemPng").trigger("mouseover");
    cy.get("@uploadItemPng").find(".anticon-eye").should("not.exist");

    // Test max files
    cy.getByDataCy("formPreview")
      .find(".ant-upload-list-item")
      .each(($el) => {
        cy.wrap($el).trigger("mouseover");
        cy.wrap($el).find(".anticon-delete").click();
      });

    cy.get(`input#root${SEP}maxFiles`).clearTypeBlur("1");

    cy.get(".ant-upload-select input[type=file]").selectFile(
      "cypress/fixtures/sample.pdf",
      { force: true },
    );

    cy.getByDataCy("formPreview")
      .find(".ant-upload-list-item-name")
      .contains("sample.pdf")
      .should("exist");

    // simply checking if the upload button is now hidden
    // (not trying with selectFile as it would success since the input file would still be there, just hidden)
    cy.get(".ant-upload-select").should("have.css", "display", "none");

    // Test allowed extensions
    // (can't test the actual logic as selectFile seems to ignore the html file accept attribute)
    cy.get(`fieldset#root${SEP}accept`).getByDataCy("addItemButton").click();
    cy.get(`input#root${SEP}accept${SEP}0`).clearTypeBlur(".pdf");

    cy.get(".ant-upload-select input[type=file]").should(
      "have.attr",
      "accept",
      ".pdf",
    );

    cy.getByDataCy("formPreview")
      .find('[data-cy="fileAllowedExtensionsText"]')
      .should("contain.text", "Allowed file extensions: .pdf");
  });
});
