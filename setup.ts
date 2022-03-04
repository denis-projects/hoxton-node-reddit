import Database from "better-sqlite3";

const db = new Database("./data.db", {
    verbose: console.log,
});


db.exec(`
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS postsLikes;
DROP TABLE IF EXISTS userSubreddits;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS subreddits;



CREATE TABLE subreddits (
    id INTEGER,
    description TEXT,
    background TEXT,
    PRIMARY KEY (id)
);

CREATE TABLE users (
    id INTEGER,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    displayName TEXT NOT NULL UNIQUE,
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

CREATE TABLE userSubreddits (
    id INTEGER,
    userId INTEGER,
    subredditId INTEGER,
    dateJoined TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (subredditId) REFERENCES subreddits(id)
);

CREATE TABLE postsLikes (
    id INTEGER,
    userId INTEGER,
    postsId INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (postsId) REFERENCES posts(id)
);

CREATE TABLE comments (
    id INTEGER,
    postsId INTEGER,
    userId INTEGER,
    content TEXT,
    upvotes INTEGER,
    downvotes INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (postsId) REFERENCES posts(id),
    FOREIGN KEY (userId) REFERENCES users(id)
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

const userSubreddits = [
    {
        userId: 1,
        subredditId: 1,
        dateJoined: "01.02.2022"
    },
    {
        userId: 2,
        subredditId: 2,
        dateJoined: "01.02.2022"
    },
    {
        userId: 3,
        subredditId: 3,
        dateJoined: "01.02.2022"
    },
    {
        userId: 4,
        subredditId: 4,
        dateJoined: "01.02.2022"
    },
    {
        userId: 5,
        subredditId: 5,
        dateJoined: "01.02.2022"
    }
]


const postsLikes = [
    {
        userId: 1,
        postsId: 1,
    },
    {
        userId: 2,
        postsId: 2,
    },
    {
        userId: 3,
        postsId: 3,
    },
    {
        userId: 4,
        postsId: 4,
    },
    {
        userId: 5,
        postsId: 1,
    }
]


const comments = [
    {
        postsId: 1,
        userId: 1,
        content: "first comment",
        upvotes: 1,
        downvotes: 1
    },
    {
        postsId: 2,
        userId: 2,
        content: "second comment",
        upvotes: 2,
        downvotes: 2
    },
    {
        postsId: 3,
        userId: 3,
        content: "third comment",
        upvotes: 3,
        downvotes: 3
    },
    {
        postsId: 4,
        userId: 4,
        content: "forth comment",
        upvotes: 4,
        downvotes: 4
    }
]




const createSubreddit = db.prepare(`
INSERT INTO subreddits (description, background) VALUES (?, ?)
`)

const createUser = db.prepare(`
INSERT INTO users (name, email, password, displayName) VALUES (?, ?, ?, ?)
`)



const createPost = db.prepare(`
INSERT INTO posts (userId, subredditId, title, content, createdAt) VALUES (?, ?, ?, ?, ?)
`)

const createUserSubreddit = db.prepare(`
INSERT INTO userSubreddits (userId, subredditId, dateJoined) VALUES (?, ?, ?)
`)


const createPostLikes = db.prepare(`
INSERT INTO postsLikes (userId, postsId) VALUES (?, ?)
`)


const createComment = db.prepare(`
INSERT INTO comments (postsId, userId, content, upvotes, downvotes) VALUES (?, ?, ?, ?, ?)
`)



for (const subreddit of subreddits) {
    createSubreddit.run(subreddit.descripton, subreddit.background)
}

for (const user of users) {
    createUser.run(user.name, user.email, user.password, user.displayName)
}

for (const post of posts) {
    createPost.run(post.userId, post.subredditId, post.title, post.content, post.createdAt)
}




// for (const userSubreddit of userSubreddits) {
//     createUserSubreddit.run(userSubreddit.userId, userSubreddit.subredditId, userSubreddit.dateJoined)
// }


// for (const postLIke of postsLikes) {
//     createPostLikes.run(postLIke.userId, postLIke.postsId)
// }


// for (const comment of comments) {
//     createComment.run(comment.postsId, comment.userId, comment.content, comment.upvotes, comment.downvotes)
// }