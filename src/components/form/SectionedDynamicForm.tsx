import { cn } from '@/lib/utils'
import { Copy, Plus, RotateCcw, Trash2 } from 'lucide-react'
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type JSX,
} from 'react'
import type { FieldValues } from 'react-hook-form'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import { Button } from './../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './../ui/card'
import { Separator } from './../ui/separator'
import DynamicForm, { type FormFieldConfig } from './DynamicForm'
import { type FormContextType } from './FormContext'

// Section configuration
export interface SectionConfig {
  title?: string
  description?: string
  fields: FormFieldConfig[]
  defaultValues?: Record<string, any>[] // Support array of default values for multiple sections
  minSections?: number
  maxSections?: number
  allowCopy?: boolean
  allowReset?: boolean
  collapsible?: boolean
  defaultCollapsed?: boolean
}

// Props for the sectioned form
interface SectionedDynamicFormProps<T extends FieldValues = FieldValues> {
  sectionConfig: SectionConfig
  schema: any
  onSubmit: (data: T[]) => void
  className?: string
  loading?: boolean
  submitButtonText?: string
  showResetAllButton?: boolean
  addButtonText?: string
  sectionTitlePrefix?: string
}

// Ref interface for external control
export interface SectionedFormContextType {
  addSection: (data?: Record<string, any>) => void
  removeSection: (index: number) => void
  resetSection: (index: number) => void
  resetAllSections: () => void
  getSectionData: (index: number) => Record<string, any> | null
  getAllSectionsData: () => Record<string, any>[]
  getSectionCount: () => number
  validateAllSections: () => Promise<boolean>
}

const SectionedDynamicForm = forwardRef<
  SectionedFormContextType,
  SectionedDynamicFormProps
