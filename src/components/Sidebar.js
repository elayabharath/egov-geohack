import React, { PropTypes } from 'react'
import UserStore from './../stores/UserStore'

import jayanagar from './../static/jayanagar-data.js'

const Sidebar = React.createClass({

    getInitialState() {
        return {
            numBuilding: 0,
            buildArea: 0,
            avgHeight: 0
        }
    },

    updateWard(e) {
        UserStore.setSelectedArea(e.target.value)
    },

    componentWillReceiveProps(nextProps) {
        this.calculate(nextProps.ward)
    },

    componentDidMount: function() {
        this.calculate(this.props.ward)
    },

    calculate(ward) {
        var data = jayanagar;
        switch (ward) {
            case 'SHIVAJINAGAR':
                // data = shiva
                break;
            default:

        }

        var plinthArea = 0, avgHeight = 0;

        _.forEach(data, (item, index) => {
            _.forEach(item, (building, key) => {
                plinthArea += building.area;
                avgHeight += building.height || 0;
            })
        })

        this.setState({
            numBuilding: data.length,
            buildArea: plinthArea.toFixed(2),
            avgHeight: avgHeight / data.length
        })
    },

    render () {

        return <div className="sidepanel">
            <label>Choose a ward</label>
            <select value={this.props.ward} onChange={this.updateWard} ref="ward">
                <option value="JAYANAGAR">Jaya Nagar</option>
                <option value="SHIVAJINAGAR">Shivaji Nagar</option>
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
                        <td># Buildings</td>
                        <td>{this.state.numBuilding}</td>
                    </tr>
                    <tr>
                        <td>Build area (sqm)</td>
                        <td>{this.state.buildArea}</td>
                    </tr>
                    <tr>
                        <td>Avg height (m)</td>
                        <td>{this.state.avgHeight}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    }
})

export default Sidebar
