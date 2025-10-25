import type { PlasmoCSConfig } from "plasmo"
import type { FC } from "react"
import { UrlDisplay } from "../components/UrlDisplay" // Note the import path
import { useState, useEffect } from "react"

// 1. This config object tells Plasmo WHICH pages to run on
export const config: PlasmoCSConfig = {
  matches: [
    "https://webcourses.ucf.edu/courses/*/grades"
  ]
}

// 2. This is the React component that will be injected
interface Grade {
  assignment: string;
  score: string;
  outOf: string;
  percentage: string;
}

const GradesUI: FC = () => {
  const currentUrl = window.location.href;
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [grades, setGrades] = useState<Grade[]>([]);

  const exit = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  };

  const readGrades = () => {
    // Try different possible selectors for the grades table
    console.log('Starting grade reading...');
    
    // Get all tables on the page to help debug
    const allTables = document.querySelectorAll('table');
    console.log('Found tables:', allTables.length);
    
    // Try multiple possible table selectors
    const table = document.querySelector('#grades_summary, .student_grades, .student_assignments, #grades-table');
    console.log('Found grade table:', table);
    
    if (!table) {
      console.log('No grade table found');
      return;
    }

    // Try multiple possible row selectors
    const gradeRows = table.querySelectorAll('tr.student_assignment, tr.grade_details, tr[id^="submission_"], tr.assignment_graded');
    const gradesData: Grade[] = [];

    gradeRows.forEach((row) => {
      // Get text content and clean it up
      const titleElement = row.querySelector('.title');
      const assignment = titleElement?.textContent?.trim() || '';
        
      // Clean up the score by removing the unwanted text and keeping only the numeric value
      const scoreElement = row.querySelector('.grade');
      const score = scoreElement?.textContent
        ?.replace(/Click to test a different score/g, '')
        ?.trim()
        ?.split(/\s+/)[0] || '';  // Take only the first part (the number)

      const outOf = row.querySelector('.points_possible')?.textContent?.trim() || '';
      const percentage = row.querySelector('.percent')?.textContent?.trim() || '';

      console.log('Found grade:', { assignment, score, outOf, percentage });

      // Only add if we have a meaningful assignment name
      if (assignment && !assignment.toLowerCase().includes('test a different score')) {
        gradesData.push({ assignment, score, outOf, percentage });
      }
    });
    
    // Log all grades after collecting them
    console.log('All grades:', gradesData);

    setGrades(gradesData);
  };

  // Read grades when component mounts
  useEffect(() => {
    readGrades();
  }, []);

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
        <div style={{ padding: "16px" }}>
          <button 
            onClick={exit}
            style={{
              float: "right",
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #ccc"
            }}>
            ✕
          </button>
          <h3 style={{ margin: "0 0 16px 0" }}>Grades</h3>
          <div>
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "8px" }}>Assignment</th>
                    <th style={{ textAlign: "right", padding: "8px" }}>Score</th>
                    <th style={{ textAlign: "right", padding: "8px" }}>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((grade, index) => (
                    <tr key={index}>
                      <td style={{ padding: "8px" }}>{grade.assignment}</td>
                      <td style={{ textAlign: "right", padding: "8px" }}>{grade.score}/{grade.outOf}</td>
                      <td style={{ textAlign: "right", padding: "8px" }}>{grade.percentage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
    </div>
  )
}

export default GradesUI