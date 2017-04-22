import React from 'react'
import Reflux from 'reflux'
import Sidebar from './Sidebar'
import Mapbox from './Mapbox'
import UserStore from './../stores/UserStore'

const HomePage = React.createClass({

    mixins: [
        Reflux.connect(UserStore, 'data')
    ],

    render () {
        return <div className="grid-frame">
            <div className="grid-block">
                <div className="small-2 grid-block vertical">
                    <Sidebar ward={this.state.data.selectedArea}/>
                </div>
                <div className="small-10 grid-block">
                    <Mapbox ward={this.state.data.selectedArea}/>
                </div>
            </div>
        </div>
    }
})

export default HomePage;
