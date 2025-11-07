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
    if (operator === "inArray")
      return Array.isArray(value) ? value.includes(data[id]) : false
    if (operator === "notInArray")
      return Array.isArray(value) ? !value.includes(data[id]) : true
    if (operator === "isEmpty") return !data[id]
    if (operator === "isNotEmpty") return !!data[id]
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

    console.log("Filtering date:", {
      target,
      targetDate,
      targetDateOnly,
      operator,
      value,
    })

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
