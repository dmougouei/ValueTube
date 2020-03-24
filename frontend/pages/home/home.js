import Card from "../../components/card/card.js";

const metadata = {
    thumbnail:      "https://i.ytimg.com/vi/Ks-_Mh1QhMc/maxresdefault.jpg",     // "./img/test_thumbnail.jpg",
    title:          "Your body language may shape who you are | Amy Cuddy",     // "Title",
    contentCreator: "TED",                                                      // "John Doe",
    views:          "1.1M",
    published:      "2 weeks ago",
    duration:       "2:34"
};
let card = new Card(document.body, metadata);
card.render();