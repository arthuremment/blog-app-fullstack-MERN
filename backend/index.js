import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import mongoose from 'mongoose'
import path from 'path'
const app = express()
const Schema = mongoose.Schema;
const port = 4000

const corsOption = {
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ["GET", "POST"]
}
app.use(cors(corsOption))
app.use(express.json())
const router = express.Router();

const public_path = path.join(__dirname, './build');
app.use(express.static(public_path));
app.get("*", (_, res) => {
    res.sendFile(path.join(public_path, 'index.html'))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

dotenv.config();

const uri = process.env.STRING_URI;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

mongoose.connect(uri, clientOptions)
    .then(() => console.log('successfully connected to db'))
    .catch(err => console.log(err))

//Schema
let postSchema = new Schema({
    title: String,
    content: String
})


let Post = mongoose.model('Post', postSchema)

app.use('/', router)
router.route('/').get((_, res) => {
    Post.find()
        .then(function (posts) {
            res.send(posts);
            console.log(posts);
        })
        .catch(function (err) {
            res.status(400);
            console.log(err);
        })
})

router.route('/insert').post((req, res) => {
    let post = new Post(req.body)

    post.save()
        .then(() => {
            res.status(200).send({ message: `${post.title} is successfully added` })
            console.log('post successfully created')
        })
        .catch(err => {
            console.log(err)
            res.status(400).send({ error: `error adding document ${err}` })
        })
})