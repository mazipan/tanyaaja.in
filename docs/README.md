# Setup Firebase & Firebase Admin

## Setup Firebase

### Create new firebase project

Go to https://console.firebase.google.com/ and click "create a project"

![Create project](./firebase-01-create-project.png)

### Input project name

You can type your desired project name

![Input project name](./firebase-02-input-name.png)

### Enable Google Analytics Integration

![Enable GA](./firebase-03-next-analytics.png)

### Select Google Analytics Account

![Select GA](./firebase-04-select-analytics.png)

### Your project should be ready

![Your project is ready](./firebase-05-project-ready.png)

### Select to install on the web app

![Select web installation](./firebase-06-web-install.png)

### Input your app name

![Input App Name](./firebase-07-app-name.png)

### Get the generated code

![Get the generated code](./firebase-08-code.png)

We only need the value, since the installation code was already in place.
You need to copy to your `.env.local`, see example:

```bash
# Get this env from firebaseConfig
NEXT_PUBLIC_FIREBASE_API_KEY="Copy from firebaseConfig.apiKey"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="Copy from firebaseConfig.authDomain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="Copy from firebaseConfig.projectId"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="Copy from firebaseConfig.storageBucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="Copy from firebaseConfig.messagingSenderId"
NEXT_PUBLIC_FIREBASE_APP_ID="Copy from firebaseConfig.appId"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="Copy from firebaseConfig.measurementId"
```

### Enable authentication

Click the sidebar

![Click Auth sidebar](./firebase-09-enable-auth.png)


### Enable Google sign-in method

![Enable Google sign in method](./firebase-10-choose-sign-in-method.png)

### Auto create oAuth client IDs

The public-facing name should be auto-filled. You need to input the support email. Then click save.

Firebase will automatically create an oAuth 2.0 Client IDs for you.

![Enable Google sign in method](./firebase-11-enable-google-sign-in.png)

## Setup Firebase Admin

### Go to project settings

Go to project settings by clicking the Cog Icon in the Project Overview's right side.

![Project setting menu](./firebase-12-project-settings.png)

### Generate new private key

Go to tab "Service accounts", then click "Generate new private key"

![Generate new private key](./firebase-13-generate-new-private-key.png)

You will get the json file. Please put in the root of your project, then rename the file into `TanyaAja-firebase-adminsdk.json`

### Put in .env.local

Since the format is json, we can not directly copy-paste the content to the `.env.local`.

Go to https://www.textfixer.com/tools/remove-line-breaks.php, then copy the json value and click "Remove Line Breaks"

![Remove line breaks](./firebase-14-remove-line-breaks.png)

Then you can copy the value from the website into the `.env.local`, see example:

```bash
# https://dev.to/vvo/how-to-add-firebase-service-account-json-files-to-vercel-ph5
# Make sure to add single quote here
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"XXX", "private_key_id":"XXX","private_key":"-----BEGIN PRIVATE KEY-----\nXXX\n-----END PRIVATE KEY-----\n","client_email": "XXX","client_id": "XXX","auth_uri":"XXX","token_uri": "XXX","auth_provider_x509_cert_url":"XXX","client_x509_cert_url":"XXX","universe_domain": "XXX"}'
```

### Enable Realtime Database

Click the sidebar "Realtime Database" in your Firebase Console.

![Sidebar RTDB](./firebase-15-sidebar-rtdb.png)

Then click "Create Database"

![Create RTDB](./firebase-16-create-rtdb.png)

Select your Database location, then click "Next".

![Select location](./firebase-17-select-region.png)

Select "Start in **test mode**"

![Select test mode](./firebase-18-select-test-mode.png)

### Copy the reference URL

Copy the reference link to `.env.local`. make sure to remove the trailing slash (`/`) at the end of string, see example:

```bash
REALTIME_DATABASE_URL="Reference link from Realtime Database in Firebase"
```

![Get the reference link](./firebase-19-reference-link.png)

### Update the Rule

![Update rule](./firebase-20-update-rule.png)

Update the rule, copy the value from file `.firebase/rule.json` in our repository.

Then publish it.

### Optional -- add Service Usage Consumer to the IAM

This step require if still facing error permission when running TanyaAja in your local.

Visit the GCP Cloud Console: [console.cloud.google.com](https://console.cloud.google.com/iam-admin/iam)

Select your project, and go to tab IAM.

Select one of the item in the table that already have role: "Firebase Realtime Database Admin".

Click "Edit Icon" or "Edit Principal".

Then click "ADD ANOTHER ROLE".

And find "Service Usage Consumer".

Then Save it.

## 😍 Happy Coding!