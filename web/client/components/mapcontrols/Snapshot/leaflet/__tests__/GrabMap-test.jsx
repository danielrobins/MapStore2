/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
var expect = require('expect');

var React = require('react/addons');
var ReactDOM = require('react-dom');
var GrabMap = require('../GrabMap');

describe("test the Leaflet GrabMap component", () => {
    beforeEach((done) => {
        // emulate empty map
        document.body.innerHTML = '<div><div id="container"></div>' +
            '<div id="map" style="width:100%; height:100%"><canvas></canvas>' +
                '<div class="leaflet-tile-pane"><div class="leaflet-layer"></div></div>' +
            '</div></div>';
        setTimeout(done);
    });

    it('test component creation', () => {
        let status;
        const onStatusChange = (val) => {status = val; };
        const tb = ReactDOM.render(<GrabMap active={false} onStatusChange={onStatusChange} timeout={0} />, document.getElementById("container"));
        expect(tb).toExist();
        tb.setProps({active: false, snapstate: {error: "Test"}});
        expect(status).toEqual("DISABLED");
    });

    it('test snapshot creation', (done) => {
        const tb = ReactDOM.render(<GrabMap active={true} timeout={0} onSnapshotReady={() => { expect(tb.isTainted()).toBe(false); done(); }} layers={[{loading: false, visibility: true}, {loading: false}]}/>, document.getElementById("container"));
        expect(tb).toExist();
    });

    it('test snapshot update', (done) => {
        const tb = ReactDOM.render(<GrabMap active={false} timeout={0} onSnapshotReady={() => { expect(tb.isTainted()).toBe(false); done(); }} layers={[{loading: false, visibility: true}, {loading: false}]}/>, document.getElementById("container"));
        expect(tb).toExist();
        tb.setProps({active: true});
    });
});