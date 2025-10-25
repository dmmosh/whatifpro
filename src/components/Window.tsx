import type { FC } from "react"
import { useState, useEffect } from "react"
// 1. Import the logo image (make sure icon32.png is in src/components)
import logoUrl from "../../assets/icon32.png"


// Define an interface for our category data
interface Category {
  name: string
  weight: number // Stored as 0.0 - 1.0 (e.g., 60% is 0.6)
  score: number | null // Stored as 0.0 - 1.0 (e.g., 95% is 0.95), or null if ungraded
}

// Define the props our Window will accept
interface WindowProps {
  onClose: () => void // A function to close the window
}

// Define an interface for our result message
interface Result {
  score: number
  category: string
  target: string
}

// Updated CSS for logo and color matching
const styles = `
  .whatifpro-calc-host {
    position: fixed; top: 20px; right: 20px; z-index: 9999;
    background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px;
    box-shadow: 0 6px 16px rgba(0,0,0,0.1); padding: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #333; width: 320px;
  }
  .whatifpro-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 10px;
  }
  /* Style for the logo and title container */
  .whatifpro-header-left {
    display: flex; align-items: center; gap: 8px; /* Add gap between logo and title */
  }
  .whatifpro-header-left img { /* Style the logo image */
    width: 24px; height: 24px;
  }
  .whatifpro-header h3 {
    margin: 0; color: #7E22CE; /* Matched Purple */ font-size: 18px; font-weight: 600;
  }
  .whatifpro-close-btn {
    border: none; background: none; font-size: 24px; line-height: 1;
    cursor: pointer; color: #aaa; padding: 0 4px;
  }
  .whatifpro-close-btn:hover { color: #555; }
  .whatifpro-calc-host label {
    display: block; font-weight: 500; margin-bottom: 6px;
    font-size: 14px; color: #444;
  }
  .whatifpro-score-row {
    margin-bottom: 8px; display: flex; justify-content: space-between;
    align-items: center;
  }
  .whatifpro-score-row label {
    font-size: 14px; font-weight: 400; margin-bottom: 0; flex-grow: 1;
    margin-right: 10px;
  }
  .whatifpro-input-group {
    display: flex; align-items: center; justify-content: flex-end;
  }
  .whatifpro-calc-host input[type="number"] {
    width: 65px; padding: 8px; border: 1px solid #ccc; border-radius: 5px;
    font-size: 14px; text-align: right; -moz-appearance: textfield;
  }
  .whatifpro-calc-host input[type="number"]::-webkit-outer-spin-button,
  .whatifpro-calc-host input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none; margin: 0;
  }
  .whatifpro-input-group span {
     margin-left: 5px; width: 15px;
     text-align: left; color: #555;
  }
  .whatifpro-calc-host button.calculate {
    width: 100%; padding: 10px 12px; background: #7E22CE; /* Matched Purple */ color: white;
    border: none; border-radius: 5px; cursor: pointer; font-size: 16px;
    font-weight: 600; margin-top: 5px;
  }
  .whatifpro-calc-host button.calculate:hover { background: #6A0DAD; /* Darker Matched Purple */ }
  .whatifpro-calc-host button.reset {
    background: none; color: #9333EA; /* Lighter Matched Purple */ font-size: 13px; font-weight: 400;
    width: auto; padding: 0; margin-top: 12px; cursor: pointer; border: none;
  }
  .whatifpro-calc-host button.reset:hover { text-decoration: underline; }
  .whatifpro-result {
    margin-top: 15px; padding: 12px; background-color: #f3e8ff;
    border: 1px solid #d8b4fe; border-radius: 5px; font-size: 14px;
    text-align: center; line-height: 1.4;
  }
`

