// Imports
const DEFAULT_PROPERTIES = require("../default").DEFAULT_PROPERTIES;
const { THEME_COLORS } = require("../color");
const {
  RandomHelpers,
  SecurityHelpers,
  StringHelpers,
  StyleHelpers,
  TypeHelpers,
} = require("../../utilities").Server;
const Checkbox = require("./checkbox/checkbox.js");
const Textbox = require("./textbox/textbox.js");

// Button Properties
class BUTTON_PROPERTIES extends DEFAULT_PROPERTIES {
  constructor(props) {
    super(props);
    // actionUp
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "actionUp",
      TypeHelpers.PRIMATIVES.STRING,
      false,
      SecurityHelpers.sanitiseJS(props.actionUp)
    );

    // actionDown
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "actionDown",
      TypeHelpers.PRIMATIVES.STRING,
      false,
      SecurityHelpers.sanitiseJS(props.actionDown)
    );

    // animated
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "animated",
      TypeHelpers.PRIMATIVES.BOOLEAN,
      false,
      props.animated ? "animated" : null
    );

    // caps
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "caps",
      TypeHelpers.PRIMATIVES.BOOLEAN,
      false,
      props.caps ? "caps" : null
    );

    // outline
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "outline",
      TypeHelpers.PRIMATIVES.BOOLEAN,
      false,
      props.outline ? "outline" : null
    );

    // round
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "round",
      TypeHelpers.PRIMATIVES.BOOLEAN,
      false,
      props.round ? "round" : null
    );

    // class
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "class",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      `class="${SecurityHelpers.sanitiseHTML(
        StringHelpers.combineStrings([
          props.class,
          this.animated,
          this.round,
          this.outline,
          this.caps,
          this.color,
        ])
      )}"`
    );
  }
}

