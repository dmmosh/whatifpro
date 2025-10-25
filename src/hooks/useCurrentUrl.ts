import { useState, useEffect } from "react"

/**
 * A custom React hook that gets the URL of the currently active tab.
 */
export function useCurrentUrl() {
  const [currentUrl, setCurrentUrl] = useState<string>("")

  // This function is now part of the hook
  const getCurrentUrl = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    
    if (tab && tab.url) {
      setCurrentUrl(tab.url)
    }
  }

  // The effect is also part of the hook
  useEffect(() => {
    getCurrentUrl()
  }, []) // Empty array ensures this runs only once on mount

  // The hook returns the final piece of state
  return currentUrl
}