export const Window: FC<WindowProps> = ({ onClose }) => {
  const [targetGrade, setTargetGrade] = useState("70")
  const [categories, setCategories] = useState<Category[]>([])
  const [whatIfScores, setWhatIfScores] = useState<{ [name: string]: string }>({})
  const [result, setResult] = useState<Result | null>(null)
  const [initialScrapedScores, setInitialScrapedScores] = useState<{ [name: string]: string }>({})

  // This function scrapes the data from the Canvas page
  const scrapeCanvasData = () => {
    return new Promise<void>((resolve) => {
      try {
        console.log("WIP CALC: Starting scrape...")

        // --- Part 1: Scrape Weights ---
        const weightSelector = "div#assignments-not-weighted table.summary tr"
        const weightRows = document.querySelectorAll(weightSelector)
        console.log(`WIP CALC: Found ${weightRows.length} weight rows`)

        const weightsMap = new Map<string, number>()
        weightRows.forEach((row) => {
          const catName = row.querySelector("th[scope='row']")?.textContent?.trim()
          const weightText = row.querySelector("td")?.textContent?.trim()

          if (catName && weightText && catName !== "Group" && catName !== "Total") {
            const weight = parseFloat(weightText) / 100
            if (weight > 0) {
              weightsMap.set(catName, weight)
            }
          }
        })
        console.log("WIP CALC: Weights map:", weightsMap)

        // --- Part 2: Scrape Grades ---
        const gradeSelector = "tr.student_assignment.group_total"
        const gradeRows = document.querySelectorAll(gradeSelector)
        console.log(`WIP CALC: Found ${gradeRows.length} grade rows`)

        const _categories: Category[] = []
        const initialScores: { [name: string]: string } = {}

        gradeRows.forEach((row, index) => {
          const catName = row.querySelector("th.title")?.textContent?.trim()
          const scoreElement = row.querySelector("td.assignment_score span.tooltip span.grade")
          const scoreText = scoreElement?.textContent?.trim()

          console.log(`WIP CALC: Row ${index} (${catName}): Found score text: "${scoreText}"`)

          if (catName && weightsMap.has(catName)) {
            const weight = weightsMap.get(catName)!
            const score = parseFloat(scoreText?.replace("%", ""))

            if (!isNaN(score)) {
              const scorePercent = score / 100
              _categories.push({ name: catName, weight, score: scorePercent })
              initialScores[catName] = score.toFixed(2)
            } else {
              _categories.push({ name: catName, weight, score: null })
              initialScores[catName] = ""
            }
          }
        })

        console.log("WIP CALC: All categories found:", _categories)
        setCategories(_categories)
        setInitialScrapedScores(initialScores)
        setWhatIfScores(initialScores)

      } catch (error) {
        console.error("WIP Extension Error: Failed to scrape page.", error)
      } finally {
        resolve()
      }
    })
  }

  // Run the scraper once when the component mounts
  useEffect(() => {
    scrapeCanvasData()
  }, [])

  // Update the 'whatIfScores' state and clear the old result
  const handleWhatIfChange = (name: string, value: string) => {
    setResult(null)
    setWhatIfScores((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // The main calculation logic
  const calculateWhatIf = () => {
    setResult(null)
    const target = parseFloat(targetGrade) / 100
    let pointsFromLocked = 0
    let unknownCategoryName: string | null = null
    let unknownWeight = 0
    let unknownCount = 0

    for (const cat of categories) {
      const userInput = whatIfScores[cat.name]
      if (userInput && userInput.trim() !== "") {
        pointsFromLocked += (parseFloat(userInput) / 100) * cat.weight
      } else {
        unknownCategoryName = cat.name
        unknownWeight = cat.weight
        unknownCount++
      }
    }

    if (unknownCount === 0) {
      alert("Please leave at least one category blank to solve for it.")
      return
    }
    if (unknownCount > 1) {
      alert("Please only leave ONE category blank. Fill in the others.")
      return
    }
    if (unknownWeight === 0 || !unknownCategoryName) {
      alert("Error: Could not find the category to solve for.")
      return
    }

    const pointsNeeded = target - pointsFromLocked
    const scoreNeeded = (pointsNeeded / unknownWeight) * 100

    setResult({
      score: scoreNeeded,
      category: unknownCategoryName,
      target: targetGrade
    })
  }

  // Reset the grades to the initially scraped values
  const resetScores = () => {
    setResult(null)
    setWhatIfScores(initialScrapedScores)
  }

  // Helper to render the result message
  const renderResultMessage = () => {
    if (!result) return null

    const score = result.score
    const scoreString = score.toFixed(2) + "%"

    if (score > 100) {
      return (
        <span style={{ color: "#DC2626" }}> {/* Red */}
          Warning: You need a <b>{scoreString}</b> on <b>{result.category}</b> to get a {result.target}%.
        </span>
      )
    }
    if (score <= 0) {
      return (
        <span style={{ color: "#059669" }}> {/* Green */}
          Success! You need a <b>0.00%</b> on <b>{result.category}</b> to get a {result.target}%.
        </span>
      )
    }
    // Default message
    return (
      <span>
        You need a <b>{scoreString}</b> on <b>{result.category}</b> to get a {result.target}%.
      </span>
    )
  }

  return (
    <div className="whatifpro-calc-host">
      <style>{styles}</style>

      <div className="whatifpro-header">
        {/* Container for logo and title */}
        <div className="whatifpro-header-left">
          {/* Add the logo image */}
          <img src={logoUrl} alt="What-If Pro Logo" /> 
          <h3>What-If Pro Calculator</h3>
        </div>
        <button onClick={onClose} className="whatifpro-close-btn">
          &times;
        </button>
      </div>

      <hr style={{ margin: "0 0 15px 0", borderColor: "#eee" }} />

      {/* --- Target Grade Input --- */}
      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="target-grade">Target Grade</label>
        <div className="whatifpro-input-group" style={{ justifyContent: 'flex-start' }}>
          <input
            id="target-grade"
            type="number"
            value={targetGrade}
            onChange={(e) => {
              setResult(null)
              setTargetGrade(e.target.value)
            }}
          />
          <span>%</span>
        </div>
      </div>

      {/* --- All Categories (Editable) --- */}
      <div style={{ marginBottom: "15px" }}>
        <label>What-If Scores</label>
        <p style={{ fontSize: "12px", color: "#666", margin: "0 0 10px 0" }}>
          Leave <b>one</b> blank to solve for it.
        </p>

        {categories.map((cat) => (
          <div key={cat.name} className="whatifpro-score-row">
            <label htmlFor={cat.name}>
              {cat.name} ({cat.weight * 100}%)
            </label>
            <div className="whatifpro-input-group">
              <input
                id={cat.name}
                type="number"
                placeholder="?"
                value={whatIfScores[cat.name] || ""}
                onChange={(e) => handleWhatIfChange(cat.name, e.target.value)}
              />
              <span>%</span>
            </div>
          </div>
        ))}
      </div>

      <button onClick={calculateWhatIf} className="calculate">
        Calculate
      </button>

      {/* Result box appears here */}
      {result && (
        <div className="whatifpro-result">
          {renderResultMessage()}
        </div>
      )}

      <button onClick={resetScores} className="reset">
        Reset to Current Grades
      </button>

    </div>
  )
}