const books = [
    {
        ISBN: "12345Book",
        title: "Getting started with MERN",
        pubDate: "2021-12-05",
        language: "en",
        numPage: 250,
        author: [1,2],
        publications: [1],
        category: ["tech","programming","education"]
    }
];

const author =[
    {
        id: 1,
        name: "shashank",
        books: ["12345Book","Mybook"]
    },
    {
        id: 2,
        name: "Elon Musk",
        books: ["12345Book"]
    }
];

const publications = [
    {
        id: 1,
        name: "Writex",
        books: ["12345Book"]
    },
    {
        id:2,
        name: "writex2",
        books:[]
    }
];

module.exports = {books,author,publications};