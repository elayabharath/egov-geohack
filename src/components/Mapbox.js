import React, { PropTypes } from 'react'
import jayanagar from './../static/jayanagar-data.js'
import shivajinagar from './../static/shivajinagar-data.js'
import _ from 'lodash'

const Mapbox = React.createClass({

    getInitialState() {
        return {
            data: jayanagar
        }
    },

    componentWillReceiveProps(nextProps) {
        switch (nextProps.ward) {
            case 'JAYANAGAR':
                this.setState({
                    data: jayanagar
                })
                break;
            case 'SHIVAJINAGAR':
                this.setState({
                    data: shivajinagar
                })
                break;
            default:

        }
    },

    mapData(id, coords) {
        return {
            id: id,
            type: 'fill',
            source: {
                type: 'geojson',
                data: {
                    type: 'Building',
                    geometry: {
                        type: 'Polygon',
                        'coordinates': [
                            coords
                        ]
                    }
                }
            },
            'layout': {},
            'paint': {
                'fill-color': '#088',
                'fill-opacity': 0.8
            }
        }
    },

    renderMap() {
        const self = this;

        mapboxgl.accessToken = 'pk.eyJ1IjoiZWxheWFiaGFyYXRoIiwiYSI6ImNqMTRra3JubDAwMDYzM25uOXEwNDF3ZzIifQ.ntzLwhDXekJpMtyMpygz7g';
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/satellite-v9',
            zoom: 15,
            center: [77.59956, 12.983]
        });

        map.on('load', function () {

            var features = [];

            _.forEach(self.state.data, (item, index) => {
                _.forEach(item, (building, key) => {
                    features.push({
                        type: "Feature",
                        properties: {
                            description: `
                                <table>
                                    <tbody>
                                        <tr>
                                            <td style="padding: 0 12px 0 0;">Plinth area (sqm)</td>
                                            <td><strong>${building.area.toFixed(2)}</strong></td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 0 12px 0 0;">Height (m)</td>
                                            <td><input type="number" value="${building.height || 0}" /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            `
                        },
                        geometry: {
                            type: "Polygon",
                            coordinates: [
                                building.coords
                            ]
                        }
                    })
                })
            })

            map.addLayer({
                id: "buildings",
                type: 'fill',
                source: {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: features
                    }
                },
                'layout': {},
                'paint': {
                    'fill-color': '#088',
                    'fill-opacity': 0.8
                }
            })

            var popup = new mapboxgl.Popup({
               closeButton: false,
               closeOnClick: false
           });

           map.on('mouseenter', 'buildings', function(e) {
               map.getCanvas().style.cursor = 'pointer';
               popup.setLngLat(e.features[0].geometry.coordinates[0][0])
                   .setHTML(e.features[0].properties.description)
                   .addTo(map);
           });

           map.on('mouseleave', 'buildings', function() {
               map.getCanvas().style.cursor = '';
               popup.remove();
           });
        });
    },

    componentDidMount: function() {
        this.renderMap();
    },

    componentDidUpdate(prevProps, prevState) {
        this.renderMap();
    },


    render () {
        return <div id='map' key={this.props.ward}></div>
    }
})

export default Mapbox
