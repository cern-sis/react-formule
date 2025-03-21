import CodeEditorField from "./CodeEditorField";
import FileField from "./FileField";
import IdFetcher from "./IdFetcher";
import TagsField from "./TagsField";

const fields = {
  tags: TagsField,
  idFetcher: IdFetcher,
  codeEditor: CodeEditorField,
  file: FileField,
};

export default fields;
