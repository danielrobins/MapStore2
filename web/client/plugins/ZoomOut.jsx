/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
 /**
 * Plugin for Zoom out
 */
const {connect} = require('react-redux');
const {createSelector} = require('reselect');
const {mapSelector} = require('../selectors/map');
// TODO: make step and glyphicon configurable
const selector = createSelector([mapSelector], (map) => ({currentZoom: map && map.zoom, id: "zoomin-btn", step: -1, glyphicon: "minus"}));

const {changeZoomLevel} = require('../actions/map');

const ZoomOutButton = connect(selector, {
    onZoom: changeZoomLevel
})(require('../components/buttons/ZoomButton'));

const assign = require('object-assign');

module.exports = {
    ZoomOutPlugin: assign(ZoomOutButton, {
        Toolbar: {
            name: "ZoomOut",
            position: 4,
            tooltip: "zoombuttons.zoomOutTooltip",
            tool: true,
            hide: true
        }
    }),
    reducers: {zoomOut: require("../reducers/map")}
};
