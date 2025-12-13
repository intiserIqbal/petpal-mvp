CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    google_id VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    profile_picture VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- Rehome listings
-- ==========================================================

CREATE TABLE Rehome (
    rehome_id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    type ENUM('cat', 'dog') NOT NULL,
    name VARCHAR(255) NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    age INT NOT NULL,
    breed ENUM('Deshi', 'Bideshi') NOT NULL,
    vaccinated ENUM('yes', 'no') NOT NULL,
    potty_trained ENUM('yes', 'no') NOT NULL,
    image LONGBLOB NOT NULL,
    reason_behind_rehome VARCHAR(200) NOT NULL,

    CONSTRAINT fk_rehome_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- ==========================================================
-- Animal Table
-- ==========================================================

CREATE TABLE Animal (
    animal_id INT AUTO_INCREMENT PRIMARY KEY,
    rehome_id INT NOT NULL,
    type ENUM('cat', 'dog') NOT NULL,
    name VARCHAR(255) NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    age INT NOT NULL,
    breed ENUM('Deshi', 'Bideshi') NOT NULL,
    vaccinated ENUM('yes', 'no') NOT NULL,
    potty_trained ENUM('yes', 'no') NOT NULL,
    image LONGBLOB NOT NULL,

    CONSTRAINT fk_animal_rehome
        FOREIGN KEY (rehome_id) REFERENCES Rehome(rehome_id)
        ON DELETE CASCADE
);

-- ==========================================================
-- Adoption Applications
-- ==========================================================

CREATE TABLE Adoption (
    adoption_id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    animal_id INT NOT NULL,
    num_of_children INT NOT NULL,
    phone_num VARCHAR(20) NOT NULL,
    num_of_adults INT NOT NULL,
    home_image LONGBLOB NOT NULL,
    animal_proof ENUM('yes', 'no') NOT NULL,
    other_pets ENUM('yes', 'no') NOT NULL,
    other_pets_spayed ENUM('yes', 'no') NOT NULL,
    allergies_to_pets ENUM('yes', 'no') NOT NULL,

    CONSTRAINT fk_adoption_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_adoption_animal
        FOREIGN KEY (animal_id) REFERENCES Animal(animal_id)
        ON DELETE CASCADE
);