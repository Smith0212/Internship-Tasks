const pool = require('../../../../config/database');
const common = require('../../../../utilities/common');
const responseCode = require('../../../../utilities/response_code');
const response_message = require('../../../../language/en');
const md5 = require('md5');

class UserModel {

  signup(request_data, callback) {
    let user_id = "";
    const data = {
      step: 1,
      username: request_data.username,
      email: request_data.email,
      phone: request_data.phone,
      login_type: request_data.login_type || 's',
      is_verified: 0,
      is_active: 1,
      is_deleted: 0
    };

    if (request_data.password) {
      data.password = md5(request_data.password);
    }

    if (request_data.login_type && request_data.login_type !== 's') {
      data.is_verified = 1;
      data.step = 2;
      data.social_id = common.generateSocialId();
      data.is_verified = 1;
    }

    const insertUserQuery = "INSERT INTO tbl_user SET ?";
    pool.query(insertUserQuery, data, (error, result) => {
      if (error) {
        console.log(error);
        let msg = {
          code: responseCode.OPERATION_FAILED,
          message: response_message.unsuccess,
          data: error.sqlMessage
        }
        callback(null, msg);
      }
      else {
        console.log(result);
        user_id = result.insertId;
        // send otp to user
        const otp = common.generateOTP();
        //now add otp into tbl_otp
        const insertOtpQuery = 'INSERT INTO tbl_otp SET ?';
        pool.query(insertOtpQuery, { user_id, otp: otp, phone: request_data.phone, email: request_data.email, action: request_data.action }, (err, result) => {
          if (err) {
            let msg = {
              code: responseCode.OPERATION_FAILED,
              message: response_message.unsuccess,
              data: err.sqlMessage
            }
            callback(null, msg);
          }
          else {

            // once user is data is added and otp is verified then add data into tbl_device_info
            const device_data = {
              user_id: user_id,
              device_type: request_data.device_type,
              device_token: request_data.device_token,
              os_version: request_data.os_version,
              is_active: 1,
              is_deleted: 0
            }

            const insertDeviceQuery = "INSERT INTO tbl_device_info SET ?";
            pool.query(insertDeviceQuery, device_data, (error, result) => {
              if (error) {
                let msg = {
                  code: responseCode.OPERATION_FAILED,
                  message: response_message.unsuccess,
                  data: error.sqlMessage
                }
                callback(null, msg);
              }
              else {
                let msg = {
                  code: responseCode.SUCCESS,
                  message: [response_message.success, response_message.otp_has_sent_successfully],
                  data: result.insertId
                }
                callback(null, msg);
              }
            });
          }
        });
      }
    });
  }

  verifyOTP(user_id, user_otp_info, callback) {
    console.log("user_id:", user_id);
    console.log("user_otp_info:", user_otp_info);

    const selectQuery = 'SELECT * FROM tbl_otp WHERE user_id = ? AND otp = ?';
    pool.query(selectQuery, [user_id.id, user_otp_info.otp], (err, result) => {
      if (err) {
        let msg = {
          code: responseCode.OPERATION_FAILED,
          message: response_message.unsuccess,
          data: err.sqlMessage
        }
        callback(null, msg);
      }
      else if (result) {
        console.log("otp result:", result);
        if (result[0].otp == user_otp_info.otp) {
          const updateQuery = 'UPDATE tbl_user SET is_verified = 1 WHERE id = ?';
          pool.query(updateQuery, [user_id.id], (err, result) => {
            if (err) {
              let msg = {
                code: responseCode.OPERATION_FAILED,
                message: response_message.unsuccess,
                data: err.sqlMessage
              }
              callback(null, msg);
            }
            else if (result) {
              console.log("is_verified result:", result);
              let msg = {
                code: responseCode.SUCCESS,
                message: response_message.otp_verified_successfully,
                data: result
              }
              callback(null, msg);
            }
          });
        } else {
          let msg = {
            code: responseCode.OPERATION_FAILED,
            message: response_message.incorrect_otp,
            data: null
          }
          callback(null, msg);
        }
      }
    });
  }

