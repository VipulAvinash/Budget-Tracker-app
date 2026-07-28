import { ExpenseCategory, ExpenseItem, GenericStringMap, IToCamelCase, IKeysToCamelCase } from "@/store/useExpenseStore.types";

/**
 * Converts a snake_case or kebab-case string to camelCase.
 * Example: "expense_date" -> "expenseDate"
 */
export const toCamelCase: IToCamelCase = (str: string): string => {
    return str.replace(/([-_][a-z])/gi, ($1) =>
        $1.toUpperCase().replace('-', '').replace('_', '')
    );
};

/**
 * Recursively converts all object keys (and nested array elements) from snake_case to camelCase.
 */
export const keysToCamelCase: IKeysToCamelCase = <T = any>(obj: any): T => {
    if (Array.isArray(obj)) {
        return obj.map((v) => keysToCamelCase(v)) as unknown as T;
    } else if (obj !== null && typeof obj === "object" && obj.constructor === Object) {
        return Object.keys(obj).reduce((acc, key) => {
            const camelKey = toCamelCase(key);
            acc[camelKey] = keysToCamelCase(obj[key]);
            return acc;
        }, {} as GenericStringMap) as T;
    }
    return obj as T;
};

/**
 * Formats a number as Indian Rupee currency (e.g. 125000 -> "₹1,25,000.00")
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
    }).format(amount || 0);
}

/**
 * Safely parses any date string (including DD-MM-YYYY, YYYY-MM-DD, or ISO strings) into a JavaScript Date object.
 */
export function parseIndianDate(dateInput: string | Date): Date {
    if (!dateInput) return new Date();
    if (dateInput instanceof Date) return dateInput;

    if (typeof dateInput === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(dateInput)) {
        const [day, month, year] = dateInput.split('-').map(Number);
        return new Date(year, month - 1, day);
    }
    return new Date(dateInput);
}

/**
 * Formats a date string to Indian DD-MM-YYYY format (e.g. "28-07-2026")
 */
export function formatIndianDate(dateInput: string | Date): string {
    if (!dateInput) return '';

    if (typeof dateInput === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(dateInput)) {
        return dateInput;
    }

    const d = parseIndianDate(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
}

/**
 * Returns today's date in Indian DD-MM-YYYY format (e.g. "28-07-2026")
 */
export function getTodayIndianDate(): string {
    return formatIndianDate(new Date());
}

/**
 * Returns yesterday's date in Indian DD-MM-YYYY format (e.g. "27-07-2026")
 */
export function getYesterdayIndianDate(): string {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return formatIndianDate(d);
}

/**
 * Calculates total expenses for a specific year (defaults to current year)
 */
export function getYearlyTotal(expenses: ExpenseItem[], year = new Date().getFullYear()): number {
    if (!Array.isArray(expenses)) return 0;
    return expenses.reduce((sum, item) => {
        const itemYear = parseIndianDate(item.expenseDate).getFullYear();
        return itemYear === year ? sum + (Number(item.amount) || 0) : sum;
    }, 0);
}

/**
 * Calculates total expenses for current month and year
 */
export function getCurrentMonthTotal(
    expenses: ExpenseItem[],
    year = new Date().getFullYear(),
    month = new Date().getMonth()
): number {
    if (!Array.isArray(expenses)) return 0;
    return expenses.reduce((sum, item) => {
        const d = parseIndianDate(item.expenseDate);
        return d.getFullYear() === year && d.getMonth() === month ? sum + (Number(item.amount) || 0) : sum;
    }, 0);
}

/**
 * Returns icon and color details for each expense category
 */
export function getCategoryMeta(category: ExpenseCategory | string) {
    switch (category) {
        case "Food":
            return { icon: "fast-food", color: "#FF6B6B", bg: "rgba(255,107,107,0.15)" };
        case "Transport":
            return { icon: "car", color: "#4D96FF", bg: "rgba(77,150,255,0.15)" };
        case "Groceries":
            return { icon: "cart", color: "#6BCB77", bg: "rgba(107,203,119,0.15)" };
        case "Entertainment":
            return { icon: "film", color: "#FFD93D", bg: "rgba(255,217,61,0.15)" };
        case "Bills":
            return { icon: "receipt", color: "#9B51E0", bg: "rgba(155,81,224,0.15)" };
        default:
            return { icon: "wallet", color: "#584de8", bg: "rgba(88,77,232,0.15)" };
    }
}

/**
 * Calculates category breakdown percentages and totals for charts/graphs
 */
export function getCategoryBreakdown(expenses: ExpenseItem[]) {
    if (!Array.isArray(expenses) || expenses.length === 0) return [];

    const totals: Record<string, number> = {};
    let overallTotal = 0;

    expenses.forEach((item) => {
        const amt = Number(item.amount) || 0;
        totals[item.category] = (totals[item.category] || 0) + amt;
        overallTotal += amt;
    });

    return Object.entries(totals).map(([category, amount]) => {
        const meta = getCategoryMeta(category);
        const percentage = overallTotal > 0 ? Math.round((amount / overallTotal) * 100) : 0;
        return {
            category,
            amount,
            percentage,
            ...meta,
        };
    }).sort((a, b) => b.amount - a.amount);
}

/**
 * Gets recent N expenses sorted by date
 */
export function getRecentExpenses(expenses: ExpenseItem[], limit = 5): ExpenseItem[] {
    if (!Array.isArray(expenses)) return [];
    return [...expenses]
        .sort((a, b) => parseIndianDate(b.expenseDate).getTime() - parseIndianDate(a.expenseDate).getTime())
        .slice(0, limit);
}
