import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { isEqual } from "lodash-es";

const StateSynchronizer = ({ callback, slice = "schemaWizard", children }) => {
  const state = useSelector((state) => state[slice]);
  const previousStateRef = useRef(state);

  useEffect(() => {
    if (!isEqual(previousStateRef.current, state)) {
      callback(state);
      previousStateRef.current = state;
    }
  }, [state, callback]);

  return children;
};

export default StateSynchronizer;
