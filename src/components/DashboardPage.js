import React, { PropTypes } from 'react'
import {Link} from 'react-router'
import {Navbar, Nav, NavItem, Grid, Row} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'

const DashboardPage = React.createClass({

    render () {
        return <div>
            DashboardPage
            {this.props.children}
        </div>
    }
})

export default DashboardPage;
