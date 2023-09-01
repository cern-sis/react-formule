import SelectFieldType from "./SelectFieldType";
import PropertyEditor from "./PropertyEditor";
import { useSelector } from "react-redux";

const SelectOrEdit = () => {

    const path = useSelector((state) => state.schemaWizard.field)
  
    return path ? <PropertyEditor /> : <SelectFieldType />
};

export default SelectOrEdit;
