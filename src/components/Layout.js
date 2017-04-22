import React, { PropTypes } from 'react'
import styleFiles from './../styles/app.scss'

const Layout = React.createClass({
    render () {
        return <div>
            {this.props.children}
        </div>
    }
})

export default Layout
