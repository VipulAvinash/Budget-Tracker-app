export type ExpenseCategory = "Food" | "Transport" | "Groceries" | "Entertainment" | "Bills"

export type ExpenseItem = {
    id: string,
    title: string,
    category: ExpenseCategory,
    amount: number,
    expenseDate: string
}

export type ExpenseResponse = { expenses: ExpenseItem }

export type ExpenseInput = {
    title: string,
    category: ExpenseCategory,
    amount: number,
    expenseDate: string
}

export type ExpenseStore = {
    userExpenses: ExpenseItem[],
    fetchExpenses:  () => Promise<void>,
    addExpenses:    ( input : ExpenseInput ) => Promise<void>,
    updateExpenses: ( id: string , input : ExpenseInput ) => Promise<void>,
    deleteExpenses: ( id : string ) => Promise<void>
}

export type MonthData = {
    label : string ,
    value : number ,
    monthIndex : number
}

export type GenericStringMap<T = any> = {
    [key: string]: T
}

export type IToCamelCase = (key: string) => string

export type IKeysToCamelCase = <T = any>(obj: any) => T