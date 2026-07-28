import {create} from "zustand"
import { ExpenseInput, ExpenseStore } from "./useExpenseStore.types"
import { keysToCamelCase } from "@/lib/app.helpers";

export const useExpenseStore = create<ExpenseStore>( (set,get) => ({
    userExpenses : [],

    fetchExpenses : async()=>{
        try{
            const response = await fetch("/api/expense")
            const data = await response.json();
            const parsedData = keysToCamelCase(data.expenses)
            set({userExpenses : parsedData})
        }
        catch(error){
            console.log("Failed to Fetch Expense Items" , error)
        }
    },
 
    addExpenses : async(input : ExpenseInput)=>{
        try{
            const {title , category ,amount , expenseDate} = input || {}
            const response = await fetch("/api/expense", {
                method : "POST" , 
                headers : {"Content-Type" : 'application/json'},
                body : JSON.stringify({
                    title , category , amount , expenseDate
                })
            })
            const data = await response.json()
            set( (state)=>({
                userExpenses : [data.createExpenseItem, ...state.userExpenses]
            }) )
        }
        catch(error){
            console.log("Failed to Create Expense Item", error)
        }
    },


    updateExpenses: async( id:string ,input : ExpenseInput)=>{
        try{
            const {title , category, amount , expenseDate} = input || {}
            const response = await fetch(`/api/expense/${id}` , {
                method : "PATCH",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({
                    title , category , amount , expenseDate
                })
            })
            const data = await response.json()
            set( (state)=>({
                userExpenses : state.userExpenses.map((item)=>
                item.id === id ? data.updateExpenseItem : item,
                )
            }) )
        }catch(error){
            console.log("Failed to Update Item" , error)
        }
    },
    deleteExpenses : async(id : string)=>{
        try{
            await fetch(`/api/expense/${id}` , 
                {method : "DELETE"}
            )
        }catch(error){
            console.log("Failed To Delete Item" , error)
        }
    }

}) )