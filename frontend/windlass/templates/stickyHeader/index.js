/*  ---------------------------------------------------------------------------
 *    Windlass v1.0.0 - Sticky Header Template
 *
 *    Copyright 2020 Timothy Martin
 *    Licensed under MIT (https://github.com/Niten001/windlass/blob/master/LICENSE)
 *  ---------------------------------------------------------------------------  */

const { DEFAULT_TEMPLATE_PROPERTIES, DefaultTemplate } = require("../default");
const { TypeHelpers } = require("../../utilities").Server;

class STICKY_HEADER_TEMPLATE_PROPERTIES extends DEFAULT_TEMPLATE_PROPERTIES {
  constructor(props) {
    super(props);
    // header
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "header",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      String.raw`${props.header}`
    );
  }
}

function StickyHeaderTemplate(props) {
  try {
    if (typeof props === "object" || props instanceof Object) {
      props instanceof STICKY_HEADER_TEMPLATE_PROPERTIES
        ? (this.props = props)
        : (this.props = new STICKY_HEADER_TEMPLATE_PROPERTIES(props));
      return DefaultTemplate({
        lang: this.props.lang,
        description: this.props.description,
        title: this.props.title,
        icon: this.props.icon,
        linkedStylesheets: this.props.linkedStylesheets,
        inlineStylesheet: this.props.inlineStylesheet,
        head: this.props.head,
        linkedScripts: this.props.linkedScripts,
        content: [
          this.props.header,
          this.props.content,
        ].join("\n"),
      });
    } else {
      throw new TypeError(`${props} on Text is not a valid Object type.`);
    }
  } catch (e) {
    console.error(e);
  }
}

const StickyHeader = {
  STICKY_HEADER_TEMPLATE_PROPERTIES,
  StickyHeaderTemplate,
};

module.exports = StickyHeader;
