const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'title', 'content', 'created_at'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'user_id', 'post_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                    }
            },
            {
                model: User,
                attributes: ['username']
            }
            ]
        })
    .then(dbPostdata => {
        const posts = dbPostdata.map(post => post.get({ plain: true }));
        res.render('homepage', { posts, loggedIn: req.session.loggedIn });
        })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
        })
    });

// redirecting users to homepage once they log in
router.get('/login', (req, res) => {
    if(req.session.loggedIn) {
        res.redirect('/');
        return; 
        }
    res.render('login');
    });

// redirecting users to sign in page once they sign up
router.get('/signup', (req, res) => {
    res.render('signup');
    });

//rendering one post to the single-post page
router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
            },
        attributes: ['id', 'title', 'content', 'created_at'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'user_id', 'post_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                    }
            },
            {
                model: User,
                attributes: ['username']
            }
            ]
        })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
            }
        // serialize the data
        const post = dbPostData.get({ plain: true });  
        // pass data to template
        console.log(post);
        res.render('single-post', { post, loggedIn: req.session.loggedIn});
        })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
        })
    });

// redirecting users to see all their posts with comments
router.get('/posts-comments', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
            },
        attributes: ['id', 'title', 'content', 'created_at'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'user_id', 'post_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                    }
            },
            {
                model: User,
                attributes: ['username']
            }
            ]
        })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
            }
        // serialize the data
        const post = dbPostData.get({ plain: true });
        // pass data to template
        res.render('posts-comments', { post, loggedIn: req.session.loggedIn});
        })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
        })
    });

module.exports = router; 