create database task18_db_17_02;
use task18_db_17_02;

-- schema of toStyleMOU app

create table tbl_user(
    id bigint(20) primary key auto_increment,
    step int default 1,
    email varchar(64),
    country_code varchar(8),
    phone varchar(16),
    password text,
    username varchar(64),
    fullname varchar(255),
    dob date,
    profile_image text default 'default.jpg',
    language enum ('English','French','Germany'),
    gender enum('Male','Female'), 
    login_type enum('s', 'g', 'f'),
    social_id varchar(128),
    is_verified tinyint(1) default 0,
    is_active tinyint(1) default 1,
    is_deleted tinyint(1) default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    deleted_at timestamp null
);

create table tbl_otp(
    id bigint(20) primary key auto_increment,
    user_id bigint(20),
    email varchar(64),
    phone varchar(16),
    otp varchar(6),
    action enum('signup','forgot'),
    is_active tinyint default 1,
    is_deleted tinyint default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp
);

create table tbl_category(
    id bigint(20) primary key auto_increment,
    name varchar(32),
    is_active tinyint default 1,
    is_deleted tinyint default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    deleted_at timestamp null
);

create table tbl_post(
    id bigint(20) primary key auto_increment,
    user_id bigint(20),
    cat_id bigint(20),
    description text,
    total_comment int,
    avg_rating float(5, 1),
    is_compare bool default 0,
    is_video bool default 0,
    is_me bool default 0,
    video_duration time default 0,
    is_comment_restricted bool default 0,
    likes_disabled bool default 0,
    timer time default 0,
    is_trending bool default 0,
    is_active tinyint default 1,
    is_deleted tinyint default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    deleted_at timestamp null,
    foreign key (user_id) references tbl_user(id),
    foreign key (cat_id) references tbl_category(id)
);

create table tbl_image(
    id bigint(20) primary key auto_increment,
    post_id bigint(20),
    image text,
    likes int default 0,
    is_active tinyint default 1,
    is_deleted tinyint default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    deleted_at timestamp null,
    foreign key (post_id) references tbl_post(id)
);

create table tbl_like(
    id bigint(20) primary key auto_increment,
    user_id bigint(20),
    image_id bigint(20),
    is_active tinyint default 1,
    is_deleted tinyint default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    foreign key (user_id) references tbl_user(id),
    foreign key (image_id) references tbl_image(id)
);

create table tbl_comment(
    id bigint(20) primary key auto_increment,
    user_id bigint(20),
    post_id bigint(20),
    comment text,
    is_active tinyint default 1,
    is_deleted tinyint default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    deleted_at timestamp null,
    foreign key (user_id) references tbl_user(id),
    foreign key (post_id) references tbl_post(id)
);

create table tbl_follow(
    id bigint(20) primary key auto_increment,
    user_id bigint(20),
    follow_id bigint(20),
    status enum('accept', 'pending', 'reject'),
    is_active tinyint default 1,
    is_deleted tinyint default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    foreign key (user_id) references tbl_user(id),
    foreign key (follow_id) references tbl_user(id)
);

create table tbl_favourite(
    id bigint(20) primary key auto_increment,
    user_id bigint(20),
    post_id bigint(20),
    is_active tinyint default 1,
    is_deleted tinyint default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    foreign key (user_id) references tbl_user(id),
    foreign key (post_id) references tbl_post(id)
);

create table tbl_tag(
    id bigint(20) primary key auto_increment,
    name varchar(255),
    is_active tinyint default 1,
    is_deleted tinyint default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp
);

create table tbl_post_tag(
    id bigint(20) primary key auto_increment,
    tag_id bigint(20),
    post_id bigint(20),
    is_active tinyint default 1,
    is_deleted tinyint default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    foreign key (tag_id) references tbl_tag(id),
    foreign key (post_id) references tbl_post(id)
);

create table tbl_notification(
    id bigint(20) primary key auto_increment,
    title varchar(32),
    content text,
    sender_id bigint(20),
    receiver_id bigint(20),
    is_read bool,
    notification_type ENUM('info', 'warning', 'alert') DEFAULT 'info',
    is_active tinyint default 1,
    is_deleted tinyint default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    foreign key (sender_id) references tbl_user(id),
    foreign key (receiver_id) references tbl_user(id)
);

