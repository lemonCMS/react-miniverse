// import typescript from '@rollup/plugin-typescript';
import typescript from "rollup-plugin-typescript2";
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import {terser} from "rollup-plugin-terser";
import pkg from "./package.json";
import nodeResolve from "@rollup/plugin-node-resolve";

const baseConfig = {
    input: "src/index.ts",
    plugins: [
        babel({
            exclude: "node_modules/**",
            babelHelpers: "bundled",
        }),
        nodeResolve(),
        typescript({ useTsconfigDeclarationDir: true }),
        commonjs({extensions: ['.js', '.ts']}), // the ".ts" extension is required
    ],
    external: [
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
                exports: "named",
                sourcemap: true
            }
        },
        baseConfig
    ),
    Object.assign(
        {
            output: {
                file: "cjs/index.min.js",
                format: "cjs",
                exports: "named",
                sourcemap: true
            }
        },
        minifyConfig
    ),
    Object.assign(
        {
            output: {
                file: "es/index.js",
                format: "esm",
                exports: "named",
                sourcemap: true
            }
        },
        baseConfig
    )
];