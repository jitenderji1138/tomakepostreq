const express = require("express");
const app = express();
const admin = require("firebase-admin");
const credentials = require("./credential.json");
const path = require('path');
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
        const response = await Netflix.get();
        let responseArr = [];
        response.forEach(doc => {
            responseArr.push(doc.data());
        });
        res.send(responseArr);
    } catch (error) {
        res.send(error);
    }
});
app.get('/Free-Netflix/:FileID', async(req, res)=>{
    try{
        const Netflix = db.collection("Free-Netflix").doc(req.params.FileID);
        const response = await Netflix.get();
        res.send(response.data());
    }
    catch(error){
        res.send(error);
    }
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
    console.log(`Free Netflix is running on PORT ${PORT}`)
})