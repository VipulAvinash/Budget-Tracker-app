import { GenericStringMap, IToCamelCase, IKeysToCamelCase } from "@/store/useExpenseStore.types";

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
 * Handles objects, arrays, and primitive values safely.
 *
 * Example:
 *   keysToCamelCase({ expense_date: "2026-07-28" })
 *   // Returns: { expenseDate: "2026-07-28" }
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


