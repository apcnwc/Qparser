// Copyright © 2024 apcnwc
// SPDX-License-Identifier: Apache-2.0

class PQuestion {
    constructor() {
        this.mid = "";

        this.text = "";
        this.category = "";

        this.imagePath = "";

        this.answers = [];
        this.rightAnswer = "";
        this.rightAnswerNum = -1;
    }
}

class PQuestions {
    constructor(){
        this.a = [];
    }
}

function handleResponse(message) {
    alert(`Status: ${message.response}`);
}

async function analizeQuestions(request){

    category = request.category;
    
    answersHolder = document.getElementsByClassName("questionflagsaveform")[0];
    el = answersHolder.querySelectorAll("div.que")

    let questions = new PQuestions();

    for (let i = 0; i < el.length; i++){

        let qe = new PQuestion();
        qe.category = category;
    
        let content = el[i].querySelector(".content");
        let formulation = content.querySelector(".formulation");
        let question = formulation.querySelectorAll(".qtext");

        qe.mid = el[i].id;

        //Question
        qe.text = question[0].innerText;

        //Image
        image = question[0].querySelectorAll("img");
        if(image.length == 1){
            qe.imagePath = image[0].src;
        }

        //Answers
        let answers = formulation.querySelector(".ablock").querySelector(".answer").querySelectorAll("label");
        for (let j = 0; j < answers.length; j++){
            let ans = answers[j].innerText.slice(answers[j].querySelector(".answernumber").innerText.length);
            qe.answers.push(ans);
        }

        //Right answer
        qe.rightAnswer = content.querySelector(".outcome").querySelector(".feedback").querySelector(".rightanswer").innerText;
        qe.rightAnswer = qe.rightAnswer.slice(qe.rightAnswer.indexOf(": ", 0)+2);
        qe.rightAnswerNum = qe.answers.indexOf(qe.rightAnswer);

        questions.a.push(qe);
    }

    const sending = browser.runtime.sendMessage({
        data: JSON.stringify(questions),
    });

    sending.then(handleResponse);
}

browser.runtime.onMessage.addListener(analizeQuestions);