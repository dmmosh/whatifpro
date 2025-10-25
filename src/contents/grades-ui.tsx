import type { PlasmoCSConfig } from "plasmo"
import type { FC } from "react"
import { UrlDisplay } from "../components/UrlDisplay"
import { Window } from "../components/Window"

export const config: PlasmoCSConfig = {
  matches: ["https://webcourses.ucf.edu/courses/*/grades"]
}

const GradesUI: FC = () => {
  const currentUrl = window.location.href

  return (
    <Window url={currentUrl} />
  )
}

export default GradesUI