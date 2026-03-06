const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserByUsername,updateUserEmailInDB, getUserByEmail, getUserByIDInDB, updateUserInDB , deleteUserFromDB, getUsersFromDB, createUserInDB } = require('./Users.db');
const User = require('./User.Model');
const { getDriverByUsername } = require('../Drivers/Drivers.db'); // Driver database function
const { sendVerificationEmail } = require('../EmailVerifying/email'); 
const { getNextSequenceValue } = require('../Counters/CounterService');
const userTypeMap = {
    1: 'admin',
    2: 'client',
};
async function GetUserByID(req, res){
    const { userID } = req.params; 

    try {
        const user = await getUserByIDInDB(userID);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).send(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).send({ error: 'Internal server error', details: error.message });
    }
}

async function getUserIDByUsername(req, res) {
    const { username } = req.params;
    try {
        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).send({ userID: user.userID });
    } catch (error) {
        console.error('Error fetching user by username:', error);
        res.status(500).send({ error: 'Internal server error', details: error.message });
    }
}


async function checkUserCredentials(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ error: 'Username and password are required' });
    }

    try {
        // First, try to find the user in the Users collection
        let user = await getUserByUsername(username);
        let isDriver = false;

        // If user is not found in Users, check in the Drivers collection
        if (!user) {
            user = await getDriverByUsername(username);
            isDriver = !!user; // Set flag to indicate this is a driver, not a user
        }

        // If neither user nor driver is found, return error
        if (!user) {
            console.log('User or Driver not found');
            return res.status(401).send({ error: 'Invalid username or password' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('Invalid password');
            return res.status(401).send({ error: 'Invalid username or password' });
        }

        // Prepare response based on whether it's a user or driver
        if (isDriver) {
            const { userID, fullName, email, language, country, city, drivingLicense, drivingLicenseExpiration, userType } = user;
            res.status(200).send({
                message: 'Driver authenticated successfully',
                userType: 'Driver',
                driver: { userID, fullName, username, email, language, country, city, drivingLicense, drivingLicenseExpiration, userType }
            });
        } else {
            const { userID, fullName, email, userType } = user;
            res.status(200).send({
                message: 'User authenticated successfully',
                userType: 'User',
                user: { userID, fullName, username, email, userType }
            });
        }
    } catch (error) {
        console.error('Error checking user credentials:', error);
        res.status(500).send({ error: 'Internal server error', details: error.message });
    }
}



async function listAllUsers(req, res) {
    try {
        const users = await getUsersFromDB();
        res.status(200).send(users);
    } catch (error) {
        console.error('Error listing all users:', error);
        res.status(500).send({ error: 'Internal server error', details: error.message });
    }
}

async function createUser(req, res) {
    const { fullName, username, email, password, language, country, city, userTypeID } = req.body;

    if (!fullName || !username || !email || !password || !language || !country || !city || userTypeID === undefined) {
        return res.status(400).send({ error: 'All fields are required' });
    }

    if (![1, 2, 3].includes(userTypeID)) {
        return res.status(400).send({ error: 'User Type Must Be Between 1 to 3' });
    }

    try {
        const existingUserByUsername = await getUserByUsername(username);
        if (existingUserByUsername) {
            return res.status(400).send({ error: 'Username is already in use' });
        }

        const existingUserByEmail = await getUserByEmail(email);
        if (existingUserByEmail) {
            return res.status(400).send({ error: 'Email is already in use' });
        }

        const userID = await getNextSequenceValue('Users');
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code

        const newUser = {
            fullName,
            username,
            email,
            password: hashedPassword,
            language,
            country,
            city,
            userID,
            userTypeID,
            userType: userTypeID === 1 ? 'admin' : 'client',
            verified: false,
            verificationCode 
        };

        await createUserInDB(newUser);

        await sendVerificationEmail(newUser.email, verificationCode);

        res.status(201).send({ message: 'User created successfully. Please enter the code sent to your email to verify your account.' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send({ error: 'Internal server error', details: error.message });
    }
}


async function patchUserEmail(req, res) {
    const { userID } = req.params;
    const { email } = req.body;

    if (!email) {
        return res.status(400).send({ error: 'Email is required' });
    }

    try {
        const userWithSameEmail = await getUserByEmail(email);
        if (userWithSameEmail) {
            return res.status(400).send({ error: 'Enter another email, this email is already used.' });
        }

        const result = await updateUserEmailInDB(userID, { email });
        if (result.modifiedCount > 0) {
            res.status(200).send({ message: 'Email updated successfully' });
        } else {
            res.status(404).send({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating email:', error);
        res.status(500).send({ error: 'Internal server error', details: error.message });
    }
}


async function deleteUser(req, res) {
    const { userID } = req.params;

    try {
        const result = await deleteUserFromDB(userID);
        if (result.deletedCount > 0) {
            res.status(200).send({ message: 'User deleted successfully' });
        } else {
            res.status(404).send({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ error: 'Internal server error', details: error.message });
    }
}

async function editUser(req, res) {
    const { userID } = req.params;
    const { fullName, username, email, password, language, country, city, userTypeID } = req.body;

    if (!fullName || !username || !email || !password || !language || !country || !city || userTypeID === undefined) {
        return res.status(400).send({ error: 'All fields are required' });
    }

    try {

        const userWithSameUsername = await getUserByUsername(username);
        if (userWithSameUsername) {
            return res.status(400).send({ error: 'Enter another username, this username is already used.' });
        }
        
        
        const existingUserByEmail = await getUserByEmail(email);
        if (existingUserByEmail) {
            return res.status(400).send({ error: 'Enter another email, this email is already used.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = {
            fullName,
            username,
            email,
            password: hashedPassword,
            language,
            country,
            city,
            userTypeID,
            userType: userTypeMap[userTypeID],
        };

        const result = await updateUserInDB(userID, updatedUser);
        if (result.modifiedCount > 0) {
            res.status(200).send({ message: 'User updated successfully' });
        } else {
            res.status(404).send({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send({ error: 'Internal server error', details: error.message });
    }
}

async function verifyUser(req, res) {
    const { email, verificationCode } = req.body;

    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).send({ error: 'User not found.' });
        }
        if (user.verified) {
            return res.status(400).send({ error: 'User is already verified.' });
        }
        if (user.verificationCode !== verificationCode) {
            return res.status(400).send({ error: 'Invalid verification code.' });
        }

        await updateUserInDB(user.userID, { verified: true, verificationCode: null });
        res.status(200).send({ message: 'Email verified successfully.' });
    } catch (error) {
        console.error('Error verifying user:', error);
        res.status(500).send({ error: 'Internal server error', details: error.message });
    }
}




module.exports = { checkUserCredentials,verifyUser, patchUserEmail, getUserIDByUsername, editUser ,deleteUser, listAllUsers, createUser, GetUserByID };
