import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ArrowLeft, Download, FileText, Loader2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import 'highlight.js/styles/github-dark.css';

// Mapping between route names and actual markdown file names
const docFileMap = {
  // Quick Start (multiple variations)
  'installation': 'COMPLETE_SETUP_GUIDE.md',
  'quickstart': 'setup.md',
  'quick-start': 'setup.md',
  'quick_start': 'setup.md',
  'requirements': 'building.md',
  'faq': 'answers.md',
  
  // Getting Started
  'desktop': 'desktop.md',
  'mobile': 'mobileosfeatures.md',
  'mobile-os-features': 'mobileosfeatures.md',
  'overview': 'project-overview.md',
  'project-overview': 'project-overview.md',
  'project_overview': 'project-overview.md',
  
  // Applications
  'taumail': 'taumail.md',
  'tau-mail': 'taumail.md',
  'taucloud': 'taucloud.md',
  'tau-cloud': 'taucloud.md',
  'taustore': 'tau-store.md',
  'tau-store': 'tau-store.md',
  'tau_store': 'tau-store.md',
  
  // Developer Resources
  'api': 'API.md',
  'API': 'API.md',
  'tauscript': 'tauscript-complete.md',
  'tau-script': 'tauscript-complete.md',
  'tauscript-complete': 'tauscript-complete.md',
  'architecture': 'architecture/README.md',
  
  // Security & Privacy
  'security': 'SECURITY.md',
  'privacy-policy': 'privacy-policy.md',
  'data-protection': 'data.md',
  'data_protection': 'data.md',
  
  // Enterprise
  'enterprise': 'PRODUCTION_ENTERPRISE_SUMMARY.md',
  'deployment': 'DEPLOYMENT.md',
  'production': 'PRODUCTION_SETUP.md',
  'monitoring': 'monitoring.md',
  
  // Support
  'troubleshooting': 'troubleshooting.md',
  'testing': 'TESTING.md',
  'contributing': 'CONTRIBUTING.md',
  
  // Legal
  'licensing': 'license.md',
  'governance': 'GOVERNANCE.md',
  'code-of-conduct': 'CODE_OF_CONDUCT.md',
  'code_of_conduct': 'CODE_OF_CONDUCT.md',
};

export const DocViewer = () => {
  const { docName } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDocumentation();
  }, [docName]);

  const loadDocumentation = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get the actual file name from the route
      const fileName = docFileMap[docName] || `${docName}.md`;
      
      // Try multiple variations
      const attempts = [
        `/docs/${fileName}`,
        `/docs/${docName}.md`,
        `/docs/${docName.toUpperCase()}.md`,
        `/docs/${docName.replace(/-/g, '_')}.md`,
      ];

      let success = false;
      for (const url of attempts) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            const text = await response.text();
            if (text && text.trim().length > 0) {
              setContent(text);
              success = true;
              break;
            }
          }
        } catch (e) {
          // Continue to next attempt
          continue;
        }
      }

      if (!success) {
        throw new Error('Documentation file not found');
      }
    } catch (err) {
      console.error('Error loading documentation:', err);
      setError(`Documentation "${docName}" not found. The file may not exist or hasn't been uploaded yet.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const fileName = docFileMap[docName] || `${docName}.md`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="App">
        <Header />
        <main style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '120px' }}>
          <div className="max-w-4xl mx-auto px-6 lg:px-12 py-20">
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--brand-primary)' }} />
              <span className="ml-4 body-large">Loading documentation...</span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <Header />
        <main style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '120px' }}>
          <div className="max-w-4xl mx-auto px-6 lg:px-12 py-20">
            <div className="glass p-8 rounded-xl text-center">
              <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
              <h2 className="heading-2 mb-4">Documentation Not Found</h2>
              <p className="body-medium mb-8" style={{ color: 'var(--text-secondary)' }}>
                {error}
              </p>
              <button
                onClick={() => navigate('/docs')}
                className="btn-primary dark-button-animate"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Documentation
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <main style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '120px' }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/docs')}
              className="flex items-center space-x-2 btn-secondary dark-button-animate"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Docs</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 btn-secondary dark-button-animate"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>

          {/* Content */}
          <div className="glass p-8 rounded-xl prose prose-invert prose-lg max-w-none">
            <style>{`
              .prose {
                color: var(--text-primary);
              }
              .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
                color: var(--text-primary);
                margin-top: 2em;
                margin-bottom: 1em;
              }
              .prose h1 {
                font-size: 2.5em;
                border-bottom: 1px solid var(--border-subtle);
                padding-bottom: 0.5em;
              }
              .prose h2 {
                font-size: 2em;
                border-bottom: 1px solid var(--border-subtle);
                padding-bottom: 0.5em;
                margin-top: 2em;
              }
              .prose p {
                color: var(--text-secondary);
                line-height: 1.75;
                margin-bottom: 1.25em;
              }
              .prose code {
                background: var(--bg-secondary);
                padding: 0.2em 0.4em;
                border-radius: 4px;
                font-size: 0.9em;
                color: var(--brand-primary);
              }
              .prose pre {
                background: var(--bg-secondary);
                border: 1px solid var(--border-subtle);
                border-radius: 8px;
                padding: 1em;
                overflow-x: auto;
                margin-bottom: 1.5em;
              }
              .prose pre code {
                background: transparent;
                padding: 0;
                color: var(--text-primary);
              }
              .prose a {
                color: var(--brand-primary);
                text-decoration: none;
              }
              .prose a:hover {
                text-decoration: underline;
              }
              .prose ul, .prose ol {
                color: var(--text-secondary);
                margin-bottom: 1.25em;
              }
              .prose li {
                margin-bottom: 0.5em;
              }
              .prose blockquote {
                border-left: 4px solid var(--brand-primary);
                padding-left: 1em;
                margin-left: 0;
                color: var(--text-secondary);
                font-style: italic;
              }
              .prose table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 1.5em;
              }
              .prose th, .prose td {
                border: 1px solid var(--border-subtle);
                padding: 0.75em;
                text-align: left;
              }
              .prose th {
                background: var(--bg-secondary);
                color: var(--text-primary);
                font-weight: 600;
              }
              .prose img {
                max-width: 100%;
                border-radius: 8px;
                margin-bottom: 1.5em;
              }
            `}</style>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