  editProfile(user_id, request_data, callback) {
    var userData = {
      language: request_data.language,
      gender: request_data.gender
    };

    if (request_data.fullname) {
      userData.fullname = request_data.fullname;
    }
    if (request_data.dob) {
      userData.dob = request_data.dob;
    }
    if (request_data.profile_image) {
      userData.profile_image = request_data.profile_image;
    }

    common.updateUserInfo(user_id, userData, (error, updatedUserInfo) => {
      if (error) {
        console.log("Error11:", error);
        return callback({
          code: responseCode.OPERATION_FAILED,
          message: error.sqlMessage || "User update failed",
        }, null);
      }

      console.log("User Info:", updatedUserInfo);

      if (updatedUserInfo) {
        callback(null, {
          code: responseCode.SUCCESS,
          message: response_message.profile_edit,
          data: updatedUserInfo,
        });
      } else {
        callback({
          code: responseCode.OPERATION_FAILED,
          message: "User update failed or user not found",
        }, null);
      }
    });
  }

  login(request_data, callback) {
    var selectQuery = "";
    var condition = "";

    var is_email = common.validateEmail(request_data.email_phone);
    var field = is_email ? "email" : "phone";

    console.log("Field:", field);

    if (request_data.password) {
      request_data.password = md5(request_data.password);
    }

    console.log("Encrypted Password:", request_data.password);
    console.log("Login Input:", request_data.email_phone);

    if (request_data.login_type === "s") {  // Normal login
      console.log("Normal Login");
      selectQuery = "SELECT id as user_id, profile_image, is_verified, is_active, fullname, login_type FROM tbl_user WHERE " + field + " = ? AND password = ?";
      condition = [request_data.email_phone, request_data.password];
    } else {  // Social login
      console.log("Social Login");
      selectQuery = "SELECT id as user_id, profile_image, is_verified, is_active, fullname, login_type FROM tbl_user WHERE " + field + " = ? AND social_id = ? AND login_type = ?";
      condition = [request_data.email_phone, request_data.social_id, request_data.login_type];
    }

    console.log("Select Query:", selectQuery);
    console.log("Condition:", condition);

    pool.query(selectQuery, condition, (error, _userInfo) => {
      if (error) {
        console.error("Database Query Error:", error);
        return callback(null, {
          code: responseCode.OPERATION_FAILED,
          message: error.sqlMessage
        });
      }

      console.log("Query Result:", _userInfo);

      if (_userInfo) {
        var user = _userInfo[0];
        if (user.login_type === "s" && !user.fullname) {
          return callback(null, {
            code: responseCode.CODE_NULL,
            message: response_message.complete_signup,
            data: _userInfo
          });
        }


        var user = _userInfo[0];


        if (user.is_verified !== 1) {
          return callback(null, {
            code: responseCode.OTP_NOT_VERYFIED,
            message: response_message.not_verified_2,
            data: user
          });
        }

        if (user.is_active !== 1) {
          return callback(null, {
            code: responseCode.INACTIVE_ACCOUNT,
            message: response_message.account_is_deactivated,
            data: user
          });
        }

        // Device info update
        const device_data = {
          device_type: request_data.device_type,
          device_token: request_data.device_token,
          os_version: request_data.os_version,
          is_active: 1,
          is_deleted: 0
        };

        common.updateDeviceInfo(user.user_id, device_data, (error, _userLoginInfo) => {
          if (error) {
            return callback(null, {
              code: responseCode.OPERATION_FAILED,
              message: error.sqlMessage
            });
          }

          return callback(null, {
            code: responseCode.SUCCESS,
            message: response_message.success,
            data: _userLoginInfo
          });
        });
      } else {
        return callback(null, {
          code: responseCode.OPERATION_FAILED,
          message: response_message.login_invalid_credential
        });
      }
    });
  }

