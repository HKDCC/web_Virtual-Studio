import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  { ignores: ["scripts/**/*.cjs", ".next/**", ".open-next/**", "node_modules/**"] },
  ...nextVitals,
  ...nextTypescript,
];

export default eslintConfig;
