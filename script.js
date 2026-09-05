/* =========================================================
   CAPTCHA UNIVERSITY
   Main Game Engine
========================================================= */


/* ================= GLOBAL DATA ================= */

let currentQuestion = 0;
let score = 0;
let answers = [];
let questionData = [];
let vanishingCode = "";
let circleScore = 0;
let micResult = 0;
let dodgeFinished = false;
let moleScore = 0;
let reverseAttempts = 0;
let termsAttempts = 0;


/* ================= DOODLES ================= */

const doodleCharacters = [
    "✦", "★", "☆", "♡", "☻", "☁", "⚡",
    "✎", "☕", "👀", "🤖", "👽", "🎓",
    "💭", "❓", "✨", "⭐", "🌀", "💫",
    "🧠", "🍕", "🚦", "🦆"
];

function createDoodles() {

    const container = document.getElementById("doodles");

    for (let i = 0; i < 35; i++) {

        const d = document.createElement("div");

        d.className = "doodle";

        d.textContent =
            doodleCharacters[
                Math.floor(Math.random() * doodleCharacters.length)
            ];

        d.style.left = Math.random() * 100 + "%";

        d.style.animationDuration =
            (12 + Math.random() * 18) + "s";

        d.style.animationDelay =
            (-Math.random() * 20) + "s";

        d.style.fontSize =
            (15 + Math.random() * 25) + "px";

        container.appendChild(d);
    }
}

createDoodles();


/* ================= SCREEN CONTROL ================= */

