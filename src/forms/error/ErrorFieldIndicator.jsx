import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const ErrorFieldIndicator = ({ id, children }) => {

  const formErrors = useSelector((state) => state.draftItem.get("formErrors"))

  const isFieldWithError = formErrors.some(item => item.startsWith(id));
  if (!isFieldWithError) return children;
  return <div style={{ border: "1px solid #ffccc7" }}>{children}</div>;
};

ErrorFieldIndicator.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
};

export default ErrorFieldIndicator
