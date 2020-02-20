import babel from 'rollup-plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import gzipPlugin from 'rollup-plugin-gzip';
import scss from 'rollup-plugin-scss';
import { eslint } from 'rollup-plugin-eslint';
import { uglify } from 'rollup-plugin-uglify';

import packageJson from './package.json';

export default [
  {
    input: 'src/emailsEditor.js',
    output: {
      file: packageJson.browser,
      name: 'emailsEditor',
      format: 'umd',
      sourcemap: true
    },
    plugins: [
      scss({
        output: 'dist/bundle/css/bundle.css'
      }),
      eslint(),
      babel({
        exclude: 'node_modules/**',
        presets: ['@babel/preset-env']
      }),
      uglify({
        compress: {
          toplevel: true,
          drop_console: true
        }
      }),
      gzipPlugin()
    ]
  },
  {
    input: 'src/emailsEditor.js',
    output: {
      file: packageJson.main,
      name: 'emailsEditor',
      format: 'umd',
      sourcemap: true
    },
    plugins: [
      scss({
        output: 'dist/bundle/css/bundle.min.css',
        outputStyle: 'compressed',
        sourceMap: true
      }),
      eslint(),
      babel({
        exclude: 'node_modules/**',
        presets: ['@babel/preset-env']
      }),
      cleanup(),
      gzipPlugin()
    ]
  }
];
