import { useCallback, useContext } from "react";
import { isObject } from "lodash";
import { Extension } from "@codemirror/state";
import CustomizationContext from "../contexts/CustomizationContext";
import { AIResponse } from "../types";

const getLocalAiSettings = () => {
  const settings = localStorage.getItem("aiSettings");
  return settings ? JSON.parse(settings) : null;
};

const cleanFieldTypes = (allFieldTypes) => {
  const removeProps = (obj) => {
    if (!isObject(obj)) return obj;
    // Exclude icon and extraExtensions from any depth level (to avoid recursion issues)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { icon, extraExtensions, ...rest } = obj as {
      icon?: JSX.Element; // TODO check all these types, maybe we can just add disable ts and done
      extraExtensions?: Extension;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };
    return Object.entries(rest).reduce((acc, [key, value]) => {
      acc[key] = isObject(value) ? removeProps(value) : value;
      return acc;
    }, {});
  };

  return Object.entries(allFieldTypes).reduce((acc, [key, field]) => {
    acc[key] = removeProps(field);
    return acc;
  }, {});
};

const getProvider = (providers) => {
  const localAiSettings = getLocalAiSettings();
  if (localAiSettings?.provider && providers[localAiSettings.provider]) {
    return localAiSettings.provider;
  }
  // If no provider is selected, return the first available provider having apiKey and model
  return (
    Object.keys(providers).find(
      (key) => providers[key].apiKey && providers[key].model,
    ) || null
  );
};

export const useGetProvider = (): string | null => {
  const { ai } = useContext(CustomizationContext);
  const providers = ai.providers;

  return getProvider(providers);
};

export const useGenerateSchema = () => {
  const { allFieldTypes, ai } = useContext(CustomizationContext);
  const providers = ai.providers;

  return useCallback(
    async (prompt, schema): Promise<AIResponse> => {
      const localAiSettings = getLocalAiSettings();
      const providerName = getProvider(providers);

      const provider = providers[providerName];
      return provider.generateSchema(
        prompt,
        schema,
        cleanFieldTypes(allFieldTypes),
        provider.apiKey || localAiSettings?.apiKey,
        provider.model || localAiSettings?.model,
      );
    },
    [allFieldTypes, providers],
  );
};
