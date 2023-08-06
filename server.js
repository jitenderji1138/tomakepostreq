const express = require("express");
const app = express();
const admin = require("firebase-admin");
const credentials = require("./credential.json");
admin.initializeApp({
    credential: admin.credential.cert(credentials)
})
app.set('view engine', 'ejs');
app.set('views', __dirname);
const db = admin.firestore();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.post('/Add-Movie', async (req, res)=>{
    try{
        const id = req.body.FileID;
        const data = {
            "Title" : req.body.Title,
            "Image" : req.body.Image,
            "MainCategory" : req.body.MainCategory,
            "Geans" : req.body.Geans,
            "FileID" : req.body.FileID,
            "Plateform" : req.body.Plateform,
        };
        const response = db.collection("Free-Netflix").doc(id).set(data)
        res.send(response)
    }
    catch(error){
        res.send(error);
    }
})
app.get('/', async (req, res) => {
    try {
        res.render('index', { pageTitle: 'Free Netflix' });
    } catch (error) {
        res.send(error);
    }
});
app.get('/Free-Netflix', async (req, res) => {
    try {
        const Netflix = db.collection("Free-Netflix");
        const limit = parseInt(req.query.limit) || 20;
        const page = parseInt(req.query.page) || 1;
        const maincategory = req.query.MainCategory;
        const geans = req.query.Geans;
        const response = await Netflix.get();
        let responseArr = response.docs.reverse().map(doc => doc.data());
        const start = (page-1)*limit;
        const end = limit*page;
        if(maincategory){
            responseArr = responseArr.filter(item => item.MainCategory === maincategory);
        }
        if(geans){
            responseArr = responseArr.filter(item => item.Geans === geans);
        }
        responseArr = responseArr.slice(start, end);
        res.send({
            Owner:"jitenderji1137",
            Linkedin:"https://www.linkedin.com/in/jitender1137/",
            Instagram:"https://www.instagram.com/vijayji1137/",
            Github:"https://github.com/jitenderji1137",
            Email:"trademetrader1137@gmail.com",
            Size:response._size,
            Page:page,
            Limit:limit,
            "Free-Netflix": responseArr
        });
    } catch (error) {
        res.send(error);
    }
});
app.get('/Free-Netflix/:FileID', async(req, res)=>{
    try{
        const Netflix = db.collection("Free-Netflix").doc(req.params.FileID);
        const response = await Netflix.get();
        res.send({
            Owner:"jitenderji1137",
            Linkedin:"https://www.linkedin.com/in/jitender1137/",
            Instagram:"https://www.instagram.com/vijayji1137/",
            Github:"https://github.com/jitenderji1137",
            Email:"trademetrader1137@gmail.com",
            "Free-Netflix": response.data()});
    }
    catch(error){
        res.send(error);
    }
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
    console.log(`Free Netflix is running on PORT ${PORT}`)
})
