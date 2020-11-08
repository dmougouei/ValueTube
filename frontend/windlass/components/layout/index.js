/*  ---------------------------------------------------------------------------
 *    Windlass v1.0.0 - Layout Elements
 *
 *    Copyright 2020 Timothy Martin
 *    Licensed under MIT (link to LICENSE)
 *  ---------------------------------------------------------------------------  */

// Imports
const {
  ALIGN_VALUES,
  MARGIN_VALUES,
  PADDING_VALUES,
  WIDTH_VALUES,
  ZINDEX_VALUES,
  DEFAULT_PROPERTIES,
  DISPLAY_VALUES,
} = require("../default");
const {
  SecurityHelpers,
  StringHelpers,
  StyleHelpers,
  TypeHelpers,
} = require("../../utilities").Server;

// Layout
// Layout Properties
class LAYOUT_PROPERTIES extends DEFAULT_PROPERTIES {
  constructor(props) {
    super(props);
    // align
    TypeHelpers.typeCheckValue(
      this,
      props,
      "align",
      ALIGN_VALUES,
      undefined,
      `align: ${SecurityHelpers.sanitiseCSS(props.align)};`
    );

    // color
    TypeHelpers.typeCheckColor(
      this,
      props,
      "color",
      undefined,
      `background-color: ${SecurityHelpers.sanitiseCSS(props.color)};`
    );

    // border
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "border",
      TypeHelpers.PRIMATIVES.BOOLEAN,
      undefined,
      props.border ? `border: solid 1px currentcolor;` : ``
    );

    // fluid
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "fluid",
      TypeHelpers.PRIMATIVES.BOOLEAN,
      false,
      props.fluid
        ? `width: 100%;`
        : `min-width: ${WIDTH_VALUES.EXTRA_SMALL}; width: fit-content(100%);`
    );

    // margin
    TypeHelpers.typeCheckValue(
      this,
      props,
      "margin",
      MARGIN_VALUES,
      undefined,
      `margin: ${SecurityHelpers.sanitiseCSS(props.margin)};`
    );

    // maxWidth
    TypeHelpers.typeCheckValue(
      this,
      props,
      "maxWidth",
      WIDTH_VALUES,
      undefined,
      `max-width: ${SecurityHelpers.sanitiseCSS(props.maxWidth)};`
    );

    // padding
    TypeHelpers.typeCheckValue(
      this,
      props,
      "padding",
      PADDING_VALUES,
      undefined,
      `padding: ${SecurityHelpers.sanitiseCSS(props.padding)};`
    );

    // visibility
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "visibility",
      TypeHelpers.PRIMATIVES.BOOLEAN,
      false,
      props.visibility ? `visibility: visible;` : `visibility: hidden;`
    );

    // zIndex
    TypeHelpers.typeCheckValue(
      this,
      props,
      "zIndex",
      ZINDEX_VALUES,
      undefined,
      `z-index: ${SecurityHelpers.sanitiseCSS(props.zIndex)};`
    );

    // styleList
    this.styleList = this.styleList.concat([
      this.align,
      this.color,
      this.border,
      this.fluid,
      this.margin,
      this.maxWidth,
      this.padding,
      this.visibility,
      this.zIndex,
    ]);
  }
}

const CONTAINER_VALUES = {
  DEFAULT: "div",
  ADDRESS: "address",
  ARTICLE: "article",
  ASIDE: "aside",
  CONTAINER: "div",
  FOOTER: "footer",
  HEADER: "header",
  HEADING_GROUP: "hgroup",
  MAIN: "main",
  NAVIGATION: "nav",
  SECTION: "section",
};
Object.freeze(CONTAINER_VALUES);

//  Container Properties
class CONTAINER_PROPERTIES extends LAYOUT_PROPERTIES {
  constructor(props) {
    super(props);
    // variant
    TypeHelpers.typeCheckValue(
      this,
      props,
      "variant",
      CONTAINER_VALUES,
      CONTAINER_VALUES.DEFAULT,
      `${SecurityHelpers.sanitiseHTML(props.variant)}`
    );
  }
}