create table tbl_rating(
    id bigint(20) primary key auto_increment,
    user_id bigint(20),
    post_id bigint(20),
    rating float(5, 1),
    is_active tinyint default 1,
    is_deleted tinyint default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    deleted_at timestamp null,
    foreign key (user_id) references tbl_user(id),
    foreign key (post_id) references tbl_post(id)
);

CREATE TABLE tbl_app_details (
    id INT PRIMARY KEY AUTO_INCREMENT,
    about TEXT NOT NULL,
    terms TEXT NOT NULL,
    privacy TEXT NOT NULL,
    is_active TINYINT DEFAULT 1,
    is_deleted TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE tbl_device_info (
    id BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT(20) NOT NULL,
    device_type ENUM('android', 'ios') NOT NULL,
    device_token TEXT NOT NULL,
    os_version VARCHAR(16) NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    is_deleted TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES tbl_user(id) ON DELETE CASCADE
);



-- * RATING TRIGGER (INSERT) *

DELIMITER //
create trigger rating_insert
after insert on tbl_rating
for each row
begin
update tbl_post 
set avg_rating=(
    select ifnull(round(avg(tbl_rating.rating),1),0) 
    from tbl_rating 
    where tbl_rating.post_id=new.post_id
)
where tbl_post.id=new.post_id and tbl_post.is_active=1 and tbl_post.is_deleted=0;
end;

//
DELIMITER ;


-- * RATING TRIGGER (UPDATE) *

DELIMITER //
create trigger rating_update
after update on tbl_rating
for each row
begin
update tbl_post 
set avg_rating=(
    select ifnull(round(avg(tbl_rating.rating),1),0) 
    from tbl_rating 
    where tbl_rating.post_id=old.post_id
)
where tbl_post.id=old.post_id and tbl_post.is_active=1 and tbl_post.is_deleted=0;
end;

//
DELIMITER ;


-- * RATING TRIGGER (DELETE) *

DELIMITER //
create trigger rating_delete
after delete on tbl_rating
for each row
begin
update tbl_post 
set avg_rating=(
    select ifnull(round(avg(tbl_rating.rating),1),0) 
    from tbl_rating 
    where tbl_rating.post_id=old.post_id
)
where tbl_post.id=old.post_id and tbl_post.is_active=1 and tbl_post.is_deleted=0;
end;

//
DELIMITER ;





-- * COMMENT TRIGGER (INSERT) *

DELIMITER //
create trigger comment_insert
after insert on tbl_comment
for each row
begin
update tbl_post 
set total_comment=(
    select count(*) 
    from tbl_comment 
    where tbl_comment.post_id=new.post_id
)
where tbl_post.id=new.post_id and tbl_post.is_active=1 and tbl_post.is_deleted=0;
end;

//
DELIMITER ;



-- * COMMENT TRIGGER (UPDATE) *

DELIMITER //
create trigger comment_update
after update on tbl_comment
for each row
begin
update tbl_post 
set total_comment=(
    select count(*) 
    from tbl_comment 
    where tbl_comment.post_id=old.post_id
)
where tbl_post.id=old.post_id and tbl_post.is_active=1 and tbl_post.is_deleted=0;
end;

//
DELIMITER ;



-- * COMMENT TRIGGER (DELETE) *

DELIMITER //
create trigger comment_delete
after delete on tbl_comment
for each row
begin
update tbl_post 
set total_comment=(
    select count(*) 
    from tbl_comment 
    where tbl_comment.post_id=old.post_id
)
where tbl_post.id=old.post_id and tbl_post.is_active=1 and tbl_post.is_deleted=0;
end;

//
DELIMITER ;







-- * LIKE TRIGGER (INSERT) *

DELIMITER //
create trigger like_insert
after insert on tbl_like
for each row
begin
update tbl_image 
set likes=(
    select count(*) 
    from tbl_like 
    where tbl_like.image_id=new.image_id
)
where tbl_image.id=new.image_id and tbl_image.is_active=1 and tbl_image.is_deleted=0;
end;

//
DELIMITER ;



-- * LIKE TRIGGER (DELETE) *

DELIMITER //
create trigger like_delete
after delete on tbl_like
for each row
begin
update tbl_image 
set likes=(
    select count(*) 
    from tbl_like 
    where tbl_like.image_id=old.image_id
)
where tbl_image.id=old.image_id and tbl_image.is_active=1 and tbl_image.is_deleted=0;
end;

//
DELIMITER ;


-- * TAG * 

-- DELIMITER //

-- create trigger hashtag_trigger
-- after insert on tbl_post_tag
-- for each row
-- begin
--     if not exists (select id from tbl_tag where name = new.name) then
--         insert into tbl_tag (name, total_count) values (new.name, 1);
--     ELSE
--         update tbl_tag set total_count = total_count + 1 where name = new.name;
--     end if;
-- end;
-- //

-- DELIMITER ;




insert into tbl_user (step, email, country_code, phone, password, username, fullname, dob, language, bio, is_verified) values  
('4', 'john.doe@example.com', '+1', '9876543210', 'hashed_password_1', 'johndoe', 'John Doe', '1995-05-15', 'English', 'Software developer at XYZ Corp.','1'),  
('4', 'jane.smith@example.com', '+44', '7654321098', 'hashed_password_2', 'janesmith', 'Jane Smith', '1998-08-21', 'English', 'Tech enthusiast and blogger.','1'),  
('4', 'alex.brown@example.com', '+91', '9871234560', 'hashed_password_3', 'alexbrown', 'Alex Brown', '2000-12-10', 'Germany', 'Passionate about AI and ML.','1'),  
('4', 'emily.white@example.com', '+33', '6543210987', 'hashed_password_4', 'emilywhite', 'Emily White', '1993-03-25', 'French', 'Data scientist and researcher.','1'),  
('4', 'michael.johnson@example.com', '+49', '7896541230', 'hashed_password_5', 'michaelj', 'Michael Johnson', '1997-07-30', 'German', 'Full-stack developer and open-source contributor.','1');

insert into tbl_category (name) values  
('Travel'),  
('Food'),  
('Fitness'),  
('Fashion'),  
('Technology'),  
('Photography');

INSERT INTO tbl_post (user_id, cat_id, description, is_compare, is_video, is_me, video_duration, is_comment_restricted, likes_disabled, timer) VALUES  
(1, 1, 'Exploring the beautiful beaches of Bali! 🌊✨ #Travel #BeachLife', 0, 1, 0, '00:02:30', 0, 0, '00:05:00'),  
(2, 2, 'Tried this amazing pasta recipe today! 🍝 #Foodie #Homemade', 1, 0, 0, '00:00:00', 0, 0, '00:05:00'),  
(3, 3, 'Morning workout done! Feeling pumped 💪 #Fitness #HealthyLiving', 0, 1, 0, '00:01:00', 0, 0, '00:05:00'),  
(4, 4, 'New outfit drop! What do you think? 🔥 #Fashion #Style', 0, 0, 1, '00:00:45', 0, 0, '00:05:00');

INSERT INTO tbl_image (post_id, image) VALUES  
(1, 'bali_beach_1.mp4'),    
(2, 'pasta_dish.jpg'),  
(2, 'pasta_dish2.jpg'),  
(3, 'gym_workout.mp4'),  
(4, 'fashion_outfit_1.jpg'),  
(4, 'fashion_outfit_2.jpg');

INSERT INTO tbl_like (user_id, image_id) VALUES  
(1, 1),  
(2, 1),  
(3, 2),  
(4, 3),  
(5, 4),  
(1, 5),  
(2, 5),  
(3, 6),  
(4, 6),  
(5, 2);

INSERT INTO tbl_comment (user_id, post_id, comment) VALUES  
(1, 1, 'This place looks amazing! 🌊✨'),  
(2, 1, 'I wish I could visit Bali someday!'),  
(3, 2, 'That pasta looks delicious! 🍝'),  
(4, 3, 'Great job on your workout! Keep going! 💪'),  
(5, 4, 'Love this outfit! Where did you get it?'),  
(1, 3, 'Morning workouts are the best way to start the day!'),  
(2, 4, 'Fashion game on point! 🔥'),  
(3, 1, 'Such a beautiful view! 😍'),  
(4, 2, 'I need to try this recipe soon!'),  
(5, 3, 'Stay consistent! Fitness is a lifestyle! 💯');

INSERT INTO tbl_follow (user_id, follow_id, status) VALUES 
(1, 2, 'accept'),  
(2, 3, 'pending'),  
(3, 4, 'accept'),  
(4, 5, 'reject'),  
(5, 1, 'accept'),  
(1, 3, 'pending'),  
(2, 4, 'accept'),  
(3, 5, 'pending'),  
(4, 1, 'accept'),  
(5, 2, 'reject');

INSERT INTO tbl_favourite (user_id, post_id) VALUES  
(1, 1),  
(2, 2),  
(3, 3),  
(4, 4),  
(5, 1),  
(1, 3),  
(2, 4),  
(3, 2),  
(4, 1),  
(5, 3);

insert into tbl_otp(email,phone,otp_generated) values
('mailto:john.doe@example.com','1234567890','123456');

insert into tbl_tag(name) values
('#trending'),
('#drip'),
('#goat'),
('#bestforlife'),
('#nice');

insert into tbl_post_tag(post_id,tag_id) values
(1, 2),
(2, 3),
(3, 4),
(4, 5);

INSERT INTO tbl_rating (user_id, post_id, rating) VALUES  
(1, 1, 4.8),  
(2, 1, 4.7),  
(3, 2, 4.9),  
(4, 3, 4.6),  
(5, 4, 4.5),  
(1, 4, 4.7),  
(2, 1, 4.6),  
(3, 3, 4.8),  
(4, 1, 4.7),  
(5, 2, 4.9);

INSERT INTO tbl_notification (content, sender_id, receiver_id, is_read, notification_type) VALUES  
('User 1 liked your post!', 1, 2, false, 'info'),  
('User 2 commented on your post: "Love the view!"', 2, 1, false, 'info'),  
('User 3 posted a new workout video!', 3, 4, false, 'info'),  
('User 4 liked your post!', 4, 5, true, 'info'),  
('User 5 commented on your post: "This looks delicious!"', 5, 2, true, 'info'),  
('User 1 posted a new fashion outfit!', 1, 3, false, 'info'),  
('User 2 liked your post!', 2, 4, false, 'info'),  
('User 3 commented on your post: "I need this recipe!"', 3, 5, false, 'info'),  
('User 4 posted a new photo!', 4, 1, true, 'info'),  
('User 5 liked your post!', 5, 2, false, 'info');

INSERT INTO tbl_app_details (about, terms, privacy, is_active, is_deleted, created_at, updated_at) VALUES
('This is a social media app that connects people around the world.', 'These are the terms and conditions.', 'This is the privacy policy.', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('An app to share your moments with friends and family.', 'Terms and conditions for using the app.', 'Privacy policy for user data.', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('A platform to showcase your talents and skills.', 'User agreement and terms of service.', 'Privacy policy regarding user information.', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO tbl_device_info (user_id, device_type, device_token, os_version, is_active, is_deleted, created_at, updated_at, deleted_at) VALUES
(1, 'android', 'token1', '10.0', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
(2, 'ios', 'token2', '14.4', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
(3, 'android', 'token3', '11.0', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
(4, 'ios', 'token4', '13.3', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
(5, 'android', 'token5', '9.0', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL);


-- queries

-- * TRENDING BASED ON RATING *
select tbl_post.id, tbl_image.image
from tbl_post 
join tbl_image on tbl_post.id=tbl_image.post_id
where avg_rating>4.5 and tbl_post.is_compare=0 and tbl_post.is_active=1 and tbl_post.is_deleted=0 and tbl_image.is_active=1 and tbl_image.is_deleted=0
group by tbl_post.id;


-- * NEW WISE *
select tbl_post.id,tbl_image.image, tbl_post.is_me,tbl_post.is_compare,tbl_post.is_video
from tbl_post
join tbl_image on tbl_image.id=tbl_post.id
where tbl_post.is_active=1 and tbl_post.is_deleted=0 and tbl_image.is_active=1 and tbl_image.is_deleted=0
order by tbl_post.created_at desc limit 2;


-- * FOLLOWING * 
select tbl_post.id,tbl_image.image, tbl_post.is_me,tbl_post.is_compare,tbl_post.is_video
from tbl_post
join tbl_image on tbl_post.id=tbl_image.post_id
join tbl_follow on tbl_follow.user_id=tbl_post.user_id
where tbl_post.is_active=1 and tbl_post.is_deleted=0 and tbl_image.is_active=1 and tbl_image.is_deleted=0
and tbl_post.user_id=1
group by tbl_post.id;


-- * EXPIRING * 
select tbl_post.id,tbl_image.image, tbl_post.is_me,tbl_post.is_compare,tbl_post.is_video
from tbl_post 
join tbl_image on tbl_post.id=tbl_image.post_id
where tbl_post.is_compare=1 and tbl_post.is_active=1 and tbl_post.is_deleted=0 and tbl_image.is_active=1 and tbl_image.is_deleted=0
group by tbl_post.id
order by tbl_post.timer asc limit 2;


-- * INSERT POST *
INSERT INTO tbl_post (user_id, cat_id, description, is_compare, is_video, is_me, video_duration, is_comment_restricted, likes_disabled, timer) VALUES  
(1, 1, 'Exploring the beautiful beaches of Bali! 🌊✨ #Travel #BeachLife', 0, 1, 0, '00:02:30', 0, 0, '00:05:00');


-- * POST DETAILS *
select tbl_user.id,tbl_user.profile_image,tbl_user.fullname,
tbl_post.is_me,tbl_post.is_video, tbl_post.id,
tbl_image.image,tbl_image.created_at, tbl_post.avg_rating,tbl_post.total_comment,tbl_post.description,
case 
    when tbl_favourite.user_id = 1 then '1' 
    else '0' 
end as is_favourite,
case 
    when tbl_rating.user_id = 1 then '1'
    else '0' 
end as is_rated
from tbl_post 
join tbl_image on tbl_image.post_id=tbl_post.id
join tbl_user on tbl_user.id=tbl_post.user_id
left join tbl_favourite on tbl_favourite.post_id =tbl_post.id and tbl_favourite.user_id=1
left join tbl_rating on tbl_rating.post_id = tbl_post.id and tbl_rating.user_id = 1
where tbl_post.is_compare=0 and tbl_post.is_active=1 and tbl_post.is_deleted=0 and tbl_image.is_active=1 and tbl_image.is_deleted=0
group by tbl_post.id;


-- * POST DELETE *
delete from tbl_post where tbl_post.id=1 and tbl_post.is_active=1 and tbl_post.is_deleted=0;


-- * ADD COMMENT *
INSERT INTO tbl_comment (user_id, post_id, comment) VALUES  
(1, 1, 'This place looks amazing! 🌊✨');


-- * ADD RATING *
INSERT INTO tbl_rating (user_id, post_id, rating) VALUES  
(1, 1, 4.8);


-- * RANKING *
select tbl_image.*
from tbl_image
join tbl_post on tbl_post.id=tbl_image.post_id
where tbl_post.is_compare=1 and tbl_post.id = 2
order by likes desc;


-- * FOLLOWER *
select distinct f1.user_id, u.fullname, f2.*,
case 
	when f2.user_id is not null then '1'
	else '0'
end as following_or_not
from tbl_follow f1
left join tbl_follow f2 on f1.user_id = f2.follow_id and f2.user_id = 1
join tbl_user u on f1.user_id = u.id
where f1.follow_id = 1 and f1.status = 'accept';


-- * FOLLOWING *
select distinct f1.follow_id, tbl_user.fullname,
case
	when f2.follow_id is not null then '1'
    else '0'
end as following_or_not
from tbl_follow f1
left join tbl_follow f2 on f1.follow_id=f2.user_id and f2.follow_id=1
join tbl_user on tbl_user.id=f1.follow_id
where f1.user_id=1 and f1.status='accept';



-- * NOTIFICATION *
select * from tbl_notification;


-- * PROFILE DETAILS *
select (select count(*) from tbl_follow where user_id=1 and status='accept' group by user_id) as following,
(select count(*) from tbl_follow where follow_id=1 and status='accept' group by follow_id) as follower,
u.profile_image,u.username,p.avg_rating,pi.image from tbl_user u
join tbl_post p on u.id = p.user_id
join tbl_image pi on p.id = pi.post_id
where u.id = 1;

















