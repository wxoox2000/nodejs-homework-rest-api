const express = require('express')

const router = express.Router();
const contactsController = require("../../controllers/contactsController");
const middlewares = require("../../middlewares/index");

router.get('/', contactsController.getAllContacts);

router.get('/:contactId', middlewares.isValidId, contactsController.getById);

router.post('/', middlewares.isEmptyBody, contactsController.add);

router.delete('/:contactId', middlewares.isValidId, contactsController.deleteContact);

router.put('/:contactId', middlewares.isValidId, middlewares.isEmptyBody, contactsController.updateContact);

router.patch("/:contactId/favorite", middlewares.isValidId, middlewares.isEmptyBody, contactsController.switchFavoriteContact);

module.exports = router
