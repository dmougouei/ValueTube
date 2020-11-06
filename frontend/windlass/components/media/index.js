// Imports
const { DEFAULT_PROPERTIES } = require("../default");
const {
  SecurityHelpers,
  StringHelpers,
  StyleHelpers,
  TypeHelpers,
} = require("../../utilities").Server;

// Cross Origin Values
const CROSSORIGIN_VALUES = {
  DEFAULT: "",
  ANONYMOUS: "anonymous",
  USE_CREDENTIALS: "use-credentials",
};
Object.freeze(CROSSORIGIN_VALUES);

// Decoding Values
const DECODING_VALUES = {
  DEFAULT: "",
  SYNC: "sync",
  ASYNC: "async",
  AUTO: "auto",
};
Object.freeze(DECODING_VALUES);

// Loading Values
const LOADING_VALUES = {
  DEFAULT: "",
  EAGER: "eager",
  LAZY: "lazy",
};
Object.freeze(LOADING_VALUES);

class SIZE {
  constructor(props) {
    // mediaCondition
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "mediaCondition",
      TypeHelpers.PRIMATIVES.STRING,
      undefined,
      props.mediaCondition
    );

    // size
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "size",
      TypeHelpers.PRIMATIVES.STRING,
      undefined,
      props.size
    );
  }
}

class SRC {
  constructor(props) {
    // url
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "url",
      TypeHelpers.PRIMATIVES.STRING,
      undefined,
      props.url
    );

    // descriptor
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "descriptor",
      TypeHelpers.PRIMATIVES.STRING,
      undefined,
      props.descriptor
    );
  }
}

// Image Properties
class IMAGE_PROPERTIES extends DEFAULT_PROPERTIES {
  constructor(props) {
    super(props);
    // alt
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "alt",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      `alt="${SecurityHelpers.sanitiseHTML(props.alt)}"`
    );

    // crossorigin
    TypeHelpers.typeCheckValue(
      this,
      props,
      "crossorigin",
      CROSSORIGIN_VALUES,
      CROSSORIGIN_VALUES.DEFAULT,
      `crossorigin="${props.crossorigin}"`
    );

    // decoding
    TypeHelpers.typeCheckValue(
      this,
      props,
      "decoding",
      DECODING_VALUES,
      DECODING_VALUES.DEFAULT,
      `decoding="${props.decoding}"`
    );

    // height
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "height",
      TypeHelpers.PRIMATIVES.NUMBER,
      "",
      `height="${props.height}"`
    );

    // loading
    TypeHelpers.typeCheckValue(
      this,
      props,
      "loading",
      LOADING_VALUES,
      LOADING_VALUES.DEFAULT,
      `loading="${props.decoding}"`
    );

    // sizes
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "sizes",
      TypeHelpers.PRIMATIVES.ARRAY,
      "",
      (props.sizes) ? `sizes="${props.sizes.filter((size) => {
        const test = new SIZE(size);
        return (test instanceof SIZE) ? true : false;
      }).map((size) => {
        return [size.mediaCondition, size.size].join(" ")
      }).join()}"` : ""
    );

    // src
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "src",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      `src="${SecurityHelpers.sanitiseHTML(props.src)}"`
    );

    // srcset
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "srcset",
      TypeHelpers.PRIMATIVES.ARRAY,
      "",
      (props.srcset) ? `srcset="${props.srcset.filter((src) => {
        const test = new SRC(src);
        return (test instanceof SRC) ? true : false;
      }).map((src) => {
        return [src.url, src.descriptor].join(" ")
      }).join()}"` : ""
    );

    // width
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "width",
      TypeHelpers.PRIMATIVES.NUMBER,
      "",
      `width="${props.width}"`
    );
  }
}

