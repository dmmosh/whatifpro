
import { useState, useEffect } from "react"
import type { JSX } from "react"
import { getCurrentTabUrl } from "./utils/chrome"
import { UrlDisplay } from "./components/UrlDisplay"

function IndexPopup(): JSX.Element {
  const [currentUrl, setCurrentUrl] = useState<string>("")

  useEffect(() => {
    const fetchUrl = async () => {
      const url = await getCurrentTabUrl()
      setCurrentUrl(url)
    }
    fetchUrl()
  }, [])

  return <UrlDisplay url={currentUrl} />
}



export default IndexPopup