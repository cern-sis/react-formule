import SelectFieldType from "./SelectFieldType";
import PropertyEditor from "../containers/PropertyEditor";

const SelectOrEdit = ({path}) => {
  
    return path ? <PropertyEditor /> : <SelectFieldType />
};

export default SelectOrEdit;
