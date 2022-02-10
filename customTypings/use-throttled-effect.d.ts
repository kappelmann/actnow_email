declare module "use-throttled-effect" {
  let useThrottledEffect : (fn : () => any, throttleMs : number, dependencies : any[]) => void;
  export = useThrottledEffect;
}
