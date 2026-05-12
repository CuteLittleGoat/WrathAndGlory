// --- Wspólny loader prywatnych danych Firebase / Shared Firebase private data loader ---
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
const FIREBASE_IMPORT_SCHEMA_VERSION = "datavault-firebase-import-v1";
const DATA_PATH = "datavault/live";
const firebaseConfig = window.WG_FIREBASE_CONFIG || {};
const DATA_ACCESS_EMAIL = window.WG_DATA_ACCESS_EMAIL || "";
let app, auth, database, authReadyPromise;
function initFirebaseDataAccess(){ if(!app){ app=getApps().length?getApp():initializeApp(firebaseConfig); auth=getAuth(app); database=getDatabase(app); authReadyPromise=setPersistence(auth,browserLocalPersistence).then(()=>new Promise(r=>{const u=onAuthStateChanged(auth,x=>{u();r(x);});})); } return {app,auth,database}; }
async function waitForAuthReady(){ initFirebaseDataAccess(); return authReadyPromise; }
function getCurrentUser(){ initFirebaseDataAccess(); return auth.currentUser; }
async function loginWithGroupPassword(password){ initFirebaseDataAccess(); const clean=String(password||"").trim(); if(!clean) throw new Error("EMPTY_PASSWORD"); if(!DATA_ACCESS_EMAIL) throw new Error("MISSING_DATA_ACCESS_EMAIL"); return signInWithEmailAndPassword(auth,DATA_ACCESS_EMAIL,clean);}
async function logoutDataAccess(){ initFirebaseDataAccess(); await signOut(auth);}
function unwrapDataVaultPayload(v){ if(v&&v.schemaVersion===FIREBASE_IMPORT_SCHEMA_VERSION&&typeof v.dataJson==='string'){ try{return JSON.parse(v.dataJson);}catch(e){const w=new Error('FIREBASE_IMPORT_DATAJSON_PARSE_FAILED');w.cause=e;throw w;} } return v; }
async function loadDataVaultLive(){ initFirebaseDataAccess(); const user=await waitForAuthReady(); if(!user) throw new Error('NOT_AUTHENTICATED'); const s=await get(ref(database,DATA_PATH)); if(!s.exists()) throw new Error('DATA_NOT_FOUND'); return unwrapDataVaultPayload(s.val()); }
function getReadableAccessError(error, lang='pl'){ const code=String((error&&(error.code||error.message))||''); if(code.includes('EMPTY_PASSWORD')) return lang==='en'?'Enter the access password.':'Podaj hasło dostępu.'; if(code.includes('auth/invalid-credential')||code.includes('auth/wrong-password')||code.includes('auth/user-not-found')) return lang==='en'?'Invalid access password.':'Nieprawidłowe hasło dostępu.'; if(code.includes('NOT_AUTHENTICATED')) return lang==='en'?'Sign in to access private data.':'Zaloguj się, aby uzyskać dostęp do prywatnych danych.'; return lang==='en'?'Could not load private data.':'Nie udało się załadować prywatnych danych.'; }
window.DataVaultFirebase={initFirebaseDataAccess,waitForAuthReady,getCurrentUser,loginWithGroupPassword,logoutDataAccess,loadDataVaultLive,unwrapDataVaultPayload,getReadableAccessError};
window.DataVaultFirebaseReady=Promise.resolve(window.DataVaultFirebase);
