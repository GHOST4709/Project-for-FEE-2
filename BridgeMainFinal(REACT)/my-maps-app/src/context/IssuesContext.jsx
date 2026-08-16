import { createContext, useContext, useMemo, useState } from 'react';
import seedIssues from '../data/issues.json';

const IssuesContext = createContext(null);

let nextId = seedIssues.length + 1;

export function IssuesProvider({ children }) {
  const [issues, setIssues] = useState(seedIssues);

  const addIssue = (issue) => {
    const newIssue = {
      id: `issue-${String(nextId).padStart(3, '0')}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...issue,
    };
    nextId += 1;
    setIssues((current) => [newIssue, ...current]);
    return newIssue;
  };

  const value = useMemo(() => ({ issues, addIssue }), [issues]);

  return <IssuesContext.Provider value={value}>{children}</IssuesContext.Provider>;
}

export function useIssues() {
  const context = useContext(IssuesContext);
  if (!context) {
    throw new Error('useIssues must be used within an IssuesProvider');
  }
  return context;
}
