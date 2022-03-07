import express from 'express'
// import cors from 'cors'
import Database from 'better-sqlite3'

const app = express()
// app.use(cors())
app.use(express.json())

const db = new Database('./data.db', {
    verbose: console.log
})


const getAllUsers = db.prepare(`SELECT * FROM users`)
const getUserById = db.prepare(`SELECT * FROM users WHERE id=?;`)
const createUser = db.prepare(`INSERT INTO users(username,email,password) VALUES (?,?,?);`)
const login = db.prepare(`SELECT * FROM users WHERE email=? `)

const getAllSubreddits = db.prepare(`SELECT * FROM subreddits`)
const getSubredditById = db.prepare(`SELECT * FROM subreddits WHERE id=?;`)
const createSubreddit = db.prepare(`INSERT INTO subreddits(name,description,background) VALUES (?,?,?);`)

const getAllPosts = db.prepare(`SELECT * FROM posts `)
const getPostById = db.prepare(`SELECT * FROM posts WHERE id=?;`)
const createPost = db.prepare(`INSERT INTO posts(description,title,created,userId,subredditId) VALUES(?,?,?,?,?);`)


const getCommentById = db.prepare(`SELECT * FROM comments WHERE id=?;`)
const getCommentsByPostId = db.prepare(`SELECT  * FROM comments WHERE postId=?;`)
const createComment = db.prepare(`INSERT INTO comments(text,userId,postId) VALUES (?,?,?); `)

// Getting all users

app.get('/users', (req, res) => {
    const allUsers = getAllUsers.all()
    res.send(allUsers)
})


//Posting to Users

app.post('/users', (req, res) => {
    const { username, email, password } = req.body

    let errors = []

    if (typeof username !== 'string') errors.push('Username missing or not a string')
    if (typeof email !== 'string') errors.push('Email missing or not a string')
    if (typeof password !== 'string') errors.push('Password missing or not a string')


    if (errors.length === 0) {
        const result = createUser.run(username, email, password)

        const newUser = getUserById.run(result.lastInsertRowid)
        res.send(newUser)
    }
    else {
        res.status(400).send({ error: errors })
    }
})



// Getting Subreddits


app.get('/subreddits', (req, res) => {
    const allSubreddits = getAllSubreddits.all()

    res.send(allSubreddits)
})

app.get('/subreddits/:id', (req, res) => {
    const id = req.params.id

    const subreddit = getSubredditById.get(id)
    if (subreddit) {
        res.send(subreddit)
    }
    else {
        res.status(404).send({ error: 'Subreddit  Not Found' })
    }
})


// Poating Subreddits

app.post('/subreddits', (req, res) => {
    const { name, description, background } = req.body

    let errors = []

    if (typeof name !== 'string') errors.push('Name missing or not a string')
    if (typeof description !== 'string') errors.push('Description missing or not a string')
    if (typeof background !== 'string') errors.push('Background missing or not a string')


    if (errors.length === 0) {
        const result = createSubreddit.run(name, description, background)

        const newSubreddit = getSubredditById.run(result.lastInsertRowid)

        res.send(newSubreddit)
    }
    else {
        res.status(400).send({ error: errors })
    }
})



// Get Posts    

app.get('/posts/:id', (req, res) => {
    const id = req.params.id

    const post = getPostById.get(id)

    if (post) {
        const user = getUserById.get(post.userId)
        post.user = user
        const subreddit = getSubredditById.get(post.subredditId)
        post.subreddit = subreddit
        const comments = getCommentsByPostId.all(post.id)
        post.comments = comments
        res.send(post)
    }

    else {
        res.status(404).send({ error: 'Post not found' })
    }
})

app.get('/posts', (req, res) => {

    const allposts = getAllPosts.all()
    for (const post of allposts) {
        const user = getUserById.get(post.userId)
        post.user = user
        const subreddit = getSubredditById.get(post.subredditId)
        post.subreddit = subreddit
        const comments = getCommentsByPostId.all(post.id)
        post.comments = comments

    }
    res.send(allposts)

})

// Posting to posts

app.post('/posts', (req, res) => {
    const { description, title, created, userId, subredditId } = req.body

    let errors = []

    if (typeof description !== 'string') errors.push('Description missing or not a string')
    if (typeof title !== 'string') errors.push('Title missing or not a string')
    if (typeof created !== 'string') errors.push('Created Date missing or not a string')
    if (typeof userId !== 'number') errors.push('UserId missing or not a number')
    if (typeof subredditId !== 'number') errors.push('SubredditId missing or not a number')

    if (errors.length === 0) {
        const result = createPost.run(description, title, created, userId, subredditId)

        const newPost = getPostById.run(result.lastInsertRowid)

        res.send(newPost)
    }
    else {
        res.status(400).send({ error: errors })
    }
})

// Posting to comments

app.post('/comments', (req, res) => {
    const { text, userId, postId } = req.body

    let errors = []
    if (typeof text !== 'string') errors.push('Text missing or not a string')
    if (typeof userId !== 'number') errors.push('UserId missing or not a number')
    if (typeof postId !== 'number') errors.push('PostId missing or not a number')


    if (errors.length === 0) {
        const result = createComment.run(text, userId, postId)
        const newComment = getCommentById.run(result.lastInsertRowid)
        res.send(newComment)
    }
    else {
        res.status(400).send({ error: errors })
    }
})





//Joining tables many to many

// const gjej  Intervistuesut per Applicantet = db.prepare(`
// SELECT intervituesit.* FROM intervistuesit
// JOIN takimet ON intervistuesit.id = takimet.interviewerId
// WHERE takimet.applicantId = ?;
// `);


// const getSubredditsForUsers = db.prepare(`
// SELECT subreddits.* FROM subreddits
// JOIN posts ON subreddits.id = posts.subredditId
// WHERE posts.userId = ?
// `)



// const getApplicantsForInterviewer = db.prepare(`
// SELECT applicants.* FROM applicants
// JOIN interviews ON applicants.id = interviews.applicantId
// WHERE interviews.interviewerId = ?;
// `);




app.post('/sign-in', (req, res) => {
    // to sign in, the user needs to send us their email and passowrd
    const { email, password } = req.body
    // check if the email exists
    // check if the password matches
    // give them back the user if they match
    // give them back an error if they don't
    res.send({ error: 'Poop' })
})



app.listen(4000, () => {
    console.log(`Running on: http://localhost:4000`)
})