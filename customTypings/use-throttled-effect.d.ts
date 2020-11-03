// Note: adapted from https://github.com/DefinitelyTyped/DefinitelyTyped/blob/d1e5d808965b05cb549ed0b8c71f90ed6f464ebf/types/sql.js/module.d.ts
// latest version form sql.js does not seem to be supported
declare module "use-throttled-effect" {
  let useThrottledEffect : (fn : () => any, throttleMs : number, dependencies : any[]) => void;
  export = useThrottledEffect;
}
