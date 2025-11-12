/**
 * API logging interceptor for Axios
 * Logs all API requests and responses
 */

import logger from './logger';

/**
 * Create API logging interceptor
 */
export const setupApiLogging = (axiosInstance) => {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      logger.logApiRequest(config.method.toUpperCase(), config.url, config.data);

      // Attach start time for performance tracking
      config.metadata = { startTime: Date.now() };

      return config;
    },
    (error) => {
      logger.error('API Request Error', error.message);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      const duration = Date.now() - response.config.metadata.startTime;

      logger.logApiResponse(
        response.config.method.toUpperCase(),
        response.config.url,
        response.status,
        {
          duration: `${duration}ms`,
          dataSize: JSON.stringify(response.data).length
        }
      );

      return response;
    },
    (error) => {
      if (error.config && error.config.metadata) {
        const duration = Date.now() - error.config.metadata.startTime;
        logger.error(`API Error: ${error.config.method.toUpperCase()} ${error.config.url}`, {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          duration: `${duration}ms`
        });
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default setupApiLogging;
