import Database from "better-sqlite3";

const db = new Database("./data.db", {
    verbose: console.log,
});

db.exec(`
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS subreddits;

CREATE TABLE users (
    id INTEGER,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    displayName TEXT NOT NULL UNIQUE,
    PRIMARY KEY (id)
);

CREATE TABLE subreddits (
    id INTEGER,
    description TEXT,
    background TEXT,
    PRIMARY KEY (id)
);
CREATE TABLE posts (
    id INTEGER,
    userId INTEGER,
    subredditId INTEGER,
    title TEXT,
    content TEXT,
    createdAt TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (userId) REFERENCES users(id)
    FOREIGN KEY (subredditId) REFERENCES subreddits(id) 
);
`);

const users = [
    {
        name: "Denis",
        email: "denis@email.com",
        password: "denis",
        displayName: "Den"
    },
    {
        name: "Elon",
        email: "elon.musk@email.com",
        password: "tesla",
        displayName: "Elon"
    },
    {
        name: "Tim",
        email: "tim.cook@email.com",
        password: "apple",
        displayName: "Tim"
    },
    {
        name: "Warren",
        email: "warren.buffet@email.com",
        password: "cocacola",
        displayName: "Warren"
    },
    {
        name: "Bill",
        email: "bill.gates@email.com",
        password: "microsoft",
        displayName: "Bill"
    }
]




const subreddits = [
    {
        descripton: "description one",
        background: "background one",
    },
    {
        descripton: "description two",
        background: "background two",
    },
    {
        descripton: "description three",
        background: "background three",
    }
]


const posts = [
    {
        userId: 1,
        subredditId: 1,
        title: "first post",
        content: "content of first post",
        createdAt: "01/01/2020"
    },
    {
        userId: 2,
        subredditId: 2,
        title: "second post",
        content: "content of second post",
        createdAt: "01/01/2020"
    },
    {
        userId: 3,
        subredditId: 3,
        title: "third post",
        content: "content of third post",
        createdAt: "01/01/2020"
    }

]


const createUser = db.prepare(`
INSERT INTO users (name, email, password, displayName) VALUES (?, ?, ?, ?)
`)

for (const user of users) {
    createUser.run(user.name, user.email, user.password, user.displayName)
}


const createSubreddit = db.prepare(`
INSERT INTO subreddits (description, background) VALUES (?, ?)
`)
for (const subreddit of subreddits) {
    createSubreddit.run(subreddit.descripton, subreddit.background)
}


const createPost = db.prepare(`
INSERT INTO posts (userId, subredditId, title, content, createdAt) VALUES (?, ?, ?, ?, ?)
`)
for (const post of posts) {
    createPost.run(post.userId, post.subredditId, post.title, post.content, post.createdAt)
}