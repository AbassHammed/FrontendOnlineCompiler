import { cppLanguage } from '@codemirror/lang-cpp';
import { cssLanguage } from '@codemirror/lang-css';
import { htmlLanguage } from '@codemirror/lang-html';
import { javaLanguage } from '@codemirror/lang-java';
import { jsxLanguage, tsxLanguage } from '@codemirror/lang-javascript';
import { jsonLanguage } from '@codemirror/lang-json';
import { lessLanguage } from '@codemirror/lang-less';
import { markdownLanguage } from '@codemirror/lang-markdown';
import { phpLanguage } from '@codemirror/lang-php';
import { pythonLanguage } from '@codemirror/lang-python';
import { rustLanguage } from '@codemirror/lang-rust';
import { sassLanguage } from '@codemirror/lang-sass';
import { StandardSQL } from '@codemirror/lang-sql';
import { wastLanguage } from '@codemirror/lang-wast';
import { xmlLanguage } from '@codemirror/lang-xml';
import { yamlLanguage } from '@codemirror/lang-yaml';
import { Language, LanguageSupport, LRLanguage, StreamLanguage } from '@codemirror/language';
import { cmake } from '@codemirror/legacy-modes/mode/cmake';
import { cobol } from '@codemirror/legacy-modes/mode/cobol';
import { coffeeScript } from '@codemirror/legacy-modes/mode/coffeescript';
import { commonLisp } from '@codemirror/legacy-modes/mode/commonlisp';
import { crystal } from '@codemirror/legacy-modes/mode/crystal';
import { dockerFile } from '@codemirror/legacy-modes/mode/dockerfile';
import { elm } from '@codemirror/legacy-modes/mode/elm';
import { erlang } from '@codemirror/legacy-modes/mode/erlang';
import { fortran } from '@codemirror/legacy-modes/mode/fortran';
import { gherkin } from '@codemirror/legacy-modes/mode/gherkin';
import { go } from '@codemirror/legacy-modes/mode/go';
import { haskell } from '@codemirror/legacy-modes/mode/haskell';
import { haxe } from '@codemirror/legacy-modes/mode/haxe';
import { http } from '@codemirror/legacy-modes/mode/http';
import { julia } from '@codemirror/legacy-modes/mode/julia';
import { lua } from '@codemirror/legacy-modes/mode/lua';
import { mathematica } from '@codemirror/legacy-modes/mode/mathematica';
import { nginx } from '@codemirror/legacy-modes/mode/nginx';
import { pascal } from '@codemirror/legacy-modes/mode/pascal';
import { pegjs } from '@codemirror/legacy-modes/mode/pegjs';
import { perl } from '@codemirror/legacy-modes/mode/perl';
import { pig } from '@codemirror/legacy-modes/mode/pig';
import { powerShell } from '@codemirror/legacy-modes/mode/powershell';
import { protobuf } from '@codemirror/legacy-modes/mode/protobuf';
import { puppet } from '@codemirror/legacy-modes/mode/puppet';
import { r } from '@codemirror/legacy-modes/mode/r';
import { ruby } from '@codemirror/legacy-modes/mode/ruby';
import { scheme } from '@codemirror/legacy-modes/mode/scheme';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { smalltalk } from '@codemirror/legacy-modes/mode/smalltalk';
import { sparql } from '@codemirror/legacy-modes/mode/sparql';
import { stex } from '@codemirror/legacy-modes/mode/stex';
import { swift } from '@codemirror/legacy-modes/mode/swift';
import { textile } from '@codemirror/legacy-modes/mode/textile';
import { toml } from '@codemirror/legacy-modes/mode/toml';
import { vb } from '@codemirror/legacy-modes/mode/vb';
import { vbScript } from '@codemirror/legacy-modes/mode/vbscript';
import { verilog } from '@codemirror/legacy-modes/mode/verilog';
import { clojureLanguage } from '@nextjournal/lang-clojure';
import { csharpLanguage } from '@replit/codemirror-lang-csharp';
import { brainfuckLanguage } from 'codemirror-lang-brainfuck';