function showScreen(id) {

    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ================= NAVIGATION ================= */

function showInstructions() {

    playClick();

    showScreen("instructionsScreen");
}

function showHumanQuestion() {

    playClick();

    showScreen("humanQuestionScreen");
}

function startGame() {

    playStart();

    currentQuestion = 0;
    score = 0;
    answers = [];

    questionData = createQuestions();

    showScreen("gameScreen");

    loadQuestion();
}


/* =========================================================
   SOUND EFFECTS
========================================================= */

const AudioContext =
    window.AudioContext ||
    window.webkitAudioContext;

let audioCtx;

function getAudio() {

    if (!audioCtx) {
        audioCtx = new AudioContext();
    }

    return audioCtx;
}

function tone(frequency, duration, type = "sine") {

    try {

        const ctx = getAudio();

        const oscillator =
            ctx.createOscillator();

        const gain =
            ctx.createGain();

        oscillator.type = type;

        oscillator.frequency.value =
            frequency;

        gain.gain.setValueAtTime(
            0.0001,
            ctx.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.15,
            ctx.currentTime + 0.01
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            ctx.currentTime + duration
        );

        oscillator.connect(gain);

        gain.connect(ctx.destination);

        oscillator.start();

        oscillator.stop(
            ctx.currentTime + duration
        );

    } catch (error) {
        console.log("Audio unavailable.");
    }
}


function playClick() {
    tone(500, .08);
}

function playCorrect() {

    tone(600, .1);
    setTimeout(() => tone(850, .12), 100);
    setTimeout(() => tone(1100, .15), 200);
}

function playWrong() {

    tone(180, .15, "square");
    setTimeout(() => tone(120, .2, "square"), 120);
}

function playStart() {

    tone(400, .1);
    setTimeout(() => tone(600, .1), 100);
    setTimeout(() => tone(800, .2), 200);
}

function playRobotAlarm() {

    tone(150, .2, "sawtooth");

    setTimeout(
        () => tone(300, .2, "sawtooth"),
        200
    );

    setTimeout(
        () => tone(150, .3, "sawtooth"),
        400
    );
}


/* =========================================================
   QUESTION DATA
========================================================= */

function createQuestions() {

    return [

        {
            type: "traffic",
            title: "Select ALL the traffic lights.",
            description:
                "Please identify the traffic lights. This should be easy. Probably.",
            correct: true
        },

        {
            type: "word",
            title: "Type the word you see.",
            description:
                "Our font department has made this unnecessarily difficult.",
            word: "HUMAN",
            correct: true
        },

        {
            type: "circle",
            title: "Draw a PERFECT circle.",
            description:
                "Use your mouse or finger. We will judge you.",
            correct: true
        },

        {
            type: "mic",
            title: "Hum the tune we're thinking of.",
            description:
                "You have approximately 2 seconds to impress our extremely imaginary music department.",
            correct: true
        },

        {
            type: "math",
            title: "Solve this mathematics problem.",
            description:
                "This is definitely mathematics.",
            correct: true
        },

        {
            type: "vanishing",
            title: "Remember the code.",
            description:
                "You have 0.4 seconds. Good luck.",
            correct: true
        },

        {
            type: "dodge",
            title: "Click SUBMIT.",
            description:
                "Simple.",
            correct: true
        },

        {
            type: "moles",
            title: "Speed Whack!",
            description:
                "Click ONLY the bald moles. You have 5 seconds.",
            correct: true
        },

        {
            type: "reverse",
            title: "Prove you are a robot.",
            description:
                "Type extremely quickly and monotonously.",
            correct: true
        },

        {
            type: "terms",
            title: "Find the checkbox.",
            description:
                "Please carefully inspect the Terms & Conditions.",
            correct: true
        },

        {
            type: "swapped",
            title: "Human Verification.",
            description:
                "You definitely read the labels before clicking.",
            correct: true
        },

        {
            type: "feelings",
            title:
                "Prove you're not a robot by convincing us you have feelings.",
            description:
                "Write whatever your mysterious human brain believes.",
            correct: true
        }

    ];

}


/* =========================================================
   LOAD QUESTION
========================================================= */

function loadQuestion() {

    const q =
        questionData[currentQuestion];

    document.getElementById("questionNumber")
        .textContent =
        `QUESTION ${String(currentQuestion + 1).padStart(2, "0")} / ${questionData.length}`;

    document.getElementById("scoreDisplay")
        .textContent =
        Math.round(
            (score / currentQuestion) * 100
        ) || "0%";

    document.getElementById("progressBar")
        .style.width =
        ((currentQuestion) /
            questionData.length * 100) + "%";

    const container =
        document.getElementById(
            "questionContainer"
        );

    container.innerHTML = "";

    const card =
        document.createElement("div");

    card.className = "question-card";

    card.innerHTML = `
        <div class="question-tag">
            HUMANITY CHALLENGE #${currentQuestion + 1}
        </div>

        <h1 class="question-title">
            ${q.title}
        </h1>

        <p class="question-description">
            ${q.description}
        </p>

        <div id="challengeArea"></div>
    `;

    container.appendChild(card);

    renderChallenge(q);

}


/* =========================================================
   CHALLENGE RENDERER
========================================================= */

function renderChallenge(q) {

    const area =
        document.getElementById(
            "challengeArea"
        );

    switch (q.type) {

        case "traffic":
            renderTraffic(area);
            break;

        case "word":
            renderWord(area);
            break;

        case "circle":
            renderCircle(area);
            break;

        case "mic":
            renderMic(area);
            break;

        case "math":
            renderMath(area);
            break;

        case "vanishing":
            renderVanishing(area);
            break;

        case "dodge":
            renderDodge(area);
            break;

        case "moles":
            renderMoles(area);
            break;

        case "reverse":
            renderReverse(area);
            break;

        case "terms":
            renderTerms(area);
            break;

        case "swapped":
            renderSwapped(area);
            break;

        case "feelings":
            renderFeelings(area);
            break;
    }
}


/* =========================================================
   QUESTION 1
   FRUIT TRAFFIC LIGHTS
========================================================= */

function renderTraffic(area) {

    const items = [
        "🚦",
        "🥭",
        "🚦",
        "🍎",
        "🐱",
        "🚦",
        "🍉",
        "🚦",
        "🐱‍👤"
    ];

    area.innerHTML = `
        <div class="traffic-grid">
            ${items.map((item, index) => `
                <button
                    class="traffic-item"
                    onclick="selectTraffic(this, '${item}')">
                    ${item}
                </button>
            `).join("")}
        </div>

        <br>

        <button class="big-button"
                onclick="submitTraffic()">
            VERIFY TRAFFIC LIGHTS
        </button>
    `;

}

let selectedTraffic = [];

function selectTraffic(button, item) {

    playClick();

    button.classList.toggle("selected");

    if (selectedTraffic.includes(item)) {

        selectedTraffic =
            selectedTraffic.filter(
                x => x !== item
            );

    } else {

        selectedTraffic.push(item);

    }
}

function submitTraffic() {

    const correctCount =
        selectedTraffic.filter(
            x => x === "🚦"
        ).length;

    const totalLights =
        4;

    const passed =
        correctCount === totalLights &&
        selectedTraffic.length === totalLights;

    finishQuestion(
        passed,
        passed
            ? "Excellent. You successfully identified actual traffic lights."
            : "You have been defeated by fruit."
    );

    selectedTraffic = [];
}


/* =========================================================
   QUESTION 2
   DISTORTED WORD
========================================================= */

let wordAttempts = 0;

function renderWord(area) {

    wordAttempts = 0;

    area.innerHTML = `

        <div class="distorted-word">
            H U M A N
        </div>

        <input
            id="wordInput"
            class="text-answer"
            placeholder="Type the word..."
            autocomplete="off"
        >

        <button
            class="big-button"
            onclick="submitWord()">
            VERIFY WORD
        </button>

        <p id="wordAttempts">
            Attempts: 0 / 3
        </p>
    `;
}

function submitWord() {

    const input =
        document.getElementById(
            "wordInput"
        ).value.trim().toUpperCase();

    wordAttempts++;

    document.getElementById(
        "wordAttempts"
    ).textContent =
        `Attempts: ${wordAttempts} / 3`;

    if (input === "HUMAN") {

        finishQuestion(
            true,
            "You can read! Suspiciously impressive."
        );

    } else if (wordAttempts >= 3) {

        finishQuestion(
            true,
            "Close enough. We have decided literacy is optional."
        );

    } else {

        playWrong();

    }
}


/* =========================================================
   QUESTION 3
   CIRCLE
========================================================= */

function renderCircle(area) {

    area.innerHTML = `

        <div class="canvas-wrap">

            <canvas
                id="circleCanvas"
                width="500"
                height="350">
            </canvas>

        </div>

        <br>

        <button
            class="big-button"
            onclick="judgeCircle()">
            JUDGE MY CIRCLE
        </button>
    `;

    setupCanvas();
}


let drawing = false;
let points = [];

function setupCanvas() {

    const canvas =
        document.getElementById(
            "circleCanvas"
        );

    const ctx =
        canvas.getContext("2d");

    ctx.lineWidth = 5;
    ctx.lineCap = "round";

    function position(e) {

        const rect =
            canvas.getBoundingClientRect();

        const clientX =
            e.touches
                ? e.touches[0].clientX
                : e.clientX;

        const clientY =
            e.touches
                ? e.touches[0].clientY
                : e.clientY;

        return {
            x:
                (clientX - rect.left)
                * canvas.width
                / rect.width,

            y:
                (clientY - rect.top)
                * canvas.height
                / rect.height
        };
    }

    function start(e) {

        e.preventDefault();

        drawing = true;
        points = [];

        const p = position(e);

        points.push(p);

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
    }

    function move(e) {

        if (!drawing) return;

        e.preventDefault();

        const p = position(e);

        points.push(p);

        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    }

    function end() {

        drawing = false;
    }

    canvas.addEventListener(
        "mousedown",
        start
    );

    canvas.addEventListener(
        "mousemove",
        move
    );

    canvas.addEventListener(
        "mouseup",
        end
    );

    canvas.addEventListener(
        "touchstart",
        start,
        { passive: false }
    );

    canvas.addEventListener(
        "touchmove",
        move,
        { passive: false }
    );

    canvas.addEventListener(
        "touchend",
        end
    );
}


function judgeCircle() {

    if (points.length < 20) {

        finishQuestion(
            false,
            "That is not a circle. That is a philosophical statement."
        );

        return;
    }

    const first = points[0];
    const last =
        points[points.length - 1];

    const distance =
        Math.hypot(
            last.x - first.x,
            last.y - first.y
        );

    circleScore =
        Math.max(
            0,
            Math.min(
                100,
                Math.round(
                    100 - distance
                )
            )
        );

    const passed =
        circleScore >= 35;

    finishQuestion(
        passed,
        `Circle roundness: ${circleScore}%. Our standards are deeply questionable.`
    );
}


/* =========================================================
   QUESTION 4
   MICROPHONE
========================================================= */

function renderMic(area) {

    area.innerHTML = `

        <div class="mic-area">

            <div style="font-size:50px;margin-bottom:20px;">
                🎵 🎶 🎵
            </div>

            <button
                class="mic-button"
                id="micButton"
                onclick="startMic()">
                🎤
            </button>

            <p id="micStatus">
                Click the microphone and hum for 2 seconds.
            </p>

        </div>
    `;
}

async function startMic() {

    const button =
        document.getElementById(
            "micButton"
        );

    const status =
        document.getElementById(
            "micStatus"
        );

    try {

        const stream =
            await navigator.mediaDevices
                .getUserMedia({
                    audio: true
                });

        button.classList.add(
            "recording"
        );

        status.textContent =
            "🎤 LISTENING TO EXTREMELY SERIOUS MUSIC...";

        const recorder =
            new MediaRecorder(stream);

        recorder.start();

        setTimeout(() => {

            recorder.stop();

            stream.getTracks().forEach(
                track => track.stop()
            );

            micResult =
                Math.floor(
                    40 + Math.random() * 61
                );

            const comments = [
                "Technically that was sound.",
                "Our AI has concerns.",
                "Beautiful. Probably.",
                "We detected approximately 14% music.",
                "The university's imaginary music professor approves."
            ];

            const comment =
                comments[
                    Math.floor(
                        Math.random()
                        * comments.length
                    )
                ];

            finishQuestion(
                micResult >= 50,
                `Tune match: ${micResult}%. ${comment}`
            );

        }, 2000);

    } catch (error) {

        finishQuestion(
            false,
            "Microphone access denied. The robots are suspicious."
        );
    }
}


/* =========================================================
   QUESTION 5
   MATH/PUN
========================================================= */

function renderMath(area) {

    area.innerHTML = `

        <div style="
            font-family:'Bangers';
            font-size:45px;
            text-align:center;
            padding:30px;
            background:#fff0b5;
            border:3px solid var(--ink);
        ">
            If you have 3 apples<br>
            and I take 2...
            <br><br>
            <span style="font-size:25px;">
                HOW MANY APPLES DO I HAVE?
            </span>
        </div>

        <br>

        <button class="answer-button"
                onclick="mathAnswer(false)">
            A) 1
        </button>

        <button class="answer-button"
                onclick="mathAnswer(false)">
            B) 2
        </button>

        <button class="answer-button"
                onclick="mathAnswer(true)">
            C) 2... because YOU took them
        </button>

        <button class="answer-button"
                onclick="mathAnswer(false)">
            D) 5
        </button>
    `;
}

function mathAnswer(correct) {

    finishQuestion(
        correct,
        correct
            ? "Congratulations. You solved capitalism."
            : "Incorrect. The apples remain emotionally unavailable."
    );
}


/* =========================================================
   QUESTION 6
   VANISHING TEXT
========================================================= */

function renderVanishing(area) {

    vanishingCode =
        randomCode();

    area.innerHTML = `

        <div
            id="vanishingCode"
            class="vanish-code">
            ${vanishingCode}
        </div>

        <p style="text-align:center;">
            MEMORIZE IT.
        </p>

        <input
            id="vanishInput"
            class="text-answer"
            placeholder="What did you see?"
        >

        <button
            class="big-button"
            onclick="submitVanishing()">
            SUBMIT MEMORY
        </button>
    `;

    setTimeout(() => {

        const element =
            document.getElementById(
                "vanishingCode"
            );

        if (element) {

            element.textContent =
                "TOO LATE.";

        }

    }, 400);
}


function randomCode() {

    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (let i = 0; i < 5; i++) {

        code +=
            chars[
                Math.floor(
                    Math.random()
                    * chars.length
                )
            ];
    }

    return code;
}


function submitVanishing() {

    const answer =
        document.getElementById(
            "vanishInput"
        ).value.trim().toUpperCase();

    const correct =
        answer === vanishingCode;

    finishQuestion(
        correct,
        correct
            ? "You actually remembered it?!"
            : `Your answer: ${answer || "(nothing)"} | Actual: ${vanishingCode}`
    );
}


/* =========================================================
   QUESTION 7
   DODGE BUTTON
========================================================= */

function renderDodge(area) {

    dodgeFinished = false;

    area.innerHTML = `

        <div class="dodge-area"
             id="dodgeArea">

            <button
                id="dodgeButton"
                onclick="catchDodge()">
                SUBMIT
            </button>

        </div>

        <p style="
            text-align:center;
            font-family:'Bangers';
            font-size:25px;
            margin-top:15px;">
            Countdown: <span id="dodgeTimer">10</span>
        </p>
    `;

    const button =
        document.getElementById(
            "dodgeButton"
        );

    const box =
        document.getElementById(
            "dodgeArea"
        );

    button.addEventListener(
        "mouseenter",
        () => {

            if (Math.random() > .05) {

                const maxX =
                    box.clientWidth
                    - button.offsetWidth;

                const maxY =
                    box.clientHeight
                    - button.offsetHeight;

                button.style.left =
                    Math.random()
                    * maxX + "px";

                button.style.top =
                    Math.random()
                    * maxY + "px";
            }

        }
    );

    let seconds = 10;

    const timer =
        setInterval(() => {

            seconds--;

            const timerElement =
                document.getElementById(
                    "dodgeTimer"
                );

            if (timerElement)
                timerElement.textContent =
                    seconds;

            if (seconds <= 0) {

                clearInterval(timer);

                if (!dodgeFinished) {

                    finishQuestion(
                        false,
                        "The button has successfully escaped justice."
                    );

                }

            }

        }, 1000);
}


function catchDodge() {

    if (dodgeFinished) return;

    dodgeFinished = true;

    finishQuestion(
        true,
        "YOU CAUGHT IT. The university is genuinely frightened."
    );
}


/* =========================================================
   QUESTION 8
   SPEED WHACK
========================================================= */

let moleTimer;

function renderMoles(area) {

    moleScore = 0;

    let html = `
        <div class="mole-grid">
    `;

    for (let i = 0; i < 12; i++) {

        const bald =
            Math.random() > .5;

        html += `
            <button
                class="mole"
                data-bald="${bald}"
                onclick="whackMole(this)">
                ${bald ? "🐭" : "🧢"}
            </button>
        `;
    }

    html += `</div>

        <p style="
            text-align:center;
            margin-top:20px;
            font-family:'Bangers';
            font-size:30px;">
            TIME: <span id="moleTimer">5</span>
        </p>
    `;

    area.innerHTML = html;

    let seconds = 5;

    moleTimer =
        setInterval(() => {

            seconds--;

            const t =
                document.getElementById(
                    "moleTimer"
                );

            if (t) t.textContent = seconds;

            if (seconds <= 0) {

                clearInterval(
                    moleTimer
                );

                finishQuestion(
                    moleScore >= 5,
                    `You whacked ${moleScore} bald moles. The hats have filed a complaint.`
                );

            }

        }, 1000);
}


function whackMole(button) {

    if (
        button.dataset.clicked === "true"
    ) return;

    button.dataset.clicked = "true";

    if (
        button.dataset.bald === "true"
    ) {

        moleScore++;

        button.textContent = "💥";

        playCorrect();

    } else {

        button.textContent = "😡";

        playWrong();
    }
}


/* =========================================================
   QUESTION 9
   REVERSE PSYCHOLOGY
========================================================= */

function renderReverse(area) {

    reverseAttempts = 0;

    area.innerHTML = `

        <div style="
            background:#e7e0ff;
            border:3px solid var(--ink);
            padding:25px;
            text-align:center;
        ">

            <div style="
                font-family:'Press Start 2P';
                font-size:10px;
                margin-bottom:20px;">
                PROVE YOU ARE A ROBOT
            </div>

            <p>
                Type the following word as quickly
                as you possibly can:
            </p>

            <h2 style="
                font-family:'Bangers';
                font-size:50px;">
                ROBOT
            </h2>

            <input
                id="reverseInput"
                class="text-answer"
                placeholder="ROBOT"
                autocomplete="off"
            >

            <button
                class="big-button"
                onclick="submitReverse()">
                CONFIRM ROBOTIC BEHAVIOUR
            </button>

        </div>
    `;
}


function submitReverse() {

    const value =
        document.getElementById(
            "reverseInput"
        ).value
        .trim()
        .toUpperCase();

    reverseAttempts++;

    if (value === "ROBOT") {

        finishQuestion(
            true,
            "Excellent robotic performance. Suspiciously human."
        );

    } else {

        finishQuestion(
            false,
            "Your typing was too human."
        );
    }
}


/* =========================================================
   QUESTION 10
   HIDDEN CHECKBOX
========================================================= */

function renderTerms(area) {

    termsAttempts = 0;

    let fakeText = "";

    for (let i = 0; i < 15; i++) {

        fakeText += `
            Section ${i + 1}: By participating in
            CAPTCHA University, you acknowledge that
            absolutely nothing here makes sense.
            You agree that buttons may be suspicious,
            robots may be disappointed, and the university
            reserves the right to judge your circle.
            <br><br>
        `;
    }

    area.innerHTML = `

        <div class="terms-box">
            ${fakeText}
        </div>

        <div
            id="movingCheckbox"
            class="hidden-checkbox">
            <label>
                <input type="checkbox"
                    onchange="termsCheck(this)">
                I have definitely read all of this.
            </label>
        </div>

    `;

    moveTermsCheckbox();
}


function moveTermsCheckbox() {

    const checkbox =
        document.getElementById(
            "movingCheckbox"
        );

    if (!checkbox) return;

    checkbox.style.marginLeft =
        Math.random() * 70 + "%";

    checkbox.style.marginTop =
        Math.random() * 30 + "px";
}


function termsCheck(input) {

    if (input.checked) {

        finishQuestion(
            true,
            "You read the Terms & Conditions. That is more suspicious than being a robot."
        );
    }
}


/* =========================================================
   QUESTION 11
   SWAPPED CHECKBOX
========================================================= */

function renderSwapped(area) {

    area.innerHTML = `

        <div class="swapped-area">

            <div class="fake-robot-check">

                <label>
                    <input
                        type="checkbox"
                        onchange="robotCheckbox(this)">
                    I am a robot
                </label>

            </div>

            <div class="real-human-check">

                <label>
                    <input
                        type="checkbox"
                        onchange="humanCheckbox(this)">
                    I am NOT a robot
                </label>

            </div>

        </div>

        <p style="
            margin-top:15px;
            font-family:'Permanent Marker';
            text-align:center;">
            You didn't even read it, did you?
        </p>
    `;
}


function robotCheckbox(input) {

    if (input.checked) {

        playRobotAlarm();

        input.checked = false;

        showRobotFlash();

        finishQuestion(
            false,
            "ACCESS DENIED — ROBOT DETECTED 🤖"
        );
    }
}


function humanCheckbox(input) {

    if (input.checked) {

        finishQuestion(
            true,
            "Wow. You actually read things. Suspicious."
        );
    }
}


function showRobotFlash() {

    const flash =
        document.createElement("div");

    flash.style.position = "fixed";
    flash.style.inset = "0";
    flash.style.background =
        "rgba(255,0,50,.35)";
    flash.style.zIndex = "9999";
    flash.style.pointerEvents = "none";

    document.body.appendChild(flash);

    setTimeout(() => {
        flash.remove();
    }, 350);
}


/* =========================================================
   QUESTION 12
   FEELINGS
========================================================= */

function renderFeelings(area) {

    area.innerHTML = `

        <div style="
            text-align:center;
            font-size:60px;
            margin-bottom:20px;">
            ❤️ 🧠 💭 🤨
        </div>

        <textarea
            id="feelingsInput"
            class="text-answer"
            style="height:180px;"
            placeholder="Tell CAPTCHA University what you feel..."
        ></textarea>

        <button
            class="big-button"
            onclick="submitFeelings()">
            PROVE YOUR HUMANITY
        </button>
    `;
}


function submitFeelings() {

    const text =
        document.getElementById(
            "feelingsInput"
        ).value.trim();

    if (!text) {

        finishQuestion(
            false,
            "Even robots have something to say."
        );

        return;
    }

    finishQuestion(
        true,
        "Beautiful. Completely unnecessary. Very human."
    );
}


/* =========================================================
   FINISH QUESTION
========================================================= */

function finishQuestion(
    correct,
    message
) {

    if (correct) {

        score++;

        playCorrect();

        showFeedback(
            "✅ " + message,
            true
        );

    } else {

        playWrong();

        showFeedback(
            "❌ " + message,
            false
        );
    }

    answers.push({
        question:
            questionData[currentQuestion]
                .title,
        correct,
        message
    });

    setTimeout(() => {

        currentQuestion++;

        if (
            currentQuestion
            >= questionData.length
        ) {

            finishGame();

        } else {

            loadQuestion();

        }

    }, 1700);
}


/* ================= FEEDBACK ================= */

function showFeedback(
    message,
    correct
) {

    const feedback =
        document.getElementById(
            "feedback"
        );

    feedback.textContent =
        message;

    feedback.className =
        "feedback " +
        (correct
            ? "correct"
            : "wrong");
}


/* =========================================================
   FINISH GAME
========================================================= */

function finishGame() {

    const percentage =
        Math.round(
            score / questionData.length
            * 100
        );

    document.getElementById(
        "progressBar"
    ).style.width = "100%";

    showResult(percentage);
}


/* =========================================================
   RESULT SCREEN
========================================================= */

function showResult(percentage) {

    showScreen("resultScreen");

    const result =
        document.getElementById(
            "resultContent"
        );

    if (percentage >= 80) {

        playCorrect();

        result.innerHTML = `

            <div class="result-card human">

                <div class="robot-art">
                    🎓✨🧑‍🚀✨🎓
                </div>

                <h1>
                    HUMAN.
                </h1>

                <div class="pixel-art">
     ★ ★ ★ ★ ★ ★ ★ ★
       ███ HUMAN ███
     ★ ★ ★ ★ ★ ★ ★ ★
                </div>

                <div class="result-score">
                    ${score} / ${questionData.length}
                    &nbsp; — &nbsp;
                    ${percentage}%
                </div>

                <p class="result-message">
                    Against all odds, you have demonstrated
                    sufficient levels of human behaviour.
                </p>

                <div style="
                    font-size:45px;
                    margin:25px;">
                    🥳 🎉 🪩 ✨ 🎓 🏆
                </div>

                <button
                    class="big-button"
                    onclick="showCertificateForm()">
                    CLAIM CERTIFICATE
                    <b>🎓</b>
                </button>

            </div>
        `;

    } else {

        playRobotAlarm();

        result.innerHTML = `

            <div class="result-card robot">

                <div class="robot-art">
                    🤖 ⚠️ 🤖 ⚠️ 🤖
                </div>

                <h1>
                    ROBOT.
                </h1>

                <div class="pixel-art">
        ███████████
        █  ERROR  █
        █ HUMAN?  █
        █  FALSE  █
        ███████████
                </div>

                <div class="result-score">
                    ${score} / ${questionData.length}
                    &nbsp; — &nbsp;
                    ${percentage}%
                </div>

                <p class="result-message">
                    Unfortunately, you failed the Humanity
                    Verification Examination.
                    <br><br>
                    Minimum required score:
                    <b>80%</b>
                </p>

                <div style="
                    font-size:45px;
                    margin:25px;">
                    🤖💀🛑📡⚡
                </div>

                <button
                    class="big-button"
                    onclick="showReview()">
                    REVIEW MY FAILURE
                    <b>🔎</b>
                </button>

                <br><br>

                <button
                    class="big-button"
                    onclick="location.reload()"
                    style="
                        background:var(--blue);
                        color:var(--ink);">
                    TRY AGAIN
                </button>

            </div>
        `;
    }
}


/* =========================================================
   REVIEW
========================================================= */

function showReview() {

    const result =
        document.getElementById(
            "resultContent"
        );

    const percentage =
        Math.round(
            score / questionData.length
            * 100
        );

    let html = `

        <div class="result-card robot">

            <div class="robot-art">
                🔎 🤖 📋
            </div>

            <h1 style="font-size:70px;">
                FAILURE REPORT
            </h1>

            <div class="result-score">
                FINAL SCORE: ${percentage}%
            </div>

            <div class="review">
    `;

    answers.forEach(
        (answer, index) => {

            html += `

                <div class="
                    review-item
                    ${answer.correct
                        ? "correct"
                        : "wrong"}">

                    <b>
                        ${answer.correct
                            ? "✅ CORRECT"
                            : "❌ WRONG"}
                    </b>

                    <p>
                        Question ${index + 1}:
                        ${answer.question}
                    </p>

                    <small>
                        ${answer.message}
                    </small>

                </div>
            `;
        }
    );

    html += `

            </div>

            <br>

            <button
                class="big-button"
                onclick="location.reload()">
                RETAKE THE TEST
            </button>

        </div>
    `;

    result.innerHTML = html;
}


/* =========================================================
   CERTIFICATE
========================================================= */

function showCertificateForm() {

    showScreen("certificateScreen");

    const certificate =
        document.getElementById(
            "finalCertificate"
        );

    certificate.innerHTML = `

        <div style="text-align:center;">

            <div class="cert-top">
                CAPTCHA UNIVERSITY PRESENTS
            </div>

            <div class="cert-title">
                CERTIFICATE
            </div>

            <div class="cert-subtitle">
                OF HUMANITY
            </div>

            <div style="
                font-size:70px;
                margin:20px;">
                🎓
            </div>

            <p>
                Enter the name of the brave human
                who survived the examination.
            </p>

            <input
                id="certificateName"
                class="name-input"
                placeholder="Your human name..."
                oninput="updateCertificate()"
            >

            <div id="certificatePreview">

                <p style="margin-top:30px;">
                    Your certificate will appear here.
                </p>

            </div>

        </div>
    `;
}


function updateCertificate() {

    const name =
        document.getElementById(
            "certificateName"
        ).value.trim();

    if (!name) return;

    const percentage =
        Math.round(
            score / questionData.length
            * 100
        );

    const serial =
        "CU-2026-" +
        Math.floor(
            100000 +
            Math.random() * 900000
        );

    const preview =
        document.getElementById(
            "certificatePreview"
        );

    preview.innerHTML = `

        <div style="
            margin-top:40px;
            border-top:3px dashed #8b172c;
            padding-top:30px;">

            <p class="cert-text">
                This officially unnecessary document
                certifies that
            </p>

            <div class="demo-name">
                ${escapeHTML(name)}
            </div>

            <p class="cert-text">
                has successfully completed the CAPTCHA
                University Humanity Verification Examination.
            </p>

            <div class="certificate-grid">

                <div>
                    <b>HUMANITY SCORE</b>
                    <span>${percentage}%</span>
                </div>

                <div>
                    <b>QUESTIONS SURVIVED</b>
                    <span>${score}/${questionData.length}</span>
                </div>

                <div>
                    <b>STATUS</b>
                    <span>HUMAN™</span>
                </div>

            </div>

            <div class="cert-bottom">

                <div class="fake-signature">
                    Prof. Definitely Real
                    <small>
                        Dean of Human Things
                    </small>
                </div>

                <div class="cert-stamp">
                    APPROVED
                    <small>PROBABLY</small>
                </div>

                <div class="barcode">
                    ||| || |||| | ||| || ||||
                </div>

            </div>

            <div class="cert-doodle">
                ★ survived the nonsense
            </div>

            <div class="cert-date">
                SERIAL: ${serial}
            </div>

        </div>
    `;
}


function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* =========================================================
   PRINT
========================================================= */

function printCertificate() {

    const name =
        document.getElementById(
            "certificateName"
        )?.value.trim();

    if (!name) {

        alert(
            "Please enter your human name first."
        );

        return;
    }

    window.print();
}