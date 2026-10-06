import ReactMarkdown from 'react-markdown';
import { homeContent } from '../content/homeContent';

export const HomePage = () => {
  return (
    <div className="markdown-body">
        <img className ="main-logo" src="/logo.jpeg"></img>
        <ReactMarkdown>{homeContent}</ReactMarkdown>
    </div>
  )
}
