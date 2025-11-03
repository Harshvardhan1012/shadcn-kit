import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import ExcelJS from 'exceljs'
import {
  AlertCircle,
  CheckCircle2,
  CloudUpload,
  Download,
  X,
} from 'lucide-react'
import * as React from 'react'
import * as XLSX from 'xlsx'
import { z } from 'zod'
import { FormFieldType } from '../form/DynamicForm'
import type {
  BulkUploadResult,
  ExcelColumnConfig,
  ExcelTemplate,
  ValidationError,
} from './master-table'

interface BulkUploadSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: ExcelTemplate
  schema: z.ZodSchema<any>
  onUpload?: (data: any[]) => Promise<void>
  emptyRowCount?: number // Number of empty rows to add (default: 10)
}

export function BulkUploadSheet({
  open,
  onOpenChange,
  template,
  schema,
  onUpload,
  emptyRowCount = 10,
}: BulkUploadSheetProps) {
  const [file, setFile] = React.useState<File | null>(null)
  const [uploadResult, setUploadResult] =
    React.useState<BulkUploadResult | null>(null)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Function to format Zod error messages in a user-friendly way
  const formatZodError = (
    error: z.ZodError,
    row: any,
    rowIndex: number
  ): ValidationError[] => {
    const errors: ValidationError[] = []

    error.issues.forEach((issue: any) => {
      const columnKey = issue.path.join('.') || 'unknown'
      const value = issue.path.length > 0 ? row[issue.path[0]] : undefined

      // Find the label for this column key
      const columnConfig = template.columns.find((col) => col.key === columnKey)
      const columnLabel = columnConfig ? columnConfig.label : columnKey

      let message = issue.message
      let expected: string | undefined

      // Enhanced error messages based on error type
      switch (issue.code) {
        case 'invalid_type':
          message = `Expected ${issue.expected}, received ${issue.received}`
          break

        case 'invalid_value':
        case 'invalid_enum_value':
          if (issue.options && Array.isArray(issue.options)) {
            expected = issue.options.join(', ')
            message = `Invalid value`
          }
          break

        case 'too_small':
          if (issue.type === 'string') {
            message = `Must be at least ${issue.minimum} characters`
          } else if (issue.type === 'number') {
            message = `Must be at least ${issue.minimum}`
          } else if (issue.type === 'array') {
            message = `Must contain at least ${issue.minimum} item(s)`
          } else {
            message = `Value too small (minimum: ${issue.minimum})`
          }
          break

        case 'too_big':
          if (issue.type === 'string') {
            message = `Must be at most ${issue.maximum} characters`
          } else if (issue.type === 'number') {
            message = `Must be at most ${issue.maximum}`
          } else if (issue.type === 'array') {
            message = `Must contain at most ${issue.maximum} item(s)`
          } else {
            message = `Value too big (maximum: ${issue.maximum})`
          }
          break

        case 'invalid_format':
        case 'invalid_string':
          if (issue.validation === 'email' || issue.format === 'email') {
            message = 'Invalid email format'
          } else if (issue.validation === 'url' || issue.format === 'url') {
            message = 'Invalid URL format'
          } else if (issue.validation === 'uuid' || issue.format === 'uuid') {
            message = 'Invalid UUID format'
          }
          break

        case 'custom':
          message = issue.message || 'Validation failed'
          break
      }

      errors.push({
        row: rowIndex + 2, // +2 because Excel is 1-indexed and row 1 is header
        column: columnLabel, // Use label instead of key
        message,
        value,
        expected,
      })
    })

    return errors
  }

  // Generate Excel template with dropdown support using ExcelJS
  const handleDownloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook()

    // Main sheet
    const sheet = workbook.addWorksheet('Data Template')

    // Hidden lookup sheet for dropdown options
    const lookupSheet = workbook.addWorksheet('Lookups')

    // Track which columns have dropdowns
    const dropdownColumns: Map<number, ExcelColumnConfig> = new Map()

    // Set up columns in main sheet
    sheet.columns = template.columns.map((col, index) => {
      if (col.dropdownOptions && col.dropdownOptions.length > 0) {
        dropdownColumns.set(index, col)
      }
      return {
        header: col.label,
        key: col.key,
        width: col.width || 20,
      }
    })

    // Populate lookup sheet with dropdown options (showing labels, storing label-value mapping)
    let lookupColumnIndex = 1
    const dropdownRanges: Map<number, string> = new Map()

    dropdownColumns.forEach((col, colIndex) => {
      if (!col.dropdownOptions) return

      // Add headers for label and value columns
      lookupSheet.getCell(1, lookupColumnIndex).value = `${col.key}_label`
      lookupSheet.getCell(1, lookupColumnIndex + 1).value = `${col.key}_value`

      // Add dropdown options (labels in column A, values in column B)
      col.dropdownOptions.forEach((option, rowIndex) => {
        lookupSheet.getCell(rowIndex + 2, lookupColumnIndex).value =
          option.label
        lookupSheet.getCell(rowIndex + 2, lookupColumnIndex + 1).value =
          option.value
      })

      // Store the range for this dropdown (using labels for display)
      const lastRow = col.dropdownOptions.length + 1
      const columnLetter = String.fromCharCode(64 + lookupColumnIndex) // A, B, C, etc.
      dropdownRanges.set(
        colIndex,
        `Lookups!$${columnLetter}$2:$${columnLetter}$${lastRow}`
      )

      lookupColumnIndex += 2 // Move to next pair of columns
    })

    // Hide the lookup sheet
    lookupSheet.state = 'veryHidden'

    // Add empty rows for user input (no sample data)
    for (let i = 0; i < emptyRowCount; i++) {
      sheet.addRow({})
    }

    // Apply data validation to all columns based on type
    const totalRows = emptyRowCount + 1 // +1 for header

    template.columns.forEach((col, colIndex) => {
      const columnLetter = String.fromCharCode(65 + colIndex) // A, B, C, etc.

      // Apply validation to all data rows (skip header)
      for (let row = 2; row <= totalRows; row++) {
        const cell = sheet.getCell(`${columnLetter}${row}`)

        // Apply dropdown validation for columns with dropdownOptions
        if (col.dropdownOptions && col.dropdownOptions.length > 0) {
          const range = dropdownRanges.get(colIndex)
          if (range) {
            cell.dataValidation = {
              type: 'list',
              allowBlank: true,
              formulae: [range],
              showErrorMessage: true,
              errorStyle: 'error',
              errorTitle: 'Invalid Entry',
              error: `Please select a value from the dropdown list`,
            }
          }
        }
        // Apply validation based on field type
        else if (col.type) {
          switch (col.type) {
            case FormFieldType.NUMBER:
              cell.dataValidation = {
                type: 'decimal',
                operator: 'greaterThanOrEqual',
                showErrorMessage: true,
                allowBlank: true,
                formulae: [-999999999], // Allow any number
                errorStyle: 'error',
                errorTitle: 'Invalid Number',
                error: 'Please enter a valid number',
              }
              // Set number format
              cell.numFmt = '0'
              break

            case FormFieldType.DATE:
              cell.dataValidation = {
                type: 'date',
                operator: 'greaterThan',
                showErrorMessage: true,
                allowBlank: true,
                formulae: [new Date(1900, 0, 1)], // Allow dates after 1900
                errorStyle: 'error',
                errorTitle: 'Invalid Date',
                error: 'Please enter a valid date (e.g., 2024-01-15)',
              }
              // Set date format
              cell.numFmt = 'yyyy-mm-dd'
              break

            case FormFieldType.DATETIME:
              cell.dataValidation = {
                type: 'date',
                operator: 'greaterThan',
                showErrorMessage: true,
                allowBlank: true,
                formulae: [new Date(1900, 0, 1)],
                errorStyle: 'error',
                errorTitle: 'Invalid DateTime',
                error: 'Please enter a valid date and time',
              }
              // Set datetime format
              cell.numFmt = 'yyyy-mm-dd hh:mm:ss'
              break

            case FormFieldType.TEXT:
            case FormFieldType.TEXTAREA:
              cell.dataValidation = {
                type: 'textLength',
                operator: 'greaterThanOrEqual',
                showErrorMessage: true,
                allowBlank: true,
                formulae: [0],
                errorStyle: 'warning',
                errorTitle: 'Invalid Text',
                error: 'Please enter text',
              }
              break
          }
        }
      }
    })

    // Generate file name with timestamp
    const fileName = `bulk_upload_template_${new Date().getTime()}.xlsx`
    // Write file
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    // Download file
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setUploadResult(null)
    setIsProcessing(true)

    try {
      // Read the file
      const data = await selectedFile.arrayBuffer()
      const workbook = XLSX.read(data)

      // Get first worksheet
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]

      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json<any>(worksheet)

      // Create label-to-value mapping for dropdown columns
      const labelToValueMap: Map<string, Map<string, string>> = new Map()

      template.columns.forEach((col) => {
        if (col.dropdownOptions && col.dropdownOptions.length > 0) {
          const mapping = new Map<string, string>()
          col.dropdownOptions.forEach((opt) => {
            mapping.set(opt.label, opt.value) // Map "Site 1" → "1"
          })
          labelToValueMap.set(col.key, mapping)
        }
      })

      // Helper function to convert Excel date serial number to JavaScript Date
      const excelDateToJSDate = (serial: number): Date => {
        // Excel date serial starts from 1900-01-01
        const excelEpoch = new Date(1899, 11, 30) // December 30, 1899
        const days = Math.floor(serial)
        const milliseconds = Math.round((serial - days) * 86400000) // Convert fractional part to milliseconds
        return new Date(excelEpoch.getTime() + days * 86400000 + milliseconds)
      }

      // Helper function to format date
      const formatDate = (date: Date, includeTime: boolean = false): string => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')

        if (includeTime) {
          const hours = String(date.getHours()).padStart(2, '0')
          const minutes = String(date.getMinutes()).padStart(2, '0')
          const seconds = String(date.getSeconds()).padStart(2, '0')
          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        }

        return `${year}-${month}-${day}`
      }

      // Validate and process rows
      const validRows: any[] = []
      const errors: ValidationError[] = []

      jsonData.forEach((row, index) => {
        // Transform row: convert labels to values for dropdown columns
        const transformedRow: any = {}

        template.columns.forEach((col) => {
          let cellValue = row[col.label] // Excel uses column labels as keys

          // Handle date/datetime fields - Excel stores dates as numbers
          if (
            cellValue !== undefined &&
            cellValue !== null &&
            cellValue !== ''
          ) {
            if (
              col.type === FormFieldType.DATE ||
              col.type === FormFieldType.DATETIME
            ) {
              // Check if value is a number (Excel date serial)
              if (typeof cellValue === 'number') {
                const jsDate = excelDateToJSDate(cellValue)
                cellValue = formatDate(
                  jsDate,
                  col.type === FormFieldType.DATETIME
                )
              }
              // If it's already a string in date format, keep it
              else if (typeof cellValue === 'string') {
                // Try to parse and reformat to ensure consistent format
                const parsedDate = new Date(cellValue)
                if (!isNaN(parsedDate.getTime())) {
                  cellValue = formatDate(
                    parsedDate,
                    col.type === FormFieldType.DATETIME
                  )
                }
              }
            }
          }

          // If this column has dropdown options, convert label to value
          if (col.dropdownOptions && col.dropdownOptions.length > 0) {
            const mapping = labelToValueMap.get(col.key)
            if (mapping && cellValue) {
              // Try to find the value for this label (e.g., "Site 1" → "1")
              const mappedValue = mapping.get(String(cellValue))
              transformedRow[col.key] = mappedValue || cellValue
            } else {
              transformedRow[col.key] = cellValue
            }
          } else {
            // For non-dropdown columns, just use the value directly
            transformedRow[col.key] = cellValue
          }
        })

        // Check if all required columns exist
        const missingColumns = template.columns.filter(
          (col) =>
            !(col.key in transformedRow) &&
            transformedRow[col.key] === undefined
        )

        if (missingColumns.length > 0) {
          missingColumns.forEach((col) => {
            errors.push({
              row: index + 2, // +2 because Excel is 1-indexed and row 1 is header
              column: col.label, // Use label instead of key
              message: 'Missing required column',
            })
          })
        }

        // Validate using Zod schema
        const result = schema.safeParse(transformedRow)
        console.log(jsonData, transformedRow)

        if (!result.success) {
          const zodErrors = formatZodError(result.error, transformedRow, index)
          errors.push(...zodErrors)
        } else {
          // If validation passes, add to valid rows
          validRows.push(result.data)
        }
      })

      setUploadResult({
        success: errors.length === 0,
        validRows,
        errors,
        totalRows: jsonData.length,
        validCount: validRows.length,
        errorCount: errors.length,
      })
    } catch (error) {
      console.error('Error processing file:', error)
      setUploadResult({
        success: false,
        validRows: [],
        errors: [
          {
            row: 0,
            column: 'File',
            message: 'Failed to process file. Please check the format.',
          },
        ],
        totalRows: 0,
        validCount: 0,
        errorCount: 1,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUpload = async () => {
    if (!uploadResult || !onUpload || uploadResult.validRows.length === 0)
      return

    setIsUploading(true)
    try {
      await onUpload(uploadResult.validRows)
      // Reset and close on success
      setFile(null)
      setUploadResult(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      onOpenChange(false)
    } catch (error) {
      console.error('Error uploading data:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setUploadResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl px-4 py-10 overflow-y-auto">
        <SheetHeader className="relative flex flex-row justify-center">
          <div>
            <SheetTitle className="flex items-center gap-2">
              Bulk Upload
            </SheetTitle>
            <SheetDescription>
              Upload your Excel file with data to import multiple records at
              once.
            </SheetDescription>
          </div>
          {/* Template Download Button - Top Right */}
          <Button
            onClick={handleDownloadTemplate}
            variant="outline"
            size="sm">
            {' '}
            <Download className="mr-2 h-3 w-3" />
            Download Template
          </Button>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          {/* Upload Area */}
          <div className="space-y-3">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative cursor-pointer border-2 border-dashed rounded-lg p-8 hover:border-primary/50 transition-colors bg-muted/20">
              <div className="flex flex-col items-center justify-center gap-3 text-center">
                <CloudUpload className="size-8 text-primary" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {file ? file.name : 'Click to upload Excel file'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supported format: .xlsx
                  </p>
                </div>
                {file && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleReset()
                    }}
                    variant="ghost"
                    size="sm"
                    className="mt-2">
                    <X className="h-4 w-4 mr-1" />
                    Remove File
                  </Button>
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Processing indicator */}
          {isProcessing && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Processing...</AlertTitle>
              <AlertDescription>
                Validating your Excel file. Please wait.
              </AlertDescription>
            </Alert>
          )}

          {/* Upload Results */}
          {uploadResult && !isProcessing && (
            <div className="space-y-4">
              {/* Summary */}
              <Alert variant={uploadResult.success ? 'default' : 'destructive'}>
                {uploadResult.success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {uploadResult.success
                    ? 'Validation Successful'
                    : 'Validation Errors Found'}
                </AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-1">
                    <p>Total Rows: {uploadResult.totalRows}</p>
                    <p className="text-green-600 dark:text-green-400">
                      Valid Rows: {uploadResult.validCount}
                    </p>
                    {uploadResult.errorCount > 0 && (
                      <p className="text-red-600 dark:text-red-400">
                        Errors: {uploadResult.errorCount}
                      </p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>

              {/* Error Details */}
              {uploadResult.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Error Details:</h4>
                  <div className="border rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">Row</TableHead>
                          <TableHead className="w-32">Column</TableHead>
                          <TableHead>Error</TableHead>
                          <TableHead className="w-40">Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {uploadResult.errors.map((error, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium text-center">
                              {error.row}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {error.column}
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="text-sm text-red-600 dark:text-red-400">
                                  {error.message}
                                </p>
                                {error.expected && (
                                  <p className="text-xs text-muted-foreground">
                                    Expected: {error.expected}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-xs">
                              <code className="px-2 py-1 bg-muted rounded text-xs">
                                {error.value !== undefined &&
                                error.value !== null
                                  ? String(error.value)
                                  : '-'}
                              </code>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Upload Button */}
              {uploadResult.validCount > 0 && (
                <div className="pt-4 border-t">
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full">
                    {isUploading ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <CloudUpload className="mr-2 h-4 w-4" />
                        Upload {uploadResult.validCount} Valid Row
                        {uploadResult.validCount !== 1 ? 's' : ''}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
