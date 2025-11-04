import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to format date
export const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC", // force UTC, no shift
    })
  } catch {
    return dateString
  }
}

let buttonClickHandler:
  | ((id: string, isValid: boolean, values: any, form: any) => void)
  | null = null
let globalFormInstance: any = null // Store global form instance for reset functionality

export function setButtonClickHandler(
  handler: (id: string, isValid: boolean, values: any, form: any) => void
) {
  buttonClickHandler = handler
}

export function setGlobalFormInstance(formInstance: any) {
  globalFormInstance = formInstance
}

export function invokeButtonClickHandler(
  id: string,
  isValid: boolean,
  values: any,
  form: any
) {
  if (buttonClickHandler) {
    buttonClickHandler(id, isValid, values, form)
  } else {
    console.warn("No button click handler set.")
  }
}

let tableActionHandler:
  | ((actionId: string, value: any, row: any) => void)
  | null = null

export function setTableActionHandler(
  handler: (actionId: string, value: any, row: any) => void
) {
  tableActionHandler = handler
}

export function invokeTableActionHandler(
  actionId: string,
  value: any,
  row: any
) {
  if (tableActionHandler) {
    tableActionHandler(actionId, value, row?.original)
  } else {
    console.warn("No table action handler set.")
  }
}

let actionClickHandler: ((action: string, row: any) => void) | null = null

export function setActionClickHandler(
  handler: (actionId: string, row: any) => void
) {
  actionClickHandler = handler
}

export function invokeActionClickHandler(action: string, row: any) {
  if (actionClickHandler) {
    actionClickHandler(action, row?.original)
  } else {
    console.warn("No table action handler set.")
  }
}

let checkedClickHandler:
  | ((action: string, value: any, row: any) => void)
  | null = null

export function setCheckedClickHandler(
  handler: (actionId: string, value: any, row: any) => void
) {
  checkedClickHandler = handler
}

export function invokeCheckedClickHandler(
  action: string,
  value: any,
  row: any
) {
  if (checkedClickHandler) {
    checkedClickHandler(action, value, row)
  } else {
    console.warn("No table action handler set.")
  }
}

let formFieldOnChangeHandler:
  | ((field: string, value: any, form_value: any) => void)
  | null = null

export function setFormFieldOnChangeHandler(
  handler: (field: string, value: any, form_value: any) => void
) {
  formFieldOnChangeHandler = handler
}

export function invokeFormFieldOnChangeHandler(
  field: string,
  value: any,
  form_value: any
) {
  if (formFieldOnChangeHandler) {
    formFieldOnChangeHandler(field, value, form_value)
  } else {
    console.warn("No table action handler set.")
  }
}

export function updateFormFieldConfig(
  formConfig: { sections: any[] },
  sectionId: any,
  fieldName: any,
  updates: { config: any }
) {
  const updatedConfig = {
    ...formConfig,
    sections: formConfig.sections.map((section: any) => {
      if (section.id !== sectionId) return section

      return {
        ...section,
        fields: section.fields.map((field: any) => {
          if (field.name !== fieldName) return field

          return {
            ...field,
            ...updates,
            config: {
              ...field.config,
              ...updates.config, // nested config update if needed
            },
          }
        }),
      }
    }),
  }

  return updatedConfig
}

export function updateFormConfig(config: any, updates: any): any {
  return {
    ...config,
    ...updates,
  }
}

export function updateFormSectionConfig(
  config: any,
  sectionId: string,
  updates: any
): any {
  const updatedSections = config.sections.map((section: any) => {
    if (section.id === sectionId) {
      return {
        ...section,
        ...updates,
      }
    }
    return section
  })

  return {
    ...config,
    sections: updatedSections,
  }
}

/**
 * Automatically maps table row data to form fields based on form configuration
 * @param row - The table row data object
 * @param formConfig - The form configuration containing field definitions
 * @returns Object with form field names as keys and row data as values
 */
