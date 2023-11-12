import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const port = 3000;
const app = express();

//middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.set('view engine' , 'ejs');
app.use(express.static("public"));


// mongoose connection
mongoose.connect(`mongodb+srv://ngawangg:applepie@cluster0.7h0rl9g.mongodb.net/truly?retryWrites=true&w=majority` ,);

// mongoose schema
const postSchema = {
    postNumber: Number,
    title: String ,
    question:String ,
    answer:String,
    imageUpload:String ,
    url:String,
    submitTime:Date,
    subject:String,
    topic:String ,
    
}

const Post = mongoose.model("Post", postSchema );


app.get('/home' , (req,res)=>{
    res.render('single.ejs')
} )

// adding post or questions from the admin side
app.post("/", async function(req, res) {
    try {
        // Count the existing posts
        const postCount = await Post.countDocuments();

        // Create a new post with the incremented post number
        const post = new Post({
            postNumber: postCount + 1,
            title: req.body.title,
            question: req.body.question,
            answer: req.body.answer,
            imageUpload: req.body.imageUpload,
            url: req.body.url,
            submitTime: req.body.submitTime,
            subject: req.body.subject,
            topic: req.body.topic,
        });

        // Save the new post
        await post.save();
        res.redirect('/add-question');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



// getting a single quesitons on the main page
app.get("/" , async function(req,res){
    try {
        // Find the first post in the database
        const firstPost = await Post.findOne({}).sort({ postNumber: 1 });

        if (firstPost) {
            // Render the 'home' page with the first post
            res.render('home', {
                posts: [firstPost],
            });
        } else {
            console.log('No posts found in the database');
            res.status(404).json({ message: 'No posts found in the database' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})



// getting the list of every data availabe on the /data page
app.get('/data', (req, res) => {
    Post.find({},function(err,posts){
        res.json(posts)
     })
});



// A route to get the login page
app.get('/login' , (req,res)=>{
    res.render('check.ejs');
})


// admin route to add the new post or questions
app.get('/add-question' , (req,res)=>{
    res.render('admin.ejs');
})

// Authentication and security
// simple use of email and password to login . 
app.post('/add-question',(req,res)=>{
    const password = req.body.password;
    const email = req.body.email;
    if(password === "ngawang" && email === "ngawanglm07@gmail.com"){
        res.render('admin.ejs')
    } else {
        res.render('check.ejs')
    }
})



// get a specific post with the parameter postNumber
app.get('/api/:postNumber', async (req, res) => {
    let postNumber = parseInt(req.params.postNumber);

    try {
        const postCount = await Post.countDocuments();

        if (postNumber === 0) {
            postNumber = postCount;
        } else if (postNumber > postCount) {
            postNumber = 1;
        }

        const foundPost = await Post.findOne({ postNumber: postNumber });

        if (foundPost) {
            // Render the 'home' page with the specific post
            res.render('home.ejs', {
                posts: [foundPost],
            });
        } else {
            console.log(`Post with postNumber ${postNumber} not found`);
            res.status(404).json({ message: `Post with postNumber ${postNumber} not found` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// dummy email used inside footer
app.post('/email' , (req,res)=>{
    console.log(req.body.email);
    res.redirect('/home')
})

// getting a specific topic from the database
app.get('/search-item' , async (req,res)=>{
    const searchTopic = req.query.search;
     try {
         // Use the searchTopic to find relevant data in your MongoDB collection
         const searchResults = await Post.find({ subject : { $regex: new RegExp(searchTopic, 'i') } });
         if (searchResults.length > 0) {
             // Render a page or send a JSON response with the search results
             
             res.render('data.ejs', {posts:searchResults});
         } else {
            console.log('s')
            res.redirect('/');
 
         }
     } catch (error) {
         console.error(error);
         res.status(500).json({ message: 'Internal Server Error' });
     }
 })



app.listen(port , () => {
    console.log(`server is running at port ${port}`)
})



