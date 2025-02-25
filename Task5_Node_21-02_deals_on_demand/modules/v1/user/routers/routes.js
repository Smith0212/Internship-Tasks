let user = require('../controllers/user');


let userRouter = (app) => {
    app.post('/v1/user/login', user.login);
    app.post('/v1/user/signup', user.signup);
    app.post('/v1/user/verifyOtp/:id', user.verifyOTP);
    app.post('/v1/user/editProfile/:id', user.editProfile);
    app.post('/v1/user/forgotPassword', user.forgotPassword);
    app.post('/v1/user/updatePassword/:id', user.updatePassword);
    app.post('/v1/user/changePassword/:id', user.changePassword);
    app.post('/v1/user/logout/:id', user.logout);
    app.get('/v1/user/get', user.getSingleUser);
    app.get('/v1/user/get/:id', user.getAllUser);
    app.put('/v1/user/update', user.update);
    app.delete('/v1/user/delete', user.delete);

    //screen: 15, 16, 39
    app.get('/v1/deals/category',user.getCategory);
    app.get('/v1/deals/:user_id',user.getDeals);

    //screen: 17, 18
    app.get('/v1/deal/:post_id',user.getDealDetails);

    //screen: 19
    app.get('/v1/deals/getCatDealCnt',user.getCategoryDealCount);
    
    //screen 20
    app.get('/v1/deals/category/:user_id',user.getDealsByCat);
    
    //screen 22
    app.get('/v1/deal/userComments/:deal_id',user.getDealersDealComments);
    app.get('/v1/post/dealerComment/:post_id',user.getUsersPostComments);

    //screen 23
    app.post('/v1/deal/addUpdateRate/:post_id',user.addUpdateRate);

    //screen 26, 27 api to get the data of other user profile
    app.get('/v1/user/getOtherUserDetails/:user_id',user.getOtherUserDetails);

    // screen 26, 27
    app.get('/v1/user/getUserDetails/:user_id',user.getUserDetails);

    // screen 49
    app.get('/v1/user/saved/:user_id',user.getSavedPost);

    // screen 53
    app.get('/v1/user/following/:user_id',user.getFollowing);

    // screen 54    
    app.get('/v1/user/follower/:user_id',user.getFollower);

}

module.exports = userRouter;

