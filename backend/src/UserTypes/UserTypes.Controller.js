const { 
    getUserTypesFromDB, 
    createUserTypeInDB,
    updateUserTypeInDB, 
    deleteUserTypeFromDB 
} = require('./UserTypes.db');

async function getUserTypes(req, res) {
    try {
        const userTypes = await getUserTypesFromDB();
        res.status(200).send(userTypes);
    } catch (error) {
        console.error('Error fetching user types:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

async function createUserType(req, res) {
    const { userTypeID, userType } = req.body;
    if (!userTypeID || !userType) {
        return res.status(400).send({ error: 'UserTypeID and UserType are required' });
    }

    try {
        await createUserTypeInDB({ userTypeID, userType });
        res.status(201).send({ message: 'User type created successfully' });
    } catch (error) {
        console.error('Error creating user type:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

async function updateUserType(req, res) {
    const { id } = req.params;
    const userTypeData = req.body;

    if (!userTypeData.userType) {
        return res.status(400).send({ error: 'UserType is required' });
    }

    try {
        const result = await updateUserTypeInDB(id, userTypeData);
        if (result.modifiedCount > 0) {
            res.status(200).send({ message: 'User type updated successfully' });
        } else {
            res.status(404).send({ error: 'User type not found' });
        }
    } catch (error) {
        console.error('Error updating user type:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

async function deleteUserType(req, res) {
    const { id } = req.params;

    try {
        const result = await deleteUserTypeFromDB(id);
        if (result.deletedCount > 0) {
            res.status(200).send({ message: 'User type deleted successfully' });
        } else {
            res.status(404).send({ error: 'User type not found' });
        }
    } catch (error) {
        console.error('Error deleting user type:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

module.exports = { getUserTypes, createUserType, updateUserType, deleteUserType };
