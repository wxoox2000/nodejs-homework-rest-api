const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.resolve("models", "contacts.json");

const listContacts = async () => {
  const result = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(result);
};

const getContactById = async (contactId) => {
  const list = await listContacts();
  const contact = list.find((item) => item.id === contactId);
  return contact || null;
};

const removeContact = async (contactId) => {
  const list = await listContacts();
  const index = list.findIndex((item) => item.id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = list.splice(index, 1);
  fs.writeFile(contactsPath, JSON.stringify(list, null, 2));
  return result;
};

const addContact = async (body) => {
  const list = await listContacts();
  const alreadyInList = list.find((item) => item.phone === body.phone);
  if (alreadyInList) {
    return null;
  }
  const newContact = {
    id: nanoid(),
    name: body.name,
    email: body.email,
    phone: body.phone,
  };
  list.push(newContact);
  fs.writeFile(contactsPath, JSON.stringify(list, null, 2));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const list = await listContacts();
  const index = list.findIndex((item) => item.id === contactId);
  if (index === -1) {
    return null;
  }
  const updatedContact = {
    ...list[index],
    ...body,
  };
  list.splice(index, 1, updatedContact);
  fs.writeFile(contactsPath, JSON.stringify(list, null, 2));
  return updatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
