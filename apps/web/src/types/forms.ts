export type FormFieldType = "date" | "number" | "text";

export type FormField = {
  name: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
};

export type FormConfig = {
  id: string;
  title: string;
  fields: FormField[];
};

export type FormValues = Record<string, string>;
