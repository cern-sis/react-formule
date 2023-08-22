import { connect } from "react-redux";
import SelectOrEdit from "../components/SelectOrEdit";

function mapStateToProps(state) {
  return {
    path: state.schemaWizard.get("field"),
  };
}

export default connect(
  mapStateToProps
)(SelectOrEdit);
