import React, { PropTypes } from 'react'
import UserStore from './../stores/UserStore'

import jayanagar from './../static/jayanagar-data.js'
import shivajinagar from './../static/shivajinagar-data.js'

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
                data = shivajinagar;
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
                <option value="JAYANAGAR">Ward Banashankari</option>
                <option value="SHIVAJINAGAR">Ward Padmanabhanagar</option>
            </select>
            <hr/>
            <p style={{color: "#EF5350"}}>High tax</p>
            <p style={{color: "#00C853"}}>Low tax</p>
            <p style={{color: "#FFB300"}}>Medium tax</p>
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
                    {/* <tr>
                        <td>Avg height (m)</td>
                        <td>{this.state.avgHeight}</td>
                    </tr> */}
                </tbody>
            </table>
        </div>
    }
})

export default Sidebar
