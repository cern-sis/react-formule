/// <reference types="cypress" />

describe("test basic functionality", () => {
  beforeEach(() => {
    cy.visit("localhost:3030");
  });

  it("allows drag and drop to the SchemaTree", () => {
    cy.addField("text");

    cy.getByDataCy("treeItem").should("have.length", 1);
    cy.getByDataCy("treeItem").find(".anticon-font-size").should("have.length", 1);
  });

  it("allows drag and drop inside objects", () => {
    cy.addFieldWithName("object", "myobject");
    cy.addField("text");

    cy.getByDataCy("treeItem").contains("myobject").as("objectField").should("have.length", 1);

    cy.addField("text", "@objectField")

    // Total number of elements in the schema tree
    cy.getByDataCy("treeItem").should("have.length", 3);
    // Number of text elements inside the object element. first() is needed since otherwise we would also get the hoverBox of the root field.
    cy.get("@objectField").parents("[data-cy=hoverBox]").first().find(".anticon-font-size").should("have.length", 1);
    // Total number of text elements
    cy.getByDataCy("treeItem").find(".anticon-font-size").should("have.length", 2);
  });

  it("allows moving elements up and down inside the SchemaTree", () => {
    cy.addFieldWithName("text", "mytext").as("textField");
    cy.getByDataCy("treeItem").contains("mytext").as("textField")
    cy.addFieldWithName("textarea", "mytextarea").as("textAreaField");
    cy.getByDataCy("treeItem").contains("mytextarea").as("textAreaField")
    cy.addFieldWithName("number", "mynumber").as("numberField");
    cy.getByDataCy("treeItem").contains("mynumber").as("numberField")

    cy.getByDataCy("treeItem").eq(0).contains("mytext")
    cy.getByDataCy("treeItem").eq(1).contains("mytextarea")
    cy.getByDataCy("treeItem").eq(2).contains("mynumber")

    cy.moveField("@numberField", "@textAreaField")

    cy.getByDataCy("treeItem").eq(0).contains("mytext")
    cy.getByDataCy("treeItem").eq(1).contains("mynumber")
    cy.getByDataCy("treeItem").eq(2).contains("mytextarea")

    cy.getByDataCy("dropArea").as("dropArea")
    cy.moveField("@textField", "@dropArea", "@textAreaField")

    cy.getByDataCy("treeItem").eq(0).contains("mynumber")
    cy.getByDataCy("treeItem").eq(1).contains("mytextarea")
    cy.getByDataCy("treeItem").eq(2).contains("mytext")
  })

  it("changes root field settings", () => {
    cy.addField("text")

    cy.getByDataCy("rootSettings").click()
    cy.getByDataCy("fieldSettings").should("exist")

    // Testing root schema settings
    cy.get("input#root_title").clearTypeBlur("Test root title")
    cy.getByDataCy("rootTitle").should("contain.text", "Test root title")
    cy.get("input#root_description").clearTypeBlur("Test root description")
    cy.getByDataCy("rootDescription").should("contain.text", "Test root description")

    // Testing root uiSchema settings
    cy.getByDataCy("fieldSettings").find(".scrollableTabs .ant-tabs-nav-list").find("[data-node-key=2]").click()

    cy.getByDataCy("formPreview").find(".ant-row-end .ant-col-xs-8").should("not.exist")

    cy.getByDataCy("fieldSettings").find("span").contains("xsmall").click()
    cy.getByDataCy("fieldSettings").find("span").contains("end").click()

    // TODO: Ideally this should be tested with snapshot/visual testing
    cy.getByDataCy("formPreview").find(".ant-row-end .ant-col-xs-8").should("exist")
  });

  it("tests common field settings", () => {
    cy.addField("text")

    cy.getByDataCy("treeItem").click()
    cy.getByDataCy("fieldSettings").should("exist")

    // Edit field id
    cy.getByDataCy("editFieldId").find("div[role=button]").click()
    cy.getByDataCy("editFieldId").find("textarea").clearTypeBlur("myfield")
    cy.get("span#root_myfield-title").should("have.text", "myfield")

    // Edit field title
    cy.get("input#root_title").clearTypeBlur("Test title")
    cy.get("span#root_myfield-title").should("have.text", "Test title")

    // Edit field description
    cy.get("input#root_description").clearTypeBlur("Test description")
    cy.get("span#root_myfield-description").should("have.text", "Test description")

    // Edit readOnly
    cy.getByDataCy("formPreview").find("input#root_myfield").clearTypeBlur("sample text")

    cy.get("button#root_readOnly").click()
    cy.getByDataCy("formPreview").find("input#root_myfield").should("be.disabled")

    // Edit uiSchema > field width
    cy.getByDataCy("fieldSettings").find(".scrollableTabs .ant-tabs-nav-list").find("[data-node-key=2]").click()
    cy.getByDataCy("spanColWrapper").should("have.class", "ant-col-24")
    cy.get(".ant-slider-mark").contains("50%").click()
    cy.getByDataCy("spanColWrapper").should("have.class", "ant-col-12")
  });

  it("tests text field", () => {
    cy.addFieldWithName("text", "myfield")
    cy.getByDataCy("treeItem").click();

    // Test pattern allowing only one character
    cy.get("input#root_pattern").clearTypeBlur("^.$")
    cy.getByDataCy("formPreview").find("input#root_myfield").as("myfield").clearTypeBlur("a")
    cy.getByDataCy("formPreview").hasNoErrorMessage()
    cy.get("@myfield").clearTypeBlur("asd")
    cy.getByDataCy("formPreview").hasErrorMessage('must match pattern "^.$"')
    cy.get("input#root_pattern").clear()

    // Test uiSchema > convertToUppercase
    cy.getByDataCy("fieldSettings").find(".scrollableTabs .ant-tabs-nav-list").find("[data-node-key=2]").click()
    cy.get("input#root_ui\\:options_convertToUppercase").click() // Need to double escape the colon
    cy.get("@myfield").clearTypeBlur("asdf")
    cy.get("@myfield").should("have.value", "ASDF")
    cy.get("input#root_ui\\:options_convertToUppercase").click()

    // Test uiSchema > mask
    cy.get("input#root_ui\\:options_mask").clearTypeBlur("BA-00/a")
    cy.get("@myfield").focus()
    cy.get("@myfield").should("have.value", "B_-__/_")
    cy.get("@myfield").type("NWW5j34r")
    cy.get("@myfield").should("have.value", "BN-53/r")

    // TODO test also suggestion endpoint, after that feature is migrated to formule
  });

  it("tests number field", () => {
    cy.addFieldWithName("number", "myfield")
    cy.getByDataCy("treeItem").click();

    // Test number type
    cy.getByDataCy("formPreview").find("input#root_myfield").as("myfield").clearTypeBlur("123.45")
    cy.getByDataCy("formPreview").find(".ant-form-item-explain-error").should("not.exist")
    // select type integer
    cy.get("input#root_type").type("{downArrow}{enter}", {force: true})
    cy.get("input#root_type").parent().parent().find("[title=Integer]").should("exist")
    cy.getByDataCy("formPreview").find("input#root_myfield").as("myfield").clearTypeBlur("123.45")
    cy.getByDataCy("formPreview").hasErrorMessage("must be integer")
  });

  it("tests checkbox field", () => {
    cy.addField("checkbox")
    cy.getByDataCy("treeItem").click();

    // Test checkbox type: one option
    cy.get("input#root_title").clearTypeBlur("Only option")
    cy.getByDataCy("formPreview").find('.ant-checkbox-wrapper span').contains("Only option").should("exist")

    // Test checkbox type: multiple options
    cy.get("input#root_type").type("{downArrow}{enter}", {force: true})
    cy.get("input#root_type").parent().parent().find('[title="Multiple Options"]').should("exist")
    // rename options
    cy.get("input#root_items_enum_0").clearTypeBlur("First option")
    cy.get("input#root_items_enum_1").clearTypeBlur("Second option")
    // add extra option
    cy.get("fieldset#root_items").getByDataCy("addItemButton").click()
    cy.get("input#root_items_enum_2").clearTypeBlur("Third option")
    cy.getByDataCy("formPreview").find('.ant-checkbox-wrapper span').contains("First option").should("exist")
    cy.getByDataCy("formPreview").find('.ant-checkbox-wrapper span').contains("Second option").as("option2").should("exist")
    cy.get("input[id^=root_items_enum_").should("have.length", 3)
    // check option
    cy.getByDataCy("formPreview").find('.ant-checkbox-wrapper span').contains("Third option").as("checkbox3").parent().should("not.have.class", "ant-checkbox-wrapper-checked")
    cy.get("@checkbox3").click()
    cy.get("@checkbox3").parent().should("have.class", "ant-checkbox-wrapper-checked")
    //remove option (eq(1) gets the second element)
    cy.get("#root_items .arrayFieldRow").eq(1).find(".anticon-delete").click()
    cy.get("input[id^=root_items_enum_").should("have.length", 2)
    cy.get("@option2").should("not.exist")

    // TODO: returned value when checked and unchecked should be tested in a unit/component test with access to formData
  });

  it.skip("tests switch field", () => {
    // TODO: again, returned value type AND return undefined instead of false (in uiOptions) should be tested in a unit/component test with access to formData
  });


  it.skip("tests radio field", () => {
    // We could test adding and removing options here, but it seems repetitive, as it is already done in general for the array field
  });

  it("tests select field", () => {
    cy.addFieldWithName("select", "myfield")
    cy.getByDataCy("treeItem").click();

    // Test select type: one value (text)
    cy.get("input#root_type").parent().parent().find('[title="Select one value (text)"]').should("exist")
    cy.get("fieldset#root_enum").getByDataCy("addItemButton").click()
    cy.get("input#root_enum_0").clearTypeBlur("First option")
    cy.get("fieldset#root_enum").getByDataCy("addItemButton").click()
    cy.get("input#root_enum_1").clearTypeBlur("Second option")
    cy.get("#root_enum .arrayFieldRow").eq(0).find(".anticon-delete").click()
    cy.getByDataCy("formPreview").get("input#root_myfield").as("dropdown").type("{downArrow}")
    cy.get("@dropdown").type("{enter}")
    cy.get("@dropdown").get(".ant-select-item-option-content").contains("Second option").should("exist")

    // Test select type: one value (number)
    cy.get("input#root_type").type("{downArrow}{enter}", {force: true})
    cy.get("input#root_type").parent().parent().find('[title="Select one value (number)"]').should("exist")
    cy.get("fieldset#root_enum").getByDataCy("addItemButton").click()
    cy.get("input#root_enum_0").clearTypeBlur("asd")
    cy.get("input#root_enum_0").should("have.value", "")
    cy.get("input#root_enum_0").clearTypeBlur("1")
    cy.get("input#root_enum_0").should("have.value", "1")
    cy.get("input#root_enum_1").clearTypeBlur("2")
    cy.get("#root_enum .arrayFieldRow").eq(0).find(".anticon-delete").click()
    cy.get("@dropdown").type("{downArrow}")
    cy.get("@dropdown").type("{enter}")
    cy.getByDataCy("formPreview").get(".ant-select-item-option-content").contains("2").should("exist")
    
    // Test select type: multiple values
    cy.get("input#root_type").type("{downArrow}{enter}", {force: true})
    cy.get("input#root_type").parent().parent().find('[title="Select multiple values"]').should("exist")
    cy.get("fieldset#root_items_enum").getByDataCy("addItemButton").click()
    cy.get("input#root_items_enum_0").clearTypeBlur("First option")
    cy.get("fieldset#root_items_enum").getByDataCy("addItemButton").click()
    cy.get("input#root_items_enum_1").clearTypeBlur("Second option")
    cy.get("fieldset#root_items_enum").getByDataCy("addItemButton").click()
    cy.get("input#root_items_enum_2").clearTypeBlur("Third option")
    cy.get("#root_items_enum .arrayFieldRow").eq(1).find(".anticon-delete").click()
    cy.getByDataCy("formPreview").get("input#root_myfield").type("{downArrow}{enter}", {force: true})
    cy.getByDataCy("formPreview").get("input#root_myfield").type("{downArrow}{enter}", {force: true})
    cy.getByDataCy("formPreview").get(".ant-select-item-option-content").contains("First option").should("exist")
    cy.getByDataCy("formPreview").get(".ant-select-item-option-content").contains("Third option").should("exist")
  });

  it("tests date field", () => {
    cy.addFieldWithName("date", "myfield")
    cy.getByDataCy("treeItem").click();

    // Test date type (format)
    cy.get("input#root_myfield").clearTypeBlur("11/10/2023", {force: true})
    cy.get("input#root_myfield").should("have.value", "11/10/2023")
    cy.get("input#root_myfield").clearTypeBlur("11/10/2023 17:29:16", {force: true})
    cy.get("input#root_myfield").should("have.value", "11/10/2023")
    cy.get("input#root_format").type("{downArrow}{enter}", {force: true})
    cy.get("input#root_myfield").clearTypeBlur("11/10/2023 17:29:16", {force: true})
    cy.get("input#root_myfield").should("have.value", "11/10/2023 17:29:16")

    // Test format (customFormat)
    cy.get("input#root_customFormat").type("hh:mm DD-MM-YYYY")
    cy.get("input#root_myfield").clearTypeBlur("11/10/2023 17:29:16", {force: true})
    cy.get("input#root_myfield").should("have.value", "")
    cy.get("input#root_myfield").clearTypeBlur("17:29 11-10-2023", {force: true})
    cy.get("input#root_myfield").should("have.value", "17:29 11-10-2023")

    // Test minDate
    cy.get("input#root_customFormat").clear()
    cy.get("input#root_format").type("{downArrow}{enter}", {force: true})
    cy.get("input#root_minDate").type("10/05/2023", {force: true})
    cy.get("input#root_myfield").clearTypeBlur("9/05/2023", {force: true})
    cy.get("input#root_myfield").should("have.value", "")
    cy.get("input#root_myfield").clearTypeBlur("10/05/2023", {force: true})
    cy.get("input#root_myfield").should("have.value", "10/05/2023")

    // Test maxDate
    cy.get("input#root_maxDate").type("21/12/2023", {force: true})
    cy.get("input#root_myfield").clearTypeBlur("22/12/2023", {force: true})
    cy.get("input#root_myfield").should("have.value", "")
    cy.get("input#root_myfield").clearTypeBlur("21/12/2023", {force: true})
    cy.get("input#root_myfield").should("have.value", "21/12/2023")
  })

  it("tests uri field", () => {
    cy.get("span").contains("Advanced fields").click()
    cy.addFieldWithName("uri", "myfield")

    cy.getByDataCy("formPreview").find("input[type=url]").as("urlInput").clearTypeBlur("notaurl")
    cy.get("@urlInput").clearTypeBlur("notaurl")
    cy.getByDataCy("formPreview").hasErrorMessage('must match format "uri"')
    cy.getByDataCy("formPreview").find(".anticon-link").parent().parent().as("linkButton").should("have.class", "ant-btn-disabled")

    cy.get("@urlInput").clearTypeBlur("https://google.com")
    cy.getByDataCy("formPreview").hasNoErrorMessage()
    cy.getByDataCy("formPreview").find(".anticon-link").parent().parent().should("not.have.class", "ant-btn-disabled")
  });

  it("tests rich editor field", () => {
    cy.get("span").contains("Advanced fields").click()
    cy.addField("richeditor")

    cy.getByDataCy("formPreview").get(".rc-md-editor").as("editor").find("textarea").type("Some text")
    cy.get("@editor").find(".button-type-undo").click()
    cy.get("@editor").find("textarea").should("have.text", "")
    cy.get("@editor").find(".button-type-bold").click()
    cy.get("@editor").find("textarea").type("Bold text")
    cy.get("@editor").find("textarea").should("have.text", "**Bold text**")
  });

  it("tests tags field", () => {
    cy.get("span").contains("Advanced fields").click()
    cy.addFieldWithName("tags", "myfield")

    cy.getByDataCy("formPreview").find("span").contains("New Tag").click()
    cy.getByDataCy("formPreview").find("input#tags_newTag").type("tag 1{enter}")
    cy.getByDataCy("formPreview").find("span").contains("New Tag").click()
    cy.getByDataCy("formPreview").find("input#tags_newTag").type("tag 2{enter}")
    cy.getByDataCy("formPreview").find(".ant-tag").contains("tag 1").as("tag1").should("exist")
    cy.getByDataCy("formPreview").find(".ant-tag").contains("tag 2").as("tag2").should("exist")

    cy.get("@tag1").parent().find("span.anticon-close").click()
    cy.get("@tag1").should("not.exist")
    cy.get("@tag2").should("exist")
  });

  it("tests object field", () => {
    cy.addFieldWithName("object", "myobject")

    // TODO: see how to test the hidden

    cy.getByDataCy("treeItem").contains("myobject").as("objectField")
    cy.addFieldWithName("text", "myfield", "@objectField")

    cy.getByDataCy("formPreview").find("fieldset#root_myobject").find("input#root_myobject_myfield").should("exist")
  });

  it("tests array field", () => {
    cy.addFieldWithName("array", "myarray")
    cy.getByDataCy("treeItem").contains("myarray").as("arrayField")
    cy.addField("text", "@arrayField")

    // test basic add, move, delete functionality
    cy.getByDataCy("formPreview").find("fieldset#root_myarray").getByDataCy("addItemButton").as("addItem").click()
    cy.get("@addItem").click()
    cy.getByDataCy("formPreview").find("input#root_myarray_0").as("item0").clearTypeBlur("First item")
    cy.getByDataCy("formPreview").find("input#root_myarray_1").as("item1").clearTypeBlur("Second item")
    cy.getByDataCy("arrayUtils").first().find(".anticon-arrow-down").click()
    cy.get("@item0").should("have.value", "Second item")
    cy.get("@item1").should("have.value", "First item")
    cy.getByDataCy("arrayUtils").first().find(".anticon-delete").click()
    cy.getByDataCy("formPreview").find("input#root_myarray_0").should("have.value", "First item")
    cy.getByDataCy("formPreview").find("input#root_myarray_1").should("not.exist")
  });

  it.skip("tests accordion field", () => {
    // cy.addFieldWithName("array", "myarray")
    // cy.getByDataCy("treeItem").contains("myarray").as("arrayField")
    // cy.addField("accordionObjectField", "@arrayField")
    // cy.getByDataCy("treeItem").contains("items").as("accordionItems")
    // cy.addField("text", "@accordionItems")
    
    // cy.getByDataCy("formPreview").find("fieldset#root_myarray").getByDataCy("addItemButton").as("addItem").click()
    // cy.get("@addItem").click()

    // cy.getByDataCy("formPreview").find(".ant-collapse-item").first().click()

    // FIXME: To be properly tested once the accordion field is reviewed and its function is more clearly defined
  });

  it("tests layer field", () => {
    cy.addFieldWithName("array", "myarray")
    cy.getByDataCy("treeItem").contains("myarray").as("arrayField")
    cy.addField("layerObjectField", "@arrayField")
    cy.getByDataCy("treeItem").contains("items").as("layerItems")
    cy.addFieldWithName("text", "myfield", "@layerItems")
    
    cy.getByDataCy("formPreview").find("fieldset#root_myarray").getByDataCy("addItemButton").as("addItem").click()
    cy.get("@addItem").click()

    cy.getByDataCy("formPreview").find("li.ant-list-item").as("layerItem").first().click()
    cy.getByDataCy("layerModal").find("input#root_myarray_0_myfield").as("input0").clearTypeBlur("First item")
    cy.getByDataCy("layerModal").find("button").contains("OK").click()

    cy.get("@layerItem").last().click()
    cy.getByDataCy("layerModal").find("input#root_myarray_1_myfield").as("input1").should("exist")
    cy.getByDataCy("layerModal").find("button").contains("Cancel").click()

    cy.get("@layerItem").first().click()
    cy.get("@input0").should("have.value", "First item")
    cy.getByDataCy("layerModal").find("button").contains("Cancel").click()

    cy.get("@layerItem").last().click()
    cy.get("@input1").should("have.value", "")
    cy.getByDataCy("layerModal").find("button").contains("Cancel").click()
  });

  it("tests tab field", () => {
    cy.addFieldWithName("tabView", "mytab")
    cy.getByDataCy("treeItem").contains("mytab").as("tabField")
    cy.addFieldWithName("text", "myfield1", "@tabField")
    cy.addFieldWithName("text", "myfield2", "@tabField")

    
    cy.getByDataCy("formPreview").find(".ant-menu-item").contains("myfield1").click()
    cy.getByDataCy("formPreview").find("input#root_mytab_myfield1").should("exist")
    cy.getByDataCy("formPreview").find(".ant-menu-item").contains("myfield2").click()
    cy.getByDataCy("formPreview").find("input#root_mytab_myfield2").should("exist")
  });
});
