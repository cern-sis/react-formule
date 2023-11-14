import Form from "../../forms/Form";
import ObjectFieldTemplate from "../formComponents/ObjectFieldTemplate";
import ArrayFieldTemplate from "../formComponents/ArrayFieldTemplate";
import FieldTemplate from "../formComponents/FieldTemplate";
import { _validate } from "../utils";
import { useSelector } from "react-redux";
import CustomizationContext from "../../contexts/CustomizationContext";
import { useContext } from "react";

const SchemaTree = () => {

  const schema = useSelector((state) => state.schemaWizard.current.schema)
  const uiSchema = useSelector((state) => state.schemaWizard.current.uiSchema)

  const customizationContext = useContext(CustomizationContext)

  return (
    <Form
      schema={customizationContext.transformSchema(schema)}
      uiSchema={uiSchema}
      formData={{}}
      ObjectFieldTemplate={ObjectFieldTemplate}
      ArrayFieldTemplate={ArrayFieldTemplate}
      FieldTemplate={FieldTemplate}
      onChange={() => {}}
      validate={_validate}
      liveValidate
      formContext={{ schema: [], uiSchema: [] }}
      className="schemaTree"
    />
  );
};

export default SchemaTree;
