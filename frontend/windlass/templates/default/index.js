/*  ---------------------------------------------------------------------------
 *    Windlass v1.0.0 - Default Template
 *
 *    Copyright 2020 Timothy Martin
 *    Licensed under MIT (https://github.com/Niten001/windlass/blob/master/LICENSE)
 *  ---------------------------------------------------------------------------  */

const { SecurityHelpers, TypeHelpers } = require("../../utilities").Server;

class DEFAULT_TEMPLATE_PROPERTIES {
  constructor(props) {
    // content
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "content",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      String.raw`${props.content}`
    );

    // description
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "description",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      SecurityHelpers.sanitiseHTML(props.description)
    );

    // head
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "head",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      SecurityHelpers.sanitiseHTML(props.head)
    );

    // icon
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "icon",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      SecurityHelpers.sanitiseHTML(props.icon)
    );

    // inlineStylesheet
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "inlineStylesheet",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      props.inlineStylesheet ? SecurityHelpers.sanitiseHTML(
        SecurityHelpers.sanitiseCSS(`<style>${props.inlineStylesheet}</style>`)
      ) : ""
    );

    // lang
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "lang",
      TypeHelpers.PRIMATIVES.STRING,
      "en",
      SecurityHelpers.sanitiseHTML(props.lang)
    );

    // linkedScripts
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "linkedScripts",
      TypeHelpers.PRIMATIVES.ARRAY,
      "",
      props.linkedScripts
    );

    // linkedStylesheets
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "linkedStylesheets",
      TypeHelpers.PRIMATIVES.ARRAY,
      "",
      props.linkedStylesheets
    );

    // title
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "title",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      SecurityHelpers.sanitiseHTML(props.title)
    );
  }
}

function DefaultTemplate(props) {
  try {
    if (typeof props === "object" || props instanceof Object) {
      props instanceof DEFAULT_TEMPLATE_PROPERTIES
        ? (this.props = props)
        : (this.props = new DEFAULT_TEMPLATE_PROPERTIES(props));
      return `
        <!DOCTYPE html>
        <html lang="${this.props.lang}">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content="${this.props.description}" />
                <meta name="title" content="${this.props.title}" />
                <title>${this.props.title}</title>
                <link rel="icon" href="${this.props.icon}" />
                ${
                  this.props.linkedStylesheets
                    ? this.props.linkedStylesheets
                        .map((url) => {
                          return `<link rel="stylesheet" type="text/css" href="${SecurityHelpers.sanitiseHTML(
                            url
                          )}" media="print" onload="this.media='all'"></link>`;
                        })
                        .join("\n")
                    : ``
                }
                ${this.props.inlineStylesheet}
                ${this.props.head}
            </head>
            <body>
              ${this.props.content}
              ${
                this.props.linkedScripts
                  ? this.props.linkedScripts
                      .map((url) => {
                        return `<script type="module" src="${SecurityHelpers.sanitiseHTML(
                          url
                        )}"></script>`;
                      })
                      .join("\n")
                  : ``
              }
            </body>
        </html>
      `;
    } else {
      throw new TypeError(`${props} on Text is not a valid Object type.`);
    }
  } catch (e) {
    console.error(e);
  }
}

const Default = {
  DEFAULT_TEMPLATE_PROPERTIES,
  DefaultTemplate,
};

module.exports = Default;
