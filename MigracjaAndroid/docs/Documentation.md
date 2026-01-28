# MigracjaAndroid — Documentation

## 1. Scope and purpose
This module contains a single, user‑facing document: `MigracjaAndroid/Migracja_Android.md`. The document is a **beginner‑friendly, step‑by‑step guide** describing how to wrap the WrathAndGlory HTML/JS modules into an Android WebView application (variant B: native wrapper). It also answers operational questions about hosting, updates, push notifications, and icon preparation.

The documentation is written to allow another person to recreate the described solution **1:1** based solely on the content.

---

## 2. Files and roles

### 2.1 `MigracjaAndroid/Migracja_Android.md`
This is the primary guide. It is structured as a Q&A with explicit, detailed steps for beginners. It contains:

1. **Step‑by‑step creation flow** for a WebView Android app, including:
   - Hosting the HTML modules online (e.g., GitHub Pages).
   - Installing Android Studio.
   - Creating an Android project using *Empty Activity*.
   - Adding WebView in layout XML.
   - Enabling JavaScript and loading the hosted URL.
   - Creating a second Activity for the Infoczytnik module.
   - Setting orientation per Activity (portrait for Infoczytnik, landscape for others).
   - Switching Activities either with a native button or by intercepting WebView URLs.
   - Running the app on a device or emulator.

2. **Answers to operational questions**:
   - **Online content updates (GM.html):** the app displays whatever is on the hosting server, so updating the file updates all users.
   - **Push notifications:** possible only with native Android integration (e.g., Firebase Cloud Messaging), not with plain HTML/WebView.
   - **File locations:** web files can be in any hosted folder as long as URLs match; the app must point to the correct paths.
   - **App icon requirements:** use Android Studio’s Image Asset tool to generate adaptive/legacy icons; supply a clean source image.
   - **Module updates:** if modules are hosted online, changes do not require rebuilding the APK unless native features are added.
   - **Data updates (`data.json`, `AudioManifest.xlsx`):** replace the hosted file and the app will load the new data without rebuilding.

3. **Summary statement** explaining that the WebView wrapper is built once and most future changes are made by updating hosted files, unless native features change.

---

## 3. Behavior and assumptions documented in the guide
The guide explicitly assumes:
- **Online‑only architecture** — all HTML/CSS/JS and data are served from a web host.
- **Two‑Activity approach** to enforce different orientations:
  - Main modules: `sensorLandscape`.
  - Infoczytnik: `portrait`.
- **No offline packaging** of assets inside the APK.
- **No custom build pipeline** — the Android app simply loads existing web pages.

---

## 4. Styles, fonts, and UI rules
No CSS, fonts, or UI styles are defined in this module. The document does not introduce any visual design changes. It only describes the native Android wrappers and hosting strategy.

---

## 5. How to extend the document
If new requirements appear, extend `Migracja_Android.md` by:
- Adding a new Q&A item with clear, beginner‑friendly steps.
- Updating the step‑by‑step section if new native features are required (e.g., camera, storage, GPS).
- Keeping the wording explicit about where to click and which files to open in Android Studio.

---

## 6. Changelog responsibility
Any future modification to `MigracjaAndroid/Migracja_Android.md` should be accompanied by updates to:
- `MigracjaAndroid/docs/README.md` (user‑facing instructions, in PL and EN),
- `MigracjaAndroid/docs/Documentation.md` (technical documentation of the guide’s structure and assumptions).
