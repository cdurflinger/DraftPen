# DraftPen

DraftPen is a blogging platform with a built in CMS. It features front page blogs that can be read by anyone and the ability for users to create content and edit/delete their own content. Permission levels add value by allowing admin level users to moderate the content of others.

# Getting Started
This application is not currently hosted anywhere so it must be cloned in order to run. Follow the steps below in order to demo/test the application.

1. Install git if you do not already have it installed. It can be installed from [here](https://git-scm.com/downloads).
2. Install node.js if you do not already have it installed. It can be installed from [here](https://nodejs.org/en/download/).
3. Clone this repo by typing `git clone https://github.com/cdurflinger/DraftPen.git` in your git command line. The link to the repo can also be found above by clicking the 'Clone or download' button.
4. Once the repo has been cloned, navigate to the repo folder via the command line and run `npm install`. This command will install all necessary dependencies.
5. Run the database init file by navigating to the root folder of the repe in the command line and run `node init.js`. This will setup the database with a default user 'admin' that has full access.
6. Launch the application by running the command `node index.js` while in the root folder of the repo. This will start the node server.
7. Open your browser and navigate to localhost:5000.

# Built With
This project is built with Node.js, Express.js, Passport.js, Express.Sessions, JavaScript, HTML, and SASS. I have incorporated the latest ES6 JavaScript standards in order to learn more about the syntax/features of the language.

# Structure
I tried my best to incorporate the MVC structure to this project. Most of the models are included in index.js and routes folder. The views are kept in the views folder and controllers in the controller folder.

# What I learned
My primary goal with this project was about learning more about the backend and rendering data/pages to the user. I learned a lot about Express.js and setting up routes within the app. I learned how to incorporate templating engines (Handlebars) with Express and using static files on rendered pages. I also learned about using body-parser to parse incoming Ajax data from the front-end to dynamically update the database/front-end.

I also learned about databases in this project. The project was created with SQLite because it is a lightweight database which allows the use of memory storage or storage via a local file which suited my database needs. I only had a little experience with Mongodb proir to this project.

I learned/utilized the following technologies as well:
  - Node.js
  - Express.js
  - Handlebars
  - Express Session
  - Bcrypt
  - Passport
  - Express Validator
  - SQLite
  - MVC
  
  
# Notes
I did not focus much on the styling of this project. It does not look like a well styled application for that reason. The best view for this application will be mobile view for now. Most of my time/effort went into learning as much as I could about http, Node, Express, structure and the above technologies and how to implement them.
