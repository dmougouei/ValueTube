/*  ---------------------------------------------------------------------------
 *    Windlass v1.0.0 - Sidebar Template
 *
 *    Copyright 2020 Timothy Martin
 *    Licensed under MIT (https://github.com/Niten001/windlass/blob/master/LICENSE)
 *  ---------------------------------------------------------------------------  */
const {
  WIDTH_VALUES,
} = require("../../components").Default;
const {
  DEFAULT_TEMPLATE_PROPERTIES,
  DefaultTemplate,
} = require("../default");
const {
  Grid
} = require("../../components").Layout;
const TypeHelpers = require("../../utilities").Server.TypeHelpers;

// Sidebar Side Values
const SIDEBAR_SIDE_VALUES = {
  DEFAULT: [`minmax(${WIDTH_VALUES.SMALL}, 8fr)`, `minmax(${WIDTH_VALUES.EXTRA_SMALL}, 3fr)`],
  LEFT: [`minmax(${WIDTH_VALUES.EXTRA_SMALL}, 3fr)`, `minmax(${WIDTH_VALUES.SMALL}, 8fr)`],
  RIGHT: [`minmax(${WIDTH_VALUES.EXTRA_SMALL}, 3fr)`, `minmax(${WIDTH_VALUES.SMALL}, 8fr)`],
};
Object.freeze(SIDEBAR_SIDE_VALUES);

// Sidebar Template Properties
class SIDEBAR_TEMPLATE_PROPERTIES extends DEFAULT_TEMPLATE_PROPERTIES {
  constructor(props) {
    super(props);
    // side
    TypeHelpers.typeCheckValue(
      this,
      props,
      "side",
      SIDEBAR_SIDE_VALUES,
      SIDEBAR_SIDE_VALUES.DEFAULT,
      props.side
    );
    
    // header
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "header",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      String.raw`${props.header}`
    );

    // mainContent
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "mainContent",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      String.raw`${props.mainContent}`
    );

    // sidebarContent
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "sidebarContent",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      String.raw`${props.sidebarContent}`
    );
  }
}

// Sidebar Template
function SidebarTemplate(props) {
  try {
    if (typeof props === "object" || props instanceof Object) {
      props instanceof SIDEBAR_TEMPLATE_PROPERTIES
        ? (this.props = props)
        : (this.props = new SIDEBAR_TEMPLATE_PROPERTIES(props));
      const output = DefaultTemplate({
        description: this.props.description,
        title: this.props.title,
        icon: this.props.icon,
        linkedStylesheets: this.props.linkedStylesheets,
        linkedScripts: this.props.linkedScripts,
        content: [
          this.props.header,
          Grid({
            templateColumns: this.props.side,
            content:
              (this.props.side == SIDEBAR_SIDE_VALUES.LEFT)
                ? [
                  this.props.sidebarContent,
                  this.props.mainContent,
                ].join("\n")
                : [
                  this.props.mainContent,
                  this.props.sidebarContent,
                ].join("\n"),
          }),
        ].join("\n"),
      });
      return output;
    } else {
      throw new TypeError(`${props} on SidebarTemplate is not a valid Object type.`);
    }
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  SIDEBAR_SIDE_VALUES,
  SIDEBAR_TEMPLATE_PROPERTIES,
  SidebarTemplate,
};
