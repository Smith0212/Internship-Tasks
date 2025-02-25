let user = require('../controllers/user');


let userRouter = (app) => {
    app.post('/v1/user/login', user.login);
    app.post('v1/user/')
    app.post('/v1/user/signup', user.signup);
    app.post('/v1/user/verifyOtp/:id', user.verifyOTP);
    app.post('/v1/user/editProfile/:id', user.editProfile);
    app.post('/v1/user/forgotPassword', user.forgotPassword);
    app.post('/v1/user/updatePassword/:id', user.updatePassword);
    app.post('/v1/user/changePassword/:id', user.changePassword);
    app.post('/v1/user/logout/:id', user.logout);

    // only do soft delete by updating is_deleted to 1
    app.post('/v1/user/delete/:user_id', user.deleteUser);

    // TRENDING BASED ON RATING
    app.get('/v1/posts/trending', user.getTrendingPosts);

    // NEW(based on created_at) WISE show all post and just like that using if else show is_me, is_video, is_compare posts using this flags and if no condition is give then show all posts of following
    app.get('/v1/posts/new', user.getNewPosts);

    // FOLLOWING wise show all post and just like that using if else show is_me, is_video, is_compare posts using this flags and if no condition is give then show all posts of following
    app.get('/v1/posts/following/:user_id', user.getFollowingPosts);

    // EXPIRING wise show only is_compare posts
    app.get('/v1/posts/expiring', user.getExpiringPosts);

    // show all categories
    app.get('/v1/post/categories',user.getCategories);

    //  INSERT POST
    app.post('/v1/post/:user_id',user.addPost);

    // show all types of posts in mix
    app.get('/v1/allPosts/:user_id',user.getAllPost);

    // only do soft delete by updating is_deleted to 1
    app.delete('/v1/post/:post_id',user.deletePost);
    
    // ADD COMMENT
    app.post('/v1/posts/:post_id/comments',user.addComment);

    // ADD RATING
    app.post('/v1/post/:post_id/addUpdateRate',user.addUpdateRate);

    // RANKING for is_compare posts
    app.get('/v1/post/imageRanking/:post_id',user.getImageRanking);

    // get save post
    app.get('/v1/user/saved/:user_id',user.getSavedPost);

    // following
    app.get('/v1/user/following/:user_id',user.getFollowing);

    // follower
    app.get('/v1/user/follower/:user_id',user.getFollower);

    // PROFILE DETAILS
    app.get('/v1/user/getUserDetails/:user_id',user.getUserDetails);

    //api to get the data of other user profile
    app.get('/v1/user/getOtherUserDetails/:otherUser_id',user.getOtherUserDetails);

    // NOTIFICATION
    app.get('/v1/user/:user_id/notifications', user.getNotifications)    

}

module.exports = userRouter;

