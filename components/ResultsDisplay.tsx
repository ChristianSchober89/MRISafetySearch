import React from 'react';
import type { SearchResult } from '../types';
import ReactMarkdown from 'react-markdown';
import { 
  LinkIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  QuestionMarkCircleIcon,
  MagneticFieldIcon,
  SARIcon,
  GradientIcon
} from './icons';

interface ResultsDisplayProps {
  result: SearchResult;
}

const safetyInfoMap = {
  'MR Safe': {
    Icon: CheckCircleIcon,
    label: 'MR Safe',
    className: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200',
    iconClassName: 'text-emerald-500 dark:text-emerald-400',
  },
  'MR Conditional': {
    Icon: ExclamationTriangleIcon,
    label: 'MR Conditional',
    className: 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200',
    iconClassName: 'text-amber-500 dark:text-amber-400',
  },
  'MR Unsafe': {
    Icon: XCircleIcon,
    label: 'MR Unsafe',
    className: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200',
    iconClassName: 'text-red-500 dark:text-red-400',
  },
  'Unknown': {
    Icon: QuestionMarkCircleIcon,
    label: 'Information Not Found',
    className: 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200',
    iconClassName: 'text-slate-500 dark:text-slate-400',
  }
};

const Section: React.FC<{ title: string; content: string | null | undefined }> = ({ title, content }) => {
  if (!content || content.trim() === '' || content.trim().toLowerCase() === 'n/a') return null;

  return (
    <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-6">
      <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-200">{title}</h3>
      <div className="prose prose-slate dark:prose-invert max-w-none prose-a:text-brand-DEFAULT hover:prose-a:text-brand-dark">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

const InfoCard: React.FC<{ title: string; value: string | null | undefined; icon: React.ReactNode }> = ({ title, value, icon }) => {
  if (!value) return null;
  return (
    <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-xl">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
        {icon}
        <h4 className="text-sm font-semibold uppercase tracking-wider">{title}</h4>
      </div>
      <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
};


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const { data, sources } = result;
  const safetyInfo = safetyInfoMap[data.safetyClassification] || safetyInfoMap['Unknown'];

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md space-y-6 animate-fade-in">
      
      {/* Safety Classification Header */}
      <div className={`flex items-center gap-4 p-4 rounded-xl ${safetyInfo.className}`}>
        <safetyInfo.Icon className={`w-10 h-10 flex-shrink-0 ${safetyInfo.iconClassName}`} />
        <div>
          <h2 className="text-2xl font-extrabold">{safetyInfo.label}</h2>
          <p className="font-semibold text-lg">{data.deviceName}</p>
          {data.manufacturer && <p className="text-sm opacity-80">by {data.manufacturer}</p>}
        </div>
      </div>
      
      <Section title="Summary" content={data.summary} />
      
      {/* Conditional Guidelines */}
      {data.safetyClassification === 'MR Conditional' && data.conditionalGuidelines && (
         <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-6">
            <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">MR Conditional Guidelines</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoCard title="Static Field" value={data.conditionalGuidelines.staticMagneticField} icon={<MagneticFieldIcon className="w-4 h-4" />} />
                <InfoCard title="Gradient Field" value={data.conditionalGuidelines.spatialGradientField} icon={<GradientIcon className="w-4 h-4" />} />
                <InfoCard title="SAR Limit" value={data.conditionalGuidelines.sarLimit} icon={<SARIcon className="w-4 h-4" />} />
            </div>
            {data.conditionalGuidelines.notes && (
                <div className="mt-4 prose prose-slate dark:prose-invert max-w-none">
                    <ReactMarkdown>{data.conditionalGuidelines.notes}</ReactMarkdown>
                </div>
            )}
         </div>
      )}

      <Section title="Potential Risks & Artifacts" content={data.risksAndArtifacts} />
      <Section title="Post-Procedure Waiting Period" content={data.waitingPeriod} />

      {data.disclaimer && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-400 dark:border-amber-500 text-amber-800 dark:text-amber-200">
            <p><strong className="font-bold">Disclaimer:</strong> {data.disclaimer}</p>
        </div>
      )}

      {sources.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-6">
          <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-200">
            Sources
          </h3>
          <ul className="space-y-2">
            {sources.map((source, index) => (
              <li key={index} className="flex items-start">
                <LinkIcon className="w-4 h-4 mr-2 mt-1 flex-shrink-0 text-slate-400 dark:text-slate-500" />
                <a
                  href={source.web.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-DEFAULT hover:text-brand-dark hover:underline dark:hover:text-brand-light transition duration-200 break-words"
                  title={source.web.title}
                >
                  {source.web.title || source.web.uri}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;
document.head.append(style);
