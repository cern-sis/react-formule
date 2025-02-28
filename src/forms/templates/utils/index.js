const _checkIfHidden = (name, uiSchema) => {
  return (
    uiSchema &&
    uiSchema[name] &&
    uiSchema[name]["ui:options"] &&
    uiSchema[name]["ui:options"].hidden
  );
};

export const _filterTabs = (tabs, options, properties) => {
  if (tabs) {
    options.tabs.map((tab) => {
      tab.idsList = [];
      properties.map((item) => {
        if (tab.content.includes(item.name)) {
          tab.idsList.push(item.content.props.idSchema.$id);
        }
      });
    });
    return options.tabs;
  }
  return properties.filter(
    (item) => !_checkIfHidden(item.name) && item.name !== "analysis_reuse_mode",
  );
};

export const isFieldContainsError = (item) => {
  const findErrorsRecursively = (item) => {
    if (item.__errors) {
      return true;
    } else if (Object.keys(item).length) {
      for (const child of Object.keys(item)) {
        if (item[child]) {
          return findErrorsRecursively(item[child]);
        }
      }
    } else {
      return false;
    }
  };
  const children = item.content || item.children;
  if (children.props.errorSchema) {
    return findErrorsRecursively(children.props.errorSchema);
  }
  return false;
};

/** Finds matches ignoring the "properties" and "items" segments in the patch path and
 * allows partial matches only when the match includes one last element which is not
 * "properties" or "items".
 * E.g.: "root::properties::people" will match ["properties", "people", "type"] but not
 * ["properties", "people", "properties", "age"] as the latter has an extra "properties"
 * segment meaning this is the parent of that object, so it must not be matched here).
 */
export const stylePatches = (id, patches, token) => {
  if (patches) {
    const relevantPatch = patches.find((patch) => {
      const currentPath = [];

      for (let i = 0; i < patch.path.length; i++) {
        const segment = patch.path[i];
        const nextSegment = patch.path[i + 1];

        if (segment === "properties" || segment === "items") continue;

        currentPath.push(segment);

        if (!nextSegment || !["properties", "items"].includes(nextSegment)) {
          break;
        }
      }

      return id.replace(/^root::/, "") === currentPath.join("::");
    });

    if (relevantPatch) {
      const styles = {
        add: {
          backgroundColor: `${token.colorSuccess}40`,
          outline: `2px solid ${token.colorSuccess}`,
        },
        remove: {
          backgroundColor: `${token.colorError}40`,
          border: `2px solid ${token.colorError}`,
        },
        replace: {
          backgroundColor: `${token.colorWarning}40`,
          outline: `2px solid ${token.colorWarning}`,
        },
      };

      return styles[relevantPatch.op];
    }
  }
  return {};
};