  resendOTP(user, callback) {
    const otp = common.generateOTP();
    //now add otp into tbl_otp
    const insertOtpQuery = 'INSERT INTO tbl_otp SET ?';
    pool.query(insertOtpQuery, { user_id: user.id, otp: otp, phone: user.phone, email: user.email, action: user.action || "forgot" }, (err, result) => {
      if (err) {
        let msg = {
          code: responseCode.OPERATION_FAILED,
          message: response_message.unsuccess,
          data: err.sqlMessage
        }
        callback(null, msg);
      }
      else {
        let msg = {
          code: responseCode.SUCCESS,
          message: [response_message.success, response_message.otp_has_sent_successfully],
          data: result.insertId
        }
        callback(null, msg);
      }
    });
  }

  forgotPassword(request_data, callback) {

    var is_email = common.validateEmail(request_data.email_phone)
    var field = "email";

    if (!is_email) {
      field = "phone";
    }

    var selectUser = "SELECT tbl_user.* from tbl_user where " + field + " = ?";

    pool.query(selectUser, [request_data.email_phone], (error, _user) => {
      if (error) {
        callback(error.sqlMessage, undefined);
      } else {
        console.log("User:", _user);
        if (_user[0].login_type == 's') {
          if (_user.length > 0) {
            var _user = _user[0];

            this.resendOTP(_user, (err, result) => {
              if (err) {
                callback({
                  code: responseCode.OPERATION_FAILED,
                  message: error
                });
              } else {
                callback({
                  code: responseCode.SUCCESS,
                  message: response_message.otp_has_sent_successfully,
                  data: { user_id: _user.id }
                });
              }
            });
          } else {
            callback({
              code: responseCode.OPERATION_FAILED,
              message: response_message.forgotpassword_email_not_registered
            });
          }
        } else {
          callback({
            code: responseCode.OPERATION_FAILED,
            message: response_message.password_change_social
          })
        }
      }
    });
  }


  updatePassword(user_id, request_data, callback) {

    //first check if otp is matched or not and then update the password
    var selectQuery = "SELECT * FROM tbl_otp WHERE user_id = ? AND otp = ?";
    pool.query(selectQuery, [user_id.id, request_data.otp], (error, _otp) => {
      if (error) {
        callback({
          code: responseCode.OPERATION_FAILED,
          message: error
        });
      } else {
        if (_otp.length > 0) {
          var data = {
            password: md5(request_data.new_password)
          }
          common.updateUserInfo(user_id, data, (error, _updatedUser) => {
            if (error) {
              console.log("Error:", error);
              callback({
                code: responseCode.OPERATION_FAILED,
                message: error
              }, null);
            } else {
              callback(null, {
                code: responseCode.SUCCESS,
                message: response_message.password_change,
                data: _updatedUser
              });
            }
          });
        } else {
          callback({
            code: responseCode.OPERATION_FAILED,
            message: response_message.incorrect_otp
          });
        }
      }
    });
  }

  changePassword(user_id, request_data, callback) {
    var selectQuery = "SELECT * FROM tbl_user WHERE id = ?";
    console.log("User ID:", user_id);
    pool.query(selectQuery, user_id.id, (_error, _response) => {
      if (_error) {
        return callback({
          code: responseCode.OPERATION_FAILED,
          message: _error
        });
      }

      console.log("Response:", _response);
      if (_response.length === 0) {
        return callback({
          code: responseCode.OPERATION_FAILED,
          message: "User not found"
        });
      }

      let user = _response[0];

      if (user.login_type === 's') {
        request_data.old_password = md5(request_data.old_password);
        request_data.new_password = md5(request_data.new_password);

        if (request_data.new_password === user.password) {
          return callback({
            code: responseCode.OPERATION_FAILED,
            message: response_message.old_and_new_password_does_not_match
          });
        }

        if (request_data.old_password === user.password) {
          var data = { password: request_data.new_password };

          common.updateUserInfo(user_id, data, (_err, _res) => {
            if (_err) {
              return callback({
                code: responseCode.OPERATION_FAILED,
                message: _err
              });
            }

            return callback({
              code: responseCode.SUCCESS,
              message: response_message.password_change,
              data: _res
            });
          });
        } else {
          return callback({
            code: responseCode.OPERATION_FAILED,
            message: response_message.old_password_does_not_match
          });
        }
      } else {
        return callback({
          code: responseCode.OPERATION_FAILED,
          message: "Cannot change password for this login type"
        });
      }
    });
  }

