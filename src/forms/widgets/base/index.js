import TextWidget from "./TextWidget";
import RichEditorWidget from "./RichEditorWidget";
import SwitchWidget from "./SwitchWidget";
import CheckboxWidget from "./CheckboxWidget";
import UriWidget from "./UriWidget";
import DateWidget from "./DateWidget";
import RequiredWidget from "./RequiredWidget";
import SelectWidget from "./SelectWidget";
import SliderWidget from "./SliderWidget";
import TableArrayFieldTemplate from "../../templates/ArrayFieldTemplates/TableArrayFieldTemplate";

const widgets = {
  text: TextWidget,
  uri: UriWidget,
  richeditor: RichEditorWidget,
  latex: RichEditorWidget,
  required: RequiredWidget,
  switch: SwitchWidget,
  checkbox: CheckboxWidget,
  date: DateWidget,
  select: SelectWidget,
  slider: SliderWidget,
  slider_markers: SliderWidget,
  table: TableArrayFieldTemplate,
};

export default widgets;
