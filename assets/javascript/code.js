/*
    Author: Dave Paquette
    Date: January 2019
*/

$(document).ready(function() {
'use strict'

/*
    Global Variables & Functions
    ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
*/
let countDown, tOut, timeRemaining=25, right=0, wrong=0, qNum=0
let q = questions()
let qOrder

function shuffle(x=false) {
    function randInt(i) {
        return Math.floor(Math.random()*i)
    }
    if (x===false) {
        x = []
        for (let i in q) {x.push(i)}
    }
    let x2 = [...x]
    let z = []
    for (let i in x) {
      z.push(x2.splice(randInt(x2.length),1).toString())
    }
    return z
}
function len(x) {
    let y = 0, z
    for (z in x) {
        if (x.hasOwnProperty(z)) {y++}
    }
    return y
}
function questions() {
    function q(question,a1,r1,a2,r2,a3,r3,image) {
        this.q = question
        this.a = [[a1,r1],[a2,r2],[a3,r3]]
        this.i = 'assets/images/' + image
    }
    let x = {
        1: new q(
            "What was Tolstoy's wife's maiden name?",
            "Sophia Behrina",true,
            "Jane Austin",false,
            "Anna Karinina",false,
            'tolstoy.jpg'
        ),
        2: new q(
            "What were the cities in Dickens' 'Tale of Two Cities'?",
            'London & Paris',true,
            'London & Dublin',false,
            'London & Madrid',false,
            'cities.jpg'
        ),
        3: new q(
            "Where was Dantes imprisoned in Dumas' 'The Count of Monte Christo'?",
            "The Château d'If",true,
            "Monte Christo",false,
            "The Bastille",false,
            'chateau.jpg'
        ),
        4: new q(
            "At the beginning of Hugo's 'Les Misérables', what famous battle did Thenardier participate?",
            "Waterloo",true,
            "Leipzig",false,
            "Austerlitz",false,
            'napoleon.webp'
        ),
        5: new q(
            "In Golding's 'Lord of The Flies' what object is broken just before Piggy's death?",
            'A conch shell',true,
            'A looking glass',false,
            'A pair of glasses',false,
            'conch.jpg'
        )
    }
    return x
}
function timer(reset=false) {
    let t = $('#timer').addClass('mx-auto text-center')
    t.html('<h3>Time Remaining: ' + timeRemaining + '<h3>')
    timeRemaining--
    if (timeRemaining < 0) {
        clearInterval(countDown)
        countDown = null
        timeRemaining = 25
        wrong++
        checkAnswer(true)
        return
    }
    if (reset===true) {
        clearInterval(countDown)
        countDown = null
        timeRemaining = 25
    }
    if (!countDown) {countDown = setInterval(timer,1000)}
}
function startGame() {
    right = 0
    wrong = 0
    qOrder = shuffle()
    qNum = 0
    showQuestion()
    return
}
function startScreen() {
    $('#question-form').hide()
    $('#results').hide()
    $('#timer').hide()
    $('#start').show()
}
function showQuestion() {
    $('#results').hide()
    $('#start').hide()
    clearTimeout(tOut)
    $('#question-form').show()
    $('#timer').show()
    $('#start').hide()
    $('#results').hide()
    $('#answers').empty()
    timer(true)
    if (qNum === len(q)) {
        qNum = len(q)
        results()
        return
    }
    $('#question').html('<h4>' + q[qOrder[qNum]].q + '</h4>')
    let answers = shuffle([...q[qOrder[qNum]].a])
    for (let i in answers) {
        let split = answers[i].indexOf(',')
        let answer = answers[i].substring(0,split)
        let key = answers[i].substring(split+1)
        answer = $('<h4>').text(answer).attr('key',key).addClass('question-answers')
        answer.appendTo('#answers').on('click',checkAnswer)
    }
    qNum++
}
function checkAnswer(timeout=false) {
    clearInterval(countDown)
    countDown = null
    $('#answers').empty()
    let result = q[qOrder[qNum-1]].a[0][0]
    if ($(this).attr('key') == 'true' || timeout === false) {
        right++
        $('<h2>').text('Correct!').appendTo('#answers').on('click',showQuestion)
    } else {
        wrong++
        $('<h2>').text('Wrong!').appendTo('#answers').on('click',showQuestion)
    }
    let x = $('<h4>').text('The correct answer is ' + result).appendTo('#answers')
    $('<img>').attr('src',q[qOrder[qNum-1]].i).appendTo('#answers').on('click',showQuestion)
    x.on('click',showQuestion)
    tOut = setTimeout(showQuestion,10000)
    return
}
function results() {
    clearInterval(countDown)
    countDown = null
    clearTimeout(tOut)
    $('#question-form').hide()
    $('#results').show()
    $('#results').empty()
    $('<h5>').text('Right: ' + right).on('click',startGame).appendTo('#results')
    $('<h5>').text('Wrong: ' + wrong).on('click',startGame).appendTo('#results')
    $('#button').html('Start Over')
    $('#start').show().on('click',startGame)
    tOut = setTimeout(startGame,10000)
    return
}

startScreen()
$('#start').on('click',startGame)
})