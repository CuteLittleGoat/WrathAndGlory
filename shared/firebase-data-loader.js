// --- Wspólny loader prywatnych danych Firebase / Shared Firebase private data loader ---
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

const FIREBASE_IMPORT_SCHEMA_VERSION = "datavault-firebase-import-v1";
const DATA_PATH = "datavault/live";
const PRIVATE_DATA_APP_NAME = "wh40k-data-slate-private-data";
let app;
let auth;
let database;
let authReadyPromise;
let currentAuthUser = null;

function getFirebaseConfig(){ return window.WG_FIREBASE_CONFIG || {}; }
function getDataAccessEmail(){ return window.WG_DATA_ACCESS_EMAIL || ""; }
// --- Pobranie lub utworzenie nazwanej aplikacji prywatnych danych / Get or create named Firebase app for private data ---
function getPrivateDataApp(){
  const firebaseConfig = getFirebaseConfig();
  const existing = getApps().find((candidate) => candidate.name === PRIVATE_DATA_APP_NAME);
  if (existing) return existing;
  return initializeApp(firebaseConfig, PRIVATE_DATA_APP_NAME);
}

function assertFirebaseRuntimeConfig(){
  const config = getFirebaseConfig();
  if (!config || typeof config !== "object") throw new Error("MISSING_WG_FIREBASE_CONFIG");
  if (!config.apiKey) throw new Error("MISSING_FIREBASE_API_KEY");
  if (!config.authDomain) throw new Error("MISSING_FIREBASE_AUTH_DOMAIN");
  if (!config.databaseURL) throw new Error("MISSING_FIREBASE_DATABASE_URL");
  if (!config.projectId) throw new Error("MISSING_FIREBASE_PROJECT_ID");
  if (!getDataAccessEmail()) throw new Error("MISSING_DATA_ACCESS_EMAIL");
}

// --- Debug stanu auth bez danych wrażliwych / Auth state debug without sensitive data ---
function debugAuthState(label){
  const user = auth ? (auth.currentUser || currentAuthUser) : null;
  console.info("[DataVaultFirebase]", label, {
    appName: app ? app.name : null,
    projectId: app && app.options ? app.options.projectId : null,
    databaseURL: app && app.options ? app.options.databaseURL : null,
    hasAuth: !!auth,
    hasCurrentUser: !!user,
    uid: user ? user.uid : null,
    email: user ? user.email : null
  });
}

function initFirebaseDataAccess(){
  if(!app){
    assertFirebaseRuntimeConfig();
    app = getPrivateDataApp();
    auth = getAuth(app);
    database = getDatabase(app);
    authReadyPromise = setPersistence(auth, browserLocalPersistence)
      .catch((error) => {
        console.warn("Firebase Auth persistence warning:", error);
      })
      .then(() => new Promise((resolve) => {
        let resolved = false;

        onAuthStateChanged(auth, (user) => {
          currentAuthUser = user || null;

          if (!resolved) {
            resolved = true;
            resolve(currentAuthUser);
          }
        });
      }));
    debugAuthState("after initFirebaseDataAccess");
  }
  return {app,auth,database};
}

async function waitForAuthReady(){
  initFirebaseDataAccess();
  await authReadyPromise;
  currentAuthUser = auth.currentUser || currentAuthUser || null;
  return currentAuthUser;
}

function getCurrentUser(){
  initFirebaseDataAccess();
  return auth.currentUser || currentAuthUser || null;
}

async function loginWithGroupPassword(password){
  initFirebaseDataAccess();
  const clean=String(password||"").trim();
  if(!clean) throw new Error("EMPTY_PASSWORD");
  const email = getDataAccessEmail();
  if(!email) throw new Error("MISSING_DATA_ACCESS_EMAIL");

  const credential = await signInWithEmailAndPassword(auth,email,clean);
  currentAuthUser = credential.user || auth.currentUser || null;
  authReadyPromise = Promise.resolve(currentAuthUser);
  debugAuthState("after login");

  if (currentAuthUser && typeof currentAuthUser.getIdToken === "function") {
    await currentAuthUser.getIdToken(true);
  }

  return credential;
}

async function logoutDataAccess(){
  initFirebaseDataAccess();
  await signOut(auth);
  currentAuthUser = null;
  authReadyPromise = Promise.resolve(null);
}

function unwrapDataVaultPayload(v){ if(v&&v.schemaVersion===FIREBASE_IMPORT_SCHEMA_VERSION&&typeof v.dataJson==='string'){ try{return JSON.parse(v.dataJson);}catch(e){const w=new Error('FIREBASE_IMPORT_DATAJSON_PARSE_FAILED');w.cause=e;throw w;} } return v; }

async function loadDataVaultLive(){
  initFirebaseDataAccess();
  await waitForAuthReady();
  const user = auth.currentUser || currentAuthUser || null;
  debugAuthState("before loadDataVaultLive");
  if(!user) throw new Error('NOT_AUTHENTICATED');
  if (typeof user.getIdToken === "function") await user.getIdToken();
  const s=await get(ref(database,DATA_PATH));
  if(!s.exists()) throw new Error('DATA_NOT_FOUND');
  return unwrapDataVaultPayload(s.val());
}

