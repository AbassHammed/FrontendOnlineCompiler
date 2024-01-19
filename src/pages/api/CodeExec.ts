
import React from 'react';

interface ExecuteCodeResponse {
  statusCode: number;
  messageContent: string;
}

type ExecuteCodeParams = {
  code: string;
  language: string;
}

const CodeExec = async ({ code, language }: ExecuteCodeParams): Promise<ExecuteCodeResponse> => {
  try {
    const response = await fetch('http://localhost:8000/runcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, language }),
    });

    return await response.json();
  } catch (error) {
    return {
      statusCode: 500,
      messageContent: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export default CodeExec;