>(
  <T extends FieldValues = FieldValues>(
    {
      sectionConfig,
      schema,
      onSubmit,
      className,
      loading = false,
      submitButtonText = 'Submit All',
      showResetAllButton = false,
      addButtonText = 'Add Section',
      sectionTitlePrefix = 'Section',
    }: SectionedDynamicFormProps<T>,
    ref: React.Ref<unknown> | undefined
  ) => {
    const [sections, setSections] = useState<
      Array<{ id: string; data: Record<string, any> }>
    >(() => {
      // Initialize sections based on defaultValues array
      if (
        Array.isArray(sectionConfig.defaultValues) &&
        sectionConfig.defaultValues.length > 0
      ) {
        return sectionConfig.defaultValues.map((defaultValue, index) => ({
          id: `section-${Date.now()}-${index}`,
          data: defaultValue || {},
        }))
      }
      // Fallback to single empty section if no default values provided
      return [
        {
          id: `section-${Date.now()}`,
          data: {},
        },
      ]
    })

    const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
      new Set(sectionConfig.defaultCollapsed ? [sections[0]?.id] : [])
    )

    const [isValidating, setIsValidating] = useState(false)

    const formRefs = useRef<{ [key: string]: FormContextType }>({})

    // Helper functions
    const generateSectionId = () =>
      `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const addSection = (data?: Record<string, any>) => {
      if (
        sectionConfig.maxSections &&
        sections.length >= sectionConfig.maxSections
      ) {
        return
      }

      const newSection = {
        id: generateSectionId(),
        data: data || {}, // Only use provided data, no default values for new sections
      }

      setSections((prev) => [...prev, newSection])
    }

    const removeSection = (index: number) => {
      if (
        sectionConfig.minSections &&
        sections.length <= sectionConfig.minSections
      ) {
        return
      }

      setSections((prev) => {
        const newSections = prev.filter((_, i) => i !== index)
        const removedId = prev[index]?.id
        if (removedId) {
          delete formRefs.current[removedId]
          setCollapsedSections((prevCollapsed) => {
            const newCollapsed = new Set(prevCollapsed)
            newCollapsed.delete(removedId)
            return newCollapsed
          })
        }
        return newSections
      })
    }

    const copySection = (index: number) => {
      const formRef = formRefs.current[sections[index].id]
      if (formRef) {
        const currentData = formRef.getFormValues()
        addSection(currentData)
      }
    }

    const resetSection = (index: number) => {
      const formRef = formRefs.current[sections[index].id]
      if (formRef) {
        formRef.resetForm()
      }

      // Reset to appropriate default values for this section only if defaults exist
      setSections((prev) =>
        prev.map((section, i) => {
          if (i === index) {
            let defaultData = {}
            if (
              Array.isArray(sectionConfig.defaultValues) &&
              sectionConfig.defaultValues.length > 0
            ) {
              // Use the default value for this section index, or the last one if we exceed the array
              const defaultIndex = Math.min(
                i,
                sectionConfig.defaultValues.length - 1
              )
              defaultData = sectionConfig.defaultValues[defaultIndex] || {}
            }
            // If no default values are configured, reset to empty object
            return { ...section, data: defaultData }
          }
          return section
        })
      )
    }

    const resetAllSections = () => {
      Object.values(formRefs.current).forEach((formRef) => {
        formRef?.resetForm()
      })

      setSections((prev) =>
        prev.map((section, index) => {
          let defaultData = {}
          if (
            Array.isArray(sectionConfig.defaultValues) &&
            sectionConfig.defaultValues.length > 0
          ) {
            // Use the default value for this section index, or the last one if we exceed the array
            const defaultIndex = Math.min(
              index,
              sectionConfig.defaultValues.length - 1
            )
            defaultData = sectionConfig.defaultValues[defaultIndex] || {}
          }
          // If no default values are configured, reset to empty object
          return {
            ...section,
            data: defaultData,
          }
        })
      )
    }

    const toggleSectionCollapse = (sectionId: string) => {
      setCollapsedSections((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(sectionId)) {
          newSet.delete(sectionId)
        } else {
          newSet.add(sectionId)
        }
        return newSet
      })
    }

    const getSectionData = (index: number) => {
      const formRef = formRefs.current[sections[index]?.id]
      return formRef ? formRef.getFormValues() : null
    }

    const getAllSectionsData = () => {
      return sections.map((section) => {
        const formRef = formRefs.current[section.id]
        return formRef ? formRef.getFormValues() : section.data
      })
    }

    const validateAllSections = async () => {
      const validationPromises = sections.map((section) => {
        const formRef = formRefs.current[section.id]
        return formRef ? formRef.validateForm() : Promise.resolve(true)
      })

      const results = await Promise.all(validationPromises)
      return results.every((result) => result)
    }

    const handleSubmitAll = async () => {
      // Validate all sections before submitting
      setIsValidating(true)

      try {
        const isValid = await validateAllSections()

        if (!isValid) {
          console.log('Validation failed for one or more sections')
          // Optionally show an error toast or alert here
          return
        }

        const allData = getAllSectionsData()
        onSubmit(allData as T[])
      } catch (error) {
        console.error('Error during validation:', error)
      } finally {
        setIsValidating(false)
      }
    }

    // Expose methods via ref
    useImperativeHandle(
      ref,
      (): SectionedFormContextType => ({
        addSection,
        removeSection,
        resetSection,
        resetAllSections,
        getSectionData,
        getAllSectionsData,
        getSectionCount: () => sections.length,
        validateAllSections,
      })
    )

    if (loading) {
      return (
        <div className={cn('space-y-6', className)}>
          <div className="flex justify-between items-center">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-28 bg-gray-200 rounded animate-pulse" />
          </div>
          {Array.from({ length: 2 }).map((_, i) => (
            <Card
              key={i}
              className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-6 w-24 bg-gray-200 rounded" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="space-y-2">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-10 w-full bg-gray-200 rounded" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }

    return (
      <div className={cn('space-y-6', className)}>
        {/* Header with Add Button */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            {sectionConfig.title && (
              <h2 className="text-lg font-semibold">{sectionConfig.title}</h2>
            )}
            {sectionConfig.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {sectionConfig.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {showResetAllButton && sections.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset All Sections</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reset all sections to their default values. This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={resetAllSections}>
                      Reset All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <Button
              onClick={() => addSection()}
              disabled={
                sectionConfig.maxSections
                  ? sections.length >= sectionConfig.maxSections
                  : false
              }
              size="sm">
              <Plus className="w-4 h-4 mr-2" />
              {addButtonText}
            </Button>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, index) => {
            const isCollapsed = collapsedSections.has(section.id)
            const canRemove =
              !sectionConfig.minSections ||
              sections.length > sectionConfig.minSections

            return (
              <Card
                key={section.id}
                className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {sectionConfig.collapsible && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSectionCollapse(section.id)}
                          className="h-6 w-6 p-0">
                          <span
                            className={cn(
                              'text-lg transition-transform',
                              isCollapsed ? 'rotate-0' : 'rotate-90'
                            )}>
                            ▶
                          </span>
                        </Button>
                      )}
                      <CardTitle className="text-base">
                        {sectionTitlePrefix} {index + 1}
                      </CardTitle>
                    </div>

                    <div className="flex items-center gap-1">
                      {sectionConfig.allowCopy && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copySection(index)}
                          className="h-8 w-8 p-0"
                          title="Copy section">
                          <Copy className="w-4 h-4" />
                        </Button>
                      )}

                      {sectionConfig.allowReset !== false && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => resetSection(index)}
                          className="h-8 w-8 p-0"
                          title="Reset section">
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      )}

                      {canRemove && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSection(index)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          title="Remove section">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {!isCollapsed && (
                  <CardContent className="pt-0">
                    <DynamicForm
                      ref={(formRef: FormContextType | null) => {
                        if (formRef) {
                          formRefs.current[section.id] = formRef
                        }
                      }}
                      formConfig={sectionConfig.fields}
                      schema={schema}
                      defaultValues={section.data}
                      onSubmit={() => {}} // Individual sections don't submit
                      customSubmitButton={<></>} // Hide submit button for individual sections
                    />
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>

        {/* Global Submit */}
        {sections.length > 0 && (
          <>
            <Separator />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitAll}
                disabled={loading || isValidating}
                loading={loading || isValidating}>
                {isValidating ? 'Validating...' : submitButtonText}
              </Button>
            </div>
          </>
        )}
      </div>
    )
  }
)

SectionedDynamicForm.displayName = 'SectionedDynamicForm'

export default SectionedDynamicForm as unknown as <T extends FieldValues>(
  props: SectionedDynamicFormProps<T> & {
    ref?: React.ForwardedRef<SectionedFormContextType>
  }
) => JSX.Element