function getReadableAccessError(error, lang='pl'){
  const code=String((error&&(error.code||error.message))||'');
  if(code.includes('EMPTY_PASSWORD')) return lang==='en'?'The angered Machine Spirit replies: the Litany of Access has not been recited.':'Rozgniewany Duch Maszyny odpowiada: Litania Dostępu nie została wypowiedziana.';
  if(code.includes('MISSING_WG_FIREBASE_CONFIG')) return lang==='en'?'The Machine Spirit detected a configuration fault: Firebase configuration is missing.':'Duch Maszyny wykrył usterkę konfiguracji: brakuje konfiguracji Firebase.';
  if(code.includes('MISSING_FIREBASE_API_KEY')) return lang==='en'?'The Machine Spirit detected a configuration fault: Firebase apiKey is missing.':'Duch Maszyny wykrył usterkę konfiguracji: brakuje apiKey w konfiguracji Firebase.';
  if(code.includes('MISSING_FIREBASE_AUTH_DOMAIN')) return lang==='en'?'The Machine Spirit detected a configuration fault: Firebase authDomain is missing.':'Duch Maszyny wykrył usterkę konfiguracji: brakuje authDomain w konfiguracji Firebase.';
  if(code.includes('MISSING_FIREBASE_DATABASE_URL')) return lang==='en'?'The Machine Spirit detected a configuration fault: Firebase databaseURL is missing.':'Duch Maszyny wykrył usterkę konfiguracji: brakuje databaseURL w konfiguracji Firebase.';
  if(code.includes('MISSING_FIREBASE_PROJECT_ID')) return lang==='en'?'The Machine Spirit detected a configuration fault: Firebase projectId is missing.':'Duch Maszyny wykrył usterkę konfiguracji: brakuje projectId w konfiguracji Firebase.';
  if(code.includes('MISSING_DATA_ACCESS_EMAIL')) return lang==='en'?'The Machine Spirit detected a configuration fault: Firebase access email is missing.':'Duch Maszyny wykrył usterkę konfiguracji: brakuje technicznego e-maila dostępu Firebase.';
  if(code.includes('auth/invalid-credential')||code.includes('auth/wrong-password')||code.includes('auth/user-not-found')) return lang==='en'?'The angered Machine Spirit replies: the Litany of Access was rejected.':'Rozgniewany Duch Maszyny odpowiada: Litania Dostępu została odrzucona.';
  if(code.includes('auth/invalid-api-key')) return lang==='en'?'The Machine Spirit detected a false access sigil: invalid Firebase apiKey.':'Duch Maszyny wykrył fałszywy znak dostępu: nieprawidłowy apiKey Firebase.';
  if(code.includes('auth/configuration-not-found')) return lang==='en'?'Firebase Authentication is not configured for the Firebase app currently used. Check that GeneratorNPC uses the private data app wh40k-data-slate-private-data, not the old favorites Firebase project.':'Firebase Authentication nie jest poprawnie skonfigurowane dla aktualnie użytej aplikacji Firebase. Sprawdź, czy GeneratorNPC używa aplikacji wh40k-data-slate-private-data, a nie starego projektu favorites.';
  if(code.includes('auth/operation-not-allowed')) return lang==='en'?'The Machine Spirit rejected the rite: email/password sign-in is disabled for this Firebase project.':'Duch Maszyny odrzucił rytuał: logowanie e-mail/hasło jest wyłączone w tym projekcie Firebase.';
  if(code.includes('NOT_AUTHENTICATED')) return lang==='en'?'The Machine Spirit denies access: the Rite of Authentication has not been completed. If this appears after entering the password, the Auth session was not detected after login.':'Duch Maszyny odmawia dostępu: Rytuał Uwierzytelnienia nie został ukończony. Jeżeli widzisz to po wpisaniu hasła, aplikacja nie wykryła sesji Auth po logowaniu.';
  if(code.includes('permission_denied')||code.includes('PERMISSION_DENIED')||code.includes('permission-denied')) return lang==='en'?'The Machine Spirit denies access: no authorization to read K.O.Z.A. classified data.':'Duch Maszyny odmawia dostępu: brak autoryzacji do odczytu danych z klauzulą tajności K.O.Z.A.';
  if(code.includes('DATA_NOT_FOUND')) return lang==='en'?'The Machine Spirit detected an empty data reliquary: private data was not found in Firebase.':'Duch Maszyny wykrył pusty relikwiarz danych: nie znaleziono prywatnych danych w Firebase.';
  if(code.includes('FIREBASE_IMPORT_DATAJSON_PARSE_FAILED')) return lang==='en'?'Firebase data wrapper is invalid. Cannot parse dataJson.':'Wrapper danych w Firebase jest niepoprawny. Nie można sparsować dataJson.';
  if(code.includes('DATAVAULT_DATA_MISSING_SHEETS')) return lang==='en'?'The Machine Spirit detected an incomplete archive schema: Firebase data does not contain the expected sheets structure.':'Duch Maszyny wykrył niepełny schemat archiwum: dane z Firebase nie mają oczekiwanej struktury sheets.';
  return lang==='en'?'The Machine Spirit is silent: could not load private data.':'Duch Maszyny milczy: nie udało się załadować prywatnych danych.';
}

window.DataVaultFirebase={initFirebaseDataAccess,waitForAuthReady,getCurrentUser,loginWithGroupPassword,logoutDataAccess,loadDataVaultLive,unwrapDataVaultPayload,getReadableAccessError};
window.DataVaultFirebaseReady=Promise.resolve(window.DataVaultFirebase);
window.dispatchEvent(new Event("datavault-firebase-loader-ready"));
