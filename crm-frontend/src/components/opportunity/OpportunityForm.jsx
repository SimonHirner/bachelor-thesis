import React, { Component } from "react";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import ContactService from "../../services/ContactService";
import OpportunityService from "../../services/OpportunityService";
import { withRouter } from "../../withRouter";

class OpportunityForm extends Component {

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            error: "",
            contacts: [],
            opportunity: {
                estimatedCloseDate: "",
                value: "",
                budget: "",
                discount: "",
                status: "",
                note: "",
                relatedContactId: "",
                id: null,
            }
        }
    }

    componentDidMount() {
        ContactService.getAllContacts()
            .then(response => {
                this.setState({
                    contacts: response.data
                })
            });
    }

    handleOpportunityChange = event => {
        const opportunity = this.state.opportunity;
        opportunity[event.target.name] = event.target.value;
        this.setState({
            opportunity,
        })
    }

    handleSubmit = event => {
        event.preventDefault();

        OpportunityService.saveOpportunity(this.state.opportunity)
            .then(() => {
                this.setState({
                    error: "",
                })
                this.props.navigate('/opportunities')
            })
            .catch(error => {
                this.setState({
                    error: error.response.data,
                })
            });
    }

    render() {
        const { opportunity, error, contacts } = this.state;
        return (
            <Card>
                <Card.Body>
                    {!error ? "" :
                        <Alert variant="danger">
                            {error.error}: {error.message}
                        </Alert>
                    }
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" >
                                    <Form.Label>Estimated close date</Form.Label>
                                    <Form.Control type="date" name='estimatedCloseDate' value={opportunity.estimatedCloseDate} onChange={this.handleOpportunityChange} />
                                </Form.Group>
                                <Form.Group className="mb-3" >
                                    <Form.Label>Value</Form.Label>
                                    <Form.Control type="number" name='value' value={opportunity.value} onChange={this.handleOpportunityChange} />
                                </Form.Group>
                                <Form.Group className="mb-3" >
                                    <Form.Label>Budget</Form.Label>
                                    <Form.Control type="number" name='budget' value={opportunity.budget} onChange={this.handleOpportunityChange} />
                                </Form.Group>
                                <Form.Group className="mb-3" >
                                    <Form.Label>Discount</Form.Label>
                                    <Form.Control type="number" name='discount' value={opportunity.discount} onChange={this.handleOpportunityChange} />
                                </Form.Group>
                                <Form.Group className="mb-3" >
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select aria-label="Default select example" name='status' value={opportunity.status} onChange={this.handleOpportunityChange} >
                                        <option value="">Select status</option>
                                        <option value="PLANNED">PLANNED</option>
                                        <option value="IN_PROGRESS">IN PROGRESS</option>
                                        <option value="ON_HOLD">ON HOLD</option>
                                        <option value="CANCELED">CANCELED</option>
                                        <option value="SOLD">SOLD</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" >
                                    <Form.Label>Note</Form.Label>
                                    <Form.Control as="textarea" rows={3} name='note' value={opportunity.note} placeholder="Enter note" onChange={this.handleOpportunityChange} />
                                </Form.Group>
                                <Form.Group className="mb-3" >
                                    <Form.Label>Realted contact</Form.Label>
                                    <Form.Select aria-label="Default select example" name='relatedContactId' value={opportunity.relatedContactId} onChange={this.handleOpportunityChange} >
                                        <option value="">Select related Contact ID</option>
                                        {contacts.map(contact =>
                                            <option key={contact.id} value={contact.id}>{contact.id.substr(contact.id.length - 8) + ", " + contact.firstName + " " + contact.lastName}</option>
                                        )}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant='primary' type='submit'>Create</Button>
                    </Form>
                </Card.Body>
            </Card>
        )
    }
}

export default withRouter(OpportunityForm);