  logout(user_id, callback) {
    // update tbl_user and tbl_device_info (make is_active = 0) both
    var data = {
      is_active: 0
    }

    common.updateUserInfo(user_id, data, (error, result) => {
      if (error) {
        return callback({
          code: responseCode.OPERATION_FAILED,
          message: error
        });
      }
      else {
        console.log("Result1:", result);
        // update tbl_device_info
        user_id = user_id.id;
        let deviceData = {
          is_active: 0,
          device_token: null
        }
        common.updateDeviceInfo(user_id, deviceData, (error, result) => {
          if (error) {
            return callback({
              code: responseCode.OPERATION_FAILED,
              message: error
            });
          }
          else {
            return callback({
              code: responseCode.SUCCESS,
              message: response_message.logout_success,
              data: result
            });
          }
        });
      }
    });
  }

  deleteUser(userId, callback) {
    const query = "UPDATE tbl_user SET is_deleted = 1 WHERE id = ?"
    pool.query(query, [userId], (error, result) => {
      if (error) {
        return callback({
          code: responseCode.OPERATION_FAILED,
          message: response_message.unsuccess,
          data: error.sqlMessage,
        })
      }
      callback(null, {
        code: responseCode.SUCCESS,
        message: "user deleted successfully",
        data: result,
      })
    })
  }

  getTrendingPosts(callback) {
    const query = `
          SELECT tbl_post.id, tbl_image.image, tbl_post.avg_rating
          FROM tbl_post 
          JOIN tbl_image ON tbl_post.id = tbl_image.post_id
          WHERE avg_rating > 4.5 AND tbl_post.is_compare = 0 
            AND tbl_post.is_active = 1 AND tbl_post.is_deleted = 0 
            AND tbl_image.is_active = 1 AND tbl_image.is_deleted = 0
          GROUP BY tbl_post.id
          ORDER BY avg_rating desc
          LIMIT 10
        `

    pool.query(query, (error, results) => {
      if (error) {
        return callback({
          code: responseCode.OPERATION_FAILED,
          message: response_message.unsuccess,
          data: error.sqlMessage,
        })
      }
      callback(null, {
        code: responseCode.SUCCESS,
        message: response_message.success,
        data: results,
      })
    })
  }

  getNewPosts(filters, callback) {
    let query = `
          SELECT tbl_post.id, tbl_image.image, tbl_post.is_me, tbl_post.is_compare, tbl_post.is_video
          FROM tbl_post
          JOIN tbl_image ON tbl_image.post_id = tbl_post.id
          WHERE tbl_post.is_active = 1 AND tbl_post.is_deleted = 0 
            AND tbl_image.is_active = 1 AND tbl_image.is_deleted = 0
        `

    if (filters.is_me) query += " AND tbl_post.is_me = 1"
    if (filters.is_video) query += " AND tbl_post.is_video = 1"
    if (filters.is_compare) query += " AND tbl_post.is_compare = 1"

    query += " ORDER BY tbl_post.created_at DESC LIMIT 10"

    pool.query(query, (error, results) => {
      if (error) {
        return callback({
          code: responseCode.OPERATION_FAILED,
          message: response_message.unsuccess,
          data: error.sqlMessage,
        })
      }
      callback(null, {
        code: responseCode.SUCCESS,
        message: response_message.success,
        data: results,
      })
    })
  }

