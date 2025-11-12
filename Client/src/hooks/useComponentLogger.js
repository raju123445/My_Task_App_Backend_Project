/**
 * Custom React hook for component logging
 * Logs component lifecycle events
 */

import { useEffect, useRef } from 'react';
import logger from '../utils/logger';

/**
 * Hook to log component lifecycle
 * @param {string} componentName - Name of the component
 */
export const useComponentLogger = (componentName) => {
  const mountedRef = useRef(false);

  useEffect(() => {
    // Log mount
    if (!mountedRef.current) {
      logger.logComponentLifecycle(componentName, 'MOUNTED');
      mountedRef.current = true;
    }

    // Log unmount
    return () => {
      logger.logComponentLifecycle(componentName, 'UNMOUNTED');
    };
  }, [componentName]);

  return {
    logAction: (action, data) => {
      logger.logUserAction(`${componentName}: ${action}`, data);
    },
    logNavigation: (to) => {
      logger.logPageNavigation(componentName, to);
    }
  };
};

export default useComponentLogger;
