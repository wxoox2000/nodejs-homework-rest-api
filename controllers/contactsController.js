const helpers = require("../helpers/index");
const schemas = require("../schemas/schemas");
const Contact = require("../models/Contact");

const getAllContacts = async (req, res, next) => {
  try {
    const {_id: owner} = req.user;
    const {page = 1, limit = 10} = req.query;
    const skip = (page - 1)*limit;
    const result = await Contact.find({owner}, '-createdAt', {skip, limit});
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const {_id: owner} = req.user;
    const result = await Contact.findOne({_id: contactId, owner});
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
    const {_id: owner} = req.user;
    const result = await Contact.create({...req.body, owner});
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const {_id: owner} = req.user;
    const result = await Contact.findByIdAndDelete({_id: contactId, owner});
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
    const {_id: owner} = req.user;
    const result = await Contact.findByIdAndUpdate({_id: contactId, owner}, req.body);
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