  getFollowingPosts(userId, filters, callback) {
    let query = `
          SELECT tbl_post.id, tbl_image.image, tbl_post.is_me, tbl_post.is_compare, tbl_post.is_video
          FROM tbl_post
          JOIN tbl_image ON tbl_post.id = tbl_image.post_id
          JOIN tbl_follow ON tbl_follow.follow_id = tbl_post.user_id
          WHERE tbl_post.is_active = 1 AND tbl_post.is_deleted = 0 
            AND tbl_image.is_active = 1 AND tbl_image.is_deleted = 0
            AND tbl_follow.user_id = ?
        `

    if (filters.is_me) query += " AND tbl_post.is_me = 1"
    if (filters.is_video) query += " AND tbl_post.is_video = 1"
    if (filters.is_compare) query += " AND tbl_post.is_compare = 1"

    query += " GROUP BY tbl_post.id LIMIT 10"

    pool.query(query, [userId], (error, results) => {
      if (error) {
        return callback({
          code: responseCode.OPERATION_FAILED,
          message: response_message.unsuccess,
          data: error.sqlMessage,
        })
      }
      callback(null, {
        code: responseCode.SUCCESS,
        message: response_message.success,
        data: results,
      })
    })
  }

  getExpiringPosts(callback) {
    const query = `
          SELECT tbl_post.id, tbl_image.image, tbl_post.is_me, tbl_post.is_compare, tbl_post.is_video
          FROM tbl_post 
          JOIN tbl_image ON tbl_post.id = tbl_image.post_id
          WHERE tbl_post.is_compare = 1 AND tbl_post.is_active = 1 
            AND tbl_post.is_deleted = 0 AND tbl_image.is_active = 1 
            AND tbl_image.is_deleted = 0
          GROUP BY tbl_post.id
          ORDER BY tbl_post.timer ASC LIMIT 10
        `

    pool.query(query, (error, results) => {
      if (error) {
        return callback({
          code: responseCode.OPERATION_FAILED,
          message: response_message.unsuccess,
          data: error.sqlMessage,
        })
      }
      callback(null, {
        code: responseCode.SUCCESS,
        message: response_message.success,
        data: results,
      })
    })
  }

  getCategories(callback) {
    const query = "SELECT * FROM tbl_category WHERE is_active = 1 AND is_deleted = 0"

    pool.query(query, (error, results) => {
      if (error) {
        return callback({
          code: responseCode.OPERATION_FAILED,
          message: response_message.unsuccess,
          data: error.sqlMessage,
        })
      }
      callback(null, {
        code: responseCode.SUCCESS,
        message: response_message.success,
        data: results,
      })
    })
  }

  addPost(userId, postData, callback) {
    const query = "INSERT INTO tbl_post SET ?"
    const { image, ...postDataWithoutImage } = postData;
    const data = {
      user_id: userId,
      ...postDataWithoutImage,
    };

    pool.query(query, data, (error, result) => {
      if (error) {
        return callback({
          code: responseCode.OPERATION_FAILED,
          message: response_message.unsuccess,
          data: error.sqlMessage,
        })
      }
      else {
        console.log(postData.image)
        const insertImageQuery = "INSERT INTO tbl_image SET ?";
        const imageData = {
          post_id: result.insertId,
          image: postData.image,
          is_active: 1,
          is_deleted: 0
        };

        pool.query(insertImageQuery, imageData, (error, result) => {
          if (error) {
            return callback({
              code: responseCode.OPERATION_FAILED,
              message: response_message.unsuccess,
              data: error.sqlMessage,
            });
          }
        });
        callback(null, {
          code: responseCode.SUCCESS,
          message: response_message.success,
          data: { id: result.insertId },
        })
      }
    })
  }

  getAllPosts(userId, callback) {
    const query = `
          SELECT tbl_post.*, group_concat(tbl_image.image)
          FROM tbl_post
          left JOIN tbl_image ON tbl_post.id = tbl_image.post_id
          WHERE tbl_post.user_id = ? AND tbl_post.is_active = 1 AND tbl_post.is_deleted = 0
          GROUP BY tbl_post.id
          ORDER BY tbl_post.created_at DESC
        `

    pool.query(query, [userId], (error, results) => {
      if (error) {
        return callback({
          code: responseCode.OPERATION_FAILED,
          message: response_message.unsuccess,
          data: error.sqlMessage,
        })
      }
      callback(null, {
        code: responseCode.SUCCESS,
        message: response_message.success,
        data: results,
      })
    })
  }

