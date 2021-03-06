import React, { Component } from 'react';
import { Button, Card, Col, Form, FormControl, Nav, Row, Table } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import OpportunityService from '../../services/OpportunityService';

class OpportunityList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            opportunities: [],
            filteredOpportunities: [],
        }
    }

    handleSearch = search => {
        let filtered = this.state.opportunities.filter(opportunity => {
            return opportunity.status.match(new RegExp(search.target.value, "i")) ||
                opportunity.note.match(new RegExp(search.target.value, "i")) ||
                opportunity.id.match(new RegExp(search.target.value, "i"))
        })
        this.setState({
            filteredOpportunities: filtered,
        });
    }

    componentDidMount() {
        OpportunityService.getAllOpportunities()
            .then(response => {
                this.setState({
                    opportunities: response.data,
                    filteredOpportunities: response.data,
                })
            });
    }

    render() {
        const { filteredOpportunities: opportunities } = this.state;
        return (
            <div>
                <Row>
                    <Col>
                        <Button className="text-start mb-4" variant="primary" as={NavLink} to='/opportunities/new'>New</Button>{' '}
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
                                    <th>Estimated close date</th>
                                    <th>Value</th>
                                    <th>Budget</th>
                                    <th>Discount</th>
                                    <th>Status</th>
                                    <th>Note</th>
                                    <th>Related contact</th>
                                </tr>
                            </thead>
                            <tbody>
                                {opportunities.filter(opportunity => opportunity.relatedContactId.includes(this.props.id ? this.props.id : "")).map(opportunity =>
                                    <tr key={opportunity.id}>
                                        <td>
                                            <Nav.Link style={{ display: 'contents' }} as={NavLink} to={`/opportunities/${opportunity.id}`} key={opportunity.id}>
                                                {opportunity.id.substr(opportunity.id.length - 8)}
                                            </Nav.Link>
                                        </td>
                                        <td>{(opportunity.estimatedCloseDate ? opportunity.estimatedCloseDate : "-")}</td>
                                        <td>{(opportunity.value ? opportunity.value : "-")}</td>
                                        <td>{(opportunity.budget ? opportunity.budget : "-")}</td>
                                        <td>{(opportunity.discount ? opportunity.discount : "-")}</td>
                                        <td>{(opportunity.status ? opportunity.status : "-")}</td>
                                        <td>{(opportunity.note ? opportunity.note : "-")}</td>
                                        <td>
                                            {(opportunity.relatedContactId ? (
                                                <Nav.Link style={{ display: 'contents' }} as={NavLink} to={`/contacts/${opportunity.relatedContactId}`} key={opportunity.relatedContactId}>
                                                    {opportunity.relatedContactId.substr(opportunity.relatedContactId.length - 8)}
                                                </Nav.Link>
                                            ) : "-")}
                                        </td>
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

export default OpportunityList;