import Toggler from "./RichEditorPreviewPlugin";
import "katex/dist/katex.min.css";
import MarkdownIt from "markdown-it";
import katex from "katex";
import tm from "markdown-it-texmath";
import "markdown-it-texmath/css/texmath.css";
import PropTypes from "prop-types";
import { useRef } from "react";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

const RichEditorWidget = ({
  onChange,
  value,
  readonly,
  disabled,
  canViewProps,
  viewProps,
  noBorder,
  options,
}) => {
  const { height } = options;

  const mdParser = new MarkdownIt();
  mdParser.use(tm, {
    engine: katex,
    delimiters: "dollars",
    katexOptions: { macros: { "\\RR": "\\mathbb{R}" } },
  });
  let myEditor = useRef(null);

  const renderHTML = (text) => {
    return mdParser.render(text);
  };
  const handleEditorChange = (values) => {
    onChange(values.text);
  };

  MdEditor.use(Toggler, {
    isEditView: { html: false, md: true },
  });

  return (
    <MdEditor
      style={{
        height: height || undefined,
        border: noBorder ? "none" : undefined,
      }}
      config={{
        canView: {
          fullScreen: false,
          md: false,
          html: false,
          ...canViewProps,
          ...(readonly || disabled
            ? {
                md: false,
                html: true,
                fullScreen: true,
                menu: false,
                hideMenu: false,
              }
            : {}),
        },
        view: {
          fullScreen: false,
          md: true,
          html: false,
          ...viewProps,
          ...(readonly || disabled
            ? {
                md: false,
                html: true,
                fullScreen: true,
                menu: false,
                hideMenu: false,
              }
            : {}),
        },
      }}
      readOnly={readonly}
      renderHTML={renderHTML}
      onChange={handleEditorChange}
      value={value}
      ref={myEditor}
      key={noBorder}
    />
  );
};

RichEditorWidget.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  readonly: PropTypes.bool,
  displayedFromModal: PropTypes.bool,
  canViewProps: PropTypes.object,
  viewProps: PropTypes.object,
  noBorder: PropTypes.bool,
  height: PropTypes.number,
};

export default RichEditorWidget;
