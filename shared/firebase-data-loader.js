// --- Wspólny loader prywatnych danych Firebase / Shared Firebase private data loader ---
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

const FIREBASE_IMPORT_SCHEMA_VERSION = "datavault-firebase-import-v1";
const DATA_PATH = "datavault/live";
let app, auth, database, authReadyPromise;

function getFirebaseConfig(){ return window.WG_FIREBASE_CONFIG || {}; }
function getDataAccessEmail(){ return window.WG_DATA_ACCESS_EMAIL || ""; }

function assertFirebaseRuntimeConfig(){
  const config = getFirebaseConfig();
  if (!config || typeof config !== "object") throw new Error("MISSING_WG_FIREBASE_CONFIG");
  if (!config.apiKey) throw new Error("MISSING_FIREBASE_API_KEY");
  if (!config.authDomain) throw new Error("MISSING_FIREBASE_AUTH_DOMAIN");
  if (!config.databaseURL) throw new Error("MISSING_FIREBASE_DATABASE_URL");
  if (!config.projectId) throw new Error("MISSING_FIREBASE_PROJECT_ID");
  if (!getDataAccessEmail()) throw new Error("MISSING_DATA_ACCESS_EMAIL");
}

function initFirebaseDataAccess(){
  if(!app){
    assertFirebaseRuntimeConfig();
    const firebaseConfig = getFirebaseConfig();
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    database = getDatabase(app);
    authReadyPromise = setPersistence(auth, browserLocalPersistence).then(()=>new Promise((resolve)=>{
      const unsubscribe = onAuthStateChanged(auth, (user)=>{ unsubscribe(); resolve(user); });
    }));
  }
  return {app,auth,database};
}
async function waitForAuthReady(){ initFirebaseDataAccess(); return authReadyPromise; }
function getCurrentUser(){ initFirebaseDataAccess(); return auth.currentUser; }
async function loginWithGroupPassword(password){
  initFirebaseDataAccess();
  const clean=String(password||"").trim();
  if(!clean) throw new Error("EMPTY_PASSWORD");
  const email = getDataAccessEmail();
  if(!email) throw new Error("MISSING_DATA_ACCESS_EMAIL");
  return signInWithEmailAndPassword(auth,email,clean);
}
async function logoutDataAccess(){ initFirebaseDataAccess(); await signOut(auth); }
function unwrapDataVaultPayload(v){ if(v&&v.schemaVersion===FIREBASE_IMPORT_SCHEMA_VERSION&&typeof v.dataJson==='string'){ try{return JSON.parse(v.dataJson);}catch(e){const w=new Error('FIREBASE_IMPORT_DATAJSON_PARSE_FAILED');w.cause=e;throw w;} } return v; }
async function loadDataVaultLive(){ initFirebaseDataAccess(); const user=await waitForAuthReady(); if(!user) throw new Error('NOT_AUTHENTICATED'); const s=await get(ref(database,DATA_PATH)); if(!s.exists()) throw new Error('DATA_NOT_FOUND'); return unwrapDataVaultPayload(s.val()); }
function getReadableAccessError(error, lang='pl'){
  const code=String((error&&(error.code||error.message))||'');
  if(code.includes('EMPTY_PASSWORD')) return lang==='en'?'Enter the access password.':'Podaj hasło dostępu.';
  if(code.includes('MISSING_WG_FIREBASE_CONFIG')) return lang==='en'?'Firebase configuration is missing.':'Brakuje konfiguracji Firebase.';
  if(code.includes('MISSING_FIREBASE_API_KEY')) return lang==='en'?'Firebase apiKey is missing.':'Brakuje apiKey w konfiguracji Firebase.';
  if(code.includes('MISSING_FIREBASE_AUTH_DOMAIN')) return lang==='en'?'Firebase authDomain is missing.':'Brakuje authDomain w konfiguracji Firebase.';
  if(code.includes('MISSING_FIREBASE_DATABASE_URL')) return lang==='en'?'Firebase databaseURL is missing.':'Brakuje databaseURL w konfiguracji Firebase.';
  if(code.includes('MISSING_FIREBASE_PROJECT_ID')) return lang==='en'?'Firebase projectId is missing.':'Brakuje projectId w konfiguracji Firebase.';
  if(code.includes('MISSING_DATA_ACCESS_EMAIL')) return lang==='en'?'Firebase access email is missing.':'Brakuje technicznego e-maila dostępu Firebase.';
  if(code.includes('auth/invalid-credential')||code.includes('auth/wrong-password')||code.includes('auth/user-not-found')) return lang==='en'?'Invalid access password.':'Nieprawidłowe hasło dostępu.';
  if(code.includes('NOT_AUTHENTICATED')) return lang==='en'?'Sign in to access private data.':'Zaloguj się, aby uzyskać dostęp do prywatnych danych.';
  if(code.includes('permission_denied')||code.includes('PERMISSION_DENIED')||code.includes('permission-denied')) return lang==='en'?'No permission to read private data.':'Brak uprawnień do odczytu prywatnych danych.';
  if(code.includes('DATA_NOT_FOUND')) return lang==='en'?'Private data was not found in Firebase.':'Nie znaleziono prywatnych danych w Firebase.';
  if(code.includes('FIREBASE_IMPORT_DATAJSON_PARSE_FAILED')) return lang==='en'?'Firebase data wrapper is invalid. Cannot parse dataJson.':'Wrapper danych w Firebase jest niepoprawny. Nie można sparsować dataJson.';
  if(code.includes('DATAVAULT_DATA_MISSING_SHEETS')) return lang==='en'?'Firebase data does not contain the expected sheets structure.':'Dane z Firebase nie mają oczekiwanej struktury sheets.';
  return lang==='en'?'Could not load private data.':'Nie udało się załadować prywatnych danych.';
}
window.DataVaultFirebase={initFirebaseDataAccess,waitForAuthReady,getCurrentUser,loginWithGroupPassword,logoutDataAccess,loadDataVaultLive,unwrapDataVaultPayload,getReadableAccessError};
window.DataVaultFirebaseReady=Promise.resolve(window.DataVaultFirebase);
window.dispatchEvent(new Event("datavault-firebase-loader-ready"));
