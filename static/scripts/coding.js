function checkUser() {
    if (localStorage.getItem("username") == null) {
        document.getElementById("newUserWindow").style.display = "initial";
    }
}


function submitHighscore() {

    if (localStorage.getItem("highscore") == null) {
        alert("You have no highscore to submit yet!");
    }
    else if (localStorage.getItem("username") != null && localStorage.getItem("highscore") != null) {
        document.getElementById("usernameForm").value = localStorage.getItem("username");
        document.getElementById("highscoreForm").value = localStorage.getItem("highscore");
        //Code derived from user krtek's code snippet (https://stackoverflow.com/questions/5211328/clicking-submit-button-of-an-html-form-by-a-javascript-code)
        document.forms["newHighscorePrompt"].submit();
    }
}

function getUsername() {
    var user = document.getElementById("usernameInput").value;

    //Credit to Borislav Hadzhiev for creating this special character array (https://bobbyhadz.com/blog/javascript-check-if-string-contains-special-characters)
    let specialChar = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (user.length < 1) {
        alert("Username can't be empty!");
    }
    else if (specialChar.test(user) == true) {
        alert("Username can't have special characters!");
    }
    else if (user.length > 14) {
        alert("Username can't be longer than 14 characters!");
    }
    else {
        localStorage.setItem("username", user);
    }
}

function showProfile() {

    if (localStorage.getItem("username") == null) {
        alert("Make a profile first!");
    }


    else if(document.getElementById("userProfile").style.display == "initial"){
        document.getElementById("userProfile").style.display = "none";
    }

    else {
        document.getElementById("userProfile").style.display = "initial";
        document.getElementById("profileUsername").innerHTML = "User ID: " + localStorage.getItem("username");

        if (localStorage.getItem("highscore") == null) {
            document.getElementById("profileHighscore").innerHTML = "Highscore: 0";
        }
        else {
            document.getElementById("profileHighscore").innerHTML = "Highscore: " + localStorage.getItem("highscore");
        }
    }

}

function clearUserData() {
    var confirmation = prompt("Are you sure you want to clear all user data? Type 'CONFIRMCLEARDATA' to confirm.");
    if (confirmation == "CONFIRMCLEARDATA") {
        localStorage.clear();
        alert("All user data cleared.");
        location.reload();
    }
    else {
        alert("Input does not match prompt. Data clearing cancelled.")
    }
}





function randColour() {
    var random = Math.floor(Math.random() * 7);
    var colour = "";

    if (random == 0) {
        colour = "red";
    }
    else if (random == 1) {
        colour = "orange";
    }
    else if (random == 2) {
        colour = "yellow";
    }
    else if (random == 3) {
        colour = "green";
    }
    else if (random == 4) {
        colour = "blue";
    }
    else if (random == 5) {
        colour = "pink";
    }
    else if (random == 6) {
        colour = "cyan";
    }
    return colour;
}

function randWord() {
    var random = Math.floor(Math.random() * 7);
    var word = "";

    if (random == 0) {
        word = "red";
    }
    else if (random == 1) {
        word = "orange";
    }
    else if (random == 2) {
        word = "yellow";
    }
    else if (random == 3) {
        word = "green";
    }
    else if (random == 4) {
        word = "blue";
    }
    else if (random == 5) {
        word = "pink";
    }
    else if (random == 6) {
        word = "cyan";
    }
    return word;
}


function createRound() {
    var word = randWord();
    var colour = randColour();
    document.getElementById("main").innerHTML = word;
    document.getElementById("main").style.color = colour;

    //Procedure for restarting animation derived from CSS-TRICKS website (https://css-tricks.com/restart-css-animation/)
    document.getElementById("main").classList.remove("playNewComboAnimation");
    document.getElementById("main").offsetWidth;
    document.getElementById("main").classList.add("playNewComboAnimation");

    return [word, colour];
}

function verifyRound(input, round) {
    var word = round[0];
    var colour = round[1];
    var validFlag = 0;
    if ((input == "ArrowLeft" && word == colour)
        || (input == "ArrowRight" && word != colour)) {

        validFlag = 1;
    }
    else if ((input == "ArrowLeft" && word != colour)
        || (input == "ArrowRight" && word == colour)) {
        validFlag = 0;
    }

    return validFlag;
}

function startGame() {
    document.getElementById("score").innerHTML = "Score: 0";
    document.getElementById("retryButton").style.display = "none";
    document.getElementById("homeButton").style.display = "none";
    document.getElementById("timer").style.fontSize = "50px";
    document.getElementById("timer").classList.remove("playNoTimeAnimation");

    var round = createRound();
    var word = round[0];
    var colour = round[1];
    var score = 0

    var continueGame = 1;

    //Sounds for pressing and game loss
    const feedback = document.getElementById("press");
    feedback.volume = 0.25;

    const lose = document.getElementById("fail");
    lose.volume = 0.25;
    //



    const start = Date.now();
    var timer;
    var finaltime = 0;
    const timerInterval = setInterval(() => {
        timer = 60 - (Date.now() - start) / 1000;
        document.getElementById("timer").innerHTML = parseFloat(timer).toFixed(2);
        if (timer < 0) {
            timer = 0;
            document.getElementById("timer").innerHTML = "0.00";
            document.getElementById("timer").style.fontSize = "100px";
            document.getElementById("timer").classList.add("playNoTimeAnimation");
            continueGame = 0;
        }
    }, 25);




    if (continueGame == 1) {
        document.addEventListener("keydown", function registerInput(input) {
            if (timer < 0) {
                continueGame = 0;
            }
            if (input.key == "ArrowLeft" || input.key == "ArrowRight") {
                feedback.play();
                if (verifyRound(input.key, round) == true && continueGame == 1) {
                    score++;
                    round = createRound();
                    word = round[0];
                    colour = round[1];
                    document.getElementById("score").innerHTML = "Score: " + score;
                }
                else {
                    lose.play();
                    finaltime = parseFloat(timer).toFixed(2);
                    clearInterval(timerInterval);
                    document.getElementById("timer").innerHTML = finaltime;
                    word = "GAME OVER";
                    colour = "red";
                    document.getElementById("main").innerHTML = word;
                    document.getElementById("main").style.color = colour;
                    if (localStorage.getItem("highscore") == null) {
                        localStorage.setItem("highscore", score);
			document.getElementById("highscoreForm").value = score;
                    }
                    else {
                        if (localStorage.getItem("highscore") < score) {
                            localStorage.setItem("highscore", score);
                        }
                    }
                    continueGame = 0;
                    document.removeEventListener("keydown", registerInput, true);
                    document.getElementById("retryButton").style.display = "initial";
                    document.getElementById("homeButton").style.display = "initial";
                }
            }
        }, true);
    }
}

function enterGame() {
    document.getElementById("btnstart").onclick = window.location.href = "/game";

}
function goHome() {
    document.getElementById("btnstart").onclick = window.location.href = "/home";

}
