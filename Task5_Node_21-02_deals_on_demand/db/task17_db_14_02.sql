create database task17_db_14_02;
use task17_db_14_02;

-- plans
create table tbl_plans(
    id bigint(20) primary key auto_increment,
    name varchar(32) not null,
    price float(10,2) not null,
    duration int not null,
    description text,
    is_active tinyint(1) default 1,
    is_deleted tinyint(1) default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    deleted_at timestamp null
);

create table tbl_user(
	id bigint(20) primary key auto_increment,
    step int,
    role enum('user', 'dealer') default 'user' not null,
    profile_image text default 'default.jpg',
    user_name varchar(32) not null,
	email varchar(64) unique not null,
    phone varchar(16) not null,
	password text not null,
    coins INT DEFAULT 0,
    referral_code varchar(16) unique,
	first_name varchar(32),
    last_name varchar(32),
    bio text,
    login_type enum('s', 'g', 'f'),
    social_id varchar(128),
    total_followers int default 0,
    total_following int default 0,
	address TEXT,
    country varchar(16),
	latitude varchar(16),
    longitude varchar(16),
    plan_id bigint(20),
    plan_price float(10,2),
    plan_status ENUM('active', 'expired', 'cancelled') NULL,
    is_verified tinyint(1) default 0,
	is_active tinyint(1) default 1,
	is_deleted tinyint(1) default 0,
	created_at timestamp default current_timestamp,
	updated_at timestamp default current_timestamp on update current_timestamp,
	deleted_at timestamp null,
    INDEX idx_email (email),
    foreign key (plan_id) references tbl_plans(id) on delete cascade
);

create table tbl_otp (
    id bigint(20) primary key auto_increment,
    user_id bigint(20) not null,
    email varchar(64),
    phone varchar(16),
    otp varchar(6) not null,
    action enum('signup','forgot'),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    foreign key (user_id) references tbl_user(id) on delete cascade
);

