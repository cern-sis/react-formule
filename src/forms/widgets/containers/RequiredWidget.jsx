import { connect } from "react-redux";
import RequiredWidget from "../RequiredWidget";
import { updateRequired } from "../../../actions/schemaWizard";

const mapStateToProps = state => ({
  path: state.schemaWizard.get("field"),
});

const mapDispatchToProps = dispatch => ({
  updateRequired: (path, checked) => dispatch(updateRequired(path, checked)),
});

const ConnectedRequiredWidget = connect(mapStateToProps, mapDispatchToProps)(RequiredWidget)

export default props => <ConnectedRequiredWidget {...props} />;
