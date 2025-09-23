# A3 Updated Coffee Shop Orders ☕🍂

This assignment builds off of my A2 assignent, a prototype two-tier web application where users can place, edit, and delete coffee and food orders.  
Built using **HTML, CSS, JavaScript, and Node.js**, with active client–server communication.  
**Render Link:** https://a2-kyrabrown.onrender.com/

## How to Run
1. Clone or fork this repository.  
2. Install dependencies (only `mime` is required):  
   `npm install`
3. Start the server:  
  `node server.improved.js`
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Baseline Requirements
For A3, I...
- Created a server using **Express**.
- Added **login and logout** functionality with **Results** functionality which shows all data associated with a logged in user (shown in top bar)
- Updated the existing **Form/Entry** functionality which allows users to *add*, *modify*, and *delete* data
- Used **MongoDB** for persistent data storage in between server sessions
- Used the CSS Frameowrk **Tailwind** to do the bulk of my styling for me

- **HTML**  
  - Text inputs for username and password in the login form (`#login-username`, `#login-password`).
  - Text inputs for name, drink, food in the order form (`#yourname`, `#yourdrink`, `#yourfood`).
  - Proper `<label for=...>` pairs and required attributes for accessible, validated inputs.
  - To fully satisfy “various flavors” (textarea / checkboxes / radio), add minimal extras to your order form (super quick):
    - Radio buttons (ex.size): Small/Medium/Large
    - Checkboxes (ex. add-ons): Oat milk / Extra shot / Whipped cream
    - Textarea (ex. special instructions): No ice, etc

  - Can display all data for a particular authenticated user:
    - The table in “All Orders (results)” renders rows from /results for that specifc signed in user
    - On the server, /results filters by the current req.session.userId, so the table shows only the logged-in user’s orders (not everyone’s)
    = This meets the assignment’s “different from previous assignment” requirement (user-scoped, not global).

- **HTML**  
  - Switched to Tailwind via CDN for the primary styling (framework-first approach)   
  - Kept overrides minimal, mainly used main.css for fonts or fallback
  - Accessibility improvements: high contrast colors, adding `aria-hidden="true"` for screen readers to skip over emojis in menu, focus-visible states, labeled form controls

