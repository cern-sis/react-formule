import { Switch } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { updateRequired } from "../../store/schemaWizard";

const RequiredWidget = ({ value, onChange }) => {

  const path = useSelector((state) => state.schemaWizard.field)

  const dispatch = useDispatch()

  const handleChange = checked => {
    onChange(checked);
    dispatch(updateRequired({path: path.path, isRequired: checked}));
  };

  return (
    <Switch onChange={handleChange} checked={value}>
      Required
    </Switch>
  );
};

export default RequiredWidget;
