import React, { useMemo, useRef, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import type { AgGridReactProps } from "ag-grid-react";
import type {
  ColDef,
  ColGroupDef,
  ValueGetterParams,
  GridApi,
} from "ag-grid-community";
import AutosuggestField from "./AutosuggestField";
import { isArray } from "lodash-es";

// AG Grid styles
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";

/**
 * Minimal JSON Schema typing for the features we support
 */
type JSONSchema = {
  $id?: string;
  title?: string;
  description?: string;
  type?: string | string[];
  format?: string;
  enum?: (string | number | boolean | null)[];
  default?: unknown;
  properties?: Record<string, JSONSchema>;
  items?: JSONSchema | JSONSchema[];
  required?: string[];
  subtype?: string;
  [k: string]: unknown;
};

interface UISchemaType {
  items?: Record<string, UISchemaType>;
  suggestions?: {
    src?: string;
    pathParam?: boolean;
    queryParam?: string;
    resultParams?: string[];
    resultList?: boolean;
    resultMap?: Array<{ source: string; target: string }>;
    autofillParams?: unknown;
  };
  [key: string]: unknown;
}

type SugggetionsDef = {
  url?: string;
  params?: {
    queryParam?: string;
    resultsPath: string[];
  };
  autofill?: {
    fieldMap?: Record<string, unknown>[];
  };
};

type ColumnLike = ColDef | ColGroupDef;

export type JSONSchemaGridProps = {
  /** Root schema can be an array of objects or a row object */
  schema: JSONSchema;
  /** Data rows */
  rowData: Record<string, unknown>[];

  uiSchema: UISchemaType;
  suggestions: {
    [key: string]: SugggetionsDef;
  };

  /** Per-field overrides keyed by dotted path (e.g., "customer.email") */
  columnOverrides?: Record<string, Partial<ColDef>>;
  /** Default colDef for all columns */
  defaultColDef?: ColDef;
  /** Pass-through props to AgGridReact */
  gridProps?: AgGridReactProps<Record<string, unknown>>;

  /** Auto-height behavior */
  autoHeight?: boolean; // when true, grid grows to fit rows
  maxAutoRows?: number; // cap for auto-height; if provided we compute a fixed height
  rowPx?: number; // rowHeight used for height calc and grid rowHeight
  headerPx?: number; // header allowance for height calc
  themeClassName?: string; // e.g., "ag-theme-alpine"

  /** Visibility control (precedence: shownProperties > hiddenProperties) */
  shownProperties?: string[]; // show only these; everything else hidden
  hiddenProperties?: string[]; // hide these (used only when shownProperties is not provided)
  /** Back-compat (deprecated). Prefer shownProperties/hiddenProperties */
  shownColumns?: string[]; // DEPRECATED
  hiddenColumns?: string[]; // DEPRECATED
  /** If true, remove hidden leaves from defs (and any groups that then become empty) */
  pruneHidden?: boolean;

  onChange?: (
    rows: Record<string, unknown>[],
    meta: { reason: string },
  ) => void;
};

/* ========================= Utils ========================= */
const toArray = (t?: string | string[]) =>
  Array.isArray(t) ? t : t ? [t] : [];

/** Normalize dotted path for matching: drop [] markers and trailing dot */
function normalizePath(p?: string) {
  return (p || "").replace(/\[\]\.?/g, ".").replace(/\.$/, "");
}

/** Wildcard rule match: exact or prefix.* */
function matchesRule(fieldPath: string, rule: string): boolean {
  const f = normalizePath(fieldPath);
  const r = normalizePath(rule);
  if (r.endsWith(".*")) {
    const prefix = r.slice(0, -2);
    return f === prefix || f.startsWith(prefix + ".");
  }

  return f === r;
}

function isHiddenField(
  fieldPath: string | undefined,
  rules: Set<string>,
): boolean {
  if (!fieldPath || rules.size === 0) return false;
  for (const rule of rules) if (matchesRule(fieldPath, rule)) return true;
  return false;
}

function isShownField(
  fieldPath: string | undefined,
  rules: Set<string>,
): boolean {
  if (!fieldPath) return false;
  if (rules.size === 0) return true;
  for (const rule of rules) if (matchesRule(fieldPath, rule)) return true;
  return false;
}

function getByPath(obj: unknown, path: string): unknown {
  if (!obj || !path) return undefined;
  return path.split(".").reduce((acc: unknown, key: string) => {
    if (acc == null) return acc;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

function isGroup(col: ColumnLike): col is ColGroupDef {
  return (col as ColGroupDef).children != null;
}

/* ==================== Schema → ColDefs ==================== */
function inferColFromSchema(
  key: string,
  path: string,
  s: JSONSchema,
  uiS: UISchemaType,
  required: boolean,
): ColDef {
  const headerName = s.title || key;
  const primaryType = toArray(s.type)[0];
  const subtype = s?.subtype;
  const base: ColDef = {
    headerName,
    field: path,
    valueGetter: (p: ValueGetterParams) => getByPath(p.data, path),
    sortable: true,
    filter: true,
    editable: true,
    resizable: true,
    headerTooltip: s.description,
  };

  if (s.enum) {
    base.filter = "agSetColumnFilter";
    base.filterParams = { values: s.enum };
    base.cellDataType =
      primaryType === "number"
        ? "number"
        : primaryType === "boolean"
          ? "boolean"
          : "text";
  }

  switch (primaryType) {
    case "integer":
    case "number":
      base.filter = "agNumberColumnFilter";
      base.cellDataType = "number";
      break;
    case "boolean":
      base.filter = "agSetColumnFilter";
      base.cellDataType = "boolean";
      break;
    case "string":
      if (s.format === "date" || s.format === "date-time") {
        base.filter = "agDateColumnFilter";
        base.valueFormatter = (p) => {
          const v = getByPath(p.data, path);
          if (!v) return "";
          const d = new Date(v as string | number | Date);
          return Number.isNaN(d.getTime())
            ? String(v)
            : s.format === "date"
              ? d.toISOString().slice(0, 10)
              : d.toLocaleString();
        };
      } else {
        base.filter = "agTextColumnFilter";
      }
      break;
    case "array":
      base.filter = "agTextColumnFilter";
      base.valueFormatter = (p) => {
        const v = getByPath(p.data, path);
        return Array.isArray(v) ? v.join(", ") : v == null ? "" : String(v);
      };
      break;
    case "object":
      base.filter = "agTextColumnFilter";
      base.valueFormatter = (p) => {
        const v = getByPath(p.data, path);
        try {
          return v == null ? "" : JSON.stringify(v);
        } catch {
          return String(v);
        }
      };
      break;
    default:
      base.filter = "agTextColumnFilter";
  }

  if (subtype == "suggester") {
    base.cellEditor = AutosuggestField;
    base.cellEditorParams = {
      src: uiS?.suggestions?.src, // "https://inspirehep.net/api/journals"
      pathParam: uiS?.suggestions?.pathParam,
      queryParam: uiS?.suggestions?.queryParam,
      resultParams: uiS?.suggestions?.resultParams,
      resultList: uiS?.suggestions?.resultList,
      resultMap: uiS?.suggestions?.resultMap,
      autofillParams: uiS?.suggestions?.autofillParams,
    };
  }
  if (!required) base.headerClass = () => "opacity-80";
  return base;
}

function buildColsFromObjectSchema(
  schema: JSONSchema,
  uiSchema: UISchemaType = {} as UISchemaType,
  basePath = "",
  required: string[] = [],
): ColumnLike[] {
  const props = schema.properties || {};
  const reqSet = new Set(schema.required || required);
  const cols: ColumnLike[] = [];

  for (const key of Object.keys(props)) {
    const s = props[key] || ({} as JSONSchema);
    const uiS = uiSchema || ({} as UISchemaType);
    const path = basePath ? `${basePath}.${key}` : key;
    const primary = toArray(s.type)[0];

    if (
      (primary === "object" || (!!s.properties && !primary)) &&
      s.properties
    ) {
      const children = buildColsFromObjectSchema(
        s,
        uiS,
        path,
        s.required || [],
      );
      const group: ColGroupDef = {
        headerName: s.title || key,
        marryChildren: true,
        headerTooltip: s.description,
        children: children as (ColDef | ColGroupDef)[],
      };
      cols.push(group);
      continue;
    }

    if (primary === "array" && s.items) {
      const itemsSchema = Array.isArray(s.items)
        ? s.items[0]
        : (s.items as JSONSchema);
      if (
        itemsSchema &&
        (itemsSchema.properties || itemsSchema.type === "object")
      ) {
        const itemProps = itemsSchema.properties || {};
        const uiSchemaItems = uiS?.items || {};
        const children: ColDef[] = Object.keys(itemProps).map((childKey) => {
          const childSchema = itemProps[childKey] as JSONSchema;
          const childUISchema = (uiSchemaItems[childKey] || {}) as UISchemaType;
          const childPath = `${path}[].${childKey}`; // logical id, dotted for overrides
          const leaf = inferColFromSchema(
            childKey,
            childPath,
            childSchema,
            childUISchema,
            false,
          );
          leaf.valueGetter = (p: ValueGetterParams) => {
            const arr = getByPath(p.data, path);
            if (!Array.isArray(arr)) return undefined;
            const vals = arr
              .map((el) => getByPath(el, childKey))
              .filter((v) => v != null);
            return vals.join(", ");
          };
          return leaf;
        });
        cols.push({
          headerName: s.title || key,
          marryChildren: true,
          children,
        } as ColGroupDef);
      } else {
        const child: ColDef = {
          ...inferColFromSchema(
            key,
            `${path}[]`,
            { type: itemsSchema?.type || "string", title: s.title || key },
            uiS,
            reqSet.has(key),
          ),
          headerName: s.title || key,
          valueGetter: (p: ValueGetterParams) => {
            const v = getByPath(p.data, path);
            return Array.isArray(v) ? v.join(", ") : v;
          },
        };
        cols.push({
          headerName: s.title || key,
          marryChildren: true,
          children: [child],
        } as ColGroupDef);
      }
      continue;
    }

    const uiSchemaItem = (uiSchema?.items?.[key] || {}) as UISchemaType;
    cols.push(inferColFromSchema(key, path, s, uiSchemaItem, reqSet.has(key)));
  }

  return cols;
}

function schemaToColumns(
  schema: JSONSchema,
  uiSchema: UISchemaType = {} as UISchemaType,
): ColumnLike[] {
  let rowSchema: JSONSchema | undefined = schema;
  if (schema.type === "array") {
    if (Array.isArray(schema.items)) {
      const items = schema.items as JSONSchema[];
      return items.map((it, idx) =>
        inferColFromSchema(
          it.title || `Col ${idx + 1}`,
          String(idx),
          it,
          uiSchema,
          true,
        ),
      );
    }
    rowSchema = schema.items as JSONSchema;
  }
  if (rowSchema && (rowSchema.type === "object" || rowSchema.properties)) {
    return buildColsFromObjectSchema(rowSchema, uiSchema);
  }

  return [
    inferColFromSchema(
      schema.title || "value",
      "value",
      schema,
      uiSchema,
      true,
    ),
  ];
}

/** Apply visibility rules with precedence (shown wins). Optionally prune */
function applyVisibility(
  columns: ColumnLike[],
  shown?: string[],
  hidden?: string[],
  prune?: boolean,
): ColumnLike[] {
  const shownRules = new Set(shown ?? []);
  const hiddenRules = new Set(hidden ?? []);
  const useShown = shownRules.size > 0;

  const walk = (cols: ColumnLike[]): ColumnLike[] => {
    const out: ColumnLike[] = [];
    for (const col of cols) {
      if (isGroup(col)) {
        const children = walk((col as ColGroupDef).children as ColumnLike[]);
        if (prune && children.length === 0) continue; // drop empty groups
        out.push({ ...(col as ColGroupDef), children } as ColGroupDef);
      } else {
        const leaf = col as ColDef;
        const field = leaf.field || "";
        const visible = useShown
          ? isShownField(field, shownRules)
          : !isHiddenField(field, hiddenRules);
        if (prune && !visible) continue;
        out.push({ ...leaf, hide: !visible } as ColDef);
      }
    }
    return out;
  };

  return walk(columns);
}

/* ============================ Component ============================ */
const JSONSchemaGrid: React.FC<JSONSchemaGridProps> = ({
  schema,
  uiSchema = {} as UISchemaType,
  onChange,
  rowData = [],
  gridProps,
  autoHeight = false,
  maxAutoRows,
  rowPx = 28,
  shownColumns,
  hiddenColumns,
  pruneHidden = false,
}) => {
  const gridApiRef = useRef<GridApi | null>(null);

  // Base columns → overrides → visibility (with precedence)
  const generatedColumns = useMemo(
    () => schemaToColumns(schema, uiSchema),
    [schema, uiSchema],
  );

  const mergedColumns = useMemo<ColumnLike[]>(() => {
    const showList =
      shownColumns && shownColumns.length ? shownColumns : undefined;
    const hideList = showList
      ? undefined
      : hiddenColumns && hiddenColumns.length
        ? hiddenColumns
        : undefined;

    // const visible = applyVisibility(withOverrides, showList, hideList, pruneHidden);
    // const ordered = applyColumnOrder(visible, columnOrder ?? gridProps?.columnOrder);
    return applyVisibility(generatedColumns, showList, hideList, pruneHidden);
    // return ordered
  }, [generatedColumns, shownColumns, hiddenColumns, pruneHidden]);

  // Auto-height modes: pure vs capped
  const isCapped = !!autoHeight && Number.isFinite(maxAutoRows as number);

  const domLayout = (
    isCapped
      ? (gridProps as Record<string, unknown>)?.domLayout ?? "normal"
      : "autoHeight"
  ) as "normal" | "autoHeight" | "print";

  // For toggles UI: gather leaf fields & initial hidden state that respects precedence
  // const leafFields = useMemo(() => {
  //     const acc: { field: string; headerName: string }[] = [];
  //     const walk = (cols: ColumnLike[]) => {
  //         for (const c of cols) {
  //             if (isGroup(c)) walk((c as ColGroupDef).children as ColumnLike[]);
  //             else acc.push({ field: (c as ColDef).field!, headerName: (c as ColDef).headerName || (c as ColDef).field! });
  //         }
  //     };
  //     walk(mergedColumns);
  //     return acc;
  // }, [mergedColumns]);

  // const initialHidden = useMemo(() => {
  //     const showList = (shownProperties && shownProperties.length ? shownProperties : undefined) ??
  //         (shownColumns && shownColumns.length ? shownColumns : undefined);
  //     if (showList) {
  //         const showRules = new Set(showList.map(normalizePath));
  //         const hiddenSet = new Set<string>();
  //         for (const { field } of leafFields) if (!isShownField(field, showRules)) hiddenSet.add(normalizePath(field));
  //         return hiddenSet;
  //     }
  //     const hideList = (hiddenProperties && hiddenProperties.length ? hiddenProperties : undefined) ??
  //         (hiddenColumns && hiddenColumns.length ? hiddenColumns : undefined) ?? [];
  //     return new Set(hideList.map(normalizePath));
  // }, [shownProperties, shownColumns, hiddenProperties, hiddenColumns, leafFields]);

  // Keep prop-driven visibility in sync with the actual grid columns after ready
  // useEffect(() => {
  //     const colApi = columnApiRef.current;
  //     if (!colApi) return;
  //     for (const { field } of leafFields) {
  //         const f = field;
  //         const showList = (shownProperties && shownProperties.length ? shownProperties : undefined) ??
  //             (shownColumns && shownColumns.length ? shownColumns : undefined);
  //         const hideList = (hiddenProperties && hiddenProperties.length ? hiddenProperties : undefined) ??
  //             (hiddenColumns && hiddenColumns.length ? hiddenColumns : undefined) ?? [];

  //         const visible = showList
  //             ? isShownField(f, new Set(showList.map(normalizePath)))
  //             : !isHiddenField(f, new Set(hideList.map(normalizePath)));

  //         colApi.setColumnVisible(f, visible);
  //     }
  // }, [mergedColumns, leafFields, shownProperties, shownColumns, hiddenProperties, hiddenColumns]);

  if (mergedColumns[0]) {
    (mergedColumns[0] as ColDef)["rowDrag"] = true;
  }

  function addItems(addIndex: number) {
    const newItems = [{}];
    gridApiRef.current?.applyTransaction({
      add: newItems,
      addIndex: addIndex,
    });
  }

  const addNewItem = () => {
    const totalItems = rowData?.length || 0;
    addItems(totalItems);
  };

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
      editable: true,
    }),
    [],
  );

  const onGridReady = useCallback((params: { api: GridApi }) => {
    gridApiRef.current = params.api;
  }, []);

  const rowDataForGrid = useMemo(
    () => (isArray(rowData) ? (rowData || []).map((d) => ({ ...d })) : []),
    [rowData],
  );

  const collectAllRows = useCallback(() => {
    const api = gridApiRef.current;
    if (!api) return [];
    const rows: Record<string, unknown>[] = [];
    api.forEachNode((node) => {
      if (node.data) rows.push(node.data as Record<string, unknown>);
    });
    return rows;
  }, []);

  const emitChange = useCallback(
    (reason: string) => {
      const rows = collectAllRows();
      onChange?.(rows, { reason });
    },
    [collectAllRows, onChange],
  );

  const handleCellValueChanged = useCallback(() => {
    emitChange("edit");
  }, [emitChange]);

  const handleRowDragEnd = useCallback(() => {
    emitChange("reorder");
  }, [emitChange]);

  const handleRowDataUpdated = useCallback(() => {
    // NOTE: This also fires when rowData prop changes from the parent.
    // Be careful to avoid infinite loops if you call setState in onChange.
    emitChange("rowDataUpdated");
  }, [emitChange]);

  return (
    <div>
      <AgGridReact
        rowData={rowDataForGrid}
        columnDefs={mergedColumns as (ColDef | ColGroupDef)[]}
        defaultColDef={{
          minWidth: 120,
          ...(defaultColDef || {}),
        }}
        domLayout={domLayout}
        rowHeight={rowPx}
        onGridReady={onGridReady}
        onCellValueChanged={handleCellValueChanged}
        onRowDragEnd={handleRowDragEnd}
        onRowDataUpdated={handleRowDataUpdated}
        rowDragManaged={true}
        stopEditingWhenCellsLoseFocus={true}
        tooltipShowDelay={400}
        rowDragEntireRow={true}
        // enableCellTextSelection
        // ensureDomOrder
        // animateRows
        // undoRedoCellEditing={true}
        // undoRedoCellEditingLimit={20}
        // getRowId={(params) => String(params.dataIndex)}
        {...gridProps}
      />
      <CustomButtonComponent onClick={addNewItem} />
    </div>
  );
};

export const CustomButtonComponent: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => {
  return <a onClick={onClick}>Add new</a>;
};
export default JSONSchemaGrid;
