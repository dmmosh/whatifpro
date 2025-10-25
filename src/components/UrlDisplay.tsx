import type { FC } from "react"

interface UrlDisplayProps {
  url: string
}

export const UrlDisplay: FC<UrlDisplayProps> = ({ url }) => {
  return (
    <div style={{ padding: 16 }}>
      <h1>You are currently at:</h1>
      <p>{url}</p>
    </div>
  )
}