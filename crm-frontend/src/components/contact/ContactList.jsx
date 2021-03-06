import React, { Component } from 'react';
import { Button, Card, Col, Form, FormControl, Nav, Row, Table } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import ContactService from '../../services/ContactService';

class ContactList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            contacts: [],
            filteredContacts: [],
        }
    }

    handleSearch = search => {
        let filtered = this.state.contacts.filter(contact => {
            return contact.firstName.match(new RegExp(search.target.value, "i")) ||
                contact.lastName.match(new RegExp(search.target.value, "i")) ||
                contact.id.match(new RegExp(search.target.value, "i"))
        })
        this.setState({
            filteredContacts: filtered,
        });
    }

    componentDidMount() {
        ContactService.getAllContacts()
            .then(response => {
                this.setState({
                    contacts: response.data,
                    filteredContacts: response.data,
                })
            });
    }

    render() {
        const { filteredContacts: contacts } = this.state;
        return (
            <div>
                <Row>
                    <Col>
                        <Button className="text-start mb-4" variant="primary" as={NavLink} to='/contacts/new'>New</Button>{' '}
                    </Col>
                    <Col xs={4}>
                        <Form className="d-flex">
                            <FormControl
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                                onChange={this.handleSearch}
                            />
                        </Form>
                    </Col>
                </Row>
                <Card>
                    <Card.Body>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Last name</th>
                                    <th>First name</th>
                                    <th>Gender</th>
                                    <th>Date of birth</th>
                                    <th>Email</th>
                                    <th>Phone number</th>
                                    <th>Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.map(contact =>
                                    <tr key={contact.id}>
                                        <td>
                                            <Nav.Link style={{ display: 'contents' }} as={NavLink} to={`/contacts/${contact.id}`} key={contact.id}>
                                                {contact.id.substr(contact.id.length - 8)}
                                            </Nav.Link>
                                        </td>
                                        <td>{(contact.lastName ? contact.lastName : "-")}</td>
                                        <td>{(contact.firstName ? contact.firstName : "-")}</td>
                                        <td>{(contact.gender ? contact.gender : "-")}</td>
                                        <td>{(contact.dateOfBirth ? contact.dateOfBirth : "-")}</td>
                                        <td>{(contact.email ? <a href={'mailto:' + contact.email}>{contact.email}</a> : "-")}</td>
                                        <td>{(contact.phoneNumber ? contact.phoneNumber : "-")}</td>
                                        <td>{(contact.address ?
                                            <div>
                                                <div>{(contact.address.address ? contact.address.address : "-")}</div>
                                                {(contact.address.additionalAddress ? <div>{contact.address.additionalAddress}</div> : "")}
                                                <div>
                                                    {(contact.address.postcode ? contact.address.postcode : "-") + " " +
                                                        (contact.address.town ? contact.address.town : "-")}
                                                </div>
                                                <div>{(contact.address.country ? contact.address.country : "-")}</div>
                                            </div> : "-")}</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default ContactList;