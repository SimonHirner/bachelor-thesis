package edu.hm.contact.service;

import edu.hm.contact.persistence.Contact;

import java.util.List;
import java.util.Optional;

public interface ContactService {

    List<Contact> getAllContacts();

    Optional<Contact> getContact(String id);

    Contact saveContact(Contact newContact);

    Contact replaceContact(String id, Contact newContact);

    void deleteContact(String id);

    void deleteAllContacts();
}
