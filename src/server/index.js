require("@babel/register")({
  plugins: [
    [
      "module-resolver",
      {
        root: ["src"]
      }
    ],
    "@babel/plugin-transform-runtime"
  ],
  presets: ["@babel/env"],
  sourceMaps: "inline",
  retainLines: true
});

module.exports = require("./app");
