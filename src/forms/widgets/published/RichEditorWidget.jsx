import PropTypes from "prop-types";
import MarkdownIt from "markdown-it";
import katex from "katex";
import tm from "markdown-it-texmath";
import "katex/dist/katex.min.css";
import "markdown-it-texmath/css/texmath.css";
import { theme, Typography } from "antd";

const RichEditorWidget = ({ value = "" }) => {
  const mdParser = new MarkdownIt();
  mdParser.use(tm, {
    engine: katex,
    delimiters: "dollars",
    katexOptions: { macros: { "\\RR": "\\mathbb{R}" } },
  });

  const { token } = theme.useToken();

  return (
    <div
      style={{
        ...(value && {
          border: `2px solid ${token.colorFillSecondary}`,
          borderImage: `linear-gradient(to bottom,
            ${token.colorFillSecondary} 10px,
            transparent 20px,
            transparent calc(100% - 20px),
            ${token.colorFillSecondary} calc(100% - 10px)
          ) 1`,
          padding: "10px",
        }),
      }}
    >
      <Typography.Text>
        <span
          className="markdownSpan"
          dangerouslySetInnerHTML={{ __html: mdParser.render(value) }}
        />
      </Typography.Text>
    </div>
  );
};

RichEditorWidget.propTypes = {
  value: PropTypes.string,
};

export default RichEditorWidget;
