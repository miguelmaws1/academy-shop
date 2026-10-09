import ReactMarkdown from "react-markdown"
import { contactContent } from "../../content/contactContent"

export const ContactPage = () => {
  return (
    <div className="courses">
        <img className ="main-place" src="/place.webp"></img>
        <ReactMarkdown>{contactContent}</ReactMarkdown>
    </div>
  )
}
