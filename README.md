# clIMAX <img src="./static/images/logo.png" width="100" height="68"/>

> 30/11/2022

## Project content

- Folder *"Database"* containing the .js files that form the database
- Folder *"Features"* containing the different .feature files with all customer needs
- Folder *"ORM"* containing different .drawio files representing the schemes of the database
- Folder *"server"* contains the .js file that launches the server, the adjacent functions allowing the server to work and the database
- Folder *"static"* collecting many folders
  * Folder *"age_ratings"* containing different images to indicate age restrictions
  * Folder *"css"* containing the .css files that stylize each html page
  * Folder *"images"* containing some pictures to represent the cinema
  * Folder *"Posters"* containing the posters from every movie in the database
  * Folder *"scripts"* containing the .js files which are used for web pages execution
  * Folder *"templates"* containing the .html files, the raw web pages (as ejs format files)
- Folder *"tests"* collecting the tests done to check the site proper functioning
- The files *"cert.pem"* and *"key.pem"* used for website security
- The file *"package.json"* records important metadata about the project, listing all dependencies of the server(node.js)

* LINFO1212, group PF07

---

## How to use?

1. Download the project package
2. Download and install [node.js](https://nodejs.org/en/)
3. Write `npm install` on your terminal to download all dependencies needed
4. Make sure to have well set up [openssl](https://www.openssl.org/)
5. Launch the server writing `node server\express_server.js` on the terminal or just by pressing the f5 key on the file *"server.js"* open window
6. Go to [clIMAX](https://localhost:8080/) website and enjoy the experience! :D

---

## Authors

| Name    | Last name        | Email address                         |
| ------- | ---------------- | ------------------------------------- |
| Eduart  | Abdullahu        | eduart.abdullahu@student.uclouvain.be |
| Isaías | Antúnez García | isaias.antunez@student.uclouvain.be   |
| Adham   | Elzawawi         | adham.elzawawi@student.uclouvain.be   |

## Contributions

- Home page (Adham)
- Movie page (Isai)
- Reservation page (Eduart)
- Connection page (Isai)
- User page (Adham)
- Adding movie page (Eduart)
