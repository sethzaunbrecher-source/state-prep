//import React, { useState } from "react"
import { supabase } from "../database/Supabase"
import { sortQuestions } from "./sortQuestions"


interface Question {
    id: number,
    created_at: string,
    questionText: string,
    correctAnswerId: string,
    quizId: number,
    answers: {
        id: number,
        qId: number,
        text: string,
        choiceId: string
    }[],
    quizzes: { quizName: string }
}

let fetchError:string|null
let questions:Question[]|undefined


export const fetchQuestions = async (questionIds: number[]|undefined) => {
    
    if(questionIds){
       const { data, error } = await supabase
       .from("questions")
       .select('*,answers(*),quizzes("quizName")')
       .in("id", questionIds)
       
       if (error) {
           fetchError="could not fetch question"
           questions=undefined
           console.error(error)
        }
        
        if (data) {
            const sortedData = sortQuestions(questionIds, data)
            questions=sortedData
            fetchError=null
        }
    }

    return { error: fetchError, data: questions }
}