import type { PlasmoCSConfig } from "plasmo"
import type { FC } from "react"
import { UrlDisplay } from "../components/UrlDisplay" // Note the import path

// 1. This config object tells Plasmo WHICH pages to run on
export const config: PlasmoCSConfig = {
  matches: [
    "https://webcourses.ucf.edu/courses/*/grades"
  ]
}

// 2. This is the React component that will be injected
const GradesUI: FC = () => {
  // We don't need to fetch the URL here,
  // we already know we're on the right page!
  const currentUrl = window.location.href

  return (
    <div
      style={{
        // This style creates a floating box on the page
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        background: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
      }}>
      {/* We can reuse your existing UrlDisplay component! */}
      <UrlDisplay url={currentUrl} />
    </div>
  )
}

export default GradesUI