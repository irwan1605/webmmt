import React, { createContext, useContext } from "react";
import { FormProvider, Controller, useFormContext } from "react-hook-form";

const FieldContext = createContext(null);

export function Form({ children, ...form }) {
  // Pemakaian: <Form {...form}><form ...>...</form></Form>
  return <FormProvider {...form}>{children}</FormProvider>;
}

export function FormField({ name, render }) {
  const methods = useFormContext();
  return (
    <FieldContext.Provider value={name}>
      <Controller name={name} control={methods.control} render={render} />
    </FieldContext.Provider>
  );
}

export function FormItem({ className = "", ...props }) {
  return <div className={`space-y-2 ${className}`} {...props} />;
}

export function FormLabel({ className = "", children, ...props }) {
  const { error } = useFormFieldState();
  return (
    <label className={`text-sm font-medium ${error ? "text-red-500" : ""} ${className}`} {...props}>
      {children}
    </label>
  );
}

export function FormControl({ children }) {
  return children; // wrapper sederhana; biarkan child (Input/Textarea) yang render
}

export function FormMessage({ className = "" }) {
  const { error } = useFormFieldState();
  if (!error) return null;
  return <p className={`text-sm text-red-500 ${className}`}>{String(error.message || "Invalid value")}</p>;
}

// ----- helpers -----
function useFormFieldState() {
  const name = useContext(FieldContext);
  const { formState } = useFormContext();
  const error = name ? get(formState.errors, name) : undefined;
  return { name, error };
}

function get(obj, path) {
  return path?.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
}
