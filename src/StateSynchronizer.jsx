import { useEffect } from "react";
import { useSelector } from "react-redux";

const StateSynchronizer = ({ synchronizeState, children }) => {
  const state = useSelector((state) => state.schemaWizard);

  useEffect(() => {
    synchronizeState(state);
  }, [state, synchronizeState]);

  return children;
};

export default StateSynchronizer;