// Button
function Button(props) {
  try {
    props === undefined ? (props = {}) : null;
    if (typeof props === "object" || props instanceof Object) {
      props instanceof BUTTON_PROPERTIES
        ? (this.props = props)
        : (this.props = new BUTTON_PROPERTIES(props));
      return `<button role="button" ${StringHelpers.combineStrings([
        this.props.id,
        this.props.class,
        this.props.title,
        this.props.language,
        this.props.direction,
        this.props.tabIndex,
        this.props.actionDown ? `onclick=\"${this.props.actionDown}\"` : "",
        StyleHelpers.combineStyles(this.props.styleList, this.props.style),
      ])}>${this.props.content}</button>`;
    } else {
      throw new TypeError(`${props} on Button is not a valid Object type.`);
    }
  } catch (e) {
    console.error(e);
  }
}

// Toggle Button
function ToggleButton(props) {
  try {
    props === undefined ? (props = {}) : null;
    if (typeof props === "object" || props instanceof Object) {
      props instanceof BUTTON_PROPERTIES
        ? (this.props = props)
        : (this.props = new BUTTON_PROPERTIES(props));
      const checkboxId = RandomHelpers.randomId("ch_", 5);
      return `<button role="button" ${StringHelpers.combineStrings([
        this.props.id,
        this.props.class,
        this.props.title,
        this.props.language,
        this.props.direction,
        this.props.tabIndex,
        this.props.actionUp || this.props.actionDown
          ? `onclick="button.toggleButton(this, () => {${this.props.actionDown}}, () => {${this.props.actionUp}})"`
          : "",
        StyleHelpers.combineStyles(this.props.styleList, this.props.style),
      ])}>
        <input id="${checkboxId}" type="checkbox">
        <label for="${checkboxId}">${this.props.content}</label>
      </button>`;
    } else {
      throw new TypeError(`${props} on Button is not a valid Object type.`);
    }
  } catch (e) {
    console.error(e);
  }
}

// Type Values
const TYPE_VALUES = {
  DEFAULT: "",
  BUTTON: "button",
  CHECKBOX: "checkbox",
  COLOR: "color",
  DATE: "date",
  DATETIME: "datetime",
  DATETIME_LOCAL: "datetime-local",
  EMAIL: "email",
  FILE: "file",
  HIDDEN: "hidden",
  IMAGE: "image",
  MONTH: "month",
  NUMBER: "number",
  PASSWORD: "password",
  RADIO: "radio",
  RANGE: "range",
  RESET: "reset",
  SEARCH: "search",
  SUBMIT: "submit",
  TELEPHONE: "tel",
  TEXT: "text",
  URL: "url",
  WEEK: "week",
};
Object.freeze(TYPE_VALUES);

// Input Properties
class INPUT_PROPERTIES extends DEFAULT_PROPERTIES {
  constructor(props) {
    super(props);
    // autocomplete
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "autocomplete",
      TypeHelpers.PRIMATIVES.BOOLEAN,
      "",
      props.autocomplete ? "autocomplete" : ""
    );

    // autofocus
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "autofocus",
      TypeHelpers.PRIMATIVES.BOOLEAN,
      "",
      props.autofocus ? "autofocus" : ""
    );

    // disabled
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "disabled",
      TypeHelpers.PRIMATIVES.BOOLEAN,
      "",
      props.disabled ? "disabled" : ""
    );

    // form
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "form",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      `form="${SecurityHelpers.sanitiseHTML(props.form)}"`
    );

    // name
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "name",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      `name="${SecurityHelpers.sanitiseHTML(props.name)}"`
    );

    // type
    TypeHelpers.typeCheckValue(
      this,
      props,
      "type",
      TYPE_VALUES,
      TYPE_VALUES.DEFAULT,
      `type="${props.type}"`
    );

    // value
    if (typeof props.value === "string" || props instanceof String) {
      TypeHelpers.typeCheckPrimative(
        this,
        props,
        "value",
        TypeHelpers.PRIMATIVES.STRING,
        "",
        `value="${SecurityHelpers.sanitiseHTML(props.value)}"`
      );
    } else if (typeof props.value === "number" || props instanceof Number) {
      TypeHelpers.typeCheckPrimative(
        this,
        props,
        "value",
        TypeHelpers.PRIMATIVES.NUMBER,
        "",
        `value="${SecurityHelpers.sanitiseHTML(props.value)}"`
      );
    }
  }
}

// Input
function Input(props) {
  try {
    props === undefined ? (props = {}) : null;
    if (typeof props === "object" || props instanceof Object) {
      props instanceof INPUT_PROPERTIES
        ? (this.props = props)
        : (this.props = new INPUT_PROPERTIES(props));
      return `<input ${StringHelpers.combineStrings([
        this.props.id,
        this.props.class,
        this.props.title,
        this.props.language,
        this.props.direction,
        this.props.tabIndex,
        this.props.autocomplete,
        this.props.autofocus,
        this.props.disabled,
        this.props.form,
        this.props.name,
        this.props.type,
        this.props.value,
        StyleHelpers.combineStyles(this.props.styleList, this.props.style),
      ])}>`;
    } else {
      throw new TypeError(`${props} on Input is not a valid Object type.`);
    }
  } catch (e) {
    console.error(e);
  }
}

// Text Input Properties
class TEXT_INPUT_PROPERTIES extends INPUT_PROPERTIES {
  constructor(props) {
    super(props);
    // dirname
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "dirname",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      `dirname="${SecurityHelpers.sanitiseHTML(props.dirname)}"`
    );

    // list
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "list",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      `list="${SecurityHelpers.sanitiseHTML(props.list)}"`
    );

    // maxlength
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "maxlength",
      TypeHelpers.PRIMATIVES.NUMBER,
      "",
      `maxlength="${SecurityHelpers.sanitiseHTML(props.maxlength)}"`
    );

    // minlength
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "minlength",
      TypeHelpers.PRIMATIVES.NUMBER,
      "",
      `minlength="${SecurityHelpers.sanitiseHTML(props.minlength)}"`
    );

    // pattern
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "pattern",
      TypeHelpers.PRIMATIVES.REGEX,
      "",
      `pattern="${SecurityHelpers.sanitiseHTML(props.pattern)}"`
    );

    // placeholder
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "placeholder",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      `placeholder="${SecurityHelpers.sanitiseHTML(props.placeholder)}"`
    );

    // readonly
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "readonly",
      TypeHelpers.PRIMATIVES.BOOLEAN,
      "",
      props.readonly ? "readonly" : ""
    );

    // required
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "required",
      TypeHelpers.PRIMATIVES.BOOLEAN,
      "",
      props.required ? "required" : ""
    );

    // size
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "size",
      TypeHelpers.PRIMATIVES.NUMBER,
      "",
      `size="${SecurityHelpers.sanitiseHTML(props.size)}"`
    );

    // label
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "label",
      TypeHelpers.PRIMATIVES.STRING,
      undefined,
      SecurityHelpers.sanitiseHTML(props.label)
    );

    // error
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "error",
      TypeHelpers.PRIMATIVES.STRING,
      undefined,
      SecurityHelpers.sanitiseHTML(props.error)
    );
  }
}

// Text Input
function TextInput(props) {
  try {
    props === undefined ? (props = {}) : null;
    if (typeof props === "object" || props instanceof Object) {
      props instanceof TEXT_INPUT_PROPERTIES
        ? (this.props = props)
        : (this.props = new TEXT_INPUT_PROPERTIES(props));
        const inputId = (this.props.id == "") ? `id="${RandomHelpers.randomId("in_", 5)}"` : this.props.id;
      this.props.styleList.push(
        this.props.error
          ? `
            border-color: ${THEME_COLORS.DANGER};
            color: ${THEME_COLORS.DANGER};
          `
          : null
      );
      return (
        `${(this.props.label || this.props.error) ? `<div>` : ""}
          ${this.props.label ? `<label for="${inputId}">${this.props.label}</label>` : ""}
          <input type="text" ${StringHelpers.combineStrings([
            inputId, 
            this.props.class,
            this.props.title,
            this.props.language,
            this.props.direction,
            this.props.tabIndex,
            this.props.autocomplete,
            this.props.autofocus,
            this.props.disabled,
            this.props.form,
            this.props.name,
            this.props.type,
            this.props.value,
            this.props.dirname,
            this.props.list,
            this.props.maxlength,
            this.props.minlength,
            this.props.pattern,
            this.props.placeholder,
            this.props.readonly,
            this.props.required,
            this.props.size,
            StyleHelpers.combineStyles(this.props.styleList, this.props.style),
          ])}>
          ${this.props.error
            ? `<div class="error" style="color: ${THEME_COLORS.DANGER}; font-size: 0.8em; margin: -6px 0 8px 4px;">${this.props.error}</div>`
            : ""}
        ${(this.props.label || this.props.error) ? `</div>` : ""}`
      );
    } else {
      throw new TypeError(`${props} on TextInput is not a valid Object type.`);
    }
  } catch (e) {
    console.error(e);
  }
}

// Password Input Properties
class PASSWORD_INPUT_PROPERTIES extends INPUT_PROPERTIES {
  constructor(props) {
    super(props);
    // maxlength
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "maxlength",
      TypeHelpers.PRIMATIVES.NUMBER,
      "",
      `maxlength="${SecurityHelpers.sanitiseHTML(props.maxlength)}"`
    );

    // minlength
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "minlength",
      TypeHelpers.PRIMATIVES.NUMBER,
      "",
      `minlength="${SecurityHelpers.sanitiseHTML(props.minlength)}"`
    );

    // pattern
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "pattern",
      TypeHelpers.PRIMATIVES.REGEX,
      "",
      `pattern="${SecurityHelpers.sanitiseHTML(props.pattern)}"`
    );

    // placeholder
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "placeholder",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      `placeholder="${SecurityHelpers.sanitiseHTML(props.placeholder)}"`
    );

    // readonly
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "readonly",
      TypeHelpers.PRIMATIVES.BOOLEAN,
      "",
      props.readonly ? "readonly" : ""
    );

    // required
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "required",
      TypeHelpers.PRIMATIVES.BOOLEAN,
      "",
      props.required ? "required" : ""
    );

    // size
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "size",
      TypeHelpers.PRIMATIVES.NUMBER,
      "",
      `size="${SecurityHelpers.sanitiseHTML(props.size)}"`
    );

    // label
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "label",
      TypeHelpers.PRIMATIVES.STRING,
      undefined,
      SecurityHelpers.sanitiseHTML(props.label)
    );

    // error
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "error",
      TypeHelpers.PRIMATIVES.STRING,
      undefined,
      SecurityHelpers.sanitiseHTML(props.error)
    );
  }
}

// Password Input
function PasswordInput(props) {
  try {
    props === undefined ? (props = {}) : null;
    if (typeof props === "object" || props instanceof Object) {
      props instanceof PASSWORD_INPUT_PROPERTIES
        ? (this.props = props)
        : (this.props = new PASSWORD_INPUT_PROPERTIES(props));
      const inputId = (this.props.id == "") ? `id="${RandomHelpers.randomId("in_", 5)}"` : this.props.id;
      this.props.styleList.push(
        this.props.error
          ? `
            border-color: ${THEME_COLORS.DANGER};
            color: ${THEME_COLORS.DANGER};
          `
          : null
      );
      return (
        `${(this.props.label || this.props.error) ? `<div>` : ""}
          ${this.props.label ? `<label for="${inputId}">${this.props.label}</label>` : ""}
          <input type="password" ${StringHelpers.combineStrings([
            inputId, 
            this.props.class,
            this.props.title,
            this.props.language,
            this.props.direction,
            this.props.tabIndex,
            this.props.autocomplete,
            this.props.autofocus,
            this.props.disabled,
            this.props.form,
            this.props.name,
            this.props.type,
            this.props.value,
            this.props.maxlength,
            this.props.minlength,
            this.props.pattern,
            this.props.placeholder,
            this.props.readonly,
            this.props.required,
            this.props.size,
            StyleHelpers.combineStyles(this.props.styleList, this.props.style),
          ])}>
          ${this.props.error
            ? `<div class="error" style="color: ${THEME_COLORS.DANGER}; font-size: 0.8em; margin: -6px 0 8px 4px;">${this.props.error}</div>`
            : ""}
        ${(this.props.label || this.props.error) ? `</div>` : ""}`
      );
    } else {
      throw new TypeError(`${props} on PasswordInput is not a valid Object type.`);
    }
  } catch (e) {
    console.error(e);
  }
}

// Email Input Properties
class EMAIL_INPUT_PROPERTIES extends INPUT_PROPERTIES {
  constructor(props) {
    super(props);
    // list
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "list",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      `list="${SecurityHelpers.sanitiseHTML(props.list)}"`
    );

    // maxlength
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "maxlength",
      TypeHelpers.PRIMATIVES.NUMBER,
      "",
      `maxlength="${SecurityHelpers.sanitiseHTML(props.maxlength)}"`
    );

    // minlength
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "minlength",
      TypeHelpers.PRIMATIVES.NUMBER,
      "",
      `minlength="${SecurityHelpers.sanitiseHTML(props.minlength)}"`
    );

    // multiple
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "multiple",
      TypeHelpers.PRIMATIVES.BOOLEAN,
      "",
      props.multiple ? "multiple" : ""
    );

    // pattern
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "pattern",
      TypeHelpers.PRIMATIVES.REGEX,
      "",
      `pattern="${SecurityHelpers.sanitiseHTML(props.pattern)}"`
    );

    // placeholder
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "placeholder",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      `placeholder="${SecurityHelpers.sanitiseHTML(props.placeholder)}"`
    );

    // readonly
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "readonly",
      TypeHelpers.PRIMATIVES.BOOLEAN,
      "",
      props.readonly ? "readonly" : ""
    );

    // required
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "required",
      TypeHelpers.PRIMATIVES.BOOLEAN,
      "",
      props.required ? "required" : ""
    );

    // size
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "size",
      TypeHelpers.PRIMATIVES.NUMBER,
      "",
      `size="${SecurityHelpers.sanitiseHTML(props.size)}"`
    );

    // label
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "label",
      TypeHelpers.PRIMATIVES.STRING,
      undefined,
      SecurityHelpers.sanitiseHTML(props.label)
    );

    // error
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "error",
      TypeHelpers.PRIMATIVES.STRING,
      undefined,
      SecurityHelpers.sanitiseHTML(props.error)
    );
  }
}

// Email Input
function EmailInput(props) {
  try {
    props === undefined ? (props = {}) : null;
    if (typeof props === "object" || props instanceof Object) {
      props instanceof EMAIL_INPUT_PROPERTIES
        ? (this.props = props)
        : (this.props = new EMAIL_INPUT_PROPERTIES(props));
        const inputId = (this.props.id == "") ? `id="${RandomHelpers.randomId("in_", 5)}"` : this.props.id;
      this.props.styleList.push(
        this.props.error
          ? `
            border-color: ${THEME_COLORS.DANGER};
            color: ${THEME_COLORS.DANGER};
          `
          : null
      );
      return (
        `${(this.props.label || this.props.error) ? `<div>` : ""}
          ${this.props.label ? `<label for="${inputId}">${this.props.label}</label>` : ""}
          <input type="email" ${StringHelpers.combineStrings([
            inputId, 
            this.props.class,
            this.props.title,
            this.props.language,
            this.props.direction,
            this.props.tabIndex,
            this.props.autocomplete,
            this.props.autofocus,
            this.props.disabled,
            this.props.form,
            this.props.name,
            this.props.type,
            this.props.value,
            this.props.list,
            this.props.maxlength,
            this.props.minlength,
            this.props.multiple,
            this.props.pattern,
            this.props.placeholder,
            this.props.readonly,
            this.props.required,
            this.props.size,
            StyleHelpers.combineStyles(this.props.styleList, this.props.style),
          ])}>
          ${this.props.error
            ? `<div class="error" style="color: ${THEME_COLORS.DANGER}; font-size: 0.8em; margin: -6px 0 8px 4px;">${this.props.error}</div>`
            : ""}
        ${(this.props.label || this.props.error) ? `</div>` : ""}`
      );
    } else {
      throw new TypeError(`${props} on EmailInput is not a valid Object type.`);
    }
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  BUTTON_PROPERTIES,
  Button,
  ToggleButton,
  TYPE_VALUES,
  INPUT_PROPERTIES,
  Input,
  TEXT_INPUT_PROPERTIES,
  TextInput,
  PASSWORD_INPUT_PROPERTIES,
  PasswordInput,
  EMAIL_INPUT_PROPERTIES,
  EmailInput,
  Checkbox,
  Textbox,
};
