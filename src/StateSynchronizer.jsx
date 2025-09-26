import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { isEqual, cloneDeep } from "lodash-es";

const StateSynchronizer = ({ synchronizeState, children }) => {
  const state = useSelector((state) => state.schemaWizard);
  const previousStateRef = useRef();

  function stripFormData(obj) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { formData, ...rest } = obj;
    return rest;
  }

  useEffect(() => {
    const prev = previousStateRef.current;
    if (!prev || !isEqual(stripFormData(state), stripFormData(prev))) {
      synchronizeState(state);
    }
    previousStateRef.current = cloneDeep(state);
  }, [state, synchronizeState]);

  return children;
};

export default StateSynchronizer;
