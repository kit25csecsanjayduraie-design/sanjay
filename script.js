const scoreEl = document.getElementById("score");
const completedEl = document.getElementById("completed");
const levelEl = document.getElementById("level");
const workspace = document.getElementById("workspace");
const activity = document.getElementById("activity");

let score = 0;
let completed = 0;
let currentQuestions = [];
let questionIndex = 0;
let challengeCorrect = 0;
let answered = false;

const quizzes = {
  email: {
    title: "📧 Phishing Detective",
    questions: [
      {
        question: "A sample email says: 'Your account will be blocked today! Verify your password immediately.' What should you do?",
        options: [
          "Click the link immediately",
          "Verify through the official website or app",
          "Reply with your password"
        ],
        correct: 1,
        explanation: "Urgent threats and requests for passwords are warning signs. Check through the official website or app."
      },
      {
        question: "An unexpected email attachment arrives from an unknown sender. What is safest?",
        options: [
          "Open it to see what it contains",
          "Forward it to all your friends",
          "Don't open it; verify the sender or report it"
        ],
        correct: 2,
        explanation: "Unexpected attachments may contain harmful files. Verify them through a trusted channel."
      },
      {
        question: "A message promises a prize you never entered to win and asks for a fee. What should you do?",
        options: [
          "Pay the fee",
          "Treat it as suspicious and verify independently",
          "Send your OTP"
        ],
        correct: 1,
        explanation: "Unexpected prizes requiring payment or sensitive information are common scam warning signs."
      }
    ]
  },

  links: {
    title: "🔗 Link Inspector",
    questions: [
      {
        question: "A link displays the name of a familiar bank, but the actual domain has a misspelling. What should you do?",
        options: [
          "Avoid the link and open the bank's official app",
          "Enter your login details",
          "Share the link with others"
        ],
        correct: 0,
        explanation: "Look carefully at the actual domain. A familiar logo or displayed name doesn't prove a site is genuine."
      },
      {
        question: "A shortened URL arrives unexpectedly with the message 'Claim your reward now!' What is safest?",
        options: [
          "Open it immediately",
          "Enter your phone number",
          "Verify the message and destination before proceeding"
        ],
        correct: 2,
        explanation: "Shortened links hide their destination. Unexpected reward messages deserve extra caution."
      },
      {
        question: "Which is the safest way to access an online account?",
        options: [
          "Use a link in an unexpected message",
          "Type the known official address yourself",
          "Use any search advertisement"
        ],
        correct: 1,
        explanation: "Use a known official address or trusted app instead of relying on unexpected links."
      }
    ]
  },

  scams: {
    title: "🚨 Scam Awareness",
    questions: [
      {
        question: "Someone calls claiming to be a bank employee and asks for your OTP. What do you do?",
        options: [
          "Share the OTP",
          "Tell them your PIN too",
          "Never share it; end the call and contact your bank officially"
        ],
        correct: 2,
        explanation: "Never share OTPs, PINs or passwords with callers. Contact your bank using a verified number."
      },
      {
        question: "A stranger says you must pay immediately to avoid a fake legal penalty. What is safest?",
        options: [
          "Pay without checking",
          "Pause, verify independently and ask a trusted adult if needed",
          "Give them remote access to your device"
        ],
        correct: 1,
        explanation: "Scammers use fear and urgency to pressure people. Verify claims through official channels."
      },
      {
        question: "A social media account asks for money and claims to be your friend. What should you do?",
        options: [
          "Verify their identity using another trusted method",
          "Send money immediately",
          "Share your account password"
        ],
        correct: 0,
        explanation: "Accounts can be impersonated or compromised. Confirm the request directly before acting."
      }
    ]
  }
};

function updateDashboard() {
  scoreEl.textContent = score;
  completedEl.textContent = completed;
  levelEl.textContent =
    score >= 70 ? "Expert" :
    score >= 30 ? "Learner" : "Beginner";
}

function openActivity() {
  workspace.hidden = false;
  workspace.scrollIntoView({ behavior: "smooth" });
}

function addText(tag, text, parent = activity, className = "") {
  const el = document.createElement(tag);
  el.textContent = text;
  if (className) el.className = className;
  parent.appendChild(el);
  return el;
}

