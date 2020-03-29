![ValueTube Logo](https://gitlab.com/ValueTube/ValueTube/-/raw/master/frontend/img/ValueTube_Logo.png)

The ValueTube team aims to build a machine learning algorithm which can ascertain the values held by YouTube videos from their metadata and comment section. To compliment this we shall also build a web interface for this "more human focused" search algorithm/filter, which allows people to search for and view YouTube videos which align with their values. The values model used by our project follows the Schwartz theory of basic values in order to provide a comprehensive range of values, and a fixed point to reference them from.
This project is being built as part of the CSIT321 - Project subject at the University of Wollongong, this subject is the capstone for the Bachelor of Computer Science and Bachelor of Information Technology.

Located in this repository is the software aspects of this project including all source code, full 
documentation on the contents of this repository and instructions on how to setup a development 
environment as well as the data used to train our machine learning algorithms.

As part of this project the ValueTube team will have to undertake several milestones of work to achieve the scope of this project. To begin with we will have to create a dataset of YouTube videos and their metadata and comments, to ensure the dataset is of a manageable size we shall only analyse 1000 – 2000 videos as our dataset. To do this we will have to write a data gathering tool which shall query the YouTube Data API to get video metadata and comments. Once we have a database of video metadata and comments, we will have to create a training dataset of 200 – 500 videos by manually evaluating the videos. Once we have these two datasets, we can build our machine learning algorithm which uses the video metadata and comments to assign values to each video. While this AI section is being built, we can also create the web interface for this project. To do this we have to design the front-end, for the video search, recommendations and playing of videos (comments can also be shown). We will also have to create the various functionality for the front-end of the web interface including, sign up, login, playing video from YouTube’s servers, searching our video database, etc. As an extension on this project we can enable users to login with Google and use their Google account data to automatically determine what values a user has so that their search results and recommendations align with the values they want to view.

## Setting up a Development Environment

To set up the development environment for this project you must first create a GitLab account, you can do this by 
following the link [here](https://gitlab.com/users/sign_in#register-pane).

Next you must make sure several programs are installed on your computer, these programs include:
- [git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/)
- [Sass](https://sass-lang.com/)
- A software development environment e.g. [Visual Studio](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Community&rel=16)

Once you have these programs installed you can download and modify the GitLab repository.

#### Command Line/Terminal

To connect to GitLab via the command line you must run a few commands on the command line/terminal. First you must ensure git is added to your
environment variables, the process for doing this can be found [here](https://docs.alfresco.com/4.2/tasks/fot-addpath.html).

Then you must create a folder where you wish to store the project and then open this folder in the command line/terminal. Once there run the
following command.

Then you can clone the repository to your project folder by running the following command. You will have to log in using your GitLab username and password, to ensure you have permission to clone this project.
```
git clone https://gitlab.com/ValueTube/ValueTube.git
```
You should now have a copy of the master branch of this repository stored locally on your machine for you to edit and run as required.

## Running the project

To run the project on your local machine once you have downloaded a copy of the latest master branch all you have to do is open a command
line/terminal window in the folder containing the code for the master branch (Visual Studio has this built into the *Package Manager Console*).
From here all you need to do is run the following line of code, to execute the project.
```
node ./index.js
```
The output from this project can be viewed in any browser windows, by going to the following url.
```
localhost:8080
```
Optionally you can run the project using the node package manager using the following command.
```
npm start
```
The project may also need to be built to see changes that require compilation by one of the modules used. To compile the changes in the project run the following command.

#### Windows
```
build
```

## Workflow for editing/adding code to this repository
When you wish to modify the code in this repository you must follow a simple process to minimise errors and maximise productivity. First you must go to the *Issues Board*  for this repository and ensure nobody else is currently working on the specific problem you plan on addressing. If there are no existing projects for the task you wish to complete, the next task you must complete, is to create a new project pane with the following information and structure.
```
Relevant Title
Short description of what and why
References to related sections, resources or issues
List of outcomes to be met
Any other relevant notes
```
Once this is completed, move the pane for the tasks you are currently working on into the *In Progress* column of the projects dashboard.

Now you need to open the folder where this repository is stored locally on your computer and ensure follow a series of steps which can be completed in both Visual Studio and the Command Line.

#### Command Line

Open the folder containing your local repository via the command line, Then you must ensure you have the most recent version of the *master* branch by running a *Pull* on this branch using the following command.
```
git checkout master
git pull origin master
```

Now that you have the most recent version of *master* you must create a new local branch for the particular project you are working on (Ensure you use logical naming conventions, preferably using the same name as the title for the project pane you are currently working on; formatted using [Pascal Case](https://en.wiktionary.org/wiki/Pascal_case)), by running the following command. Then you can *check out* this branch and make changes to the code as necessary.
```
git checkout master
git branch <branch-name>
git checkout <branch-name>
```

During the coding on your new branch you should periodically *commit* your changes on your branch (preferably at least once a day). Commits should include a sensible commit message (this message should briefly and concisely cover what has been changed since the last commit). To do this you can use the following commands.
```
git add <files-that-you-wish-to-commit>
git commit -m <message>
```
If no new files have been added to the repository you can instead use.
```
git commit -a -m <message>
```

Once you have completed coding on your branch you now have to perform a *rebase* on your code. This is done to update your branch to the latest
version of the *master* branch to prevent errors and conflicts when your branch is merged into the master branch. The first step when performing a *rebase* operation is to *pull* the latest version of *master* in the same way as before. Now you *check out* your branch and enter the following code, dealing with any merge conflicts as they appear.
```
git checkout master
git pull origin master
git checkout <branch-name>
git rebase master
```
Now you should check that the *rebase* operation hasn't caused any issues/errors and you code changes still work. Then you should *commit* all the new changes on your branch.

Now that you have performed a *rebase* on your branch you are ready to push your local branch up to the GitLab repository so that you can perform a *pull request* on your branch. (You can do this at any time to share your branch with other members of the team, however you should not complete a *pull request* until you have completed the changes to your code and the outcomes addressed in the project pane referencing this branch). To push your code all you need to do is run the following command.
```
git push https://gitlab.com/ValueTube/ValueTube.git <branch-name>
```

When you wish to complete a *pull request* on your code go to the GitLab repository and you should either be prompted to create a pull request, or you can select *New pull request* and include the following information.
```
Title of the project pane
Link to the project pane
Short description of the changes the pull request implements
Outcomes from the project pane to be checked
Any other relevant notes
```
Once a pull request is completed somebody else must read, run and review your code to ensure it follows all the guidelines set out in this document as well as adding comments on changes or improvements to be made on the code. Once this is complete and all changes have been fixed (by the original creator) the new branch can be merged with the *master* branch and deleted so that the process may start again.

While your branch is under review you should ensure all functions and new dependencies are documented in the wiki following the guidelines set out in regards to the documentation for this project. A pull request should not me merged until the documentation is completed.

If you come across an issue while working on or using the code in this repository which is unrelated to your current project, you should add this issue to the *Issues* tab on this GitLab repository, including all nessessary information as you would when writing a new project pane.

## Guidelines for writing code for this repository

All code written in this repository should follow the guidelines set out below to ensure that all of the code in this repository is easy to read and debug and uses 
consistent syntax formatting and naming conventions. To ensure this, when writing and reviewing code the following points should be considered.
- Variable names are logical and related to what they contain, they are formatted using [Camel Case](https://en.wikipedia.org/wiki/Camel_case)
- Function names ale logcal and related to what they contain, they are formatted using [Pascal Case](https://en.wiktionary.org/wiki/Pascal_case)
- Struct and type names are logical and related to what they contain, they are formatted as all letters lowercase with underscores
- Indentaion is logical and easy to read, children of loops, logical statements, functions, etc. are indented from their parents. It is recommended to use 4 spaces for a single tab.
- Long lines of text are broken up over several lines where possible, try to aim for a line length of around 150 characters
- Brackets with content spanning multiple lines are placed on seperate lines to their content (the first bracket may be on the same line as the parent)
- Spacing is added whereever it is logical and makes the code easy to read
- Single line comments are in line with the first line they reference, after the code
- Multiple line comments are on a seperate line to the code they reference, on the line directly above the line they refernce, large blocks of meaningless characters
are not used to seperate multi-line comments from the rest of the code
- Comments are used whenever clarification of a line or section of code is needed and are as clear and consise as possible
- For Sass variables, variable names should follow the `$component-state-property-size` formula for consistent naming. Ex: $nav-link-disabled-color and $modal-content-box-shadow-xs.

## Resources for learning how to program this project
- [Git Documentation](https://git-scm.com/docs)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)
- [W3Schools](https://www.w3schools.com/)
- [Node Package Manager](https://www.npmjs.com/)
- [Youtube Data API Reference](https://developers.google.com/youtube/v3)
- [Schwartz Theory of Basic Values](https://i2s.anu.edu.au/resources/schwartz-theory-basic-values)

## Supervisor
- [@dmougouei](https://gitlab.com/dmougouei) Davoud Mougouei

## Authors
- [@WiredAlice](https://gitlab.com/WiredAlice) Alice Duk (6139565)
- [@bethTheDeath](https://gitlab.com/bethTheDeath) Bethany Cooper (6137003)
- [@bugsy924](https://gitlab.com/bugsy924) Gustavo Borromeo (5430276)
- [@JingM](https://gitlab.com/JingM) Jingxu Meng (6117375)
- [@Wattsy2020](https://gitlab.com/Wattsy2020) Liam Watts (5759778)
- [@tm894](https://gitlab.com/tm894) Timothy Martin (5726803)

## Acknowledgments
[<img src="https://www.uow.edu.au/content/groups/public/@web/documents/siteelement/uow171491.png" alt="University of Wollongong" width="400">](https://www.uow.edu.au/index.html)

[<img src="https://www.youtube.com/about/static/svgs/icons/brand-resources/YouTube-logo-full_color_light.svg" alt="YouTube" width="400">](https://www.youtube.com/)