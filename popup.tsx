import type { JSX } from "react"
// 1. Import your new custom hook
import { useCurrentUrl } from "./src/hooks/useCurrentUrl"

function IndexPopup(): JSX.Element { 
  // 2. Use the hook to get the data. All the complex logic is hidden away.
  const currentUrl = useCurrentUrl()

  // 3. The return (view) is all that's left
  return (
    <div
      style={{
        padding: 16
      }}>
      <h1>You are currently at:</h1>
      <p>{currentUrl || "Loading..."}</p> {/* Added a loading state */}
    </div>
  )
}

export default IndexPopup