// Container
function Container(props) {
  try {
    props === undefined ? (props = {}) : null;
    if (typeof props === "object" || props instanceof Object) {
      props instanceof CONTAINER_PROPERTIES
        ? (this.props = props)
        : (this.props = new CONTAINER_PROPERTIES(props));
      return `<${this.props.variant} ${StringHelpers.combineStrings([
        this.props.id,
        this.props.class,
        this.props.title,
        this.props.language,
        this.props.direction,
        this.props.onclick,
        this.props.attributes,
        StyleHelpers.combineStyles(this.props.styleList, this.props.style),
      ])}>${this.props.content}</${this.props.variant}>`;
    } else {
      throw new TypeError(`${props} on Container is not a valid Object type.`);
    }
  } catch (e) {
    console.error(e);
  }
}

// Figure Properties
class FIGURE_PROPERTIES extends LAYOUT_PROPERTIES {
  constructor(props) {
    super(props);
    // caption
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "caption",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      SecurityHelpers.sanitiseHTML(`<figcaption>${props.caption}</figcaption>`)
    );
  }
}

// Figure
function Figure(props) {
  try {
    props === undefined ? (props = {}) : null;
    if (typeof props === "object" || props instanceof Object) {
      props instanceof FIGURE_PROPERTIES
        ? (this.props = props)
        : (this.props = new FIGURE_PROPERTIES(props));
      return `<figure ${StringHelpers.combineStrings([
        this.props.id,
        this.props.class,
        this.props.title,
        this.props.language,
        this.props.direction,
        StyleHelpers.combineStyles(this.props.styleList, this.props.style),
      ])}>${this.props.content}${this.props.caption}</figure>`;
    } else {
      throw new TypeError(`${props} on Figure is not a valid Object type.`);
    }
  } catch (e) {
    console.error(e);
  }
}

// Grid Properties
class GRID_PROPERTIES extends LAYOUT_PROPERTIES {
  constructor(props) {
    super({
      display: DISPLAY_VALUES.GRID,
      ...props,
    });
    // templateColumns
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "templateColumns",
      TypeHelpers.PRIMATIVES.ARRAY,
      "",
      Array.isArray(props.templateColumns)
        ? `grid-template-columns: ${SecurityHelpers.sanitiseCSS(props.templateColumns.join(" "))}`
        : "",
    );

    // templateRows
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "templateRows",
      TypeHelpers.PRIMATIVES.ARRAY,
      "",
      Array.isArray(props.templateRows)
        ? `grid-template-rows: ${SecurityHelpers.sanitiseCSS(props.templateRows.join(" "))}`
        : "",
    );

    // styleList
    this.styleList = this.styleList.concat([
      this.templateColumns,
      this.templateRows,
    ]);
  }
}

// Grid
function Grid(props) {
  try {
    props === undefined ? (props = {}) : null;
    if (typeof props === "object" || props instanceof Object) {
      props instanceof GRID_PROPERTIES
        ? (this.props = props)
        : (this.props = new GRID_PROPERTIES(props));
      return `<div ${StringHelpers.combineStrings([
        this.props.id,
        this.props.class,
        this.props.title,
        this.props.language,
        this.props.direction,
        StyleHelpers.combineStyles(this.props.styleList, this.props.style),
      ])}>${this.props.content}</div>`;
    } else {
      throw new TypeError(`${props} on Grid is not a valid Object type.`);
    }
  } catch (e) {
    console.error(e);
  }
}

// Seperator
function Seperator(props) {
  try {
    props === undefined ? (props = {}) : null;
    if (typeof props === "object" || props instanceof Object) {
      props instanceof LAYOUT_PROPERTIES
        ? (this.props = props)
        : (this.props = new LAYOUT_PROPERTIES(props));
      return `<hr ${StringHelpers.combineStrings([
        this.props.id,
        this.props.class,
        this.props.title,
        this.props.language,
        this.props.direction,
        StyleHelpers.combineStyles(this.props.styleList, this.props.style),
      ])}>${this.props.content}</hr>`;
    } else {
      throw new TypeError(`${props} on Seperator is not a valid Object type.`);
    }
  } catch (e) {
    console.error(e);
  }
}

