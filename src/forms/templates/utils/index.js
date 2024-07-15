export const RJSF_SEPARATOR = "!";

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
