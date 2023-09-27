import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const ErrorFieldIndicator = ({ id, children }) => {

  // This will only apply when passing a custom store and populating formErrors from the host app
  const formErrors = useSelector((state) => state.schemaWizard.formErrors) || []

  const isFieldWithError = formErrors.some(item => item.startsWith(id));
  if (!isFieldWithError) return children;
  return <div style={{ border: "1px solid #ffccc7" }}>{children}</div>;
};

ErrorFieldIndicator.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
};

export default ErrorFieldIndicator
