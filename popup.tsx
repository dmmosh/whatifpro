import { useState, useEffect } from "react"
import type { JSX } from "react" // Import the JSX type for the return value

function IndexPopup(): JSX.Element { // Use JSX.Element as the return type, not Element
  const [currentUrl, setCurrentUrl] = useState<string>("")

  const getCurrentUrl = async () => {
    // 1. Corrected syntax: pass the object directly
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    
    // 2. Corrected syntax: pass the value directly
    if (tab && tab.url) {
      setCurrentUrl(tab.url)
    }
  }

  // 3. Corrected syntax for useEffect
  useEffect(() => {
    getCurrentUrl()
  }, []) // 4. Corrected dependency array (see explanation below)

  return (
    <div
      style={{
        padding: 16
      }}>
      <h1>You are currently at:</h1>
      <p>{currentUrl}</p>
    </div>
  )
}

export default IndexPopup