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


app.post("/",function(req,res){
    const post = new Post({
        title : req.body.title,
        question : req.body.questionText ,
        answer : req.body.answer, 
        imageUpload : req.body.imageUpload,
        url : req.body.url,
        submitTime: req.body.submitTime,
        subject: req.body.subject,
        topic:req.body.topic ,
    });
    post.save()
    res.redirect('/check')
});


app.get("/" , function(req,res){
    Post.find({},function(err,posts){
        res.render("home",{
         posts : posts,
        })
        console.log(posts.length)
      
     })
})



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



app.get('/api/posts/next/:id', async (req, res) => {
    const postId = req.params.id;
  
    try {
      // Use findById to find a document by its _id
      const foundPost = await Post.findById(postId);
  
      if (foundPost) {
        // Render the 'home' page with the specific post
        res.render('home', {
          posts: [foundPost], // Pass the found post as an array to match your rendering logic
        });
      } else {
        console.log(`Post with id ${postId} not found`);
        res.status(404).json({ message: `Post with id ${postId} not found` });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });



app.listen(port , () => {
    console.log(`server is running at port ${port}`)
})

