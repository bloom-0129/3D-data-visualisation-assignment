# 3D Data Visualization Assignment

A 3D interactive data visualization webpage built with Three.js, CSS3DRenderer, and Google OAuth, based on the periodic table demo.

🚀 Live Demo

🔗 https://bloom-0129.github.io/3D-data-visualisation-assignment/

## 📌 Overview

This project visualizes user data from a Google Sheet inside a 3D environment.
The interface supports four layouts: Table, Sphere, Helix, and Grid, and each tile's color is based on Net Worth.

This assignment follows all required specifications.

### ✨ Features
1. Google OAuth Login
  - Login using Google Sign-In (Google Identity Services)
  - Web app configured with OAuth client ID
  - App is published & accessible to external users
    
2. Google Sheet Integration
  - Data is fetched directly from a shared Google Sheet (TSV format)
  - The sheet includes:
    Name, Photo, Age, Country, Interest, Net Worth
  - Data is auto-loaded after login

3. 3D Visualization (Three.js)
  - Each person is displayed as a 3D tile containing:
  - Profile photo
  - Name
  - Age
  - Interest
  - Net worth (with original currency formatting)

4. Net Worth Color Coding
  - Red = below $100K
  - Orange = between $100K and $200K
  - Green = above $200K

5. Four 3D Layouts

    | Layout      | Description                               |
    |-------------|--------------------------------------------|
    | **Table**   | Arranged in **20 × 10** structure          |
    | **Sphere**  | Even distribution on a 3D sphere           |
    | **Double Helix** | Two intertwined helices (DNA style)   |
    | **Grid**    | **5 × 4 × 10** 3D grid                     |

    Buttons allow switching between layouts with animations.


### 📁 Project Structure

```md
3D-data-visualisation-assignment/
├── index.html
├── index.css
├── script.js
├── Data Template.csv
├── build/
│   └── three.module.js
└── jsm/
    ├── controls/
    │   └── TrackballControls.js
    ├── renderers/
    │   └── CSS3DRenderer.js
    └── libs/
        └── tween.module.js
```

### 🔐 OAuth Setup Summary
  - OAuth Client ID created in Google Cloud Console
  - App type: Web Application
  - User type: External
  - Publishing status: In Production

#### Authorized JavaScript Origins:
- https://bloom-0129.github.io
- http://localhost
- http://127.0.0.1:5500

#### Authorized Redirect URIs
- https://bloom-0129.github.io/3D-data-visualisation-assignment/
- http://localhost:5500
- http://127.0.0.1:5500

### 📊 Data Source
- Google Sheet shared with required email (lisa@kasatria.com).
- Fetched using a public TSV export link.

### 🧪 How to Run Locally
1. Clone this repo
2. Host locally using VSCode Live Server or any static server
3. Make sure localhost is added in OAuth origins
4. Open browser → Login with Google → App loads

### 🧑‍💻 Technologies Used
- Three.js
- CSS3DRenderer
- JavaScript (ES Modules)
- Google OAuth
- Google Sheets TSV
- GitHub Pages Hosting

#### 📧 Contact

If the hiring team requires clarifications or an interview, feel free to reach out.
Thank you for reviewing this assignment!
