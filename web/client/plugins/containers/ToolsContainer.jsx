/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {connect} = require('react-redux');
const {compose} = require('redux');

const HelpBadge = require('../../components/help/HelpBadge');
const Message = require('../../components/I18N/Message');

const {Button, Tooltip, OverlayTrigger, Panel, Collapse} = require('react-bootstrap');

const {setControlProperty, toggleControl} = require('../../actions/controls');
const {partial} = require('lodash');

const assign = require('object-assign');

const ToolsContainer = React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        container: React.PropTypes.func,
        tool: React.PropTypes.func,
        className: React.PropTypes.string,
        tools: React.PropTypes.array,
        panels: React.PropTypes.array,
        mapType: React.PropTypes.string,
        toolStyle: React.PropTypes.string,
        activeStyle: React.PropTypes.string,
        toolSize: React.PropTypes.string,
        stateSelector: React.PropTypes.string.isRequired,
        eventSelector: React.PropTypes.string,
        panelStyle: React.PropTypes.object,
        panelClassName: React.PropTypes.string,
        activePanel: React.PropTypes.string
    },
    contextTypes: {
        messages: React.PropTypes.object,
        router: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            container: Panel,
            className: "tools-container",
            toolStyle: "default",
            activeStyle: "primary",
            tools: [],
            panels: [],
            tool: Button,
            mapType: "leaflet",
            eventSelector: "onClick",
            panelStyle: {},
            panelClassName: "tools-container-panel",
            toolSize: null
        };
    },
    getTool(tool) {
        if (tool.tool) {
            return tool.tool === true ? tool.plugin : tool.tool;
        }
        let selector = () => ({});
        const actions = {};
        if (tool.exclusive) {
            selector = (state) => ({
                active: state.controls && state.controls[this.props.stateSelector] && state.controls[this.props.stateSelector].active === tool.name
            });
            actions[this.props.eventSelector] = setControlProperty.bind(null, this.props.stateSelector, 'active', tool.name, true);
        } else if (tool.toggle) {
            selector = (state) => ({
                bsStyle: state.controls[tool.toggleControl || tool.name] && state.controls[tool.toggleControl || tool.name][tool.toggleProperty || "enabled"] ? this.props.activeStyle : this.props.toolStyle
            });
            actions[this.props.eventSelector] = toggleControl.bind(null, tool.toggleControl || tool.name, tool.toggleProperty || null);
        } else if (tool.action) {
            actions[this.props.eventSelector] = partial(tool.action, this.context);
        }
        return connect(selector, actions, (stateProps, dispatchProps, parentProps) => {
            return this.mergeHandlers({
                ...parentProps,
                ...stateProps
            }, dispatchProps);
        })(this.props.tool);
    },
    renderTools() {
        return this.props.tools.map((tool) => {
            if (tool.element) {
                return tool.element;
            }
            const help = tool.help ? <HelpBadge className="mapstore-helpbadge" helpText={tool.help}/> : <span/>;
            const tooltip = tool.tooltip ? <Message msgId={tool.tooltip}/> : null;

            const Tool = this.getTool(tool);

            return this.addTooltip(
                <Tool tooltip={tooltip} btnSize={this.props.toolSize} bsStyle={this.props.toolStyle} help={help} key={tool.name} mapType={this.props.mapType}
                    {...tool.cfg} items={tool.items || []}>
                    {help}{tool.icon} {tool.text}
                </Tool>,
            tool);
        });
    },
    renderPanels() {
        return this.props.panels.map((panel) => {
            const ToolPanelComponent = panel.panel;
            const ToolPanel = (<ToolPanelComponent
                key={panel.name} mapType={this.props.mapType} {...panel.cfg} {...(panel.props || {})}
                items={panel.items || []}/>);
            const title = panel.title ? <Message msgId={panel.title}/> : null;
            if (panel.wrap) {
                return (
                    <Collapse key={"mapToolBar-item-collapse-" + panel.name} in={this.props.activePanel === panel.name}>
                        <Panel header={title} style={this.props.panelStyle} className={this.props.panelClassName}>
                            {ToolPanel}
                        </Panel>
                    </Collapse>
                );
            }
            return ToolPanel;
        });
    },
    render() {
        const Container = this.props.container;
        return (
            <span id={this.props.id}>
                <Container id={this.props.id + "-container"} className={this.props.className}>
                    {this.renderTools()}
                </Container>
                {this.renderPanels()}
            </span>
        );
    },
    mergeHandlers(props, handlers) {
        return Object.keys(handlers).reduce((previous, event) => {
            return assign(previous, {[event]: props[event] ? compose(props[event], handlers[event]) : handlers[event]});
        }, props);
    },
    addTooltip(button, spec) {
        if (spec.tooltip) {
            let tooltip = <Tooltip id={this.props.id + "-" + spec.name + "-tooltip"}><Message msgId={spec.tooltip}/></Tooltip>;
            return (
                <OverlayTrigger key={this.props.id + "-" + spec.name + "-overlay"} rootClose placement="left" overlay={tooltip}>
                    {button}
                </OverlayTrigger>
            );
        }
        return button;
    }
});

module.exports = ToolsContainer;