// Enctype Values
const ENCTYPE_VALUES = {
  DEFAULT: "",
  APPLICATION: "application/x-www-form-urlencoded",
  MULTIPART: "multipart/form-data",
  TEXT: "text/plain",
};
Object.freeze(ENCTYPE_VALUES);

// Method Values
const METHOD_VALUES = {
  DEFAULT: "",
  POST: "post",
  GET: "get",
  DIALOG: "dialog",
};
Object.freeze(METHOD_VALUES);

// Target Values
const TARGET_VALUES = {
  DEFAULT: "",
  SELF: "_self",
  BLANK: "_blank",
  PARENT: "_parent",
  TOP: "_top",
};
Object.freeze(TARGET_VALUES);

// Form Properties
class FORM_PROPERTIES extends LAYOUT_PROPERTIES {
  constructor(props) {
    super(props);
    // accept-charset
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "acceptCharset",
      TypeHelpers.PRIMATIVES.ARRAY,
      "",
      (props.acceptCharset) ? `accept-charset="${props.acceptCharset.filter((charset) => {
        return (typeof charset === "string" || src instanceof String) ? true : false;
      }).join(" ")}"` : ""
    );

    // autocomplete
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "autocomplete",
      TypeHelpers.PRIMATIVES.BOOLEAN,
      "",
      props.autocomplete ? "autocomplete" : ""
    );

    // rel
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "rel",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      `rel="${SecurityHelpers.sanitiseHTML(props.rel)}"`
    );

    // action
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "action",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      `action="${SecurityHelpers.sanitiseHTML(props.action)}"`
    );

    // enctype
    TypeHelpers.typeCheckValue(
      this,
      props,
      "enctype",
      ENCTYPE_VALUES,
      ENCTYPE_VALUES.DEFAULT,
      `enctype="${props.enctype}"`
    );

    // method
    TypeHelpers.typeCheckValue(
      this,
      props,
      "method",
      METHOD_VALUES,
      METHOD_VALUES.DEFAULT,
      `method="${props.method}"`
    );

    // novalidate
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "novalidate",
      TypeHelpers.PRIMATIVES.BOOLEAN,
      "",
      props.novalidate ? "novalidate" : ""
    );
    
    // target
    TypeHelpers.typeCheckValue(
      this,
      props,
      "target",
      TARGET_VALUES,
      TARGET_VALUES.DEFAULT,
      `target="${props.target}"`
    );

    // onchange
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "onchange",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      `onchange="${SecurityHelpers.sanitiseHTML(props.onchange)}"`
    );

    // styleList
    this.styleList = this.styleList.concat([
      this.templateColumns,
      this.templateRows,
    ]);
  }
}

// Form
function Form(props) {
  try {
    props === undefined ? (props = {}) : null;
    if (typeof props === "object" || props instanceof Object) {
      props instanceof FORM_PROPERTIES
        ? (this.props = props)
        : (this.props = new FORM_PROPERTIES(props));
      return `<form ${StringHelpers.combineStrings([
        this.props.id,
        this.props.class,
        this.props.title,
        this.props.language,
        this.props.direction,
        this.props.acceptCharset,
        this.props.autocomplete,
        this.props.rel,
        this.props.action,
        this.props.enctype,
        this.props.method,
        this.props.novalidate,
        this.props.target,
        this.props.onchange,
        StyleHelpers.combineStyles(this.props.styleList, this.props.style),
      ])}>${this.props.content}</form>`;
    } else {
      throw new TypeError(`${props} on Form is not a valid Object type.`);
    }
  } catch (e) {
    console.error(e);
  }
}


// Export Layout
const Layout = {
  LAYOUT_PROPERTIES,
  CONTAINER_VALUES,
  CONTAINER_PROPERTIES,
  Container,
  FIGURE_PROPERTIES,
  Figure,
  GRID_PROPERTIES,
  Grid,
  Seperator,
  ENCTYPE_VALUES,
  METHOD_VALUES,
  TARGET_VALUES,
  FORM_PROPERTIES,
  Form,
};

module.exports = Layout;
