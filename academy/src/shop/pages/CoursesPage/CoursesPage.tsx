import ReactMarkdown from "react-markdown"
import { coursesContent } from "../../content/coursesContent"


export const CoursesPage = () => {
  return (
    <div className="courses">
        <ReactMarkdown>{coursesContent}</ReactMarkdown>
    </div>
  )
}