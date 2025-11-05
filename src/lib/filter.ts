export function applyFilter(data: any, filter: any) {
    const { id, value, operator, variant } = filter;
    if (variant === "text") {
        if (operator === "iLike") return data[id]?.toLowerCase().includes((value || "").toLowerCase());
        if (operator === "notILike") return !data[id]?.toLowerCase().includes((value || "").toLowerCase());
        if (operator === "eq") return data[id] === value;
        if (operator === "ne") return data[id] !== value;
        if (operator === "isEmpty") return !data[id];
        if (operator === "isNotEmpty") return !!data[id];
    }
    if (variant === "multiSelect") {
        if (operator === "inArray") return Array.isArray(value) ? value.includes(data[id]) : false;
        if (operator === "notInArray") return Array.isArray(value) ? !value.includes(data[id]) : true;
        if (operator === "isEmpty") return !data[id];
        if (operator === "isNotEmpty") return !!data[id];
    }
    if (variant === "number") {
        if (operator === "eq") return data[id] == value;
        if (operator === "ne") return data[id] !== value;
        if (operator === "lt") return data[id] < value;
        if (operator === "lte") return data[id] <= value;
        if (operator === "gt") return data[id] > value;
        if (operator === "gte") return data[id] >= value;
        if (operator === "isEmpty") return data[id] == null;
        if (operator === "isNotEmpty") return data[id] != null;
    }
    if (variant === "array") {
        const arr = data[id];
        if (!Array.isArray(arr)) return false;

        if (operator === "inArray") {
            if (!Array.isArray(value)) return false;
            return value.some(v => arr.includes(v));
        }

        if (operator === "inAll") {
            if (!Array.isArray(value)) return false;
            return arr.every(v => value.includes(v));
        }

        if (operator === "notInArray") {
            if (!Array.isArray(value)) return false;
            return value.every(v => !arr.includes(v));
        }

        if (operator === "isEmpty") {
            return !arr || arr.length === 0;
        }

        if (operator === "isNotEmpty") {
            return arr.length > 0;
        }
    }
    if (variant === "boolean") {
        if (operator === "eq") return data[id].toString().toLowerCase() === value;
        if (operator === "ne") return data[id].toString().toLowerCase() !== value;
    }
    if (variant === "dateRange") {
        const target = data[id];
        if (!target) return false;

        const date = new Date(target);
        if (isNaN(date.getTime())) return false; // invalid date

        const targetTime = date.getTime();

        const targetDate = new Date(data[id]);
        if (isNaN(targetDate.getTime())) return false;

        const valueDate = new Date(+value); // value is timestamp (e.g., 1751308200000)
        if (isNaN(valueDate.getTime())) return false;

        if (operator === "eq") {
            return targetDate.toDateString() === valueDate.toDateString();
        }

        if (operator === "ne") {
            return targetDate.toDateString() !== valueDate.toDateString();
        }

        if (operator === "lt") {
            return targetTime < value;
        }

        if (operator === "gt") {
            return targetTime > value;
        }

        if (operator === "lte") {
            return targetTime <= value;
        }

        if (operator === "gte") {
            return targetTime >= value;
        }

        if (operator === "isBetween") {
            if (!Array.isArray(value) || value.length !== 2) return false;
            const [start, end] = value;
            return targetTime >= start && targetTime <= end;
        }

        // if (operator === "isRelativeToToday") {
        //     // value is the offset from today (in days), e.g., 0 = today, -1 = yesterday
        //     if (typeof value !== "number") return false;

        //     const today = new Date();
        //     today.setHours(0, 0, 0, 0);

        //     const compareDate = new Date(today);
        //     compareDate.setDate(today.getDate() + value);

        //     return date.toDateString() === compareDate.toDateString();
        // }

        if (operator === "isEmpty") {
            return !target;
        }

        if (operator === "isNotEmpty") {
            return !!target;
        }
    }
    return true;
}

export function getFilterFields(columns: any[]) {
    if(!columns) return [];
    return columns.map((item: { enableColumnFilter: any; accessorKey: any; }) => item.enableColumnFilter && item.accessorKey).filter(item => item);
}