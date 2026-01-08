import { readFile } from 'fs/promises';
import { join } from 'path';
import { BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const metadata = {
  title: 'User Manual - Admin',
  robots: 'noindex, nofollow',
};

async function getUserManual() {
  const manualPath = join(process.cwd(), 'USER_MANUAL.md');
  const content = await readFile(manualPath, 'utf-8');
  return content;
}

export default async function HelpPage() {
  const manualContent = await getUserManual();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white px-8 py-6">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">User Manual</h1>
              <p className="text-blue-100 text-sm">Everything you need to know about managing your store</p>
            </div>
          </div>
        </div>

        {/* Manual Content */}
        <div className="px-8 py-6 prose prose-blue max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4 border-b pb-2">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">{children}</h3>
              ),
              p: ({ children }) => <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
              li: ({ children }) => <li className="text-gray-700">{children}</li>,
              code: ({ children }) => (
                <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-4">
                  {children}
                </blockquote>
              ),
              a: ({ href, children }) => (
                <a href={href} className="text-blue-600 hover:text-blue-700 underline">
                  {children}
                </a>
              ),
              strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
              hr: () => <hr className="my-8 border-gray-300" />,
            }}
          >
            {manualContent}
          </ReactMarkdown>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            💡 <strong>Tip:</strong> Bookmark this page for quick access anytime you need help!
          </p>
        </div>
      </div>
    </div>
  );
}
