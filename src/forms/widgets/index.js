import TextWidget from "./TextWidget";
import RichEditorWidget from "./RichEditorWidget";
import SwitchWidget from "./SwitchWidget";
import CheckboxWidget from "./CheckboxWidget";
import UriWidget from "./UriWidget";
import DateWidget from "./DateWidget";
import RequiredWidget from "./RequiredWidget";

const widgets = {
  text: TextWidget,
  uri: UriWidget,
  richeditor: RichEditorWidget,
  latex: RichEditorWidget,
  required: RequiredWidget,
  switch: SwitchWidget,
  checkbox: CheckboxWidget,
  date: DateWidget,
};

export default widgets;
