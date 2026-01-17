import * as React from "react";

const Textarea = React.forwardRef(({ className = "", ...props }, ref) => (
  <textarea
    ref={ref}
    className={
      "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none " +
      "focus:border-sky-400 focus:ring-2 focus:ring-sky-200 " +
      className
    }
    {...props}
  />
));
Textarea.displayName = "Textarea";
export default Textarea;
