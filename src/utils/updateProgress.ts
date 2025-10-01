import { supabase } from "../database/Supabase"


export const handleUpdateProgress = async (curQues: number, questionArray:number[], answers:string[], quizId:number,correct:number[],incorrect:number[],attemptId:number) => {
    //const questionArray: Number[] = questionIds()
    //setIsLoading(true)

    const { data, error } = await supabase
        .from('saved_attempts')
        .update([
            {
                currentQuestion: curQues,
                questions: questionArray,
                prevAnswers: answers,
                quizId: quizId,
                correctQuestions: correct,
                incorrectQuestions: incorrect
            }
        ])
        .eq('id', attemptId)
        .select()


    if (error) {
        console.error('Error inserting data:', error.message);
        //setFetchError(error.message)
        //setIsLoading(false)
    }
    if (data) {
        //setFetchError(null)
        return data
        console.log(data)
        //setIsLoading(false)

    }
}