import Form from "../../forms/Form";
import { transformSchema } from "../../partials/Utils/schema";
import ObjectFieldTemplate from "../formComponents/ObjectFieldTemplate";
import ArrayFieldTemplate from "../formComponents/ArrayFieldTemplate";
import FieldTemplate from "../formComponents/FieldTemplate";
import { _validate } from "../utils";
import { useSelector } from "react-redux";

const SchemaTree = () => {

  const schema = useSelector((state) => state.schemaWizard.current.schema)
  const uiSchema = useSelector((state) => state.schemaWizard.current.uiSchema)

  return (
    <Form
      schema={transformSchema(schema)}
      uiSchema={uiSchema}
      formData={{}}
      ObjectFieldTemplate={ObjectFieldTemplate}
      ArrayFieldTemplate={ArrayFieldTemplate}
      FieldTemplate={FieldTemplate}
      onChange={() => {}}
      validate={_validate}
      liveValidate
      formContext={{ schema: [], uiSchema: [] }}
    />
  );
};

export default SchemaTree;
