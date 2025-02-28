import { createContext } from "react";
import { CustomizationContextProps } from "../types";
import { RJSFSchema } from "@rjsf/utils";
import fieldTypes from "../admin/utils/fieldTypes";
import { defaultProviders } from "../ai/defaults";

const CustomizationContext = createContext<CustomizationContextProps>({
  allFieldTypes: fieldTypes,
  separator: "::",
  transformSchema: (schema: RJSFSchema) => schema,
  ai: { providers: defaultProviders },
});

export default CustomizationContext;