  deletePost(postId, callback) {
    const query = "UPDATE tbl_post SET is_deleted = 1 WHERE id = ?"

    pool.query(query, [postId], (error, result) => {
      if (error) {
        return callback({
          code: responseCode.OPERATION_FAILED,
          message: response_message.unsuccess,
          data: error.sqlMessage,
        })
      }
      callback(null, {
        code: responseCode.SUCCESS,
        message: response_message.success,
        data: { affected_rows: result.affectedRows },
      })
    })
  }

  addComment(userId, postId, comment, callback) {
    const query = "INSERT INTO tbl_comment SET ?"
    const data = {
      user_id: userId,
      post_id: postId,
      comment: comment,
    }

    pool.query(query, data, (error, result) => {
      if (error) {
        return callback({
          code: responseCode.OPERATION_FAILED,
          message: response_message.unsuccess,
          data: error.sqlMessage,
        })
      }
      callback(null, {
        code: responseCode.SUCCESS,
        message: response_message.success,
        data: { id: result.insertId },
      })
    })
  }

  addUpdateRate(postId, userId, rating, callback) {
    const query = `
                  INSERT INTO tbl_rating (user_id, post_id, rating)
                  VALUES (?, ?, ?)
                  ON DUPLICATE KEY UPDATE rating = VALUES(rating)
              `

    pool.query(query, [userId, postId, rating, rating], (error, result) => {
      if (error) {
        return callback({
          code: responseCode.OPERATION_FAILED,
          message: response_message.unsuccess,
          data: error.sqlMessage,
        })
      }
      callback(null, {
        code: responseCode.SUCCESS,
        message: "rating added",
        data: result,
      })
    })
  }

  getImageRanking(postId, callback) {
    const query = `
          SELECT tbl_image.*
          FROM tbl_image
          JOIN tbl_post ON tbl_post.id = tbl_image.post_id
          WHERE tbl_post.is_compare = 1 AND tbl_post.id = ?
          ORDER BY likes DESC
        `

    pool.query(query, [postId], (error, results) => {
      if (error) {
        return callback({
          code: responseCode.OPERATION_FAILED,
          message: response_message.unsuccess,
          data: error.sqlMessage,
        })
      }
      callback(null, {
        code: responseCode.SUCCESS,
        message: response_message.success,
        data: results,
      })
    })
  }

  getSavedPost(userId, callback) {
    const query = `
          SELECT tbl_post.*, tbl_image.image
          FROM tbl_post
          JOIN tbl_image ON tbl_post.id = tbl_image.post_id
          JOIN tbl_favourite ON tbl_favourite.post_id = tbl_post.id
          WHERE tbl_favourite.user_id = ? AND tbl_post.is_active = 1 AND tbl_post.is_deleted = 0
          ORDER BY tbl_favourite.created_at DESC
        `

    pool.query(query, [userId], (error, results) => {
      if (error) {
        return callback({
          code: responseCode.OPERATION_FAILED,
          message: response_message.unsuccess,
          data: error.sqlMessage,
        })
      }
      callback(null, {
        code: responseCode.SUCCESS,
        message: response_message.success,
        data: results,
      })
    })
  }

  getFollowing(userId, callback) {
    const query = `
          SELECT DISTINCT f1.follow_id, tbl_user.fullname,
          CASE
            WHEN f2.follow_id IS NOT NULL THEN '1'
            ELSE '0'
          END AS following_or_not
          FROM tbl_follow f1
          LEFT JOIN tbl_follow f2 ON f1.follow_id = f2.user_id AND f2.follow_id = ?
          JOIN tbl_user ON tbl_user.id = f1.follow_id
          WHERE f1.user_id = ? AND f1.status = 'accept'
        `

    pool.query(query, [userId, userId], (error, results) => {
      if (error) {
        return callback({
          code: responseCode.OPERATION_FAILED,
          message: response_message.unsuccess,
          data: error.sqlMessage,
        })
      }
      callback(null, {
        code: responseCode.SUCCESS,
        message: response_message.success,
        data: results,
      })
    })
  }

