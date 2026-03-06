const express = require('express');
const { getUserTypes, createUserType, updateUserType, deleteUserType } = require('./UserTypes.Controller');
const router = express.Router();

router.get('/GetAllUserTypes', getUserTypes);
router.post('/CreateUserType', createUserType);
router.put('/UpdateUserType/:id', updateUserType);
router.delete('/DeleteUserType/:id', deleteUserType);

module.exports = router;
