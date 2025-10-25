import type { PlasmoCSConfig } from "plasmo"
import type { FC } from "react"
import { useState } from "react"
import { Window } from "../components/Window" // Import the Window

// This config object tells Plasmo WHICH pages to run on
export const config: PlasmoCSConfig = {
  matches: ["https://webcourses.ucf.edu/courses/*/grades"]
}

// This is the React component that will be injected
const GradesUI: FC = () => {
  // This state controls if the window is visible or not
  const [isVisible, setIsVisible] = useState(true)

  // If the user closes the window, we render nothing
  if (!isVisible) {
    return null
  }

  // Render the Window component and pass it the
  // function to close itself.
  return <Window onClose={() => setIsVisible(false)} />
}

export default GradesUI