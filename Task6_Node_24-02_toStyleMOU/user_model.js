const pool = require('../../../../config/database');
const common = require('../../../../utilities/common');
const responseCode = require('../../../../utilities/response_code');
const response_message = require('../../../../language/en');
const md5 = require('md5');
const user = require('../controllers/user');
const e = require('express');


class user_model {

    signup(request_data, callback) {
        let user_id = "";
        const data = {
            step: 1,
            username: request_data.username,
            email: request_data.email,
            phone: request_data.phone,
            referral_code: common.generateReferralCode(),
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
            data.step = 4;
            data.social_id = common.generateSocialId();
            data.is_verified = 1;
        }

        if (request_data.social_id) {
            data.social_id = request_data.social_id;
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
        console.log("user_otp_info:", user_otp_info.otp);

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
        var userData = {};

        if (request_data.first_name) {
            userData.first_name = request_data.first_name;
        }
        if (request_data.last_name) {
            userData.last_name = request_data.last_name;
        }
        if (request_data.bio) {
            userData.bio = request_data.bio;
        }
        if (request_data.profile_image) {
            userData.profile_image = request_data.profile_image;
        }
        if (request_data.password) {
            userData.password = request_data.password;
        }
        if (request_data.address) {
            userData.address = request_data.address;
        }
        if (request_data.latitude) {
            userData.latitude = request_data.latitude;
        }
        if (request_data.longitude) {
            userData.longitude = request_data.longitude;
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
            selectQuery = "SELECT id as user_id, profile_image, is_verified, is_active, first_name, login_type FROM tbl_user WHERE " + field + " = ? AND password = ?";
            condition = [request_data.email_phone, request_data.password];
        } else {  // Social login
            console.log("Social Login");
            selectQuery = "SELECT id as user_id, profile_image, is_verified, is_active, first_name, login_type FROM tbl_user WHERE " + field + " = ? AND social_id = ? AND login_type = ?";
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
                if (user.login_type === "s" && !user.first_name) {
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
                deviceData = {
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





    getCategory(callback) {
        const query = "SELECT cover_image, name FROM tbl_categories WHERE is_active = 1 AND is_deleted = 0"
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

    getDeals(user_id, distance, category, callback) {
        // filter all the deals by category and distance using if else condition for distance and category
        let query;
        if (distance && category) {
            query = `
            select d.image, d.title, d.address, d.created_at, d.avg_rating, d.total_comments,
            u.profile_image, concat(u.first_name, ' ', u.last_name) as name,
            ROUND(6371 * ACOS( 
                COS(RADIANS(34.0522)) 
                * COS(RADIANS(d.latitude)) 
                * COS(RADIANS(d.longitude) - RADIANS(-118.2437)) 
                + SIN(RADIANS(34.0522)) 
                * SIN(RADIANS(d.latitude)) 
            ), 1) AS distance_km,
            case when r.id is null then 0 else 1 end as review_status
            from tbl_deal_dealer dd
            join tbl_post_dealer d on d.dealer_deal_id = dd.id
            join tbl_user u on u.id = d.user_id
            left join tbl_rating r on r.dealer_post_id = d.id and r.user_id = 1
            join tbl_categories c on c.id = d.category_id
            where c.name = 'Electronics' and d.is_active = 1 and d.is_deleted = 0
            group by d.id
            having distance_km <= 1000;
            `
        }
        else if (distance) {
            query = `
            select d.image, d.title, d.address, d.created_at, d.avg_rating, d.total_comments,
            u.profile_image, concat(u.first_name, ' ', u.last_name) as name,
            ROUND(6371 * ACOS( 
                COS(RADIANS(34.0522)) 
                * COS(RADIANS(d.latitude)) 
                * COS(RADIANS(d.longitude) - RADIANS(-118.2437)) 
                + SIN(RADIANS(34.0522)) 
                * SIN(RADIANS(d.latitude)) 
            ), 1) AS distance_km,
            case when r.id is null then 0 else 1 end as review_status
            from tbl_deal_dealer dd
            join tbl_post_dealer d on d.dealer_deal_id = dd.id
            join tbl_user u on u.id = d.user_id
            left join tbl_rating r on r.dealer_post_id = d.id and r.user_id = 1
            join tbl_categories c on c.id = d.category_id
            where d.is_active = 1 and d.is_deleted = 0
            group by d.id
            having distance_km <= 1000;            
            `
        }
        else if (category) {
            query = `
            select d.image, d.title, d.address, d.created_at, d.avg_rating, d.total_comments,
            u.profile_image, concat(u.first_name, ' ', u.last_name) as name,
            case when r.id is null then 0 else 1 end as review_status
            from tbl_deal_dealer dd
            join tbl_post_dealer d on d.dealer_deal_id = dd.id
            join tbl_user u on u.id = d.user_id
            left join tbl_rating r on r.dealer_post_id = d.id and r.user_id = 1
            join tbl_categories c on c.id = d.category_id
            where c.name = 'Electronics' and d.is_active = 1 and d.is_deleted = 0
            group by d.id
            `
        }
        else {
            query = `
            select d.image, d.title, d.address, d.created_at, d.avg_rating, d.total_comments,
            u.profile_image, concat(u.first_name, ' ', u.last_name) as name,
            case when r.id is null then 0 else 1 end as review_status
            from tbl_deal_dealer dd
            join tbl_post_dealer d on d.dealer_deal_id = dd.id
            join tbl_user u on u.id = d.user_id
            left join tbl_rating r on r.dealer_post_id = d.id and r.user_id = 1
            where d.is_active = 1 and d.is_deleted = 0
            group by d.id
            `
        }


        pool.query(query, [user_id], (error, results) => {
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

    getDealDetails(postId, callback) {
        const query = `
                SELECT d.image, d.title, d.address, d.created_at, d.website_url, d.latitude, d.longitude, d.avg_rating, d.total_comments, 
                c.name as category, 
                u.profile_image, CONCAT(u.first_name, ' ', u.last_name) as name,
                GROUP_CONCAT(t.name) as tag
                FROM tbl_deal_dealer dd
                JOIN tbl_post_dealer d ON d.dealer_deal_id = dd.id
                JOIN tbl_user u ON u.id = d.user_id
                JOIN tbl_categories c ON c.id = d.category_id
                LEFT JOIN tbl_post_tags pt ON pt.dealer_post_id = d.id
                LEFT JOIN tbl_tags t ON t.id = pt.tag_id
                WHERE d.id = ?
                GROUP BY d.id
            `

        pool.query(query, [postId], (error, results) => {
            if (error) {
                return callback({
                    code: responseCode.OPERATION_FAILED,
                    message: response_message.unsuccess,
                    data: error.sqlMessage,
                })
            }
            if (results.length === 0) {
                return callback({
                    code: responseCode.NOT_FOUND,
                    message: "Post not found",
                    data: null,
                })
            }
            callback(null, {
                code: responseCode.SUCCESS,
                message: response_message.success,
                data: results[0],
            })
        })
    }

    // 19 count of total deals per category.
    getCategoryDealCount(callback) {
        const query = `
        select c.id, c.name as category, count(dd.id) as total_deals
        from tbl_deal_dealer dd
        join tbl_post_dealer d on d.dealer_deal_id = dd.id
        join tbl_categories c on c.id = d.category_id
        group by c.name;`

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



    getDealsByCat(user_id, categoryName, callback) {
        const query = `
                SELECT d.image, d.title, d.address, d.created_at, d.avg_rating, d.total_comments,
                u.profile_image, CONCAT(u.first_name, ' ', u.last_name) as name,
                CASE WHEN r.id IS NULL THEN 0 ELSE 1 END as review_status
                FROM tbl_deal_dealer dd
                JOIN tbl_post_dealer d ON d.dealer_deal_id = dd.id
                JOIN tbl_user u ON u.id = d.user_id
                LEFT JOIN tbl_rating r ON r.dealer_post_id = d.id AND r.user_id = ?
                join tbl_categories c on c.id = d.category_id
                WHERE c.name = ? AND d.is_active = 1 AND d.is_deleted = 0
                GROUP BY d.id
            `

        pool.query(query, [user_id, categoryName], (error, results) => {
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

    getDealersDealComments(postId, callback) {
        const query = `
                SELECT u.profile_image, CONCAT(u.first_name, ' ', u.last_name) as name, c.comment, c.created_at
                FROM tbl_comment_dealer c
                JOIN tbl_user u ON u.id = c.user_id
                WHERE c.dealer_post_id = ?
                ORDER BY c.created_at DESC
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

    getUsersPostComments(userId, callback) {
        const query = `
                SELECT u.profile_image, CONCAT(u.first_name, ' ', u.last_name) as name, c.comment, c.created_at
                FROM tbl_comment_dealer c
                JOIN tbl_user u ON u.id = c.user_id
                WHERE c.user_id = ?
                ORDER BY c.created_at DESC
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

    addUpdateRate(postId, userId, rating, callback) {
        const query = `
                INSERT INTO tbl_rating (user_id, dealer_post_id, rating)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE rating = ?
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
                message: response_message.rating_added,
                data: result,
            })
        })
    }

    getOtherUserDetails(otherUser_id, userId, callback) {
        const query = `
                SELECT 
                u.id,
                u.profile_image, 
                CONCAT(u.first_name, ' ', u.last_name) AS name, 
                u.bio, 
                u.address, 
                u.latitude, 
                u.longitude, 
                u.total_followers, 
                u.total_following,
                CASE WHEN f.id IS NULL THEN 0 ELSE 1 END as follow_status,

                group_concat(b.image) AS business_image, 
                group_concat(b.company_name) AS business_name, 
                group_concat(b.address) AS business_address, 
                group_concat(b.latitude) AS business_latitude, 
                group_concat(b.longitude) AS business_longitude,

                -- Fetch posts separately to avoid row duplication
                (SELECT GROUP_CONCAT(d.image) FROM tbl_post_dealer d WHERE d.user_id = u.id) AS post_image,
                (SELECT GROUP_CONCAT(d.title) FROM tbl_post_dealer d WHERE d.user_id = u.id) AS post_title,
                (SELECT GROUP_CONCAT(d.description) FROM tbl_post_dealer d WHERE d.user_id = u.id) AS post_description,
                (SELECT GROUP_CONCAT(d.address) FROM tbl_post_dealer d WHERE d.user_id = u.id) AS post_address,
                (SELECT GROUP_CONCAT(d.latitude) FROM tbl_post_dealer d WHERE d.user_id = u.id) AS post_latitude,
                (SELECT GROUP_CONCAT(d.longitude) FROM tbl_post_dealer d WHERE d.user_id = u.id) AS post_longitude,

                -- Fetch deals separately to avoid row duplication
                (SELECT GROUP_CONCAT(dd.id) FROM tbl_deal_dealer dd WHERE dd.user_id = u.id) AS deal_id,
                (SELECT GROUP_CONCAT(dd.duration) FROM tbl_deal_dealer dd WHERE dd.user_id = u.id) AS deal_duration

            FROM tbl_user u
            JOIN tbl_business b ON b.user_id = u.id
            LEFT JOIN tbl_follow f ON f.user_id_1 = ? AND f.user_id_2 = u.id
            WHERE u.id = ?
            GROUP BY u.id;
            `
        pool.query(query, [userId, otherUser_id], (error, results) => {
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
                u.profile_image, 
                CONCAT(u.first_name, ' ', u.last_name) AS name, 
                u.bio, 
                u.address, 
                u.latitude, 
                u.longitude, 
                u.total_followers, 
                u.total_following,

                group_concat(b.image) AS business_image, 
                group_concat(b.company_name) AS business_name, 
                group_concat(b.address) AS business_address, 
                group_concat(b.latitude) AS business_latitude, 
                group_concat(b.longitude) AS business_longitude,

                -- Fetch posts separately to avoid row duplication
                (SELECT GROUP_CONCAT(d.image) FROM tbl_post_dealer d WHERE d.user_id = u.id) AS post_image,
                (SELECT GROUP_CONCAT(d.title) FROM tbl_post_dealer d WHERE d.user_id = u.id) AS post_title,
                (SELECT GROUP_CONCAT(d.description) FROM tbl_post_dealer d WHERE d.user_id = u.id) AS post_description,
                (SELECT GROUP_CONCAT(d.address) FROM tbl_post_dealer d WHERE d.user_id = u.id) AS post_address,
                (SELECT GROUP_CONCAT(d.latitude) FROM tbl_post_dealer d WHERE d.user_id = u.id) AS post_latitude,
                (SELECT GROUP_CONCAT(d.longitude) FROM tbl_post_dealer d WHERE d.user_id = u.id) AS post_longitude,

                -- Fetch deals separately to avoid row duplication
                (SELECT GROUP_CONCAT(dd.id) FROM tbl_deal_dealer dd WHERE dd.user_id = u.id) AS deal_id,
                (SELECT GROUP_CONCAT(dd.duration) FROM tbl_deal_dealer dd WHERE dd.user_id = u.id) AS deal_duration

            FROM tbl_user u
            JOIN tbl_business b ON b.user_id = u.id
            WHERE u.id = ?
            GROUP BY u.id;
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
                SELECT u.id, u.profile_image, CONCAT(u.first_name, ' ', u.last_name) as name
                FROM tbl_follow f
                JOIN tbl_user u ON u.id = f.user_id_2
                WHERE f.user_id_1 = ? AND f.status = 'accept'
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

    getFollower(userId, callback) {
        const query = `
                SELECT u.id, u.profile_image, CONCAT(u.first_name, ' ', u.last_name) as name
                FROM tbl_follow f
                JOIN tbl_user u ON u.id = f.user_id_1
                WHERE f.user_id_2 = ? AND f.status = 'accept'
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

    getSavedPost(userId, callback) {
        const query = `
                SELECT d.image, d.title, d.address, d.created_at, d.avg_rating, d.total_comments,
                u.profile_image, CONCAT(u.first_name, ' ', u.last_name) as name,
                CASE WHEN r.id IS NULL THEN 0 ELSE 1 END as review_status
                FROM tbl_favorites f
                JOIN tbl_post_dealer d ON d.id = f.dealer_post_id
                JOIN tbl_user u ON u.id = d.user_id
                LEFT JOIN tbl_rating r ON r.dealer_post_id = d.id AND r.user_id = ?
                WHERE f.user_id = ? AND d.is_active = 1 AND d.is_deleted = 0
                GROUP BY d.id
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
};

module.exports = new user_model();
