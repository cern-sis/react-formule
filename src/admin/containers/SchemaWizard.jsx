import { connect } from "react-redux";

import SchemaWizard from "../components/SchemaWizard";
import { schemaInit } from "../../actions/schemaWizard";
import { _initSchemaStructure, slugify } from "../utils";

function mapStateToProps(state) {
  return {
    field: state.schemaWizard.get("field"),
    loader: state.schemaWizard.get("loader")
  };
}

const mapDispatchToProps = (dispatch) => ({
  schemaInit: () =>
    dispatch(
      schemaInit(
        slugify(Math.random().toString() + "_" + "name"),
        _initSchemaStructure(),
        {
          fullname: name,
        }
      )
    ),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SchemaWizard);
