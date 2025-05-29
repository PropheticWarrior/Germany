
const firebaseConfig = {
  apiKey: "DEINE_API_KEY",
  authDomain: "DEIN_PROJEKT.firebaseapp.com",
  projectId: "DEIN_PROJEKT",
  storageBucket: "DEIN_PROJEKT.appspot.com",
  messagingSenderId: "DEINE_SENDER_ID",
  appId: "DEINE_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

function login() {
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  auth.signInWithEmailAndPassword(email, pass)
    .then(() => {
      document.getElementById('auth').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
      loadTermine();
    }).catch(console.error);
}

function register() {
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  auth.createUserWithEmailAndPassword(email, pass)
    .then(user => {
      user.user.sendEmailVerification();
      alert('Registriert! Bitte E-Mail bestätigen.');
    }).catch(console.error);
}

function logout() {
  auth.signOut().then(() => {
    document.getElementById('auth').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
  });
}

function addTermin() {
  const datetime = document.getElementById('termin').value;
  const user = auth.currentUser;
  if (!datetime || !user) return;
  db.collection("termine").add({
    team: user.email,
    zeit: datetime,
    erstellt: new Date()
  }).then(loadTermine);
}

function loadTermine() {
  db.collection("termine").where("team", "==", auth.currentUser.email)
    .get().then(snapshot => {
      let html = "";
      snapshot.forEach(doc => {
        html += `<p>${doc.data().zeit}</p>`;
      });
      document.getElementById("termine-liste").innerHTML = html;
    });
}
