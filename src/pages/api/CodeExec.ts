import React from 'react';

interface ExecuteCodeResponse {
  statusCode: number;
  messageContent: string;
}

interface ExecuteCodeParams {
  code: string;
  language: string;
}

const executeJavaScript = async (code: string): Promise<ExecuteCodeResponse> => {
  try {
    // Note: Using `eval` is generally not recommended due to security risks.
    const result = await eval(code);
    return { statusCode: 200, messageContent: String(result) };
  } catch (error) {
    return {
      statusCode: 500,
      messageContent: (error instanceof Error) ? error.message : 'Unknown error',
    };
  }
};

const executeRemoteCode = async ({ code, language }: ExecuteCodeParams): Promise<ExecuteCodeResponse> => {
  try {
    const response = await fetch('http://localhost:8000/runcode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return {
      statusCode: 500,
      messageContent: (error instanceof Error) ? error.message : 'Unknown error',
    };
  }
};

 export const CodeExec = async ({ code, language }: ExecuteCodeParams): Promise<ExecuteCodeResponse> => {
  if (language === 'javascript') {
    return executeJavaScript(code);
  }
  return executeRemoteCode({ code, language });
};
