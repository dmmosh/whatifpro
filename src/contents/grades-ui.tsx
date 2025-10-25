import type { PlasmoCSConfig } from "plasmo"
import type { FC } from "react"
import { UrlDisplay } from "../components/UrlDisplay" // Note the import path
import { Window } from "../components/Window"


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
    
      <Window />
  )
}

export default GradesUI