const httpStatus = require('http-status-codes')
const database = require('../config/database');

class Utility {
    generateReferralCode() {
        // generate referral code of 6 alphanumeric characters
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    generateOTP() {
        // generate otp of 4 digit 
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    generateSocialId() {
        // generate social id of 6 alphanumeric characters
        return Math.random().toString(36).substring(2, 12).toUpperCase();
    }

    response(res, message, status_code = httpStatus.OK) {
        return res.status(status_code).json(message);
    }

    validateEmail(email) {
        // validate email
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    getUserDetail(user_id, callback) {
        const selectQuery = 'SELECT * FROM tbl_user WHERE id = ?';
        database.query(selectQuery, [user_id], (err, results) => {

            if (err) {
                callback(err, null);
            }

            if (results.length > 0) {
                console.log("Results1:", results);
                callback(null, results[0]);
            } else {
                callback(new Error('User not found'), null);
            }
        });
    }

    updateUserInfo(user_id, data, callback) {
        console.log("User ID:", user_id);
        if (!user_id || Object.keys(data).length === 0) {
            return callback(new Error("Invalid user ID or no data provided"), null);
        }
        console.log("Data:", data);
        const updateQuery = 'UPDATE tbl_user SET ? WHERE id = ?';
        database.query(updateQuery, [data, user_id.id], (err, results) => {
            if (err) {
                console.log("SQL Error1:", err);
                return callback(err, null);
            }
            console.log("SQL Results1:", results);
            if (results.affectedRows === 0) {
                return callback(new Error("User not found or no changes made"), null);
            }

            this.getUserDetail(user_id.id, (err, userDetails) => {
                if (err) {
                    console.log("SQL Error2:", err);
                    return callback(err, null);
                }
                console.log("SQL Results2:", userDetails);
                callback(null, userDetails);
            });
        });
    }

    updateDeviceInfo(user_id, data, callback) {
        const updateQuery = 'UPDATE tbl_device_info SET ? WHERE user_id = ?;';

        database.query(updateQuery, [data, user_id], (err, results) => {
            console.log("SQL Error:", err);
            console.log("SQL Results:", results);

            if (err) {
                return callback(err, null);
            }

            if (results.affectedRows === 0) {
                return callback(null, { message: "No rows updated. Check if user_id exists." });
            }

            return callback(null, results);
        });
    }


    generateUniqueId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      }
    
      validatePostData(postData) {
        // Validate required fields
        const requiredFields = ["description", "cat_id"]
        for (const field of requiredFields) {
          if (!postData[field]) {
            return false
          }
        }
        return true
      }
    
      formatDate(date) {
        return date.toISOString().slice(0, 19).replace("T", " ")
      }
    
      calculateExpirationTime(timer) {
        const now = new Date()
        return new Date(now.getTime() + timer * 60000) // timer is in minutes
      }

}

module.exports = new Utility();