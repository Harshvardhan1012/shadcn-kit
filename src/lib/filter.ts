export function applyFilter(data: any, filter: any) {
  const { id, value, operator, variant } = filter
  if (variant === "text") {
    if (operator === "iLike")
      return data[id]?.toLowerCase().includes((value || "").toLowerCase())
    if (operator === "notILike")
      return !data[id]?.toLowerCase().includes((value || "").toLowerCase())
    if (operator === "eq") return data[id] === value
    if (operator === "ne") return data[id] !== value
    if (operator === "isEmpty") return !data[id]
    if (operator === "isNotEmpty") return !!data[id]
  }
  if (variant === "multiSelect") {
    const normalize = (v: any) => {
      if (typeof v === "string") {
        const s = v.trim().toLowerCase()
        if (s === "true") return true
        if (s === "false") return false
        return s
      }
      return v
    }

    const dataVal = normalize(data[id])

    if (operator === "inArray") {
      if (!Array.isArray(value)) return false
      const normalized = value.map(normalize)
      return normalized.includes(dataVal)
    }
    if (operator === "notInArray") {
      if (!Array.isArray(value)) return true
      const normalized = value.map(normalize)
      return !normalized.includes(dataVal)
    }
    if (operator === "isEmpty") return dataVal == null || dataVal === ""
    if (operator === "isNotEmpty") return !(dataVal == null || dataVal === "")
  }
  if (variant === "number") {
    if (operator === "eq") return data[id] == value
    if (operator === "ne") return data[id] !== value
    if (operator === "lt") return data[id] < value
    if (operator === "lte") return data[id] <= value
    if (operator === "gt") return data[id] > value
    if (operator === "gte") return data[id] >= value
    if (operator === "isEmpty") return data[id] == null
    if (operator === "isNotEmpty") return data[id] != null
  }
  if (variant === "array") {
    const arr = data[id]
    if (!Array.isArray(arr)) return false

    if (operator === "inArray") {
      if (!Array.isArray(value)) return false
      return value.some((v) => arr.includes(v))
    }

    if (operator === "inAll") {
      if (!Array.isArray(value)) return false
      return arr.every((v) => value.includes(v))
    }

    if (operator === "notInArray") {
      if (!Array.isArray(value)) return false
      return value.every((v) => !arr.includes(v))
    }

    if (operator === "isEmpty") {
      return !arr || arr.length === 0
    }

    if (operator === "isNotEmpty") {
      return arr.length > 0
    }
  }
  if (variant === "boolean") {
    if (operator === "eq") return data[id].toString().toLowerCase() === value
    if (operator === "ne") return data[id].toString().toLowerCase() !== value
  }
  if (variant === "dateRange") {
    const target = data[id]
    if (!target) return false

    // Parse the target date (from data)
    const targetDate = new Date(target)
    if (isNaN(targetDate.getTime())) return false // invalid date

    // Reset time part to compare only dates
    const targetDateOnly = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate()
    )
    const targetTime = targetDateOnly.getTime()

    // Helper to get start and end of day
    const getStartOfDay = (date: Date) => {
      const d = new Date(date)
      d.setHours(0, 0, 0, 0)
      return d
    }

    const getEndOfDay = (date: Date) => {
      const d = new Date(date)
      d.setHours(23, 59, 59, 999)
      return d
    }

    // Helper to check if date is in range
    const isDateInRange = (start: Date, end: Date) => {
      const startTime = getStartOfDay(start).getTime()
      const endTime = getEndOfDay(end).getTime()
      return targetTime >= startTime && targetTime <= endTime
    }

    // Handle new interval operators
    if (operator === "isToday") {
      const today = getStartOfDay(new Date())
      return targetTime === today.getTime()
    }

    if (operator === "isYesterday") {
      const yesterday = getStartOfDay(new Date())
      yesterday.setDate(yesterday.getDate() - 1)
      return targetTime === yesterday.getTime()
    }

    if (operator === "isThisWeek") {
      const now = new Date()
      const startOfWeek = getStartOfDay(new Date(now))
      startOfWeek.setDate(now.getDate() - now.getDay()) // Sunday
      const endOfWeek = getEndOfDay(new Date(startOfWeek))
      endOfWeek.setDate(startOfWeek.getDate() + 6) // Saturday
      return isDateInRange(startOfWeek, endOfWeek)
    }

    if (operator === "isThisMonth") {
      const now = new Date()
      const startOfMonth = getStartOfDay(
        new Date(now.getFullYear(), now.getMonth(), 1)
      )
      const endOfMonth = getEndOfDay(
        new Date(now.getFullYear(), now.getMonth() + 1, 0)
      )
      return isDateInRange(startOfMonth, endOfMonth)
    }

    if (operator === "isThisQuarter") {
      const now = new Date()
      const quarter = Math.floor(now.getMonth() / 3)
      const startOfQuarter = getStartOfDay(
        new Date(now.getFullYear(), quarter * 3, 1)
      )
      const endOfQuarter = getEndOfDay(
        new Date(now.getFullYear(), quarter * 3 + 3, 0)
      )
      return isDateInRange(startOfQuarter, endOfQuarter)
    }

    if (operator === "isThisYear") {
      const now = new Date()
      const startOfYear = getStartOfDay(new Date(now.getFullYear(), 0, 1))
      const endOfYear = getEndOfDay(new Date(now.getFullYear(), 11, 31))
      return isDateInRange(startOfYear, endOfYear)
    }

    if (operator === "lastNDays") {
      const n = parseInt(value as string)
      if (isNaN(n)) return false
      const now = new Date()
      const startDate = getStartOfDay(new Date(now))
      startDate.setDate(now.getDate() - n)
      const endDate = getEndOfDay(new Date())
      return isDateInRange(startDate, endDate)
    }

    if (operator === "nextNDays") {
      const n = parseInt(value as string)
      if (isNaN(n)) return false
      const now = new Date()
      const startDate = getStartOfDay(new Date())
      const endDate = getEndOfDay(new Date(now))
      endDate.setDate(now.getDate() + n)
      return isDateInRange(startDate, endDate)
    }

    if (operator === "lastNWeeks") {
      const n = parseInt(value as string)
      if (isNaN(n)) return false
      const now = new Date()
      const startDate = getStartOfDay(new Date(now))
      startDate.setDate(now.getDate() - n * 7)
      const endDate = getEndOfDay(new Date())
      return isDateInRange(startDate, endDate)
    }

    if (operator === "lastNMonths") {
      const n = parseInt(value as string)
      if (isNaN(n)) return false
      const now = new Date()
      const startDate = getStartOfDay(new Date(now))
      startDate.setMonth(now.getMonth() - n)
      const endDate = getEndOfDay(new Date())
      return isDateInRange(startDate, endDate)
    }

    if (operator === "lastNYears") {
      const n = parseInt(value as string)
      if (isNaN(n)) return false
      const now = new Date()
      const startDate = getStartOfDay(new Date(now))
      startDate.setFullYear(now.getFullYear() - n)
      const endDate = getEndOfDay(new Date())
      return isDateInRange(startDate, endDate)
    }

    if (operator === "eq") {
      // value is timestamp (e.g., 1751308200000)
      const valueDate = new Date(+value)
      if (isNaN(valueDate.getTime())) return false
      const valueDateOnly = new Date(
        valueDate.getFullYear(),
        valueDate.getMonth(),
        valueDate.getDate()
      )
      return targetTime === valueDateOnly.getTime()
    }

    if (operator === "ne") {
      const valueDate = new Date(+value)
      if (isNaN(valueDate.getTime())) return false
      const valueDateOnly = new Date(
        valueDate.getFullYear(),
        valueDate.getMonth(),
        valueDate.getDate()
      )
      return targetTime !== valueDateOnly.getTime()
    }

    if (operator === "lt") {
      const valueDate = new Date(+value)
      if (isNaN(valueDate.getTime())) return false
      const valueDateOnly = new Date(
        valueDate.getFullYear(),
        valueDate.getMonth(),
        valueDate.getDate()
      )
      return targetTime < valueDateOnly.getTime()
    }

    if (operator === "gt") {
      const valueDate = new Date(+value)
      if (isNaN(valueDate.getTime())) return false
      const valueDateOnly = new Date(
        valueDate.getFullYear(),
        valueDate.getMonth(),
        valueDate.getDate()
      )
      return targetTime > valueDateOnly.getTime()
    }

    if (operator === "lte") {
      const valueDate = new Date(+value)
      if (isNaN(valueDate.getTime())) return false
      const valueDateOnly = new Date(
        valueDate.getFullYear(),
        valueDate.getMonth(),
        valueDate.getDate()
      )
      return targetTime <= valueDateOnly.getTime()
    }

    if (operator === "gte") {
      const valueDate = new Date(+value)
      if (isNaN(valueDate.getTime())) return false
      const valueDateOnly = new Date(
        valueDate.getFullYear(),
        valueDate.getMonth(),
        valueDate.getDate()
      )
      return targetTime >= valueDateOnly.getTime()
    }

    if (operator === "isBetween") {
      if (!Array.isArray(value) || value.length !== 2) return false
      const [start, end] = value

      const startDate = new Date(+start)
      const endDate = new Date(+end)

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return false

      // Reset time part for start and end dates
      const startDateOnly = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      )
      const endDateOnly = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
      )

      return (
        targetTime >= startDateOnly.getTime() &&
        targetTime <= endDateOnly.getTime()
      )
    }

    // if (operator === "isRelativeToToday") {
    //     // value is the offset from today (in days), e.g., 0 = today, -1 = yesterday
    //     if (typeof value !== "number") return false;

    //     const today = new Date();
    //     today.setHours(0, 0, 0, 0);

    //     const compareDate = new Date(today);
    //     compareDate.setDate(today.getDate() + value);

    //     return targetTime === compareDate.getTime();
    // }

    if (operator === "isEmpty") {
      return !target
    }

    if (operator === "isNotEmpty") {
      return !!target
    }
  }
  return true
}

export function getFilterFields(columns: any[]) {
  if (!columns) return []
  return columns
    .map(
      (item: { enableColumnFilter: any; accessorKey: any }) =>
        item.enableColumnFilter && item.accessorKey
    )
    .filter((item) => item)
}
