export const getCurrentTabUrl = async (): Promise<string> => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  return tab?.url || ""
}