CREATE TABLE tbl_categories (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY,
    cover_image TEXT,
    name VARCHAR(32) NOT NULL,
    is_active tinyint(1) DEFAULT 1,
    is_deleted tinyint(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	deleted_at timestamp null
);

create table tbl_business (
	id bigint(20) AUTO_INCREMENT PRIMARY KEY,
    user_id bigint(20) not null,
    category_id bigint(20) not null,
    image text,
    company_name varchar(64) not null,
    address TEXT NOT NULL,
	latitude varchar(16) NOT NULL,
    longitude varchar(16) NOT NULL,
    is_active tinyint(1) default 1,
	is_deleted tinyint(1) default 0,
	created_at timestamp default current_timestamp,
	updated_at timestamp default current_timestamp on update current_timestamp,
	deleted_at timestamp null,
    foreign key (user_id) references tbl_user(id) on delete cascade,
    foreign key (category_id) references tbl_categories(id) on delete cascade
);

create table tbl_deal_dealer (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY,
    user_id bigint(20) not null,
    duration datetime,
    is_active tinyint(1) default 1,
	is_deleted tinyint(1) default 0,
	created_at timestamp default current_timestamp,
	updated_at timestamp default current_timestamp on update current_timestamp,
	deleted_at timestamp null,
    foreign key (user_id) references tbl_user(id) on delete cascade
);

create table tbl_post_dealer (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY,
    user_id bigint(20) not null,
    dealer_deal_id bigint(20) not null,
    category_id bigint(20) not null,
    image text not null,
    title varchar(255) not null,
    description text not null,
    address TEXT NOT NULL,
    country varchar(16),
	latitude varchar(16) NOT NULL,
    longitude varchar(16) NOT NULL,
    website_url text not null,
    avg_rating float(2,1) default 0,
    total_comments int default 0,
    is_active tinyint(1) default 1,
	is_deleted tinyint(1) default 0,
	created_at timestamp default current_timestamp,
	updated_at timestamp default current_timestamp on update current_timestamp,
	deleted_at timestamp null,
    foreign key (user_id) references tbl_user(id) on delete cascade,
    foreign key (category_id) references tbl_categories(id) on delete cascade,
	foreign key (dealer_deal_id) references tbl_deal_dealer(id) on delete cascade
);

create table tbl_tags (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY,
    name varchar(32) not null,
    is_active tinyint(1) default 1,
    is_deleted tinyint(1) default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    deleted_at timestamp null
);

create table tbl_post_tags (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY,
    dealer_post_id bigint(20) not null,
    tag_id bigint(20) not null,
    is_active tinyint(1) default 1,
    is_deleted tinyint(1) default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    deleted_at timestamp null,
    foreign key (dealer_post_id) references tbl_post_dealer(id) on delete cascade,
    foreign key (tag_id) references tbl_tags(id) on delete cascade
);

create table tbl_post_user (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY,
    user_id bigint(20) not null,
    category_id bigint(20) not null,
    title varchar(255) not null,
    description text not null,
    address TEXT NOT NULL,
	latitude varchar(16) NOT NULL,
    longitude varchar(16) NOT NULL,
    total_comments int default 0,
    is_active tinyint(1) default 1,
	is_deleted tinyint(1) default 0,
	created_at timestamp default current_timestamp,
	updated_at timestamp default current_timestamp on update current_timestamp,
	deleted_at timestamp null,
    foreign key (user_id) references tbl_user(id) on delete cascade,
    foreign key (category_id) references tbl_categories(id) on delete cascade
);

-- 
create table tbl_comment_dealer (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY,
    user_id bigint(20) not null,
    dealer_post_id bigint(20) not null,
    comment text not null,
    address TEXT NOT NULL,
	latitude varchar(16) NOT NULL,
    longitude varchar(16) NOT NULL,
    is_active tinyint(1) default 1,
    is_deleted tinyint(1) default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    deleted_at timestamp null,
    foreign key (dealer_post_id) references tbl_post_dealer(id) on delete cascade,
    foreign key (user_id) references tbl_user(id) on delete cascade
);

create table tbl_comment_user (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY,
    user_id bigint(20) not null,
    user_post_id bigint(20) not null,
    comment text not null,
    is_active tinyint(1) default 1,
    is_deleted tinyint(1) default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    deleted_at timestamp null,
    foreign key (user_post_id) references tbl_post_user(id) on delete cascade,
    foreign key (user_id) references tbl_user(id) on delete cascade
);

create table tbl_rating (
    id bigint(20) primary key auto_increment,
    user_id bigint(20) not null,
    dealer_post_id bigint(20) not null,
    rating float(2,1) not null,
    CHECK (rating >= 1 AND rating <= 5),
    review text,
	is_active tinyint(1) DEFAULT 1,
    is_deleted tinyint(1) DEFAULT 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
	deleted_at TIMESTAMP NULL,
    foreign key (dealer_post_id) references tbl_post_dealer(id) on delete cascade,
    foreign key (user_id) references tbl_user(id) on delete cascade    
);

create table tbl_reporting (
    id bigint(20) primary key auto_increment,
    user_id bigint(20) not null,
    dealer_post_id bigint(20) not null,
    reason text not null,
    is_active tinyint(1) default 1,
    is_deleted tinyint(1) default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    deleted_at timestamp null,
    foreign key (dealer_post_id) references tbl_post_dealer(id) on delete cascade,
    foreign key (user_id) references tbl_user(id) on delete cascade
);

CREATE TABLE tbl_favorites (
    user_id bigint(20) NOT NULL,
    dealer_post_id bigint(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    PRIMARY KEY (user_id, dealer_post_id),
    FOREIGN KEY (user_id) REFERENCES tbl_user(id) on delete cascade,
    FOREIGN KEY (dealer_post_id) REFERENCES tbl_post_dealer(id) on delete cascade
);

-- user_id_1(do following) and user_id_2(followed)
create table tbl_follow(
	id bigint(20) primary key auto_increment,
	user_id_1 bigint(20),
	user_id_2 bigint(20),
	status enum('pending','accept','reject'),
	is_active tinyint(1) default 1,
	is_deleted tinyint(1) default 0,
	created_at timestamp default current_timestamp,
	updated_at timestamp default current_timestamp on update current_timestamp,
	deleted_at timestamp null,
	foreign key (user_id_1) references tbl_user(id) on delete cascade,
	foreign key (user_id_2) references tbl_user(id) on delete cascade
);

-- user_id_1(owner) and user_id_2(use by)
create table tbl_referral(
    id bigint(20) primary key auto_increment,
	user_id_1 bigint(20),
	user_id_2 bigint(20),
    coins_earned INT DEFAULT 50,
    is_redeemed TINYINT(1) DEFAULT 0,
    is_active tinyint(1) default 1,
    is_deleted tinyint(1) default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    deleted_at timestamp null,
    foreign key (user_id_1) references tbl_user(id) on delete cascade,
    foreign key (user_id_2) references tbl_user(id) on delete cascade
);

-- Create table for PayPal redemptions
CREATE TABLE tbl_redemption (
    id BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT(20) NOT NULL,
    amount INT NOT NULL,
    paypal_email VARCHAR(64) NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES tbl_user(id) ON DELETE CASCADE
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









-- insert queries


-- Insert 3 rows into tbl_plans
INSERT INTO tbl_plans (name, price, duration, description)
VALUES 
('Basic', 9.99, 30, 'Basic plan with limited features'),
('Standard', 19.99, 30, 'Standard plan with more features'),
('Premium', 29.99, 30, 'Premium plan with all features');



-- Insert 5 rows into tbl_user
INSERT INTO tbl_user (
    step, role, profile_image, user_name, email, phone, password, coins, referral_code, 
    first_name, last_name, bio, address, latitude, longitude, 
    plan_id, plan_price, plan_status
)
VALUES 
-- User 1: Basic Plan (active)
(2, 'user', 'default.jpg', 'john_doe', 'john.doe@example.com', '1234567890', 'password123', 100, 'REF123', 
 'John', 'Doe', 'I am a software engineer.', '123 Main St, New York, NY', '40.7128', '-74.0060', 
 1, 9.99, 'active'),
-- User 2: Standard Plan (active)
(2, 'dealer', 'default.jpg', 'jane_smith', 'jane.smith@example.com', '0987654321', 'password456', 200, 'REF456', 
 'Jane', 'Smith', 'I am a car dealer.', '456 Elm St, Los Angeles, CA', '34.0522', '-118.2437', 
 2, 19.99, 'active'),
-- User 3: Premium Plan (expired)
(2, 'user', 'default.jpg', 'alice_wang', 'alice.wang@example.com', '1122334455', 'password789', 150, 'REF789', 
 'Alice', 'Wang', 'I love traveling.', '789 Oak St, Chicago, IL', '41.8781', '-87.6298', 
 3, 29.99, 'expired'),
-- User 4: No Plan (cancelled)
(2, 'dealer', 'default.jpg', 'bob_jones', 'bob.jones@example.com', '5566778899', 'password101', 50, 'REF101', 
 'Bob', 'Jones', 'I sell electronics.', '101 Pine St, Houston, TX', '29.7604', '-95.3698', 
 NULL, NULL, 'cancelled'),
-- User 5: Basic Plan (active)
(2, 'user', 'default.jpg', 'chris_evans', 'chris.evans@example.com', '9988776655', 'password202', 300, 'REF202', 
 'Chris', 'Evans', 'I am a fitness trainer.', '202 Maple St, Phoenix, AZ', '33.4484', '-112.0740', 
 1, 9.99, 'active');

INSERT INTO tbl_otp (user_id, email, phone, otp, action, expires_at)
VALUES 
(1, 'john.doe@example.com', '1234567890', '123456', 'signup', DATE_ADD(NOW(), INTERVAL 10 MINUTE)),
(2, 'jane.smith@example.com', '0987654321', '654321', 'forgot', DATE_ADD(NOW(), INTERVAL 10 MINUTE)),
(3, 'alice.wang@example.com', '1122334455', '987654', 'signup', DATE_ADD(NOW(), INTERVAL 10 MINUTE)),
(4, 'bob.jones@example.com', '5566778899', '456789', 'forgot', DATE_ADD(NOW(), INTERVAL 10 MINUTE)),
(5, 'chris.evans@example.com', '9988776655', '321654', 'signup', DATE_ADD(NOW(), INTERVAL 10 MINUTE)),
(1, 'john.doe@example.com', '1234567890', '123456', 'signup', DATE_ADD(NOW(), INTERVAL 10 MINUTE)),
(2, 'jane.smith@example.com', '0987654321', '654321', 'forgot', DATE_ADD(NOW(), INTERVAL 10 MINUTE)),
(3, 'alice.wang@example.com', '1122334455', '987654', 'signup', DATE_ADD(NOW(), INTERVAL 10 MINUTE)),
(4, 'bob.jones@example.com', '5566778899', '456789', 'forgot', DATE_ADD(NOW(), INTERVAL 10 MINUTE)),
(5, 'chris.evans@example.com', '9988776655', '321654', 'signup', DATE_ADD(NOW(), INTERVAL 10 MINUTE)),
(1, 'john.doe@example.com', '1234567890', '123456', 'signup', DATE_ADD(NOW(), INTERVAL 10 MINUTE)),
(2, 'jane.smith@example.com', '0987654321', '654321', 'forgot', DATE_ADD(NOW(), INTERVAL 10 MINUTE)),
(3, 'alice.wang@example.com', '1122334455', '987654', 'signup', DATE_ADD(NOW(), INTERVAL 10 MINUTE)),
(4, 'bob.jones@example.com', '5566778899', '456789', 'forgot', DATE_ADD(NOW(), INTERVAL 10 MINUTE)),
(5, 'chris.evans@example.com', '9988776655', '321654', 'signup', DATE_ADD(NOW(), INTERVAL 10 MINUTE));

-- Insert 15 rows into tbl_categories
INSERT INTO tbl_categories (cover_image, name)
VALUES 
('image1.jpg', 'Electronics'),
('image2.jpg', 'Fashion'),
('image3.jpg', 'Home & Garden'),
('image4.jpg', 'Automotive'),
('image5.jpg', 'Health & Beauty'),
('image6.jpg', 'Sports'),
('image7.jpg', 'Toys & Games'),
('image8.jpg', 'Books'),
('image9.jpg', 'Music'),
('image10.jpg', 'Movies'),
('image11.jpg', 'Food & Drink'),
('image12.jpg', 'Travel'),
('image13.jpg', 'Pets'),
('image14.jpg', 'Art'),
('image15.jpg', 'Jewelry');

    -- Insert 15 rows into tbl_business
INSERT INTO tbl_business (category_id, user_id, image, company_name, address, latitude, longitude)
VALUES 
(1,1, 'business1.jpg', 'Tech World', '123 Tech St, San Francisco, CA', '37.7749', '-122.4194'),
(2,2, 'business2.jpg', 'Fashion Hub', '456 Fashion Ave, New York, NY', '40.7128', '-74.0060'),
(3,3, 'business3.jpg', 'Home Essentials', '789 Home St, Chicago, IL', '41.8781', '-87.6298'),
(4,4, 'business4.jpg', 'Auto Dealers', '101 Auto St, Houston, TX', '29.7604', '-95.3698'),
(5,5, 'business5.jpg', 'Health & Beauty Co', '202 Beauty St, Phoenix, AZ', '33.4484', '-112.0740'),
(6,1, 'business6.jpg', 'Sports Gear', '303 Sports St, Los Angeles, CA', '34.0522', '-118.2437'),
(7,2, 'business7.jpg', 'Toy Store', '404 Toy St, Miami, FL', '25.7617', '-80.1918'),
(8,3, 'business8.jpg', 'Book Haven', '505 Book St, Seattle, WA', '47.6062', '-122.3321'),
(9,4, 'business9.jpg', 'Music World', '606 Music St, Austin, TX', '30.2672', '-97.7431'),
(10,5, 'business10.jpg', 'Movie Theater', '707 Movie St, Boston, MA', '42.3601', '-71.0589'),
(11,1, 'business11.jpg', 'Food & Drink Co', '808 Food St, Denver, CO', '39.7392', '-104.9903'),
(12,2, 'business12.jpg', 'Travel Agency', '909 Travel St, Las Vegas, NV', '36.1699', '-115.1398'),
(13,3, 'business13.jpg', 'Pet Store', '1010 Pet St, San Diego, CA', '32.7157', '-117.1611'),
(14,4, 'business14.jpg', 'Art Gallery', '1111 Art St, Portland, OR', '45.5051', '-122.6750'),
(15,5, 'business15.jpg', 'Jewelry Shop', '1212 Jewelry St, Dallas, TX', '32.7767', '-96.7970');


-- Insert 15 rows into tbl_deal_dealer
INSERT INTO tbl_deal_dealer (user_id, duration)
VALUES 
(2, '2023-12-31 23:59:59'),
(4, '2023-12-31 23:59:59'),
(2, '2023-12-31 23:59:59'),
(4, '2023-12-31 23:59:59'),
(2, '2023-12-31 23:59:59'),
(4, '2023-12-31 23:59:59'),
(2, '2023-12-31 23:59:59'),
(4, '2023-12-31 23:59:59'),
(2, '2023-12-31 23:59:59'),
(4,  '2023-12-31 23:59:59'),
(2,  '2023-12-31 23:59:59'),
(4,  '2023-12-31 23:59:59'),
(2,  '2023-12-31 23:59:59'),
(4,  '2023-12-31 23:59:59'),
(2,  '2023-12-31 23:59:59');


-- Insert 15 rows into tbl_post_dealer
INSERT INTO tbl_post_dealer (user_id, dealer_deal_id, category_id, image, title, description, address, country, latitude, longitude, website_url)
VALUES
(2, 1, 1,'post1.jpg', 'Latest Smartphones', 'Check out our latest smartphones.', '123 Tech St, San Francisco, CA', '37.7749', '-122.4194', 'https://techworld.com'),
(4, 2, 2,'post2.jpg', 'New Fashion Collection', 'Explore our new fashion collection.', '456 Fashion Ave, New York, NY', '40.7128', '-74.0060', 'https://fashionhub.com'),
(2, 3, 3,'post3.jpg', 'Home Decor Sale', 'Huge sale on home decor items.', '789 Home St, Chicago, IL', '41.8781', '-87.6298', 'https://homeessentials.com'),
(4, 4, 4,'post4.jpg', 'Car Sale Event', 'Big discounts on cars.', '101 Auto St, Houston, TX', '29.7604', '-95.3698', 'https://autodealers.com'),
(2, 5, 5,'post5.jpg', 'Beauty Products', 'New beauty products available.', '202 Beauty St, Phoenix, AZ', '33.4484', '-112.0740', 'https://healthbeautyco.com'),
(4, 6, 6,'post6.jpg', 'Sports Gear Sale', 'Get the best sports gear.', '303 Sports St, Los Angeles, CA', '34.0522', '-118.2437', 'https://sportsgear.com'),
(2, 7, 7,'post7.jpg', 'Toys for Kids', 'Great toys for kids.', '404 Toy St, Miami, FL', '25.7617', '-80.1918', 'https://toystore.com'),
(4, 8, 8,'post8.jpg', 'Book Fair', 'Huge book fair.', '505 Book St, Seattle, WA', '47.6062', '-122.3321', 'https://bookhaven.com'),
(2, 9, 9,'post9.jpg', 'Music Festival', 'Join our music festival.', '606 Music St, Austin, TX', '30.2672', '-97.7431', 'https://musicworld.com'),
(4, 10, 10, 'post10.jpg', 'Movie Premiere', 'New movie premiere.', '707 Movie St, Boston, MA', '42.3601', '-71.0589', 'https://movietheater.com'),
(2, 11, 11, 'post11.jpg', 'Food Festival', 'Enjoy delicious food.', '808 Food St, Denver, CO', '39.7392', '-104.9903', 'https://fooddrinkco.com'),
(4, 12, 12, 'post12.jpg', 'Travel Deals', 'Great travel deals.', '909 Travel St, Las Vegas, NV', '36.1699', '-115.1398', 'https://travelagency.com'),
(2, 13, 13, 'post13.jpg', 'Pet Adoption', 'Adopt a pet today.', '1010 Pet St, San Diego, CA', '32.7157', '-117.1611', 'https://petstore.com'),
(4, 14, 14, 'post14.jpg', 'Art Exhibition', 'Visit our art exhibition.', '1111 Art St, Portland, OR', '45.5051', '-122.6750', 'https://artgallery.com'),
(2, 15, 15, 'post15.jpg', 'Jewelry Sale', 'Huge jewelry sale.', '1212 Jewelry St, Dallas, TX', '32.7767', '-96.7970', 'https://jewelryshop.com');



-- Insert 15 rows into tbl_tags
INSERT INTO tbl_tags (name)
VALUES 
('Electronics'),
('Fashion'),
('Home & Garden'),
('Automotive'),
('Health & Beauty'),
('Sports'),
('Toys & Games'),
('Books'),
('Music'),
('Movies'),
('Food & Drink'),
('Travel'),
('Pets'),
('Art'),
('Jewelry');

-- Insert 15 rows into tbl_post_tags
INSERT INTO tbl_post_tags (dealer_post_id, tag_id)
VALUES 
(1, 2),
(1, 3),
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10),
(11, 11),
(12, 12),
(13, 13),
(14, 14),
(15, 15);

-- Insert 15 rows into tbl_post_user
INSERT INTO tbl_post_user (user_id, category_id, title, description, address, latitude, longitude)
VALUES 
(1, 1, 'My New Phone', 'I just bought a new smartphone.', '123 Main St, New York, NY', '40.7128', '-74.0060'),
(3, 2, 'New Dress', 'I love my new dress.', '456 Elm St, Los Angeles, CA', '34.0522', '-118.2437'),
(5, 3, 'Home Decor', 'I redecorated my home.', '789 Oak St, Chicago, IL', '41.8781', '-87.6298'),
(1, 4, 'Car Maintenance', 'I just serviced my car.', '101 Pine St, Houston, TX', '29.7604', '-95.3698'),
(3, 5, 'Beauty Routine', 'My daily beauty routine.', '202 Maple St, Phoenix, AZ', '33.4484', '-112.0740'),
(5, 6, 'Sports Gear', 'I bought new sports gear.', '303 Sports St, Los Angeles, CA', '34.0522', '-118.2437'),
(1, 7, 'Toys for Kids', 'I bought toys for my kids.', '404 Toy St, Miami, FL', '25.7617', '-80.1918'),
(3, 8, 'Book Review', 'I just read a great book.', '505 Book St, Seattle, WA', '47.6062', '-122.3321'),
(5, 9, 'Music Festival', 'I attended a music festival.', '606 Music St, Austin, TX', '30.2672', '-97.7431'),
(1, 10, 'Movie Review', 'I watched a great movie.', '707 Movie St, Boston, MA', '42.3601', '-71.0589'),
(3, 11, 'Food Festival', 'I enjoyed a food festival.', '808 Food St, Denver, CO', '39.7392', '-104.9903'),
(5, 12, 'Travel Experience', 'I had a great travel experience.', '909 Travel St, Las Vegas, NV', '36.1699', '-115.1398'),
(1, 13, 'Pet Adoption', 'I adopted a new pet.', '1010 Pet St, San Diego, CA', '32.7157', '-117.1611'),
(3, 14, 'Art Exhibition', 'I visited an art exhibition.', '1111 Art St, Portland, OR', '45.5051', '-122.6750'),
(5, 15, 'Jewelry Purchase', 'I bought new jewelry.', '1212 Jewelry St, Dallas, TX', '32.7767', '-96.7970');

-- Insert 15 rows into tbl_comment_dealer
INSERT INTO tbl_comment_dealer (user_id, dealer_post_id, comment, address, latitude, longitude)
VALUES 
(1, 1, 'Great smartphones!', '123 Main St, New York, NY', '40.7128', '-74.0060'),
(3, 2, 'Love the new collection!', '456 Elm St, Los Angeles, CA', '34.0522', '-118.2437'),
(5, 3, 'Amazing home decor!', '789 Oak St, Chicago, IL', '41.8781', '-87.6298'),
(1, 4, 'Great deals on cars!', '101 Pine St, Houston, TX', '29.7604', '-95.3698'),
(3, 5, 'Awesome beauty products!', '202 Maple St, Phoenix, AZ', '33.4484', '-112.0740'),
(5, 6, 'Best sports gear!', '303 Sports St, Los Angeles, CA', '34.0522', '-118.2437'),
(1, 7, 'Great toys for kids!', '404 Toy St, Miami, FL', '25.7617', '-80.1918'),
(3, 8, 'Amazing book fair!', '505 Book St, Seattle, WA', '47.6062', '-122.3321'),
(5, 9, 'Fantastic music festival!', '606 Music St, Austin, TX', '30.2672', '-97.7431'),
(1, 10, 'Great movie premiere!', '707 Movie St, Boston, MA', '42.3601', '-71.0589'),
(3, 11, 'Delicious food festival!', '808 Food St, Denver, CO', '39.7392', '-104.9903'),
(5, 12, 'Amazing travel deals!', '909 Travel St, Las Vegas, NV', '36.1699', '-115.1398'),
(1, 13, 'Great pet adoption event!', '1010 Pet St, San Diego, CA', '32.7157', '-117.1611'),
(3, 14, 'Fantastic art exhibition!', '1111 Art St, Portland, OR', '45.5051', '-122.6750'),
(5, 15, 'Great jewelry sale!', '1212 Jewelry St, Dallas, TX', '32.7767', '-96.7970');

-- Insert 15 rows into tbl_comment_user
INSERT INTO tbl_comment_user (user_id, user_post_id, comment)
VALUES 
(2, 1, 'Nice phone!'),
(4, 2, 'Love the dress!'),
(2, 3, 'Great home decor!'),
(4, 4, 'Nice car!'),
(2, 5, 'Great beauty routine!'),
(4, 6, 'Awesome sports gear!'),
(2, 7, 'Great toys!'),
(4, 8, 'Nice book!'),
(2, 9, 'Great music festival!'),
(4, 10, 'Nice movie!'),
(2, 11, 'Great food festival!'),
(4, 12, 'Nice travel experience!'),
(2, 13, 'Great pet adoption!'),
(4, 14, 'Nice art exhibition!'),
(2, 15, 'Great jewelry!');

-- Insert 15 rows into tbl_rating
INSERT INTO tbl_rating (user_id, dealer_post_id, rating, review)
VALUES 
(1, 1, 4.5, 'Great smartphones!'),
(3, 2, 5.0, 'Love the new collection!'),
(5, 3, 4.0, 'Amazing home decor!'),
(1, 4, 4.5, 'Great deals on cars!'),
(3, 5, 5.0, 'Awesome beauty products!'),
(5, 6, 4.0, 'Best sports gear!'),
(1, 7, 4.5, 'Great toys for kids!'),
(3, 8, 5.0, 'Amazing book fair!'),
(5, 9, 4.0, 'Fantastic music festival!'),
(1, 10, 4.5, 'Great movie premiere!'),
(3, 11, 5.0, 'Delicious food festival!'),
(5, 12, 4.0, 'Amazing travel deals!'),
(1, 13, 4.5, 'Great pet adoption event!'),
(3, 14, 5.0, 'Fantastic art exhibition!'),
(5, 15, 4.0, 'Great jewelry sale!');

-- Insert 15 rows into tbl_reporting
INSERT INTO tbl_reporting (user_id, dealer_post_id, reason)
VALUES 
(1, 1, 'Inappropriate content'),
(3, 2, 'Spam'),
(5, 3, 'Inappropriate content'),
(1, 4, 'Spam'),
(3, 5, 'Inappropriate content'),
(5, 6, 'Spam'),
(1, 7, 'Inappropriate content'),
(3, 8, 'Spam'),
(5, 9, 'Inappropriate content'),
(1, 10, 'Spam'),
(3, 11, 'Inappropriate content'),
(5, 12, 'Spam'),
(1, 13, 'Inappropriate content'),
(3, 14, 'Spam'),
(5, 15, 'Inappropriate content');

-- Insert 15 rows into tbl_favorites
INSERT INTO tbl_favorites (user_id, dealer_post_id)
VALUES 
(1, 1),
(3, 2),
(5, 3),
(1, 4),
(3, 5),
(5, 6),
(1, 7),
(3, 8),
(5, 9),
(1, 10),
(3, 11),
(5, 12),
(1, 13),
(3, 14),
(5, 15);

-- Insert 15 rows into tbl_follow
INSERT INTO tbl_follow (user_id_1, user_id_2, status)
VALUES 
(1, 2, 'accept'),
(3, 4, 'accept'),
(5, 1, 'accept'),
(2, 3, 'accept'),
(4, 5, 'accept'),
(1, 3, 'accept'),
(3, 5, 'accept'),
(5, 2, 'accept'),
(2, 4, 'accept'),
(4, 1, 'accept'),
(1, 4, 'accept'),
(3, 1, 'accept'),
(5, 3, 'accept'),
(2, 5, 'accept'),
(4, 2, 'accept');

-- Insert 15 rows into tbl_referral
INSERT INTO tbl_referral (user_id_1, user_id_2, coins_earned, is_redeemed)
VALUES 
(1, 2, 50, 0),
(3, 4, 50, 0),
(5, 1, 50, 0),
(2, 3, 50, 0),
(4, 5, 50, 0),
(1, 3, 50, 0),
(3, 5, 50, 0),
(5, 2, 50, 0),
(2, 4, 50, 0),
(4, 1, 50, 0),
(1, 4, 50, 0),
(3, 1, 50, 0),
(5, 3, 50, 0),
(2, 5, 50, 0),
(4, 2, 50, 0);

-- Insert 15 rows into tbl_redemption
INSERT INTO tbl_redemption (user_id, amount, paypal_email, status)
VALUES 
(1, 100, 'john.doe@example.com', 'pending'),
(2, 200, 'jane.smith@example.com', 'completed'),
(3, 150, 'alice.wang@example.com', 'failed'),
(4, 250, 'bob.jones@example.com', 'pending'),
(5, 300, 'chris.evans@example.com', 'completed'),
(1, 100, 'john.doe@example.com', 'pending'),
(2, 200, 'jane.smith@example.com', 'completed'),
(3, 150, 'alice.wang@example.com', 'failed'),
(4, 250, 'bob.jones@example.com', 'pending'),
(5, 300, 'chris.evans@example.com', 'completed'),
(1, 100, 'john.doe@example.com', 'pending'),
(2, 200, 'jane.smith@example.com', 'completed'),
(3, 150, 'alice.wang@example.com', 'failed'),
(4, 250, 'bob.jones@example.com', 'pending'),
(5, 300, 'chris.evans@example.com', 'completed');


INSERT INTO tbl_device_info (user_id, device_type, device_token, os_version, is_active, is_deleted, created_at, updated_at, deleted_at) VALUES
(1, 'android', 'token1', '10.0', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
(2, 'ios', 'token2', '14.4', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
(3, 'android', 'token3', '11.0', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
(4, 'ios', 'token4', '13.3', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
(5, 'android', 'token5', '9.0', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL);












-- queries

-- signup user
INSERT INTO tbl_user (
    role, profile_image, user_name, email, phone, password, coins, referral_code, 
    first_name, last_name, bio, address, latitude, longitude, 
    plan_id, plan_price, plan_status
)
VALUES 
('user', 'default1.jpg', 'john_doe1', 'john1.doe@example.com', '1234567891', 'password124', 100, 'REF124', 
 'John1', 'Doe', 'I am a software engineer.', '124 Main St, New York, NY', '40.7128', '-74.0060', 
 1, 9.99, 'active');
 
 select * from tbl_user;


-- forgot password

INSERT INTO tbl_otp (user_id, email, phone, otp, action, expires_at)
VALUES 
(1, 'john1.doe@example.com', '1234567891', '123456', 'signup', DATE_ADD(NOW(), INTERVAL 10 MINUTE));

select user_id 
from tbl_otp
where otp = 123456 and expires_at < now();

update tbl_user
set password = 'updated password'
where id = 1;


-- 15
select u.first_name, u.address
from tbl_user u
where u.id = 1;

select c.cover_image, c.name 
from tbl_categories c;

select d.id, d.image, d.title, d.address, d.created_at, d.avg_rating, d.total_comments,
u.profile_image, concat(u.first_name, ' ', u.last_name) as name,
case when r.id is null then 0 else 1 end as review_status
from tbl_deal_dealer dd
join tbl_post_dealer d on d.dealer_deal_id = dd.id
join tbl_user u on u.id = d.user_id
left join tbl_rating r on r.dealer_post_id = d.id and r.user_id = 1
where d.is_active = 1 and d.is_deleted = 0
group by d.id;


-- 17
select d.image, d.title, d.address, d.created_at, d.website_url, d.latitude, d.longitude, d.avg_rating, d.total_comments, 
c.name as category, 
u.profile_image, concat(u.first_name, ' ', u.last_name) as name,
group_concat(t.name) as tag
from tbl_deal_dealer dd
join tbl_post_dealer d on d.dealer_deal_id = dd.id
join tbl_user u on u.id = d.user_id
join tbl_categories c on c.id = d.category_id
join tbl_post_tags pt on pt.dealer_post_id = d.id
join tbl_tags t on t.id = pt.tag_id
where dd.id = 1;


-- 19 query for count of total deals per category
select c.id, c.name as category, count(dd.id) as total_deals
from tbl_deal_dealer dd
join tbl_post_dealer d on d.dealer_deal_id = dd.id
join tbl_categories c on c.id = d.category_id
group by c.name;


-- 21 deals for single search category
select d.image, d.title, d.address, d.created_at, d.avg_rating, d.total_comments,
u.profile_image, concat(u.first_name, ' ', u.last_name) as name,
case when r.id is null then 0 else 1 end as review_status
from tbl_deal_dealer dd
join tbl_post_dealer d on d.dealer_deal_id = dd.id
join tbl_user u on u.id = d.user_id
left join tbl_rating r on r.dealer_post_id = d.id and r.user_id = 1
join tbl_categories c on c.id = d.category_id
where c.name = 'Electronics' and d.is_active = 1 and d.is_deleted = 0
group by d.id;


-- 22 to get all the comments for a dealer post
select u.profile_image, concat(u.first_name, ' ', u.last_name) as name, c.comment, c.created_at
from tbl_comment_dealer c
join tbl_user u on u.id = c.user_id
where c.dealer_post_id = 2
order by c.created_at desc;


-- 23 post review on deal
INSERT INTO tbl_rating (user_id, dealer_post_id, rating, review)
VALUES 
(2, 1, 4.5, 'Great smartphones!');


-- 25 to report a post
INSERT INTO tbl_reporting (user_id, dealer_post_id, reason)
VALUES 
(2, 1, 'Inappropriate content');



-- 26 to get details of single user with his business, post_dealer and deal_dealer
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


-- 28 create post
INSERT INTO tbl_post_dealer (user_id, dealer_deal_id, category_id, image, title, description, address, latitude, longitude, website_url)
VALUES 
(2, 1, 1,'post11.jpg', 'Latest Smartphones1', 'Check out our latest smartphones1.', '124 Tech St, San Francisco, CA', '37.7749', '-122.4194', 'https://techworld1.com');

INSERT INTO tbl_post_tags (dealer_post_id, tag_id)
VALUES 
(1, 2),
(1, 3),
(1, 1);


-- 35 get all post_user for a single user
select u.profile_image, concat(u.first_name, ' ', u.last_name) as name,
p.title, p.description, p.address, p.latitude, p.longitude, p.total_comments,
c.name as category_name
from tbl_user u
join tbl_post_user p on p.user_id = u.id
join tbl_categories c on c.id = p.category_id
where u.id != 1
group by p.id;


-- 37 add user post
INSERT INTO tbl_post_user (user_id, category_id, title, description, address, latitude, longitude)
VALUES 
(1, 1, 'My New Phone1', 'I just bought a new smartphone.', '123 Main St, New York, NY', '40.7128', '-74.0060');



-- 38 get all comment on single post_user from comment_dealer.
select u.profile_image, concat(u.first_name, ' ', u.last_name) as name, c.comment, c.created_at
from tbl_comment_dealer c
join tbl_user u on u.id = c.user_id
where c.dealer_post_id = 1
order by c.created_at desc;


-- 39 filter all the deals by category and distance using if else condition for distance and category
select d.image, d.title, d.address, d.created_at, d.avg_rating, d.total_comments,
u.profile_image, concat(u.first_name, ' ', u.last_name) as name,
ROUND(6371 * ACOS( 
    COS(RADIANS(34.0522)) 
    * COS(RADIANS(d.latitude)) 
    * COS(RADIANS(dd.longitude) - RADIANS(-118.2437)) 
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


-- 44 show all plans
select * from tbl_plans;

-- plane of single user
select u.plan_id, concat(u.first_name, ' ', u.last_name) as name, u.plan_id, u.plan_price, u.plan_status,
p.name, p.price, p.duration, p.description 
from tbl_user u
join tbl_plans p on p.id = u.plan_id
where u.id = 2;


-- 45 insert business
INSERT INTO tbl_business (category_id, user_id, image, company_name, address, latitude, longitude)
VALUES 
(1,2, 'business1.jpg', 'Tech World', '123 Tech St, San Francisco, CA', '37.7749', '-122.4194');


-- 48 plane of single user 
select u.plan_id, concat(u.first_name, ' ', u.last_name) as name, u.plan_id, u.plan_price, u.plan_status,
date_add(now(), interval p.duration month) as plan_expiry_date,
p.name, p.price, p.duration, p.description 
from tbl_user u
join tbl_plans p on p.id = u.plan_id
where u.id = 2;


-- 49 get all save deals of perticular user
select d.image, d.title, d.address, d.created_at, d.avg_rating, d.total_comments,
u.profile_image, concat(u.first_name, ' ', u.last_name) as name,
case when r.id is null then 0 else 1 end as review_status
from tbl_favorites f
join tbl_post_dealer d on d.id = f.dealer_post_id
join tbl_user u on u.id = d.user_id
left join tbl_rating r on r.dealer_post_id = d.id and r.user_id = 1
where f.user_id = 1 and d.is_active = 1 and d.is_deleted = 0
group by d.id;


-- 53 followers
select u.id, u.profile_image, concat(u.first_name, ' ', u.last_name) as name
from tbl_follow f
join tbl_user u on u.id = f.user_id_1
where f.user_id_2 = 1 and f.status = 'accept';

-- 54 following
select u.id, u.profile_image, concat(u.first_name, ' ', u.last_name) as name
from tbl_follow f
join tbl_user u on u.id = f.user_id_2
where f.user_id_1 = 1 and f.status = 'accept';


-- 55 to get user's coins
select id, coins from tbl_user where id = 1;





