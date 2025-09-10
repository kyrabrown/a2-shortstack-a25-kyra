# Coffee Shop Orders ☕🍂

A prototype two-tier web application where users can place, edit, and delete coffee and food orders.  
Built using **HTML, CSS, JavaScript, and Node.js**, with active client–server communication.  

The app maintains a dataset of orders in memory and automatically adds a **derived field**:  
`readyInMin`, the estimated preparation time based on the drink/food ordered.

---

## How to Run
1. Clone or fork this repository.  
2. Install dependencies (only `mime` is required):  
   `npm install`
3. Start the server:  
  `node server.improved.js`
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Features (Baseline Requirements)

- **Server**  
  - Serves static files (`index.html`, `main.css`, `main.js`).  
  - Maintains an in-memory dataset with fields:  
    - `id`, `name`, `drink`, `food`, `createdOn`, and derived `readyInMin`.  

- **Results Functionality**  
  - `/results` endpoint returns all orders in JSON.  
  - Displayed in an HTML `<table>` dynamically updated on the client side.  

- **Form/Entry Functionality**  
  - Users can submit new orders with name, drink, and food.  
  - Each row in the results table has **Edit** and **Delete** buttons.  

- **Server Logic**  
  - When a new order is received, the server runs `getPrepTimeInMin(drink, food)`  
    to compute `readyInMin` before saving the order.  

- **Derived Field**  
  - Example: Ordering *latte + sandwich* → prep time = **8 minutes**.  

---

## HTML
- `<form>` with inputs for `name`, `drink`, and `food`.  
- `<table>` displays all current orders with headers for every field.  
- Single-page interface (`index.html` is the entry point).  
- Passes W3C validation.  

---

## CSS
- **Theme**: cozy fall coffee shop aesthetic 🎃☕  
  - Background: deep brown `rgb(92, 50, 50)`  
  - Fonts: [Handlee](https://fonts.google.com/specimen/Handlee) (body), [Pacifico](https://fonts.google.com/specimen/Pacifico) (headings)  
  - Dotted cream borders with rounded corners  
- **Selectors demonstrated**:  
  - Element (`body`, `h1`, `table`, etc.)  
  - Class (`.borderbox`, `.menu`)  
  - ID (`#show-results`, `#submit-btn`)  
- **Flexbox layout** used for arranging drinks/food menu side-by-side.  
- Styled table with alternating row colors and vertical/horizontal borders.  
- External stylesheet (`main.css`) with organized, maintainable rules.  

---

## JavaScript
- **Client-side logic (`main.js`)**  
  - `submit()` → sends new order to `/submit`.  
  - `getResults()` → fetches all current orders from `/results`.  
  - `updateResults()` → redraws the results table dynamically.  
  - Event delegation for **Delete** and **Edit** buttons in each row.  
  - Edit uses `prompt()` popups to allow updating fields inline.  

---

## Node.js
- **Server (`server.improved.js`)**  
  - Uses Node’s built-in `http` and `fs` modules.  
  - Endpoints:  
    - `GET /` → serves homepage  
    - `GET /results` → returns dataset in JSON  
    - `POST /submit` → adds new order with derived field  
    - `POST /delete` → removes order by `id`  
    - `POST /edit` → updates fields for an existing order and recalculates prep time  

---

## Technical Achievements
- **Single-page app**:  
  Form submission, results display, edit, and delete all update without page reloads.  
- **Edit functionality**:  
  Users can modify an existing order directly from the results table.  

---

## Design Achievements
- Coffee shop theme with emojis, fall colors, and custom Google Fonts.  
- Rounded dotted border boxes for a “cute, cozy” aesthetic.  
- **Flexbox** layout for menu presentation.  
- Informal user feedback led to spacing adjustments between menu and results.  

---
my results func not working / being called
like what padding is
the difference between flex and grid

## Challenges
Some challenges I faced during this assignment was first getting the actual functionality down.  i started with the starter code input files, added my desried fields `name`, `drink`, and `food` and watching the console to approve that the informaiton was getting back to the code and server.  Once I got the desired `POST` and `GET` requests working and validated the information could be sent and received between the `main.js`, `index.html`, and `server.imporved.js` files.  After the actual logic was working and the base requirments were fufilled, I added things to my `main.css` file to make the UI look nice.

### POST (with Javascript)
- /submit
- /edit
- /delete

### GET
- /results

### CSS

### HTML

### whatever forms for requriments / design elems

---

I then validated my Render link using the w3 website.
---

## AI Usage
I used Chat GPT to explain concepts used in this assignment, but did not have it write any code for me.  AI specifically aided me in understanding how CSS / HTML tags work, the general format of the document, and helped me debug when my image was not showing up on my webpage.

---

## Sources Consulted
- [W3Schools – Forms, Tables, CSS](https://www.w3schools.com)  
https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms
https://www.w3schools.com/tags/tag_table.asp
https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/tbody 
https://www.w3schools.com/jsref/prop_html_innerhtml.asp 
https://www.w3schools.com/html/html_tables.asp
https://www.w3schools.com/tags/ref_httpmethods.asp
https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button
https://www.w3schools.com/js/js_htmldom_eventlistener.asp
https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListene
https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/tr 
https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt - learned about prompt
https://www.w3schools.com/html/html_css.asp
https://www.w3schools.com/cssref/pr_border.php
https://www.w3schools.com/cssref/pr_class_display.php
https://www.w3schools.com/w3css/w3css_containers.asp
