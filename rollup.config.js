// // rollup.config.js
// import typescript from '@rollup/plugin-typescript';
// import commonjs from '@rollup/plugin-commonjs';
//
// export default {
//   input: './src/index.ts',
//   output: {
//     dir: 'output',
//     format: 'cjs'
//   },
//   plugins: [
//     typescript({ module: 'CommonJS' }),
//     commonjs({ extensions: ['.js', '.ts'] }) // the ".ts" extension is required
//   ]
// };


import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import {terser} from "rollup-plugin-terser";
import pkg from "./package.json";

const minifyExtension = pathToFile => pathToFile.replace(/\.js$/, ".min.js");


const baseConfig = {
    input: "src/index.ts",
    plugins: [
        babel({
            exclude: "node_modules/**",
            babelHelpers: "bundled",
        }),
        typescript({module: 'CommonJS'}),
        commonjs({extensions: ['.js', '.ts']}), // the ".ts" extension is required
    ],
    external: [
        'rxjs/operators',
        ...Object.keys(pkg.dependencies),
        ...Object.keys(pkg.peerDependencies)
    ]
};

const minifyConfig = {
    ...baseConfig,
    plugins: [
        ...baseConfig.plugins,
        terser()
    ]
}

export default [
    Object.assign(
        {
            output: {
                file: "cjs/index.js",
                format: "cjs",
                exports: "default",
            }
        },
        baseConfig
    ),
    Object.assign(
        {
            output: {
                file: "cjs/index.min.js",
                format: "cjs",
                exports: "default",
            }
        },
        minifyConfig
    ),
    Object.assign(
        {
            output: {
                file: "es/index.js",
                format: "esm",
                exports: "default",
            }
        },
        baseConfig
    )
];