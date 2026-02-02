import JSONSchemaGrid from "./JSONSchemaGrid";

/**
 * -----------------------------
 * Example usage
 * -----------------------------
 *
 *
 *  "publication_info": {
 *    "ui:array": "table",
 *    "ui:options": {
 *      "suggestionsUrl": "https://inspirehep.net/api/journals",
 *      "suggestionsParams": {
 *          "listPath": ["hits", "hits"]
 *       },
 *       "suggestionsAutofill": {
 *          "fieldMap": [
 *              [["metadata","journal_title", "title"], ["journal_title"]],
 *              [["metadata", "self", "$ref"], ["journal_record", "$ref"]],
 *           ]
 *       }
 *    }
 * },
 * const schema = {
 *   type: "array",
 *   items: {
 *     type: "object",
 *     properties: {
 *       athlete: { type: "string" },
 *       year: { type: "integer" },
 *       sport: { type: "string" },
 *       medals: {
 *         type: "object",
 *         title: "Medals",
 *         properties: {
 *           gold: { type: "integer" },
 *           silver: { type: "integer" },
 *           bronze: { type: "integer" },
 *         },
 *       },
 *       results: {
 *         type: "array",
 *         title: "Results",
 *         items: {
 *           type: "object",
 *           properties: {
 *             event: { type: "string" },
 *             place: { type: "integer" },
 *           },
 *         },
 *       },
 *       tags: { type: "array", items: { type: "string" }, title: "Tags" },
 *     },
 *   },
 * } as const;
 *
 * // (1) Pure auto-height (grid grows to fit all rows)
 * <JSONSchemaGrid schema={schema} rowData={rows} autoHeight />
 *
 * // (2) Capped mode (scroll within grid)
 * <JSONSchemaGrid schema={schema} rowData={rows} autoHeight maxAutoRows={12} rowPx={30} />
 *
 * // (3) Show only certain properties (wildcards allowed)
 * <JSONSchemaGrid schema={schema} rowData={rows} autoHeight shownColumns={["athlete", "medals.*", "results[].event"]} />
 *
 * // (4) Hide some properties (only used if shownColumns is not provided)
 * <JSONSchemaGrid schema={schema} rowData={rows} autoHeight hiddenColumns={["year", "medals.silver", "results.*"]} />
 */

function TableArrayFieldTemplate(props) {
  const { value, schema, uiSchema, onChange } = props;
  const {
    columnsHide = [],
    columnsShow = [],
    suggestions = {},
  } = uiSchema["ui:options"] || {};

  return (
    <JSONSchemaGrid
      schema={schema}
      uiSchema={uiSchema}
      hiddenColumns={columnsHide}
      shownColumns={columnsShow}
      rowData={value}
      autoHeight
      onChange={onChange}
      suggestions={suggestions}
      gridProps={{ pagination: false, paginationPageSize: 50 }}
    />
  );
}

export default TableArrayFieldTemplate;
