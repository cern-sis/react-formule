import TextWidget from "./TextWidget";
import RichEditorWidget from "./RichEditorWidget";
import UriWidget from "./UriWidget";
import DateWidget from "./DateWidget";
import SelectWidget from "./SelectWidget";

const widgets = {
  text: TextWidget,
  textarea: TextWidget,
  uri: UriWidget,
  richeditor: RichEditorWidget,
  latex: RichEditorWidget,
  date: DateWidget,
  select: SelectWidget,
};

export default widgets;
