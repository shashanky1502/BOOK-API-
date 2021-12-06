require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

var bodyParser = require("body-parser");
//database
const database = require("./database");


//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");
const { json } = require("express");


//initialize express
const booky = express();
booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());


//Establish Database Connection
mongoose.connect(
  process.env.MONGO_URL     // url in .env file
).then(()=> console.log("Connection Established!!!!!"));

//GET ALL BOOKS
/*
Route           /
Description     Get all books
Access          Public
Parameter       NONE
Methods         GET
*/
booky.get("/", async (req,res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});

//GET A SPECIFIC BOOK localhost:3000/12345Book
/*
Route           /is
Description     Get specific book
Access          Public
Parameter       isbn
Methods         GET
*/
booky.get("/is/:isbn",async (req,res) => {
 const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});

  if(!getSpecificBook) {
    return res.json({
      error: `No book found for ISBN of ${req.params.isbn}`
    });
  }

  return res.json(getSpecificBook);

});

//GET BOOKS on a specific category
/*
Route           /c
Description     Get specific book
Access          Public
Parameter       category
Methods         GET
*/

booky.get("/c/:category", async (req,res)=> {

const getSpecificBook = await BookModel.find({category: req.params.category});
//If no specific book is returned then , the findone func returns null, and to execute the not
//found property we have to make the condn inside if true, !null is true.
if(getSpecificBook.length==0) {           //find function returns all the data which include the Parameter
  return res.json({
    error: `No book found for category of ${req.params.category}`
  });
}

return res.json({book: getSpecificBook});

});

//Assignment ******To get a list of books based on languages - ASSIGNMENT****************************************

booky.get("/lang/:langu", async (req,res) => {

    const getSpecificBook = await BookModel.find({language: req.params.langu});

    if(getSpecificBook.length==0) {
        return res.json({
            error: `No book found for language ${req.params.langu}`
        });
    }

    return res.json({book:getSpecificBook});
});
// ------------------------------------------------------------------------------------------------------------------------------------
//GET ALL AUTHORS
/*
Route           /author
Description     Get all authors
Access          Public
Parameter       NONE
Methods         GET
*/
booky.get("/author",async (req, res)=> {
  const getAllAuthors = await AuthorModel.find();
  return res.json({getAllAuthors});
});

//GET ALL AUTHORS BASED ON A BOOK
/*
Route           /author/book
Description     Get all authors based on book
Access          Public
Parameter       isbn
Methods         GET
*/

booky.get("/author/book/:isbn",async (req,res)=> {
  const getSpecificAuthor = await AuthorModel.find({books: req.params.isbn});

if(getSpecificAuthor.length==0) {
  return res.json({
    error: `No author found for isbn of ${req.params.isbn}`
  });
}

return res.json({authors: getSpecificAuthor});
});

//GET ALL PUBLICATIONS
/*
Route           /pub
Description     Get all publications
Access          Public
Parameter       NONE
Methods         GET
*/

booky.get("/publications", async (req,res) => {
  const getAllPublications = await PublicationModel.find();
  return res.json({getAllPublications});
});


//Assignment------------------------------------------------------------------------------------------------------------------------------------------
// to get specific publication - ASSIGNMENT
/*
Route           /pub/book
Description     Get specification publications
Access          Public
Parameter       NONE
Methods         GET
*/
booky.get("/pub/:book", async (req, res) => {
  const getSpecificPublication = await PublicationModel.findOne({books : req.params.book})
  //If no specific book is returned then , the findone func returns null, and to execute the not
//found property we have to make the condn inside if true, !null is true.
  if (!getSpecificPublication) {
      return res.json({
          error: `No publication found for isbn of ${req.params.book}`
      });
  }

  return res.json({ publication: getSpecificPublication });
});


//----------------------------------------------------------------------------------------------------------------------------------------------



//ADD NEW BOOKS
/*
Route           /book/new
Description     add new books
Access          Public
Parameter       NONE
Methods         POST
*/

booky.post("/book/new",async (req,res) => {
  const { newBook } = req.body;
  const addNewBook = BookModel.create(newBook);
  return res.json({
    books: addNewBook,
    message: "Book was added !!!"
  });
});

//ADD NEW AUTHORS
/*
Route           /author/new
Description     add new authors
Access          Public
Parameter       NONE
Methods         POST
*/

booky.post("/author/new", async (req,res)=> {
  const { newAuthor } = req.body;
AuthorModel.create(newAuthor);
  return res.json({authors: newAuthor, message: "Author was added"});
});



//Assignment----------------------------------------------------------------------------------------------------------------------------
  //ADD NEW publications
/*
Route           /publication/new
Description     add new publications
Access          Public
Parameter       NONE
Methods         POST
*/

booky.post("/publication/new", async (req,res)=> {
  const {newPublication} = req.body;
  PublicationModel.create(newPublication)
  return res.json({Publications: newPublication, message:"publication added"});
});
//-------------------------------------------------------------------------------------------------------------------------------------


//Update a book title
/*
Route           /book/update/:isbn
Description     update title of the book
Access          Public
Parameter       isbn
Methods         PUT
*/
booky.put("/book/update/:isbn", async (req,res)=> {
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      title: req.body.bookTitle
    },
    {
      new: true
    }
  );

  return res.json({books: updatedBook});
});



//UPADTE PUB AND BOOK
/*
Route           /publication/update/book
Description     update the pub and the book
Access          Public
Parameter       isbn
Methods         PUT
*/

booky.put("/publication/update/book/:isbn", (req,res)=> {
//UPDATE THE PUB DB
    database.publications.forEach((pub) => {
      if(pub.id === req.body.pubId) {
        return pub.books.push(req.params.isbn);
      }
    });
  
 //UPDATE THE BOOK DB
    database.books.forEach((book) => {
      if(book.ISBN == req.params.isbn) {
        book.publications = req.body.pubId;
        return;
      }
    });
  
    return res.json(
      {
        books: database.books,
        publications: database.publications,
        message: "Successfully updated!"
      }
    )
  
  });


//DELETE A BOOK
/*
Route           /book/delete
Description     delete a book
Access          Public
Parameter       isbn
Methods         DELETE
*/

booky.delete("/book/delete/:isbn", async (req,res)=> {
  const updateBookDatabase = await BookModel.findOneAndDelete({
    ISBN: req.params.isbn
  });

  return res.json({books: updateBookDatabase});
});

//DELETE AN AUTHOR FROM A BOOK AND VICE VERSA
/*
Route           /book/delete/author
Description     delete an author from a book and vice versa
Access          Public
Parameter       isbn, authorId
Methods         DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", async (req,res)=> {
  //Update the book db
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
     $pull: {
       authors: parseInt(req.params.authorId)
     }
   },
   {
     new: true
   }
 );

    //Update the author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
      {
        id: req.body.newAuthor
      },
      {
        $pull: {
          books: req.params.isbn
        }
      },
      {
        new: true
      }
    );
  
    return res.json(
      {
        bookss: updatedBook,
        authors: updatedAuthor,
        message: "author data updated"
      });

});



booky.listen(3000,()=>console.log("server is ON!!"));