  getFollower(userId, callback) {
    const query = `
          SELECT DISTINCT f1.user_id, u.fullname,
          CASE 
            WHEN f2.user_id IS NOT NULL THEN '1'
            ELSE '0'
          END AS following_or_not
          FROM tbl_follow f1
          LEFT JOIN tbl_follow f2 ON f1.user_id = f2.follow_id AND f2.user_id = ?
          JOIN tbl_user u ON f1.user_id = u.id
          WHERE f1.follow_id = ? AND f1.status = 'accept'
        `

    pool.query(query, [userId, userId], (error, results) => {
      if (error) {
        return callback({
          code: responseCode.OPERATION_FAILED,
          message: response_message.unsuccess,
          data: error.sqlMessage,
        })
      }
      callback(null, {
        code: responseCode.SUCCESS,
        message: response_message.success,
        data: results,
      })
    })
  }

  getUserDetails(userId, callback) {
    const query = `
          SELECT 
            (SELECT COUNT(*) FROM tbl_follow WHERE user_id = ? AND status = 'accept') AS following,
            (SELECT COUNT(*) FROM tbl_follow WHERE follow_id = ? AND status = 'accept') AS follower,
            u.profile_image, u.username, AVG(p.avg_rating) AS avg_rating, 
            GROUP_CONCAT(DISTINCT pi.image) AS images
          FROM tbl_user u
          LEFT JOIN tbl_post p ON u.id = p.user_id
          LEFT JOIN tbl_image pi ON p.id = pi.post_id
          WHERE u.id = ?
          GROUP BY u.id
        `

    pool.query(query, [userId, userId, userId], (error, results) => {
      if (error) {
        return callback({
          code: responseCode.OPERATION_FAILED,
          message: response_message.unsuccess,
          data: error.sqlMessage,
        })
      }
      callback(null, {
        code: responseCode.SUCCESS,
        message: response_message.success,
        data: results[0]
      });
    })
  }

  getOtherUserDetails(userId, otherUser_id, callback) {
    const query = `
          SELECT 
            (SELECT COUNT(*) FROM tbl_follow WHERE user_id = ? AND status = 'accept') AS following,
            (SELECT COUNT(*) FROM tbl_follow WHERE follow_id = ? AND status = 'accept') AS follower,
            (SELECT 1 FROM tbl_follow WHERE user_id = ? AND follow_id = ?) AS follow_status,
            u.profile_image, u.username, AVG(p.avg_rating) AS avg_rating, 
            GROUP_CONCAT(DISTINCT pi.image) AS images
          FROM tbl_user u
          LEFT JOIN tbl_post p ON u.id = p.user_id
          LEFT JOIN tbl_image pi ON p.id = pi.post_id
          WHERE u.id = ?
          GROUP BY u.id
        `

    pool.query(query, [userId, userId, userId, otherUser_id, otherUser_id], (error, results) => {
      if (error) {
        return callback({
          code: responseCode.OPERATION_FAILED,
          message: response_message.unsuccess,
          data: error.sqlMessage,
        })
      }
      callback(null, {
        code: responseCode.SUCCESS,
        message: response_message.success,
        data: results[0],
      })
    })
  }

  getNotifications(userId, callback) {
    const query = `
          SELECT * FROM tbl_notification
          WHERE receiver_id = ? AND is_active = 1 AND is_deleted = 0
          ORDER BY created_at DESC
          LIMIT 20
        `

    pool.query(query, [userId], (error, results) => {
      if (error) {
        return callback({
          code: responseCode.OPERATION_FAILED,
          message: response_message.unsuccess,
          data: error.sqlMessage,
        })
      }
      callback(null, {
        code: responseCode.SUCCESS,
        message: response_message.success,
        data: results,
      })
    })
  }
}

module.exports = new UserModel()