export function autoMapRowToFormFields(
  row: any,
  formConfig: any
): Record<string, any> {
  console.log("🔍 autoMapRowToFormFields called with:", { row, formConfig })

  const formData: Record<string, any> = {}

  return formData
}

/**
 * Validates that table data structure matches form configuration
 * @param sampleRow - A sample row from table data
 * @param formConfig - The form configuration
 * @returns Validation result with missing and extra fields
 */
export function validateTableFormAlignment(sampleRow: any, formConfig: any) {
  if (!formConfig?.sections || !sampleRow) {
    return { isValid: false, message: "Invalid input data" }
  }

  const formFields = new Set<string>()
  const tableFields = new Set(Object.keys(sampleRow))

  // Collect all form field names
  formConfig.sections.forEach((section: any) => {
    if (section.fields) {
      section.fields.forEach((field: any) => {
        if (field.name) {
          formFields.add(field.name)
        }
      })
    }
  })

  const missingInTable = Array.from(formFields).filter(
    (field) => !tableFields.has(field)
  )
  const extraInTable = Array.from(tableFields).filter(
    (field) => !formFields.has(field)
  )

  const result = {
    isValid: missingInTable.length === 0,
    formFields: Array.from(formFields),
    tableFields: Array.from(tableFields),
    missingInTable,
    extraInTable,
    message:
      missingInTable.length === 0
        ? "✅ Table and form structures are aligned"
        : `❌ Missing fields in table data: ${missingInTable.join(", ")}`,
  }

  console.log("🔍 Table-Form alignment check:", result)
  return result
}

/**
 * Enhanced setup function that uses automatic field mapping
 * @param formConfig - The form configuration object
 * @param setCurrentFormConfig - State setter for the form configuration
 * @param onSubmit - Optional custom submit handler
 */
