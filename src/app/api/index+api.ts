import { createExpenseItem, getAllExpenses } from "@/lib/server/db-actions"
export async function GET(_request: Request) {
    try {
        const expenses = await getAllExpenses()
        return Response.json({ expenses })
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Fetch Items"
        return Response.json({ error, errorMessage })
    }
}


export async function POST(request : Request){
    try{
        const body = await request.json()
        const {title , category , amount , expense_date } = body || {}

        if(!title || !category || amount === undefined || expense_date === undefined){
            return Response.json({error : "Please fill all required fields" , status : 400})
        }

        const createdExpense = await createExpenseItem({
            title , category , amount , expense_date 
        })
        return Response.json({createdExpense , status : 201})
    }
    catch(error){
        const errorMessage = error instanceof Error ? error.message : "Failed To Create an Item"
        return Response.json({error , errorMessage})
    }
}