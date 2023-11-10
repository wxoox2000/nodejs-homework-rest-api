const express = require('express')

const router = express.Router();
const contactsController = require("../../controllers/contactsController");
const middlewares = require("../../middlewares/index");

router.get('/', contactsController.getAllContacts);

router.get('/:contactId', contactsController.getById);

router.post('/', middlewares.isEmptyBody, contactsController.add);

router.delete('/:contactId', contactsController.deleteContact);

router.put('/:contactId', middlewares.isEmptyBody, contactsController.updateContact);

module.exports = router
