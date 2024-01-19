import React, { useState, useMemo, useEffect } from 'react';
import PreferenceNav from './PreferenceNav/PreferenceNav';
import Split from "react-split";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import {python} from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import EditorFooter from './EditorFooter';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';
import CodeExec from '@/pages/api/codeExec';

export interface ISettings {
    fontSize: string;
    settingsModalIsOpen: boolean;
    dropdownIsOpen: boolean;
}

const Playground = () => {
    const [user] = useAuthState(auth);
    const [output, setOutput] = useState('You have to run your code to see results');
    const [fontSize, setFontSize] = useLocalStorage("lcc-fontSize", "16px");
    const [settings, setSettings] = useState({ fontSize, settingsModalIsOpen: false, dropdownIsOpen: false });
    const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
    const [currentCode, setCurrentCode] = useState("");

    const languages = useMemo(() => ({
        JavaScript: {
            extension: javascript(),
            initialCode: "console.log(\"Hello, JavaScript!\");",
            fileExtension: ".js",
            backendIdentifier: "javascript"
        },
        C: {
            extension: cpp(),
            initialCode: "#include <stdio.h>\nint main() {\n   printf(\"Hello, C!\");\n   return 0;\n}",
            fileExtension: ".c",
            backendIdentifier: "c"
        },
        'C++': {
            extension: cpp(),
            initialCode: "#include <iostream>\nint main() {\n    std::cout << \"Hello, C++!\";\n    return 0;\n}",
            fileExtension: ".cpp",
            backendIdentifier: "cpp"
        },
        Python: {
            extension: python(),
            initialCode: "print(\"Hello, Python!\")",
            fileExtension: ".py",
            backendIdentifier: "python"
        }
    }), []);

    useEffect(() => {
        setCurrentCode(languages[selectedLanguage as keyof typeof languages].initialCode);
    }, [selectedLanguage]);

    const handleLanguageSelect = (language:string) => setSelectedLanguage(language);

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

    const executeCode = async () => {
        try {
            const result = await CodeExec({ code: currentCode, language: languages[selectedLanguage as keyof typeof languages].backendIdentifier });
            setOutput(`Status: ${result.statusCode}, Message: ${result.messageContent}`);
        } catch (error: any) {
            setOutput(`Error: ${error.message}`);
        }
    }

    return (
        <div className="flex flex-col relative bg-[#0f0f0f] rounded-lg shadow-xl overflow-hidden mr-2 mb-2">
            <PreferenceNav settings={settings} setSettings={setSettings} onLanguageSelect={handleLanguageSelect} />
            <Split className="h-[calc(100vh-94px)]" direction="vertical" sizes={[60, 40]} minSize={60}>
                <div className="w-full overflow-auto bg-[#282828] rounded-b-lg shadow-xl select-none">
                    <CodeMirror
                        value={currentCode}
                        onChange={setCurrentCode}
                        theme={vscodeDark}
                        extensions={[languages[selectedLanguage as keyof typeof languages].extension]}
                        style={{ fontSize: settings.fontSize }}
                    />
                </div>
                <div className="bg-black text-white font-mono text-xs rounded-t-lg">
                    <div className="flex items-center justify-between bg-[#303030] h-9 w-full overflow-x-hidden rounded-t-lg shadow-md"></div>
                    {output}
                </div>
            </Split>
            <EditorFooter handleSubmit={executeCode} handleGenerate={handleGenerate}/>
        </div>
    );
}

export default Playground;