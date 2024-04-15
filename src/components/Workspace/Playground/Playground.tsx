import React, { useEffect, useMemo, useState } from 'react';

import useLocalStorage from '@/hooks/useLocalStorage';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { php } from '@codemirror/lang-php';
import { python } from '@codemirror/lang-python';
import { csharp } from '@replit/codemirror-lang-csharp';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import CodeMirror from '@uiw/react-codemirror';

import EditorFooter from './EditorFooter';
import PreferenceNav from './PreferenceNav/PreferenceNav';

export interface ISettings {
  fontSize: string;
  settingsModalIsOpen: boolean;
  dropdownIsOpen: boolean;
}

const Playground = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fontSize, setFontSize] = useLocalStorage('lcc-fontSize', '16px');
  const [settings, setSettings] = useState({
    fontSize,
    settingsModalIsOpen: false,
    dropdownIsOpen: false,
  });
  const [selectedLanguage, setSelectedLanguage] = useState('C++');
  const [currentCode, setCurrentCode] = useState('');

  const languages = useMemo(
    () => ({
      'C++': {
        extension: cpp(),
        initialCode:
          '#include <iostream>\nint main() {\n    std::cout << "Hello, C++!";\n    return 0;\n}',
        fileExtension: '.cpp',
        backendIdentifier: 'cpp',
      },
      Python: {
        extension: python(),
        initialCode: 'print("Hello, Python!")',
        fileExtension: '.py',
        backendIdentifier: 'python',
      },
      JavaScript: {
        extension: javascript(),
        initialCode: 'console.log("Hello, JavaScript!");',
        fileExtension: '.js',
        backendIdentifier: 'javascript',
      },
      C: {
        extension: cpp(),
        initialCode: '#include <stdio.h>\nint main() {\n   printf("Hello, C!");\n   return 0;\n}',
        fileExtension: '.c',
        backendIdentifier: 'c',
      },
      Java: {
        extension: java(),
        initialCode:
          'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}',
        fileExtension: '.java',
        backendIdentifier: 'java',
      },
      Ruby: {
        extension: ruby(),
        initialCode: 'puts "Hello, Ruby!"',
        fileExtension: '.rb',
        backendIdentifier: 'ruby',
      },
      Go: {
        extension: go(),
        initialCode: 'package main\nimport "fmt"\nfunc main() {\n    fmt.Println("Hello, Go!")\n}',
        fileExtension: '.go',
        backendIdentifier: 'go',
      },
      Rust: {
        extension: rust(),
        initialCode: 'fn main() {\n    println!("Hello, Rust!");\n}',
        fileExtension: '.rs',
        backendIdentifier: 'rust',
      },
      TypeScript: {
        extension: javascript({ typescript: true }),
        initialCode: 'console.log("Hello, TypeScript!");',
        fileExtension: '.ts',
        backendIdentifier: 'typescript',
      },
      PHP: {
        extension: php(),
        initialCode: '<?php\necho "Hello, PHP!";\n',
        fileExtension: '.php',
        backendIdentifier: 'php',
      },
      Swift: {
        extension: swift(),
        initialCode: 'print("Hello, Swift!")',
        fileExtension: '.swift',
        backendIdentifier: 'swift',
      },
      Kotlin: {
        extension: cpp(),
        initialCode: 'fun main(args: Array<String>) {\n    println("Hello, Kotlin!")\n}',
        fileExtension: '.kt',
        backendIdentifier: 'kotlin',
      },
      'C#': {
        extension: csharp(),
        initialCode:
          'using System;\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, C#!");\n    }\n}',
        fileExtension: '.cs',
        backendIdentifier: 'csharp',
      },
      Scala: {
        extension: scala(),
        initialCode: 'object HelloScala extends App {\n  println("Hello, Scala!")\n}',
        fileExtension: '.scala',
        backendIdentifier: 'scala',
      },
      Perl: {
        extension: perl(),
        initialCode: 'print "Hello, Perl!\\n";',
        fileExtension: '.pl',
        backendIdentifier: 'perl',
      },
      Haskell: {
        extension: haskell(),
        initialCode: 'main = putStrLn "Hello, Haskell!"',
        fileExtension: '.hs',
        backendIdentifier: 'haskell',
      },
      Lua: {
        extension: lua(),
        initialCode: 'print("Hello, Lua!")',
        fileExtension: '.lua',
        backendIdentifier: 'lua',
      },
      R: {
        extension: r(),
        initialCode: 'print("Hello, R!")',
        fileExtension: '.r',
        backendIdentifier: 'r',
      },
      Dart: {
        extension: dart(),
        initialCode: 'void main() {\n  print("Hello, Dart!");\n}',
        fileExtension: '.dart',
        backendIdentifier: 'dart',
      },
    }),
    [],
  );

  useEffect(() => {
    setCurrentCode(languages[selectedLanguage as keyof typeof languages].initialCode);
  }, [languages, selectedLanguage]);

  const handleLanguageSelect = (language: string) => setSelectedLanguage(language);

  const handleGenerate = () => {
    const fileExtension = languages[selectedLanguage as keyof typeof languages].fileExtension;
    const blob = new Blob([currentCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-auto flex-col relative bg-[#0f0f0f] w-[55%] rounded-lg shadow-xl overflow-hidden px-2 mb-2 ">
      <PreferenceNav
        settings={settings}
        setSettings={setSettings}
        onLanguageSelect={handleLanguageSelect}
      />
      <div className="w-full overflow-auto bg-[#282828] rounded-b-lg shadow-xl select-none h-[calc(100vh-94px)]">
        <CodeMirror
          value={currentCode}
          onChange={setCurrentCode}
          theme={vscodeDark}
          extensions={[languages[selectedLanguage as keyof typeof languages].extension]}
          style={{ fontSize: settings.fontSize }}
        />
      </div>
      <EditorFooter handleGenerate={handleGenerate} />
    </div>
  );
};

export default Playground;
