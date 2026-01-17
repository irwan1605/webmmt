import * as React from "react";

const Input = React.forwardRef(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={
      "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none " +
      "focus:border-sky-400 focus:ring-2 focus:ring-sky-200 " +
      className
    }
    {...props}
  />
));
Input.displayName = "Input";
export default Input;
