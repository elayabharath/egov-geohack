import React, { PropTypes } from 'react'

const Sidebar = React.createClass({
    render () {
        return <div className="sidepanel">
            <label>Choose a ward</label>
            <select>
                <option value="">Jaya Nagar</option>
                <option value="">Shivaji Nagar</option>
            </select>
            <hr/>
            <input id="checkbox1" type="checkbox" /><label htmlFor="checkbox1">High tax</label><br />
            <input id="checkbox2" type="checkbox" /><label htmlFor="checkbox2">Medium tax</label><br />
            <input id="checkbox3" type="checkbox" /><label htmlFor="checkbox3">Low tax</label>
            <hr/>
            <label>Summary</label>
            <table>
                <tbody>
                    <tr>
                        <td># buildings</td>
                        <td>1123</td>
                    </tr>
                    <tr>
                        <td>Build area</td>
                        <td>123sqm</td>
                    </tr>
                    <tr>
                        <td>Avg height</td>
                        <td>20m</td>
                    </tr>
                </tbody>
            </table>
        </div>
    }
})

export default Sidebar
