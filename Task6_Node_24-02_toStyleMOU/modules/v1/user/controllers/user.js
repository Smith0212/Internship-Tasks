const user_model = require("../models/user_model")
const common = require("../../../../utilities/common")

class UserController {
  login(req, res) {
    const userData = req.body
    user_model.login(userData, (err, result) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, result)
    })
  }

  signup(req, res) {
    const userData = req.body
    user_model.signup(userData, (err, result) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, result)
    })
  }

  verifyOTP(req, res) {
    const userId = req.params
    const otpData = req.body
    user_model.verifyOTP(userId, otpData, (err, result) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, result)
    })
  }

  editProfile(req, res) {
    const userId = req.params
    const profileData = req.body
    user_model.editProfile(userId, profileData, (err, result) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, result)
    })
  }

  forgotPassword(req, res) {
    const userData = req.body
    user_model.forgotPassword(userData, (err, result) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, result)
    })
  }

  updatePassword(req, res) {
    const userId = req.params
    const passwordData = req.body
    user_model.updatePassword(userId, passwordData, (err, result) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, result)
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

  deleteUser(req, res) {
    const userId = req.params.user_id
    user_model.deleteUser(userId, (err, result) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, result)
    })
  }
  getTrendingPosts(req, res) {
    user_model.getTrendingPosts((err, result) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, result)
    })
  }

  getNewPosts(req, res) {
    const filters = req.query
    console.log(filters)
    user_model.getNewPosts(filters, (err, result) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, result)
    })
  }

  getFollowingPosts(req, res) {
    const userId = req.params.user_id
    const filters = req.query
    user_model.getFollowingPosts(userId, filters, (err, result) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, result)
    })
  }

  getExpiringPosts(req, res) {
    user_model.getExpiringPosts((err, result) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, result)
    })
  }

  getCategories(req, res) {
    user_model.getCategories((err, result) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, result)
    })
  }

  addPost(req, res) {
    const userId = req.params.user_id
    const postData = req.body
    user_model.addPost(userId, postData, (err, result) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, result)
    })
  }

  getAllPost(req, res) {
    const userId = req.params.user_id
    user_model.getAllPosts(userId, (err, result) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, result)
    })
  }

  deletePost(req, res) {
    const postId = req.params.post_id
    user_model.deletePost(postId, (err, result) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, result)
    })
  }

  addComment(req, res) {
    const postId = req.params.post_id
    const { user_id, comment } = req.body
    user_model.addComment(user_id, postId, comment, (err, result) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, result)
    })
  }

  addUpdateRate(req, res) {
    const postId = req.params.post_id
    const { user_id, rating } = req.body
    user_model.addUpdateRate(user_id, postId, rating, (err, result) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, result)
    })
  }

  getImageRanking(req, res) {
    const postId = req.params.post_id
    user_model.getImageRanking(postId, (err, result) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, result)
    })
  }

  getSavedPost(req, res) {
    const userId = req.params.user_id
    user_model.getSavedPost(userId, (err, result) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, result)
    })
  }

  getFollowing(req, res) {
    const userId = req.params.user_id
    user_model.getFollowing(userId, (err, result) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, result)
    })
  }

  getFollower(req, res) {
    const userId = req.params.user_id
    user_model.getFollower(userId, (err, result) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, result)
    })
  }

  getUserDetails(req, res) {
    const userId = req.params.user_id
    user_model.getUserDetails(userId, (err, result) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, result)
    })
  }

  getOtherUserDetails(req, res) {
    const otherUser_id = req.params.otherUser_id
    const userId = req.body.user_id
    user_model.getOtherUserDetails(userId, otherUser_id, (err, result) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, result)
    })
  }

  getNotifications(req, res) {
    const userId = req.params.user_id
    user_model.getNotifications(userId, (err, result) => {
      if (err) {
        return common.response(res, err)
      }
      return common.response(res, result)
    })
  }
}

module.exports = new UserController()

