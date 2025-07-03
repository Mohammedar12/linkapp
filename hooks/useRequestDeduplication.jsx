import { useRef, useCallback } from "react";

// Custom hook for request deduplication
export const useRequestDeduplication = () => {
  const pendingRequests = useRef(new Map());
  const abortControllers = useRef(new Map());

  const makeRequest = useCallback(async (key, requestFn) => {
    // If request is already pending, return the existing promise
    if (pendingRequests.current.has(key)) {
      return pendingRequests.current.get(key);
    }

    // Create abort controller for this request
    const abortController = new AbortController();
    abortControllers.current.set(key, abortController);

    // Create the request promise
    const requestPromise = requestFn(abortController.signal).finally(() => {
      // Clean up after request completes
      pendingRequests.current.delete(key);
      abortControllers.current.delete(key);
    });

    // Store the promise
    pendingRequests.current.set(key, requestPromise);

    return requestPromise;
  }, []);

  const cancelRequest = useCallback((key) => {
    const abortController = abortControllers.current.get(key);
    if (abortController) {
      abortController.abort();
      pendingRequests.current.delete(key);
      abortControllers.current.delete(key);
    }
  }, []);

  const cancelAllRequests = useCallback(() => {
    abortControllers.current.forEach((controller) => controller.abort());
    pendingRequests.current.clear();
    abortControllers.current.clear();
  }, []);

  return { makeRequest, cancelRequest, cancelAllRequests };
};
