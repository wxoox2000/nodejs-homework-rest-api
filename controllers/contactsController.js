const helpers = require("../helpers/index");
const schemas = require("../schemas/schemas");
const Contact = require("../models/Contact");

const getAllContacts = async (req, res, next) => {
  try {
    const result = await Contact.find();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
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
    const result = await Contact.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
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
    const result = await Contact.findByIdAndUpdate(contactId, req.body);
    if (!result) {
      throw helpers.HttpError(404, `Not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};
const switchFavoriteContact = async (req, res, next) => {
  try {
    const { error } = schemas.favoriteContactSchema.validate(req.body);
    if (error) {
      throw helpers.HttpError(400, error.message);
    }
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body);
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
  switchFavoriteContact
};
