import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export interface TabItem {
  name: string
  value: string
  content: React.ReactNode
  disabled?: boolean
}

interface TabWrapperProps {
  tabs: TabItem[]
  defaultValue?: string
  className?: string
  tabListClassName?: string
  tabTriggerClassName?: string
  tabContentClassName?: string
  onValueChange?: (value: string) => void
}

export function TabWrapper({
  tabs,
  defaultValue,
  className,
  tabListClassName,
  tabTriggerClassName,
  tabContentClassName,
  onValueChange,
}: TabWrapperProps) {
  return (
    <div className={cn('w-full', className)}>
      <Tabs
        defaultValue={defaultValue || tabs[0]?.value}
        className="gap-4"
        onValueChange={onValueChange}>
        <TabsList
          className={cn(
            'bg-background rounded-none border-b p-0',
            tabListClassName
          )}>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              disabled={tab.disabled}
              className={cn(
                'bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground hover:border-muted-foreground/30 h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none',
                tabTriggerClassName
              )}>
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className={cn(tabContentClassName)}>
            {typeof tab.content === 'string' ? (
              <p className="text-muted-foreground text-sm">{tab.content}</p>
            ) : (
              tab.content
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
