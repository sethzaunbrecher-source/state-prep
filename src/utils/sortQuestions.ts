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
    quizzes:{quizName:string, isNational:boolean}
}
 
 export const sortQuestions = (questionIds:number[], qs:Question[]|undefined)=>{
       
    //create new array to hold it temporarily
        let sortedArray:Question[]|any = []

        //loop through questionId array
        for(let i=0; i<questionIds.length; i++){
            const filteredId:Question[]|undefined=qs?.filter(q=>q.id===questionIds[i])
            if(filteredId){
                sortedArray=[...sortedArray, filteredId[0]]
            }
        }
        return sortedArray

    }
