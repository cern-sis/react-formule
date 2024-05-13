import SelectFieldType from "./SelectFieldType";
import PropertyEditor from "./PropertyEditor";
import { useSelector } from "react-redux";
import { isEmpty } from "lodash-es";

const SelectOrEdit = () => {
  const path = useSelector((state) => state.schemaWizard.field);

  return isEmpty(path) ? <SelectFieldType /> : <PropertyEditor />;
};

export default SelectOrEdit;
