import TextWidget from "./TextWidget";
import RichEditorWidget from "./RichEditorWidget";
import UriWidget from "./UriWidget";

const widgets = {
  text: TextWidget,
  textarea: TextWidget,
  uri: UriWidget,
  richeditor: RichEditorWidget,
  latex: RichEditorWidget,
};

export default widgets;