export type TextEditorLanguage =
  | 'javascript'
  | 'typescript'
  | 'cpp'
  | 'html'
  | 'java'
  | 'markdown'
  | 'php'
  | 'python'
  | 'rust'
  | 'sql'
  | 'xml'
  | 'less'
  | 'sass'
  | 'clojure'
  | 'csharp'
  | 'json'
  | 'latex'
  | 'brainfuck'
  | 'css'
  | 'yaml'
  | 'wast'
  | 'lua'
  | 'ruby'
  | 'cmake'
  | 'cobol'
  | 'coffeescript'
  | 'common-lisp'
  | 'crystal'
  | 'dockerfile'
  | 'elm'
  | 'erlang'
  | 'fortran'
  | 'gherkin'
  | 'go'
  | 'haskell'
  | 'haxe'
  | 'http'
  | 'julia'
  | 'mathematica'
  | 'nginx'
  | 'pascal'
  | 'pegjs'
  | 'perl'
  | 'pig'
  | 'powershell'
  | 'protobuf'
  | 'puppet'
  | 'r'
  | 'scheme'
  | 'shell'
  | 'smalltalk'
  | 'sparql'
  | 'swift'
  | 'textile'
  | 'toml'
  | 'vb'
  | 'vbscript'
  | 'verilog';

export const TEXT_EDITOR_LANGUAGE: Record<
  TextEditorLanguage,
  LanguageSupport | StreamLanguage<any> | LRLanguage | Language
> = {
  wast: wastLanguage,
  yaml: yamlLanguage,
  css: cssLanguage,
  javascript: jsxLanguage,
  typescript: tsxLanguage,
  cpp: cppLanguage,
  html: htmlLanguage,
  java: javaLanguage,
  markdown: markdownLanguage,
  php: phpLanguage,
  python: pythonLanguage,
  rust: rustLanguage,
  sql: StandardSQL.language,
  xml: xmlLanguage,
  less: lessLanguage,
  sass: sassLanguage,
  clojure: clojureLanguage,
  csharp: csharpLanguage,
  json: jsonLanguage,
  brainfuck: brainfuckLanguage,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  latex: StreamLanguage.define(stex),
  lua: StreamLanguage.define(lua),
  ruby: StreamLanguage.define(ruby),
  cmake: StreamLanguage.define(cmake),
  cobol: StreamLanguage.define(cobol),
  coffeescript: StreamLanguage.define(coffeeScript),
  'common-lisp': StreamLanguage.define(commonLisp),
  crystal: StreamLanguage.define(crystal),
  dockerfile: StreamLanguage.define(dockerFile),
  elm: StreamLanguage.define(elm),
  erlang: StreamLanguage.define(erlang),
  fortran: StreamLanguage.define(fortran),
  gherkin: StreamLanguage.define(gherkin),
  go: StreamLanguage.define(go),
  haskell: StreamLanguage.define(haskell),
  haxe: StreamLanguage.define(haxe),
  http: StreamLanguage.define(http),
  julia: StreamLanguage.define(julia),
  mathematica: StreamLanguage.define(mathematica),
  nginx: StreamLanguage.define(nginx),
  pascal: StreamLanguage.define(pascal),
  pegjs: StreamLanguage.define(pegjs),
  perl: StreamLanguage.define(perl),
  pig: StreamLanguage.define(pig),
  powershell: StreamLanguage.define(powerShell),
  protobuf: StreamLanguage.define(protobuf),
  puppet: StreamLanguage.define(puppet),
  r: StreamLanguage.define(r),
  scheme: StreamLanguage.define(scheme),
  shell: StreamLanguage.define(shell),
  smalltalk: StreamLanguage.define(smalltalk),
  sparql: StreamLanguage.define(sparql),
  swift: StreamLanguage.define(swift),
  textile: StreamLanguage.define(textile),
  toml: StreamLanguage.define(toml),
  vb: StreamLanguage.define(vb),
  vbscript: StreamLanguage.define(vbScript),
  verilog: StreamLanguage.define(verilog),
};
