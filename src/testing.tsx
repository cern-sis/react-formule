import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { schemaInit } from "./actions/schemaWizard";
import { _initSchemaStructure, slugify } from "./admin/utils";
import SchemaInitContainer from "./SchemaInitContainer";

export const MosesContext = ({ children }) => {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <DndProvider backend={HTML5Backend} context={window}>
      <SchemaInitContainer>{children}</SchemaInitContainer>
    </DndProvider>
  );
};

export const initSchema = () => {
  schemaInit(
    slugify(Math.random().toString() + "_" + "name"),
    _initSchemaStructure(),
    {
      fullname: name,
    }
  );
};
