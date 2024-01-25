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
    const result = safeJavaScriptEvaluator(code);
    return { statusCode: 200, messageContent: String(result) };
  } catch (error) {
    return {
      statusCode: 500,
      messageContent: error instanceof Error ? error.message : 'Unknown error',
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
      const responseBody = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${responseBody}`);
    }
    return await response.json();
  } catch (error) {
    return {
      statusCode: 500,
      messageContent: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const CodeExec = async ({ code, language }: ExecuteCodeParams): Promise<ExecuteCodeResponse> => {
  return language === 'javascript' ? executeJavaScript(code) : executeRemoteCode({ code, language });
};


function safeJavaScriptEvaluator(code: string) {
  throw new Error('Function not implemented.');
}

