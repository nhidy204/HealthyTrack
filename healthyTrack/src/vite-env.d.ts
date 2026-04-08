/// <reference types="vite/client" />

declare module '*.css' {
  const css: Record<string, string>;
  export default css;
}

// declare module '*.module.css' {
//   const classes: Record<string, string>;
//   export default classes;
// }

// declare module '*.module.scss' {
//   const classes: Record<string, string>;
//   export default classes;
// }

// declare module '*.module.sass' {
//   const classes: Record<string, string>;
//   export default classes;
// }

// declare module '*.module.less' {
//   const classes: Record<string, string>;
//   export default classes;
// }
