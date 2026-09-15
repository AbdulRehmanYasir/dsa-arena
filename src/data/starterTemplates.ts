import { Language } from '../types';

export interface LanguageInfo {
  id: Language;
  name: string;
  extension: string;
  commentPrefix: string;
  badge: string;
  isExecutableInClient: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { id: 'javascript', name: 'JavaScript', extension: 'js', commentPrefix: '//', badge: 'Live Sandboxed', isExecutableInClient: true },
  { id: 'typescript', name: 'TypeScript', extension: 'ts', commentPrefix: '//', badge: 'Live Sandboxed', isExecutableInClient: true },
  { id: 'python', name: 'Python 3', extension: 'py', commentPrefix: '#', badge: 'Live Sandboxed', isExecutableInClient: true },
  { id: 'cpp', name: 'C++', extension: 'cpp', commentPrefix: '//', badge: 'Syntax & Complexity', isExecutableInClient: false },
  { id: 'java', name: 'Java', extension: 'java', commentPrefix: '//', badge: 'Syntax & Complexity', isExecutableInClient: false },
  { id: 'c', name: 'C', extension: 'c', commentPrefix: '//', badge: 'Syntax & Complexity', isExecutableInClient: false },
  { id: 'csharp', name: 'C#', extension: 'cs', commentPrefix: '//', badge: 'Syntax & Complexity', isExecutableInClient: false },
  { id: 'go', name: 'Go', extension: 'go', commentPrefix: '//', badge: 'Syntax & Complexity', isExecutableInClient: false },
  { id: 'rust', name: 'Rust', extension: 'rs', commentPrefix: '//', badge: 'Syntax & Complexity', isExecutableInClient: false },
];

export interface ProblemSignature {
  fnName: string;
  jsParams: string;
  pyParams?: string;
  cppParams?: string;
  javaParams?: string;
  tsParams?: string;
  cParams?: string;
  csParams?: string;
  goParams?: string;
  rustParams?: string;
  returnType: {
    jsDefault: string;
    pyDefault: string;
    cppType: string;
    cppDefault: string;
    javaType: string;
    javaDefault: string;
    tsType: string;
    cType: string;
    cDefault: string;
    csType: string;
    csDefault: string;
    goType: string;
    goDefault: string;
    rustType: string;
    rustDefault: string;
  };
  sampleSolution?: {
    js?: string;
    py?: string;
  };
}

export function generateStarterCode(sig: ProblemSignature): Record<Language, string> {
  const { fnName, jsParams, returnType } = sig;
  const pyName = fnName.replace(/([A-Z])/g, '_$1').toLowerCase();
  const csName = fnName.charAt(0).toUpperCase() + fnName.slice(1);

  return {
    javascript: `function ${fnName}(${jsParams}) {\n  // Write your code here\n  return ${returnType.jsDefault};\n}`,
    typescript: `function ${fnName}(${sig.tsParams || jsParams}): ${returnType.tsType} {\n  // Write your code here\n  return ${returnType.jsDefault};\n}`,
    python: `def ${pyName}(${sig.pyParams || jsParams}) -> ${returnType.pyDefault.startsWith('[') ? 'list' : returnType.pyDefault.startsWith('{') ? 'dict' : 'any'}:\n    # Write your code here\n    return ${returnType.pyDefault}`,
    cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\n\nclass Solution {\npublic:\n    ${returnType.cppType} ${fnName}(${sig.cppParams || jsParams}) {\n        // Write your code here\n        return ${returnType.cppDefault};\n    }\n};`,
    java: `import java.util.*;\n\nclass Solution {\n    public ${returnType.javaType} ${fnName}(${sig.javaParams || jsParams}) {\n        // Write your code here\n        return ${returnType.javaDefault};\n    }\n}`,
    c: `/**\n * Algorithmic Solution in C\n */\n${returnType.cType} ${fnName}(${sig.cParams || jsParams}) {\n    // Write your code here\n    return ${returnType.cDefault};\n}`,
    csharp: `using System;\nusing System.Collections.Generic;\n\npublic class Solution {\n    public ${returnType.csType} ${csName}(${sig.csParams || jsParams}) {\n        // Write your code here\n        return ${returnType.csDefault};\n    }\n}`,
    go: `package main\n\nfunc ${fnName}(${sig.goParams || jsParams}) ${returnType.goType} {\n    // Write your code here\n    return ${returnType.goDefault}\n}`,
    rust: `pub struct Solution;\n\nimpl Solution {\n    pub fn ${pyName}(${sig.rustParams || jsParams}) -> ${returnType.rustType} {\n        // Write your code here\n        ${returnType.rustDefault}\n    }\n}`,
  };
}
