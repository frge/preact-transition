import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import {uglify} from 'rollup-plugin-uglify';
import less from 'rollup-plugin-less';
import Prefix from 'less-plugin-autoprefix';
import {version} from './package.json';
import {readFileSync, writeFileSync} from 'fs';

const banner =
  '/*!\n' +
  ' * preact-transition v' + version + '\n' +
  ' * (c) 2018 Yingqin Zhang\n' +
  ' * Released under the MIT License.\n' +
  ' */';

const plugins = [
  buble({jsx: 'h'}),
  resolve({extensions: ['.js', '.jsx', '.json']}),
  commonjs(),
];

let readmeThisPackage = false;

function example() {
  return {
    input: `src/examples/main.jsx`,
    external: ['preact'],
    output: {
      file: `examples/bundle.js`,
      format: 'iife',
      globals: {'preact': 'preact'},
      banner
    },
    plugins: [
      less({
        output: `examples/bundle.css`,
        plugins: [new Prefix({browsers: ["last 2 versions"]})]
      }),
      ...plugins
    ]
  }
}

function dist(type, min) {
  let subext;
  let format;

  switch (type) {
    case 'esm':
      subext = '.esm';
      format = 'es';
      break;

    case 'umd':
      subext = min ? '.min' : '';
      format = 'umd';
      break;

    default:
      subext = '.' + type;
      format = 'iife';
  }

  return  {
    input: 'src/index.js',
    external: ['preact'],
    output: {
      file: `dist/transition${subext}.js`,
      format,
      name: 'preactTransition',
      globals: {'preact': 'preact'},
      banner
    },
    plugins: [
      buble({jsx: 'h'}),
      resolve({
        jsnext: format === 'umd',// 该属性是指定将Node包转换为ES2015模块
        extensions: ['.js', '.jsx', '.json'],
        browser: true
      }),
      commonjs(),
      min && uglify(),
      {
        name: 'md',
        transformBundle(code) {
          if (readmeThisPackage) return code;
          readmeThisPackage = true;
          writeFileSync('./README.md', readFileSync('./src/doc.md', 'utf8')
            .replace(/\bVERSION\b/g, version));
          return code;
        },
      }
    ].filter(Boolean)
  }
}

export default [
  dist('esm'),
  dist('umd'),
  dist('umd', true),
  example(),
];
