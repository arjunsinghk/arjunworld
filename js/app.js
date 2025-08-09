// Firebase initialization (assumes firebaseConfig is already in index.html)
const auth = firebase.auth();
const db = firebase.firestore();

// 🔐 Admin Email (replace with your actual email)
const ADMIN_EMAIL = "your-admin-email@example.com";

// 🧑‍🎓 Student Registration (example function)
function registerStudent(email, password) {
  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      alert("Student registered: " + userCredential.user.email);
    })
    .catch(error => {
      alert("Error: " + error.message);
    });
}

// 🔐 Admin Login
function loginAdmin(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      if (userCredential.user.email === ADMIN_EMAIL) {
        document.getElementById("admin-panel").style.display = "block";
        alert("Admin logged in");
      } else {
        alert("Access denied: Not an admin");
      }
    })
    .catch(error => {
      alert("Login failed: " + error.message);
    });
}

// 📝 Add Quiz Question (Admin only)
function addQuestion(questionData) {
  db.collection("quizzes").add(questionData)
    .then(docRef => {
      alert("Question added with ID: " + docRef.id);
    })
    .catch(error => {
      alert("Error adding question: " + error.message);
    });
}

// 🧾 Handle Admin Question Form Submission
document.getElementById("add-question-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const questionData = {
    question: document.getElementById("question").value,
    options: [
      document.getElementById("option1").value,
      document.getElementById("option2").value,
      document.getElementById("option3").value,
      document.getElementById("option4").value
    ],
    answer: document.getElementById("answer").value,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  addQuestion(questionData);
});

// 🔍 Display Quiz Questions (for students)
function loadQuizzes() {
  db.collection("quizzes").orderBy("createdAt", "desc").get()
    .then(snapshot => {
      const quizContainer = document.getElementById("student-quiz");
      quizContainer.innerHTML = "<h3>Available Quizzes</h3>";
      snapshot.forEach(doc => {
        const data = doc.data();
        const quizHTML = `
          <div class="quiz-question">
            <p><strong>Q:</strong> ${data.question}</p>
            <ul>
              ${data.options.map(opt => `<li>${opt}</li>`).join("")}
            </ul>
          </div>
        `;
        quizContainer.innerHTML += quizHTML;
      });
    })
    .catch(error => {
      console.error("Error loading quizzes:", error.message);
    });
}

// 🔄 Load quizzes on page load
window.onload = function() {
  loadQuizzes();
  document.getElementById("admin-panel").style.display = "none"; // Hide admin panel by default
};
