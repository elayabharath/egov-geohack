import React, { PropTypes } from 'react'
import jayanagar from './../static/jayanagar-data.js'
import _ from 'lodash'

const Mapbox = React.createClass({

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

    componentDidMount: function() {

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

            _.forEach(jayanagar, (item, index) => {
                _.forEach(item, (building, key) => {
                    features.push({
                        type: "Feature",
                        properties: {
                            description: "Hello"
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


    render () {
        return <div id='map'></div>
    }
})

export default Mapbox
