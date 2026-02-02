import {
  memo,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

import { Select, Spin } from "antd";
import type { SelectProps } from "antd";
import debounce from "lodash/debounce";
import { getByPath, applyPathMappings } from "../utils";

interface OptionType {
  label: string;
  value: string;
  [key: string]: unknown;
}

export interface DebounceSelectProps<ValueType = OptionType>
  extends Omit<SelectProps<ValueType | ValueType[]>, "options" | "children"> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

interface FetchOptionsConfig {
  src?: string;
  queryParam?: string;
  pathParam?: boolean;
  resultList?: boolean;
  resultParams?: string[];
  resultMap?: Array<{ source: string; target: string }>;
}

async function _fetchOptions(
  query: string,
  options: FetchOptionsConfig = {},
): Promise<OptionType[] | undefined> {
  const {
    src,
    queryParam = "q",
    pathParam = false,
    resultList = false,
    resultParams = [],
  } = options;

  if (!src) return;

  const URLtoFetch = `${src}/${pathParam ? query : ""}${
    queryParam ? "?" + queryParam + "=" + query : ""
  }`;

  return fetch(URLtoFetch)
    .then((res) => res.json())
    .then((res) => {
      if (!resultList)
        return [
          {
            label: getByPath(res, resultParams.join(".")),
            value: getByPath(res, resultParams.join(".")),
          },
        ];
      else {
        const fetched_results = getByPath(res, resultParams.join("."));
        const results = Array.isArray(fetched_results) ? fetched_results : [];
        return results.map(
          (item: { metadata?: { short_title?: string }; id: string }) => ({
            label: item?.metadata?.short_title || "",
            value: item.id,
          }),
        );
      }
    });
}

interface NodeType {
  data: Record<string, unknown>;
  setData: (data: Record<string, unknown>) => void;
}

interface DebounceSelectComponentProps
  extends Omit<SelectProps, "options" | "onChange" | "onSelect"> {
  fetchOptions: (
    query: string,
    editorParams: FetchOptionsConfig,
  ) => Promise<OptionType[] | undefined>;
  onSelect?: (value: string) => void;
  onValueChange?: (value: string) => void;
  editorParams?: FetchOptionsConfig;
  debounceTimeout?: number;
  node?: NodeType;
}

const DebounceSelect = forwardRef<unknown, DebounceSelectComponentProps>(
  ({
    fetchOptions,
    onSelect,
    onValueChange,
    editorParams = {},
    debounceTimeout = 300,
    node,
    ...props
  }) => {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState<OptionType[]>([]);
    const [isOpen, setIsOpen] = useState(true);
    const fetchRef = useRef(0);
    const selectRef = useRef(null);

    const debounceFetcher = useMemo(() => {
      const loadOptions = (value: string) => {
        fetchRef.current += 1;
        const fetchId = fetchRef.current;
        setOptions([]);
        setFetching(true);

        fetchOptions(value, editorParams).then((newOptions) => {
          if (fetchId !== fetchRef.current) {
            // for fetch callback order
            return;
          }

          setOptions(newOptions || []);
          setFetching(false);
        });
      };

      return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout, editorParams]);

    const _onSelect = (selection: OptionType) => {
      const { resultMap = [] } = editorParams;
      if (node) {
        node.setData({
          ...node.data,
          ...applyPathMappings(resultMap, selection, node.data),
        });
      }
      // Update the cell value
      if (onValueChange) {
        onValueChange(selection?.value);
      }
      // Call the onSelect prop if provided
      if (onSelect) {
        onSelect(selection?.value);
      }
    };

    return (
      <Select
        ref={selectRef}
        aria-autocomplete="none"
        labelInValue
        showSearch
        open={isOpen}
        onOpenChange={setIsOpen}
        autoFocus
        style={{ width: "100%" }}
        filterOption={false}
        suffixIcon={null}
        defaultActiveFirstOption={true}
        onSearch={debounceFetcher}
        notFoundContent={fetching ? <Spin size="small" /> : "No results found"}
        {...props}
        onChange={_onSelect}
        onSelect={_onSelect}
        options={options}
      />
    );
  },
);

DebounceSelect.displayName = "DebounceSelect";

interface KeyboardEventType {
  key: string;
}

interface SuppressKeyboardEventParams {
  event: KeyboardEventType;
}

interface ColDefType {
  cellEditorParams?: FetchOptionsConfig;
}

interface AutosuggestFieldProps
  extends Omit<SelectProps, "onChange" | "onSelect"> {
  value?: OptionType;
  onValueChange?: (value: string) => void;
  stopEditing?: () => void;
  colDef?: ColDefType;
  node?: NodeType;
}

const AutosuggestField = forwardRef<
  {
    suppressKeyboardEvent: (params: SuppressKeyboardEventParams) => boolean;
  },
  AutosuggestFieldProps
>(({ value, onValueChange, stopEditing, colDef, node, ...props }, ref) => {
  // Expose AG Grid cell editor methods
  useImperativeHandle(ref, () => ({
    // Tell AG Grid which keyboard events to suppress
    suppressKeyboardEvent: (params: SuppressKeyboardEventParams) => {
      const { event } = params;
      const key = event.key;

      // Suppress AG Grid's handling of these keys so the Select can handle them
      return ["ArrowUp", "ArrowDown", "Enter", "Escape"].includes(key);
    },
  }));

  return (
    <DebounceSelect
      fetchOptions={_fetchOptions}
      placeholder={"Type to search.."}
      value={value}
      onValueChange={onValueChange}
      style={{ width: "100%" }}
      editorParams={colDef?.cellEditorParams || {}}
      onSelect={() => stopEditing?.()}
      node={node}
      {...props}
    />
  );
});

AutosuggestField.displayName = "AutosuggestField";

export default memo(AutosuggestField);
