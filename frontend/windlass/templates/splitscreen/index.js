/*  ---------------------------------------------------------------------------
 *    Windlass v1.0.0 - Split Screen Template
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

// Split Screen Side Values
const SPLITSCREEN_SIDE_VALUES = {
  DEFAULT: [`minmax(${WIDTH_VALUES.SMALL}, 1fr)`, `minmax(${WIDTH_VALUES.SMALL}, 1fr)`],
  CENTER: [`minmax(${WIDTH_VALUES.SMALL}, 1fr)`, `minmax(${WIDTH_VALUES.SMALL}, 1fr)`],
  LEFT: [`minmax(${WIDTH_VALUES.EXTRA_SMALL}, 1fr)`, `minmax(${WIDTH_VALUES.SMALL}, 2fr)`],
  RIGHT: [`minmax(${WIDTH_VALUES.SMALL}, 2fr)`, `minmax(${WIDTH_VALUES.EXTRA_SMALL}, 1fr)`],
};
Object.freeze(SPLITSCREEN_SIDE_VALUES);

// Split Screen Template Properties
class SPLITSCREEN_TEMPLATE_PROPERTIES extends DEFAULT_TEMPLATE_PROPERTIES {
  constructor(props) {
    super(props);
    // side
    TypeHelpers.typeCheckValue(
      this,
      props,
      "side",
      SPLITSCREEN_SIDE_VALUES,
      SPLITSCREEN_SIDE_VALUES.DEFAULT,
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

    // leftContent
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "leftContent",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      String.raw`${props.leftContent}`
    );

    // rightContent
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "rightContent",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      String.raw`${props.rightContent}`
    );
  }
}

// Split Screen Template
function SplitScreenTemplate(props) {
  try {
    if (typeof props === "object" || props instanceof Object) {
      props instanceof SPLITSCREEN_TEMPLATE_PROPERTIES
        ? (this.props = props)
        : (this.props = new SPLITSCREEN_TEMPLATE_PROPERTIES(props));
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
            content: [
              this.props.leftContent,
              this.props.rightContent,
            ].join("\n"),
          }),
        ].join("\n"),
      });
      return output;
    } else {
      throw new TypeError(`${props} on SplitScreenTemplate is not a valid Object type.`);
    }
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  SPLITSCREEN_SIDE_VALUES,
  SPLITSCREEN_TEMPLATE_PROPERTIES,
  SplitScreenTemplate,
};