export function setupMasterPageHandlersAuto(
  formConfig: any,
  setCurrentFormConfig: (updater: (prev: any) => any) => void,
  onSubmit?: (values: any) => void
) {
  // Button click handler
  setButtonClickHandler((id, isValid, values, form) => {
    console.log("🔁 GLOBAL handler", { id, isValid, values, form })

    if (id === "submit") {
      console.log("Form submitted with values:", values)

      // Call custom submit handler if provided
      if (onSubmit) {
        onSubmit(values)
      }

      // Close form after submission
      setCurrentFormConfig((prev) => ({
        ...prev,
        type: undefined,
        defaultValue: undefined,
      }))
    } else if (id === "edit") {
      console.log("Edit button clicked, switching to edit mode")
      setCurrentFormConfig((prev) => ({
        ...prev,
        type: "add", // Switch to add/edit mode to enable form editing
      }))
    } else if (id === "print") {
      console.log("Print button clicked, generating PDF...")

      // Generate and print PDF of the form
      const printWindow = window.open("", "_blank")
      if (!printWindow) {
        alert("Please allow popups to print the form")
        return
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${formConfig.title || "Form Data"}</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 20px; 
                    line-height: 1.6; 
                }
                .header { 
                    text-align: center; 
                    margin-bottom: 30px; 
                    border-bottom: 2px solid #333; 
                    padding-bottom: 20px; 
                }
                .section { 
                    margin-bottom: 25px; 
                    border: 1px solid #ddd; 
                    padding: 15px; 
                    border-radius: 5px; 
                }
                .section-title { 
                    font-weight: bold; 
                    font-size: 18px; 
                    margin-bottom: 15px; 
                    color: #333; 
                    border-bottom: 1px solid #eee; 
                    padding-bottom: 5px; 
                }
                .field { 
                    margin-bottom: 10px; 
                    display: flex; 
                    align-items: flex-start; 
                }
                .field-label { 
                    font-weight: bold; 
                    width: 200px; 
                    color: #555; 
                    margin-right: 15px; 
                }
                .field-value { 
                    flex: 1; 
                    word-wrap: break-word; 
                }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>${formConfig.title || "Form Data"}</h1>
                ${
                  formConfig.description
                    ? `<p>${formConfig.description}</p>`
                    : ""
                }
                <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            ${formConfig.sections
              .map(
                (section: any) => `
                <div class="section">
                    ${
                      section.title
                        ? `<div class="section-title">${section.title}</div>`
                        : ""
                    }
                    ${
                      section.fields
                        ? section.fields
                            .map(
                              (field: any) => `
                        <div class="field">
                            <div class="field-label">${
                              field.label || field.name
                            }:</div>
                            <div class="field-value">${
                              values[field.name] || "-"
                            }</div>
                        </div>
                    `
                            )
                            .join("")
                        : ""
                    }
                </div>
            `
              )
              .join("")}
        </body>
        </html>
      `

      printWindow.document.write(htmlContent)
      printWindow.document.close()

      // Wait for content to load then print
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 500)
    } else if (id === "reset") {
      console.log("Reset button clicked, resetting form to original values")

      // Reset form using the global form instance
      if (globalFormInstance) {
        console.log("Resetting form using global form instance")
        globalFormInstance.reset() // This will reset to the form's original defaultValues
      } else {
        console.warn("No global form instance available for reset")
      }
    }
  })

  // Action click handler (from table actions) with automatic mapping
  setActionClickHandler((type, row) => {
    console.log("🔍 Action click handler:", { type, row })

    if (type === "edit" || type === "view") {
      // Validate table-form alignment (only in development)
      // if (process.env.NODE_ENV === "development") {
      //   validateTableFormAlignment(row, formConfig)
      // }

      // Automatically map row data to form fields
      const formValue = autoMapRowToFormFields(row, formConfig)
      console.log("Auto-mapped table row to form:", { row, formValue, type })

      // setCurrentFormConfig((prev) => ({
      //   ...prev,
      //   type: type, // Set the correct type (edit or view)
      //   defaultValue: formValue,
      // }))
    }
  })
}

/**
 * Sets up common handlers for master pages with standard edit/view/add functionality
 * @param formConfig - The form configuration object
 * @param setCurrentFormConfig - State setter for the form configuration
 * @param fieldMapping - Function to map table row data to form field names
 * @param onSubmit - Optional custom submit handler
 */
export function setupMasterPageHandlers(
  setCurrentFormConfig: (updater: (prev: any) => any) => void,
  fieldMapping: (row: any) => Record<string, any>,
  onSubmit?: (values: any) => void
) {
  // Button click handler
  setButtonClickHandler((id, isValid, values, form) => {
    console.log("🔁 GLOBAL handler", { id, isValid, values, form })

    if (id === "submit") {
      console.log("Form submitted with values:", values)

      // Call custom submit handler if provided
      if (onSubmit) {
        onSubmit(values)
      }

      // Close form after submission
      setCurrentFormConfig((prev) => ({
        ...prev,
        type: undefined,
        defaultValue: undefined,
      }))
    } else if (id === "edit") {
      console.log("Edit button clicked, switching to edit mode")
      setCurrentFormConfig((prev) => ({
        ...prev,
        type: "add", // Switch to add/edit mode to enable form editing
      }))
    }
  })

  // Action click handler (from table actions)
  setActionClickHandler((type, row) => {
    if (type === "edit") {
      const formValue = fieldMapping(row)
      console.log("Mapping row data to form:", { row, formValue })

      setCurrentFormConfig((prev) => ({
        ...prev,
        type: "view", // Start in view mode
        defaultValue: formValue,
      }))
    }
  })
}

export function updateButtons(buttons: any, updates: any) {
  const ids = updates.map((item: { id: any }) => item.id)

  return buttons.map((item: { id: any }) => {
    const id = item.id
    if (ids.indexOf(id) > -1) {
      return {
        ...item,
        ...updates.find((uitem: { id: any }) => uitem.id === id),
      }
    } else {
      return item
    }
  })
}
