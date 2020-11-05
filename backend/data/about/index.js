const mission = `The core philosophy of ValueTube is to respect the values of individuals, tailoring YouTube videos results to best suit its users. This website has been created so that users can browse YouTube videos which are filtered using their unique value profile based on the Schwartz theory of basic values. The unique value profile assigned to users is created using a survey presented during sign-up, allowing the system to tailor a unique experience to every ValueTube user.
<br></br>
For this to be possible, the ValueTube team has implemented a machine learning model which extracts comment data from YouTube videos and uses these to decide on the possible values that the video holds. It is expected that this system will have numerous benefits for all individuals, especially those who are more vulnerable and sensitive and do not wish to see distressing content.`;

const teamMembers = [
    {
        name:           "Davoud Mougouei",
        role:           "Project Supervisor",
        description:    "Dr. Davoud Mougouei has a Ph.D. in Software Engineering with 10+ years of professional experience with current research in software engineering, artificial intelligence and combinational optimisation.",
        email:          "davoud@uow.edu.au",
        img:            "DavoudMougouei_profile.jpg",
    },
    {
        name:           "Bethany Cooper",
        role:           "Team Manager/Backend Developer",
        description:    "I am currently studying a bachelor of information technology at UOW while working in sydney as a digital forensic analyst. For the Valuetube project I am currently responsible for architectural design and backend development after initially managing the project.",
        email:          "bwc928@uowmail.edu.au ",
        img:            "BethanyCooper_profile.jpg",
    },
    {
        name:           "Gustavo Borromeo",
        role:           "Team Manager/Documentation",
        description:    "I am in my final year of studies towards a Bachelor of Information Technology majoring in Network Design and Management. My roles on this team are the closing team manager and to work on documentation.",
        email:          "gb995@uowmail.edu.au ",
        img:            "BugsyBorromeo_profile.jpg",
    },
    {
        name:           "Jingxu Meng",
        role:           "Documentation",
        description:    "I am a Chinese girl who speaks Mandarin, English and Japanese. I am studying towards a Bachelor of Information Technology at UOW, love talking about cultures with different values with friends from all over the world.",
        email:          "jm877@uowmail.edu.au",
        phone:          "0468512068",
        img:            "JingxuMeng_profile.jpg",
    },
    {
        name:           "Liam Watts",
        role:           "Backend Developer",
        description:    "Hi I’m Liam, a 3rd Computer Science student majoring in Big Data who likes all things Math and AI. In this project I’ve worked on some of the data backend and primarily on building the ML models that we use for assigning values to videos and the recommendation algorithm.",
        email:          "lfw342@uowmail.edu.au",
        img:            "LiamWatts_profile.jpg",
    },
    {
        name:           "Tim Martin",
        role:           "Full Stack Developer",
        description:    "I am in my fourth year of my studies for a double degree for a Bachelor of Engineering (Mechatronics) and Bachelor of Computer Science. I am a full stack web developer and primarily worked as the frontend developer for the ValueTube project.",
        email:          "tm894@uowmail.edu.au",
        img:            "TimMartin_profile.jpg",
    }
];

const About = {
    mission,
    teamMembers,
};

module.exports = About;
