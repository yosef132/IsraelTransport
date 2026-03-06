const { getDriverByNameFromDB, getDriversFromDB,getDriverNameByIDFromDB ,getDriverByEmail, createDriverInDB, updateDriverInDB, getDriverByUsername, deleteDriverFromDB, getDriverByIDFromDB } = require('./Drivers.db');
const Driver = require('./Drivers.Model');
const bcrypt = require('bcryptjs');
const { getNextSequenceValue } = require('../Counters/CounterService');

async function getDrivers(req, res) {
    try {
        const drivers = await getDriversFromDB();
        res.status(200).send(drivers);
    } catch (error) {
        console.error('Error fetching drivers:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}



async function getDriverByID(req, res) {
    const { id } = req.params;
    try {
        const driver = await getDriverByIDFromDB(id);
        if (driver) {
            res.status(200).send(driver.fullName);
        } else {
            res.status(404).send({ error: 'Driver not found' });
        }
    } catch (error) {
        console.error('Error fetching driver by ID:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

async function getDriverNameByID(req, res) {
    const { id } = req.params;

    try {
        const driver = await getDriverNameByIDFromDB(id);
        if (driver) {
            res.status(200).send({ fullName: driver.fullName });
        } else {
            res.status(404).send({ error: 'Driver not found' });
        }
    } catch (error) {
        console.error('Error fetching driver name by ID:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

async function getDriverIDByName(req, res) {
    const { name } = req.params;
    try {
        const driver = await getDriverByNameFromDB(name);
        if (driver) {
            res.status(200).send({ userID: driver.userID });
        } else {
            res.status(404).send({ error: 'Driver not found' });
        }
    } catch (error) {
        console.error('Error fetching driver by name:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

async function createDriver(req, res) {
    const { fullName, username, email, password, language, country, city, drivingLicense, drivingLicenseExpiration } = req.body;

    if (!fullName || !username || !email || !password || !language || !country || !city || !drivingLicense || !drivingLicenseExpiration) {
        return res.status(400).send({ error: 'All fields are required' });
    }

    try {
        const existingDriverByUsername = await getDriverByUsername(username);
        if (existingDriverByUsername) {
            return res.status(400).send({ error: 'Enter another username, this username is already used.' });
        }

        const existingDriverByEmail = await getDriverByEmail(email);
        if (existingDriverByEmail) {
            return res.status(400).send({ error: 'Enter another email, this email is already used.' });
        }

        const userID = await getNextSequenceValue('Drivers');

        const hashedPassword = await bcrypt.hash(password, 10);
        const newDriver = new Driver({
            fullName,
            username,
            email,
            password: hashedPassword,
            language,
            country,
            city,
            userID,
            drivingLicense,
            drivingLicenseExpiration,
            UserType : "Driver"
        });

        await createDriverInDB(newDriver);
        res.status(201).send({ message: 'Driver created successfully' });
    } catch (error) {
        console.error('Error creating driver:', error);
        res.status(500).send({ error: 'Internal server error', details: error.message });
    }
}



async function updateDriver(req, res) {
    const { id } = req.params;
    const { username, email, password } = req.body;

    try {
        const existingDriver = await getDriverByIDFromDB(id);
        if (!existingDriver) {
            return res.status(404).send({ error: 'Driver not found' });
        }

        if (username && username !== existingDriver.username) {
            const driverWithSameUsername = await getDriverByUsername(username);
            if (driverWithSameUsername) {
                return res.status(400).send({ error: 'Enter another username, this username is already used.' });
            }
        }

        if (email && email !== existingDriver.email) {
            const driverWithSameEmail = await getDriverByEmail(email);
            if (driverWithSameEmail) {
                return res.status(400).send({ error: 'Enter another email, this email is already used.' });
            }
        }

        if (password) {
            req.body.password = await bcrypt.hash(password, 10);
        }

        const updatedDriver = await updateDriverInDB(id, req.body);
        if (updatedDriver.modifiedCount > 0) {
            res.status(200).send({ message: 'Driver updated successfully' });
        } else {
            res.status(404).send({ error: 'Driver not found' });
        }
    } catch (error) {
        console.error('Error updating driver:', error);
        res.status(500).send({ error: 'Internal server error', details: error.message });
    }
}



async function checkDriverCredentials(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ error: 'Username and password are required' });
    }

    try {
        const driver = await getDriverByUsername(username);
        if (!driver) {
            console.log('Driver not found');
            return res.status(401).send({ error: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, driver.password);
        if (!isPasswordValid) {
            console.log('Invalid password');
            return res.status(401).send({ error: 'Invalid username or password' });
        }

        const { userID, fullName, email, language, country, city, drivingLicense, drivingLicenseExpiration } = driver;
        res.status(200).send({
            message: 'Driver authenticated successfully',
            driver: { userID, fullName, username, email, language, country, city, drivingLicense, drivingLicenseExpiration }
        });
    } catch (error) {
        console.error('Error checking driver credentials:', error);
        res.status(500).send({ error: 'Internal server error', details: error.message });
    }
}


async function deleteDriver(req, res) {
    const { id } = req.params;

    try {
        const result = await deleteDriverFromDB(id);
        if (result.deletedCount > 0) {
            res.status(200).send({ message: 'Driver deleted successfully' });
        } else {
            res.status(404).send({ error: 'Driver not found' });
        }
    } catch (error) {
        console.error('Error deleting driver:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

module.exports = { getDrivers, getDriverByID, getDriverNameByID,checkDriverCredentials, getDriverIDByName, createDriver, updateDriver, deleteDriver };
