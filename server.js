import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const port = 3000;
const app = express();

//middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.set('view engine' , 'ejs');



mongoose.connect(`mongodb+srv://ngawangg:applepie@cluster0.7h0rl9g.mongodb.net/truly?retryWrites=true&w=majority` ,);


const postSchema = {
    postNumber: Number,
    title: String ,
    questionText:String ,
    answer:String,
    imageUpload:String ,
    url:String,
    submitTime:Date,
    subject:String,
    topic:String ,
    
}

const Post = mongoose.model("Post", postSchema );


// app.post("/",function(req,res){
//     const post = new Post({
    
//         title : req.body.title,
//         question : req.body.questionText ,
//         answer : req.body.answer, 
//         imageUpload : req.body.imageUpload,
//         url : req.body.url,
//         submitTime: req.body.submitTime,
//         subject: req.body.subject,
//         topic:req.body.topic ,
//     });
//     post.save()
//     res.redirect('/check')
// });

app.post("/", async function(req, res) {
    try {
        // Count the existing posts
        const postCount = await Post.countDocuments();

        // Create a new post with the incremented post number
        const post = new Post({
            postNumber: postCount + 1,
            title: req.body.title,
            question: req.body.questionText,
            answer: req.body.answer,
            imageUpload: req.body.imageUpload,
            url: req.body.url,
            submitTime: req.body.submitTime,
            subject: req.body.subject,
            topic: req.body.topic,
        });

        // Save the new post
        await post.save();
        res.redirect('/check');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



app.get("/" , function(req,res){
    Post.find({},function(err,posts){
        res.render("home",{
         posts : posts,
        })
     })
})

app.get('/home', async (req, res) => {
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
});




app.get('/check' , (req,res)=>{
    res.render('check.ejs');
})



app.get('/admin' , (req,res)=>{
    res.render('admin.ejs');
})


// Authentication and security
app.post('/admin',(req,res)=>{
    const password = req.body.password;
    if(password === "ngawang"){
        res.render('admin.ejs')
    }
})



app.get('/api/posts/next/:postNumber', async (req, res) => {
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
            res.render('home', {
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


app.listen(port , () => {
    console.log(`server is running at port ${port}`)
})