document.querySelectorAll("[data-quiz]").forEach(button => {
  button.addEventListener("click", () => {
    const type = button.dataset.quiz;

    if (type === "password") {
      showPasswordChecker();
    } else {
      startQuiz(type);
    }
  });
});

document.getElementById("back").addEventListener("click", () => {
  workspace.hidden = true;
  activity.replaceChildren();
  document.getElementById("challenges").scrollIntoView({
    behavior: "smooth"
  });
});

function startQuiz(type) {
  const quiz = quizzes[type];

  currentQuestions = quiz.questions;
  questionIndex = 0;
  challengeCorrect = 0;

  activity.replaceChildren();
  addText("h2", quiz.title);
  addText("p", "Practice mode — all scenarios are fictional.", activity, "muted");
  openActivity();
  showQuestion();
}

function showQuestion() {
  activity.querySelectorAll(".question-content").forEach(el => el.remove());

  const panel = document.createElement("div");
  panel.className = "question-content";
  activity.appendChild(panel);

  if (questionIndex >= currentQuestions.length) {
    completed++;
    updateDashboard();

    addText("h3", "Challenge completed! 🎉", panel);
    addText(
      "p",
      `You answered ${challengeCorrect} out of ${currentQuestions.length} correctly.`,
      panel
    );

    const restart = addText("button", "Try Again", panel, "action");
    restart.addEventListener("click", () => {
      const type = Object.keys(quizzes).find(
        key => quizzes[key].title === activity.querySelector("h2").textContent
      );
      if (type) startQuiz(type);
    });

    addText("p", "Review the explanations to improve your online safety.", panel, "muted");
    return;
  }

  answered = false;
  const q = currentQuestions[questionIndex];

  addText(
    "p",
    `Question ${questionIndex + 1} of ${currentQuestions.length}`,
    panel,
    "muted"
  );

  addText("h3", q.question, panel, "question");

  const options = document.createElement("div");
  panel.appendChild(options);

  const feedback = addText("p", "", panel, "feedback");
  feedback.hidden = true;

  q.options.forEach((option, index) => {
    const button = addText("button", option, options, "option");

    button.addEventListener("click", () => {
      if (answered) return;
      answered = true;

      options.querySelectorAll("button").forEach(b => {
        b.disabled = true;
      });

      if (index === q.correct) {
        score += 10;
        challengeCorrect++;
        feedback.textContent = "Correct! +10 points. " + q.explanation;
      } else {
        feedback.textContent = "Not quite. " + q.explanation;
      }

      feedback.hidden = false;
      updateDashboard();

      const next = addText(
        "button",
        questionIndex === currentQuestions.length - 1
          ? "Finish Challenge"
          : "Next Question",
        panel,
        "action"
      );

      next.addEventListener("click", () => {
        questionIndex++;
        showQuestion();
      });
    });
  });
}

function showPasswordChecker() {
  activity.replaceChildren();
  addText("h2", "🔐 Password Safety Checker");
  addText(
    "p",
    "Demo only: your input stays in this page and is never transmitted or saved.",
    activity,
    "muted"
  );

  const input = document.createElement("input");
  input.type = "password";
  input.className = "password-input";
  input.placeholder = "Enter a test password";
  input.autocomplete = "off";
  input.setAttribute("aria-label", "Test password");
  activity.appendChild(input);

  const result = addText("p", "Enter a test password to check it.");
  result.className = "feedback";

  const button = addText("button", "Check Strength");
  button.className = "action";

  button.addEventListener("click", () => {
    const value = input.value;
    let points = 0;

    if (value.length >= 12) points++;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) points++;
    if (/\d/.test(value)) points++;
    if (/[^A-Za-z0-9]/.test(value)) points++;

    const rating = value.length === 0 ? "Enter a password" :
      value.length < 8 ? "Weak — use a longer password" :
      points <= 1 ? "Needs improvement" :
      points <= 2 ? "Moderate — improve its variety" :
      "Stronger pattern — keep it unique";

    result.textContent = rating +
      ". Use a long, unique passphrase and consider a password manager. " +
      "This simple check cannot detect known or leaked passwords.";

    completed++;
    updateDashboard();
  });

  addText(
    "p",
    "Use a made-up test password, not a password you use for a real account.",
    activity,
    "muted"
  );

  openActivity();
}