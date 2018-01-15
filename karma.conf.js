"use strict";

const env = process.env.NODE_ENV;
const coverage = env === "coverage";

module.exports = function(config) {
  config.set({
    browsers: process.env.TRAVIS ? ["ChromeTravisCI"] : ["ChromeHeadless"],
    frameworks: ["jasmine"],
    files: coverage ? ["src/**/*.js"] : ["src/**/*.test.js"],
    exclude: [
      "src/**/*.stories.js"
    ],
    preprocessors: {
      [coverage ? "src/**/*.js" : "src/**/*.test.js"]: ["rollup"]
    },
    reporters: ["progress"].concat(env === "coverage" ? ["coverage"] : []),
    autoWatch: false,
    singleRun: true,
    rollupPreprocessor: {
      plugins: [
        require("rollup-plugin-babel")({
          exclude: "node_modules/**"
        }),
        require("rollup-plugin-node-resolve")(),
        require("rollup-plugin-commonjs")()
      ],
      output: {
        name: "Reactgram",
        format: "iife",
        sourcemap: "inline"
      }
    },
    coverageReporter: {
      type: "lcov"
    },
    customLaunchers: {
      ChromeTravisCI: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox"]
      }
    }
  });
};
