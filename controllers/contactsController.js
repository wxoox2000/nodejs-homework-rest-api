const contactService = require("../models/contacts");
const helpers = require("../helpers/index");
const schemas = require("../schemas/schemas");
const getAllContacts = async (req, res, next) => {
  try {
    const result = await contactService.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactService.getContactById(contactId);
    if (!result) {
      throw helpers.HttpError(404, `Not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};
const add = async (req, res, next) => {
  try {
    const { error } = schemas.addContactSchema.validate(req.body);
    if (error) {
      throw helpers.HttpError(400, error.message);
    }
    const result = await contactService.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactService.removeContact(contactId);
    if (!result) {
      throw helpers.HttpError(404, `Not found`);
    }
    res.status(200).json({"message": "contact deleted"});
  } catch (error) {
    next(error);
  }
};
const updateContact = async (req, res, next) => {
  try {
    const { error } = schemas.updateContactSchema.validate(req.body);
    if (error) {
      throw helpers.HttpError(400, error.message);
    }
    const { contactId } = req.params;
    const result = await contactService.updateContact(contactId, req.body);
    if (!result) {
      throw helpers.HttpError(404, `Not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContacts,
  getById,
  add,
  deleteContact,
  updateContact,
};
