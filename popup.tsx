//import functionName from "./src/function.tsx"

import { useState, useEffect } from "react"

import type { JSX } from "react"



function IndexPopup(): JSX.Element {

  const [currentUrl, setCurrentUrl] = useState<string>("")



  const getCurrentUrl = async () => {

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

   

    if (tab && tab.url) {

      setCurrentUrl(tab.url)

    }

  }



  useEffect(() => {

    getCurrentUrl()

  }, [])



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