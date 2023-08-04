import { connect } from "react-redux";
import { schemaInit } from "./actions/schemaWizard";
import { _initSchemaStructure, slugify } from "./admin/utils";
import SchemaInit from "./SchemaInit";

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
});

export default connect(null, mapDispatchToProps)(SchemaInit);
