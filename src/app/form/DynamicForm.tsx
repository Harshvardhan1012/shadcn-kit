"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileTextIcon } from "@/components/ui/icons"; // Assuming you have these icons
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import {
  DefaultValues,
  FieldValues,
  Path,
  PathValue,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import * as z from "zod";

export interface FormFieldConfig {
  name: string; // Keep as string for config, will be cast to Path<T>
  label: string;
  description?: string;
  className?: string; // Add className option for custom styling
  type:
    | "text"
    | "password"
    | "email"
    | "number"
    | "file"
    | "checkbox"
    | "date"
    | "radio"
    | "select"
    | "textarea"
    | "combobox"
    | "multiselect"
    | "switch";
  validation?: z.ZodTypeAny;
  options?: { value: string; label: string; icon?: React.ElementType }[]; // For radio, select, combobox
  placeholder?: string;
  icon?: React.ElementType;
  fileConfig?: {
    accept?: string;
    multiple?: boolean;
  };
}

interface DynamicFormProps<T extends FieldValues> {
  formConfig: FormFieldConfig[];
  onSubmit: SubmitHandler<T>;
  defaultValues?: DefaultValues<T>; // Use DefaultValues<T>
  schema: z.ZodObject<any, any, any>;
  customSubmitButton?: React.ReactNode;
}

const DynamicForm = <T extends FieldValues>({
  formConfig,
  onSubmit,
  defaultValues,
  schema,
  customSubmitButton,
}: DynamicFormProps<T>) => {
  const form = useForm<T>({
    resolver: zodResolver(schema) as any, // Using 'as any' for now to bypass complex resolver type
    defaultValues: defaultValues,
  });

  const [filePreviews, setFilePreviews] = useState<
    Record<string, string | ArrayBuffer | null>
  >({});

  const renderField = (fieldConfig: FormFieldConfig) => {
    const {
      name,
      label,
      description,
      className,
      type,
      options,
      placeholder,
      icon: FieldIcon,
      fileConfig,
    } = fieldConfig;
    const fieldName = name as Path<T>; // Cast name to Path<T>

    switch (type) {
      case "text":
      case "password":
      case "email":
      case "number":
        return (
          <FormField
            key={name}
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem className={className}>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    {FieldIcon && (
                      <FieldIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    )}
                    <Input
                      {...field}
                      id={name}
                      type={type}
                      placeholder={placeholder}
                      className={cn(FieldIcon ? "pl-10" : "", className)}
                      onChange={(e) => {
                        const val =
                          type === "number"
                            ? parseFloat(e.target.value)
                            : e.target.value;
                        field.onChange(val as PathValue<T, Path<T>>);
                      }}
                    />
                  </div>
                </FormControl>
                {description && (
                  <FormDescription>{description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "file":
        return (
          <FormField
            key={name}
            control={form.control}
            name={fieldName}
            render={({ field }) => {
              const currentFile = field.value as File | null | undefined;
              return (
                <FormItem className={className}>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      {filePreviews[name] ? (
                        <Image
                          width={40}
                          height={40}
                          src={filePreviews[name] as string}
                          alt="Preview"
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : FieldIcon ? (
                        <FieldIcon className="h-10 w-10 text-gray-400" />
                      ) : (
                        <FileTextIcon className="h-10 w-10 text-gray-400" />
                      )}
                      <Input
                        id={name}
                        type="file"
                        accept={fileConfig?.accept}
                        multiple={fileConfig?.multiple}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        className={cn("flex-1", className)}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file as PathValue<T, Path<T>>); // Pass file to RHF
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFilePreviews((prev) => ({
                                ...prev,
                                [name]: reader.result,
                              }));
                            };
                            reader.readAsDataURL(file);
                          } else {
                            setFilePreviews((prev) => ({
                              ...prev,
                              [name]: null,
                            }));
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  {currentFile && !fileConfig?.multiple && currentFile.name && (
                    <FormDescription>
                      Selected file: {currentFile.name}
                    </FormDescription>
                  )}
                  {description && (
                    <FormDescription>{description}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        );
      case "checkbox":
        return (
          <FormField
            key={name}
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem
                className={cn(
                  "flex flex-row items-start space-x-3 space-y-0 rounded-md p-4",
                  className
                )}
              >
                <FormControl>
                  <Checkbox
                    id={name}
                    checked={field.value as boolean}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{label}</FormLabel>
                  {description && (
                    <FormDescription>{description}</FormDescription>
                  )}
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        );
      case "date":
        return (
          <FormField
            key={name}
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem className={className}>
                <FormLabel>{label}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                          className
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(new Date(field.value as string), "PPP")
                        ) : (
                          <span>{placeholder || "Pick a date"}</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        field.value
                          ? new Date(field.value as string)
                          : undefined
                      }
                      onSelect={(date) =>
                        field.onChange(
                          date?.toISOString() as PathValue<T, Path<T>>
                        )
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {description && (
                  <FormDescription>{description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "radio":
        return (
          <FormField
            key={name}
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem className={className}>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) =>
                      field.onChange(value as PathValue<T, Path<T>>)
                    }
                    defaultValue={field.value as string}
                    className={cn("flex flex-col space-y-1", className)}
                  >
                    {options?.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`${name}-${option.value}`}
                        />
                        <FormLabel htmlFor={`${name}-${option.value}`}>
                          {option.icon && (
                            <option.icon className="mr-2 inline-block h-4 w-4" />
                          )}{" "}
                          {option.label}
                        </FormLabel>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                {description && (
                  <FormDescription>{description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "select":
        return (
          <FormField
            key={name}
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem className={className}>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value as PathValue<T, Path<T>>)
                    }
                    defaultValue={field.value as string}
                  >
                    <SelectTrigger className={className}>
                      <SelectValue
                        placeholder={
                          placeholder || `Select ${label.toLowerCase()}`
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.icon && (
                            <option.icon className="mr-2 inline-block h-4 w-4" />
                          )}{" "}
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                {description && (
                  <FormDescription>{description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "textarea":
        return (
          <FormField
            key={name}
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem className={className}>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    id={name}
                    placeholder={placeholder}
                    className={cn(className)}
                  />
                </FormControl>
                {description && (
                  <FormDescription>{description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "combobox":
        return (
          <FormField
            key={name}
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem className={className}>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value as PathValue<T, Path<T>>)
                    }
                    defaultValue={field.value as string}
                  >
                    <SelectTrigger className={className}>
                      <SelectValue
                        placeholder={
                          placeholder || `Select ${label.toLowerCase()}`
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.icon && (
                            <option.icon className="mr-2 inline-block h-4 w-4" />
                          )}{" "}
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                {description && (
                  <FormDescription>{description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "switch":
        return (
          <FormField
            key={name}
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem
                className={cn(
                  "flex flex-row items-center justify-between rounded-lg border p-4",
                  className
                )}
              >
                <div className="space-y-0.5">
                  <FormLabel>{label}</FormLabel>
                  {description && (
                    <FormDescription>{description}</FormDescription>
                  )}
                </div>
                <FormControl>
                  <Checkbox
                    id={name}
                    checked={field.value as boolean}
                    onCheckedChange={field.onChange}
                    className={cn("data-[state=checked]:bg-primary", className)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "multiselect":
        return (
          <FormField
            key={name}
            control={form.control}
            name={fieldName}
            render={({ field }) => {
              const selectedValues = (field.value as string[]) || [];

              return (
                <FormItem className={className}>
                  <FormLabel>{label}</FormLabel>
                  <div className="space-y-2">
                    <FormControl>
                      <div className="rounded-md border border-input p-2">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {selectedValues.map((value) => {
                            const option = options?.find(
                              (opt) => opt.value === value
                            );
                            return option ? (
                              <div
                                key={value}
                                className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1"
                              >
                                {option.icon && (
                                  <option.icon className="h-3 w-3" />
                                )}
                                {option.label}
                                <button
                                  type="button"
                                  className="ml-1 rounded-full hover:bg-destructive/20"
                                  onClick={() => {
                                    field.onChange(
                                      selectedValues.filter(
                                        (v) => v !== value
                                      ) as PathValue<T, Path<T>>
                                    );
                                  }}
                                >
                                  <span className="sr-only">Remove</span>
                                  <span className="h-3 w-3 flex items-center justify-center">
                                    ×
                                  </span>
                                </button>
                              </div>
                            ) : null;
                          })}
                        </div>
                        <div className="flex flex-col gap-2">
                          {options?.map((option) => (
                            <div
                              key={option.value}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`${name}-${option.value}`}
                                checked={selectedValues.includes(option.value)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([
                                      ...selectedValues,
                                      option.value,
                                    ] as PathValue<T, Path<T>>);
                                  } else {
                                    field.onChange(
                                      selectedValues.filter(
                                        (v) => v !== option.value
                                      ) as PathValue<T, Path<T>>
                                    );
                                  }
                                }}
                              />
                              <label
                                htmlFor={`${name}-${option.value}`}
                                className="text-sm cursor-pointer flex items-center"
                              >
                                {option.icon && (
                                  <option.icon className="mr-2 h-4 w-4" />
                                )}{" "}
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                  </div>
                  {description && (
                    <FormDescription>{description}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        );
      default:
        return <p key={name}>Unsupported field type: {type}</p>;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {formConfig.map(renderField)}
        {customSubmitButton ? (
          customSubmitButton
        ) : (
          <Button type="submit">Submit</Button>
        )}
      </form>
    </Form>
  );
};

export default DynamicForm;
