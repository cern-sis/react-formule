import { ReactNode } from "react";
import { ThemeConfig } from "antd";
import { SchemaWizardState } from "../store/schemaWizard";

export type CustomFunctions = {
  file?: {
    /**
     * Function to fetch a file based on a file UID. Formule will call this function with
     * each of the file UIDs in a Files field's formData to initialize it with the files
     * fetched from the URL returned by this function.
     * @param uid The UID of the file to fetch
     * @returns An object URL for the file which can be a promise. This can be:
     *      - Simply a url to your backend, requiring no processing from your side
     *      - If you have a more complex use case, where you need to configure authentication,
     *          etc, you can instead fetch the file inside this function using your custom logic
     *          and then create and return an object URL with URL.createObjectURL()
     */
    fetchFile: (uid: string) => string | Promise<string>;
  };
};

export type FormuleContextProps = {
  children: ReactNode;
  customFieldTypes?: object;
  customFields?: object;
  customWidgets?: object;
  customPublishedFields?: object;
  customPublishedWidgets?: object;
  customFunctions?: CustomFunctions;
  theme?: ThemeConfig;
  separator?: string;
  errorBoundary?: ReactNode;
  synchronizeState?: (state: SchemaWizardState) => void;
  transformSchema?: (schema: object) => object;
};
