const user_model = require("../models/user_model")
const common = require("../../../../utilities/common")

class user {
  signup(req, res) {
    const userData = req.body
    user_model.signup(userData, (err, msg) => {
      if (err) {
        return common.response(res, msg)
      }
      return common.response(res, msg)
    })
  }

  verifyOTP(req, res) {
    const user_id = req.params
    const user_otp_info = req.body
    user_model.verifyOTP(user_id, user_otp_info, (err, msg) => {
      if (err) {
        return common.response(res, msg)
      }
      return common.response(res, msg)
    })
  }

  editProfile(req, res) {
    const user_id = req.params
    const userData = req.body
    user_model.editProfile(user_id, userData, (err, msg) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, msg)
    })
  }

  login(req, res) {
    const userData = req.body
    user_model.login(userData, (err, msg) => {
      if (err) {
        return common.response(res, msg)
      }
      return common.response(res, msg)
    })
  }

  forgotPassword(req, res) {
    const userData = req.body
    user_model.forgotPassword(userData, (err, msg) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, msg)
    })
  }

  updatePassword(req, res) {
    const user_id = req.params
    const userData = req.body
    user_model.updatePassword(user_id, userData, (err, msg) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, msg)
    })
  }

  changePassword(req, res) {
    const user_id = req.params
    const userData = req.body
    user_model.changePassword(user_id, userData, (err, msg) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, msg)
    })
  }

  logout(req, res) {
    const user_id = req.params
    user_model.logout(user_id, (err, msg) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, msg)
    })
  }

  getSingleUser(req, res) {
    user_model.getSingleUser()
  }

  getAllUser(req, res) {
    user_model.getAllUser()
  }

  update(req, res) {
    user_model.update()
  }

  delete(req, res) {
    user_model.delete()
  }


  getCategory(req, res) {
    user_model.getCategory((err, msg) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, msg)
    })
  }

  getDeals(req, res) {
    const user_id = req.params.user_id
    const { distance, category } = req.body
    user_model.getDeals(user_id, distance, category, (err, msg) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, msg)
    })
  }

  getDealDetails(req, res) {
    const postId = req.params.post_id
    user_model.getDealDetails(postId, (err, msg) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, msg)
    })
  }

  getCategoryDealCount(req, res) {
    user_model.getCategoryDealCount((err, msg) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, msg)
    })
  }

  getDealsByCat(req, res) {
    const user_id = req.params.user_id
    const categoryName = req.body.name
    user_model.getDealsByCat(user_id, categoryName, (err, msg) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, msg)
    })
  }

  getDealersDealComments(req, res) {
    const deal_Id = req.params.deal_id
    user_model.getDealersDealComments(deal_Id, (err, msg) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, msg)
    })
  }

  getUsersPostComments(req, res) {
    const user_id = req.params.post_id
    user_model.getUsersPostComments(user_id, (err, msg) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, msg)
    })
  }

  addUpdateRate(req, res) {
    const postId = req.params.post_id
    const { userId, rating } = req.body

    user_model.addUpdateRate(postId, userId, rating, (err, msg) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, msg)
    })
  }

  getOtherUserDetails(req, res) {
    const otherUser_id = req.params.user_id
    const user_id = req.body.user_id
    user_model.getOtherUserDetails(otherUser_id, user_id, (err, msg) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, msg)
    })
  }

  getUserDetails(req, res) {
    const user_id = req.params.user_id
    user_model.getUserDetails(user_id, (err, msg) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, msg)
    })
  }

  getSavedPost(req, res) {
    const userId = req.params.user_id
    user_model.getSavedPost(userId, (err, msg) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, msg)
    })
  }

  getFollowing(req, res) {
    const userId = req.params.user_id
    user_model.getFollowing(userId, (err, msg) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, msg)
    })
  }

  getFollower(req, res) {
    const userId = req.params.user_id
    user_model.getFollower(userId, (err, msg) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, msg)
    })
  }
}

module.exports = new user()

