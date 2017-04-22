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

            var features = [], maxTax = 0, minTax = 0;

            var low = [], med = [], high = [], lowFeatures = [], medFeatures = [], highFeatures = [], taxes = [];

            var data = _.assign({}, self.state.data);

            _.forEach(self.state.data, (item, index) => {
                _.forEach(item, (building, key) => {
                    data[index][key].tax = building.area * (building.height || 1) * (100 - (building.age || 1) / 100);
                    taxes.push(data[index][key].tax)
                })
            })

            // console.log(taxes);

            maxTax = _.max(taxes);
            minTax = _.min(taxes);

            // console.log("Max tax", maxTax);
            // console.log("Min tax", minTax);

            var taxOneThird = (maxTax - minTax) / 5 + minTax;
            var taxTwoThird = 2 * (maxTax - minTax) / 5 + minTax;

            // console.log("One third", taxOneThird);
            // console.log("Two third", taxTwoThird);

            _.forEach(self.state.data, (item, index) => {
                _.forEach(item, (building, key) => {

                    var feature = {
                        type: "Feature",
                        properties: {
                            description: `
                                <table class="table-tooltip">
                                    <tbody>
                                        <tr>
                                            <td style="padding: 0 12px 0 0;">Plinth area (sqm)</td>
                                            <td><strong>${building.area.toFixed(2)}</strong></td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 0 12px 0 0;">Height (m)</td>
                                            <td><input type="number" value="${building.height || 0}" /></td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 0 12px 0 0;">Age (years)</td>
                                            <td><input type="number" value="${building.age || 0}" /></td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 0 12px 0 0;">Constructed</td>
                                            <td><input type="number" value="${building.year || 0}" /></td>
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
                    }

                    const tax = building.tax;
                    if(tax >= minTax && tax <= taxOneThird) {
                        low.push(item);
                        lowFeatures.push(feature)
                    } else if (tax >= taxOneThird && tax <= taxTwoThird) {
                        med.push(item);
                        medFeatures.push(feature);
                    } else {
                        high.push(item);
                        highFeatures.push(feature);
                    }
                })
            })

            map.addLayer({
                id: "buildings-low",
                type: 'fill',
                source: {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: lowFeatures
                    }
                },
                'layout': {},
                'paint': {
                    'fill-color': '#00C853',
                    'fill-opacity': 1
                }
            })

            map.addLayer({
                id: "buildings-med",
                type: 'fill',
                source: {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: medFeatures
                    }
                },
                'layout': {},
                'paint': {
                    'fill-color': '#FFB300',
                    'fill-opacity': 1
                }
            })

            map.addLayer({
                id: "buildings-high",
                type: 'fill',
                source: {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: highFeatures
                    }
                },
                'layout': {},
                'paint': {
                    'fill-color': '#EF5350',
                    'fill-opacity': 1
                }
            })

            var popup = new mapboxgl.Popup({
               closeButton: false,
               closeOnClick: false
           });

           map.on('mouseenter', 'buildings-low', function(e) {
               map.getCanvas().style.cursor = 'pointer';
               popup.setLngLat(e.features[0].geometry.coordinates[0][0])
                   .setHTML(e.features[0].properties.description)
                   .addTo(map);
           });

           map.on('mouseleave', 'buildings-low', function() {
               map.getCanvas().style.cursor = '';
               popup.remove();
           });

           map.on('mouseenter', 'buildings-med', function(e) {
               map.getCanvas().style.cursor = 'pointer';
               popup.setLngLat(e.features[0].geometry.coordinates[0][0])
                   .setHTML(e.features[0].properties.description)
                   .addTo(map);
           });

           map.on('mouseleave', 'buildings-med', function() {
               map.getCanvas().style.cursor = '';
               popup.remove();
           });

           map.on('mouseenter', 'buildings-high', function(e) {
               map.getCanvas().style.cursor = 'pointer';
               popup.setLngLat(e.features[0].geometry.coordinates[0][0])
                   .setHTML(e.features[0].properties.description)
                   .addTo(map);
           });

           map.on('mouseleave', 'buildings-high', function() {
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