- **JavaScript**  
  - Front-end JS (in `js/main.js`) handles:
    - Auth: POST `/auth/login`, reads responses, toggles the UI (shows #app after login)
    - Updated: POST `/submit` to create, GET `/results` to refresh and render the table using express
    - Updated Edit/Delete: POST `/edit` and `/delete`, then re-render using express
    - Rendering: JS populates `#results-body` with the current user’s orders so the UI stays in sync with the server.
    - Have clearly labeled buttons for Edit, Delete, and Submit functionaltiy
If you haven’t added the Edit/Delete buttons yet, just render them per row and wire to /edit and /delete—you already have the endpoints

- **Node.js**  
  - *Express* server with JSON parsing and static serving from `public/` and `views/` pages.
  - Sessions via express-session + secure httpOnly cookie; used to associate requests with the logged-in user
Authentication routes:
- `POST /auth/login`: creates a user if new (hashing with bcrypt), or logs in existing users
- `GET /auth/me`: returns auth state
- `POST /auth/logout`: destroys session
MongoDB persistence:
- Connected via MongoDB Atlas URI; created users and orders collections; unique index on users.username
- All order operations are scoped by userId (ObjectId from the session)
Routes:
- `GET /results` (read current user’s orders),
- `POST /submit` (create order; also computes readyInMin),
- `POST /edit` (update order + recompute readyInMin),
- `POST /delete` (delete order)

- Kept the existing derived field: readyInMin computed server-side (getPrepTimeInMin) from drink/food—nice example of server logic beyond CRUD

- **General**  
Achieved at least 90% on the `Performance`, `Best Practices`, `Accessibility`, and `SEO` tests using Google [Lighthouse](https://developers.google.com/web/tools/lighthouse)

## Deliverables
### 1. Converted server to Express
- Rewrote the Node.js server to use **Express**.  
- Middleware handles:
  - Serving static files from `public/` and `views/`.  
  - Parsing JSON bodies (`express.json()`).  
  - Managing sessions with `express-session`.

### 2. Persistent data in MongoDB
- Connected to **MongoDB Atlas** using credentials in `.env`.  
- Created `users` and `orders` collections.  
- Orders store: `userId`, `name`, `drink`, `food`, `createdOn`, and a derived `readyInMin`.  
- Users collection enforces unique usernames.

### 3. User accounts and login
- **Account creation / login** combined into `/auth/login`:  
  - New users: password hashed with **bcrypt** and inserted.  
  - Existing users: password validated with `bcrypt.compare`.  
- **Sessions**:  
  - On login, `req.session.userId` is set.  
  - An HTTP-only session cookie links the browser to this session.  
- **Protected routes**:  
  - `requireAuth` middleware blocks access unless `req.session.userId` is present.  
  - Routes like `/results`, `/submit`, `/edit`, `/delete` only work for logged-in users.  
- **Profile route**: `/auth/profile` returns safe user info (username, createdAt) without the password hash. Displayed in the UI above the results table.

### 4. Front-end functionality
- **Login form** with username/password.  
- **Order form** for name, drink, and food (all required).  
- **Results table** shows only the logged-in user’s orders.  
- Each row has **Edit** and **Delete** buttons that call `/edit` and `/delete`.  
- User info bar shows “Signed in as … • Account created …” after login.  

### 5. Styling with Tailwind
- CSS handled via **TailwindCSS CDN**.  
- Colors/fonts chosen for a cozy coffee shop theme.  
- Accessibility:
  - Semantic HTML tags (`header`, `main`, `section`, `footer`).  
  - Labeled inputs with `for`/`id`.  
  - Skip link for keyboard users.  
  - Color contrast and focus-visible states.  
  - `aria-live` for login messages.

### 6. Deployment to Render
- Deployed to Render with proper environment variables (`SESSION_SECRET`, `USERNAME`, `PASSWORD`, `HOST`, `MONGO_DB`).  
- Verified that the site loads and login/order features work.  
- Example URL: `https://a3-FirstnameLastname.onrender.com`

### 7. Naming scheme
- Repo and pull request both follow the scheme: `a3-FirstnameLastname`.


## AI Usage
I used Chat GPT to explain concepts used in this assignment.  It came up with some good ideas to optimize my code such as encrypting the passowrds.  It also helped me utilize tailwind and walked me through the steps to replace my main.css with the CMD tailwind and implementing that right into my indes.html.  Here, I learned how to make custom color pallets with a tailwind config, all inside my html file.  This front end UI part was the main area I used ChatGPT for in this assignment.

---

## Sources Consulted
https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction
https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/thead
https://cloud.mongodb.com/v2/68cff3dd968e334e1843f3cb#/security/network/accessList
https://www.mongodb.com/docs/manual/core/security-users/
https://tailwindcss.com/
https://www.w3schools.com/js/js_promise.asp
https://tailwindcss.com/docs/colors
https://tailwindcss.com/docs/theme
https://github.com/jmcuneo/cs4241-guides/blob/master/using.express.md?plain=1
https://github.com/jmcuneo/cs4241-guides/blob/master/using.mongodb.md
https://stackoverflow.com/questions/13904291/how-to-implement-login-remember-me-using-cookies-in-express-js
https://expressjs.com/en/resources/middleware/cookie-session.html

to do:
add ALL data related to user (except password) 
- maybe shown after login or under restuls header above table
  add this to the README


## Challenges / Additional Features and Changes
Created 2 collections, one for `Users` and one for `Orders`.
Got to use some database knowledge and linked the two tables by having the objectID of the user be a foreign key in each order.

Created an encrypted passowrd using `bcrypt `to allow for a more secure database (not storing the literal string)
- `npm i express express-session mongodb bcrypt dotenv`

Used a random hex string to get the "session secret" instead of a simple string.
- `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))" to get session secret`

Originally there was a results button to update the table of orders, now the table updates autoamtically by calling the update results button instead of having it triggered by a button manually

Saved information to connect to database (endpoint) like password and host in a `.env` file for better security

Used cookie based session using express-session.  After a successful login, the server puts the user’s _id into the session, and the browser gets an HTTP-only cookie that identifies that session on future requests. Any “protected” route checks the session (the requireAuth middleware). If it finds req.session.userId, the request is allowed; otherwise it returns 401.  On login, verify with bcrypt.compare(password, user.passwordHash).  Then, on success, set req.session.userId = ..
