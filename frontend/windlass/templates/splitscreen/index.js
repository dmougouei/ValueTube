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
  STICKY_HEADER_TEMPLATE_PROPERTIES,
  StickyHeaderTemplate,
} = require("../stickyHeader");
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
class SPLITSCREEN_TEMPLATE_PROPERTIES extends STICKY_HEADER_TEMPLATE_PROPERTIES {
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
      return StickyHeaderTemplate({
        lang: this.props.lang,
        description: this.props.description,
        title: this.props.title,
        icon: this.props.icon,
        linkedStylesheets: this.props.linkedStylesheets,
        inlineStylesheet: this.props.inlineStylesheet,
        head: this.props.head,
        header: this.props.header,
        content: Grid({
          templateColumns: this.props.side,
          content: [
            this.props.leftContent,
            this.props.rightContent,
          ].join("\n"),
        }),
        linkedScripts: [],
      });
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
