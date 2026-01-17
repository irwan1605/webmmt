import * as React from "react";

export default function Button({ className = "", ...props }) {
  return (
    <button
      className={
        "inline-flex items-center justify-center rounded-xl bg-sky-500 px-4 py-2 text-white " +
        "hover:bg-sky-400 disabled:opacity-60 disabled:cursor-not-allowed " +
        className
      }
      {...props}
    />
  );
}