// Image
function Image(props) {
  try {
    props === undefined ? (props = {}) : null;
    if (typeof props === "object" || props instanceof Object) {
      props instanceof IMAGE_PROPERTIES
        ? (this.props = props)
        : (this.props = new IMAGE_PROPERTIES(props));
      return `<img ${StringHelpers.combineStrings([
        this.props.id,
        this.props.class,
        this.props.title,
        this.props.language,
        this.props.direction,
        this.props.tabIndex,
        this.props.alt,
        this.props.crossorigin,
        this.props.decoding,
        this.props.height,
        this.props.loading,
        this.props.sizes,
        this.props.src,
        this.props.srcset,
        this.props.width,
        this.props.onclick,
        StyleHelpers.combineStyles(this.props.styleList, this.props.style),
      ])} />`;
    } else {
      throw new TypeError(`${props} on Image is not a valid Object type.`);
    }
  } catch (e) {
    console.error(e);
  }
}

const PRELOAD_VALUES = {
  DEFAULT: "",
  NONE: "none",
  METADATA: "metadata",
  AUTO: "auto"
}
Object.freeze(PRELOAD_VALUES);


// Video Properties
class VIDEO_PROPERTIES extends DEFAULT_PROPERTIES {
  constructor(props) {
    super(props);
    // autoplay
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "autoplay",
      TypeHelpers.PRIMATIVES.BOOLEAN,
      "",
      props.autoplay ? "autoplay" : ""
    );

    // controls
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "controls",
      TypeHelpers.PRIMATIVES.BOOLEAN,
      "",
      props.controls ? "controls" : ""
    );

    // crossorigin
    TypeHelpers.typeCheckValue(
      this,
      props,
      "crossorigin",
      CROSSORIGIN_VALUES,
      CROSSORIGIN_VALUES.DEFAULT,
      `crossorigin="${props.crossorigin}"`
    );

    // height
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "height",
      TypeHelpers.PRIMATIVES.NUMBER,
      "",
      `height="${props.height}"`
    );

    // loop
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "loop",
      TypeHelpers.PRIMATIVES.BOOLEAN,
      "",
      props.loop ? "loop" : ""
    );

    // muted
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "muted",
      TypeHelpers.PRIMATIVES.BOOLEAN,
      "",
      props.muted ? "muted" : ""
    );

    // playsinline
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "playsinline",
      TypeHelpers.PRIMATIVES.BOOLEAN,
      "",
      props.playsinline ? "playsinline" : ""
    );

    // poster
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "poster",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      `poster="${SecurityHelpers.sanitiseHTML(props.poster)}"`
    );

    // preload
    TypeHelpers.typeCheckValue(
      this,
      props,
      "preload",
      PRELOAD_VALUES,
      PRELOAD_VALUES.DEFAULT,
      `preload="${props.preload}"`
    );

    // src
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "src",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      `src="${SecurityHelpers.sanitiseHTML(props.src)}"`
    );

    // width
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "width",
      TypeHelpers.PRIMATIVES.NUMBER,
      "",
      `width="${props.width}"`
    );
  }
}

// Video
function Video(props) {
  try {
    props === undefined ? (props = {}) : null;
    if (typeof props === "object" || props instanceof Object) {
      props instanceof VIDEO_PROPERTIES
        ? (this.props = props)
        : (this.props = new VIDEO_PROPERTIES(props));
      return `<video ${StringHelpers.combineStrings([
        this.props.id,
        this.props.class,
        this.props.title,
        this.props.language,
        this.props.direction,
        this.props.tabIndex,
        this.props.autoplay,
        this.props.controls,
        this.props.crossorigin,
        this.props.height,
        this.props.loop,
        this.props.muted,
        this.props.playsinline,
        this.props.poster,
        this.props.preload,
        this.props.src,
        this.props.width,
        StyleHelpers.combineStyles(this.props.styleList, this.props.style),
      ])}>${this.props.content}</video>`;
    } else {
      throw new TypeError(`${props} on Image is not a valid Object type.`);
    }
  } catch (e) {
    console.error(e);
  }
}

// Export Media
const Media = {
    CROSSORIGIN_VALUES,
    DECODING_VALUES,
    LOADING_VALUES,
    SIZE,
    SRC,
    IMAGE_PROPERTIES,
    Image,
    PRELOAD_VALUES,
    VIDEO_PROPERTIES,
    Video,
};

module.exports = Media;
