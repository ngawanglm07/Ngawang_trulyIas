import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const port = 3000;
const app = express();

//middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.set('view engine' , 'ejs');


let questionarr = [];

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


app.listen(port , () => {
    console.log(`server is running at port ${port}`)
})

