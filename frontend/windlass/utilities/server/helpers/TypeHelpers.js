const { isValidColor } = require("../../../components/color");

// Type Check Color
function typeCheckColor(object, props, property, defaultValue, outputValue) {
  try {
    if (
      Object.entries(props).find((prop) => prop[0] === property) === undefined
    ) {
      Object.defineProperty(object, property, {
        value: defaultValue,
        enumerable: true,
        writable: true,
      });
    } else if (
      isValidColor(
        Object.entries(props).find((prop) => prop[0] === property)[1]
      )
    ) {
      Object.defineProperty(object, property, {
        value: outputValue,
        enumerable: true,
        writable: true,
      });
    } else {
      Object.defineProperty(object, property, {
        value: defaultValue,
        enumerable: true,
        writable: true,
      });
      throw new TypeError(
        `${property} on ${object.constructor.name}.${property} is not a valid COLOR type.`
      );
    }
  } catch (e) {
    console.error(e);
  }
}

const PRIMATIVES = {
  OBJECT: "object",
  BOOLEAN: "boolean",
  STRING: "string",
  ARRAY: "array",
  NUMBER: "number",
  REGEX: "regex",
  DATE: "date"
};
Object.freeze(PRIMATIVES);

// Validate Primative
function validatePrimative(property, type) {
  switch (type) {
    case "object":
      return typeof property === "object" || property instanceof Object;
    case "boolean":
      return typeof property === "boolean" || property instanceof Boolean;
    case "string":
      return typeof property === "string" || property instanceof String;
    case "array":
      return Array.isArray(property);
    case "number":
      return typeof property === "number" || property instanceof Number;
    case "regex":
      return property instanceof RegExp;
    case "date":
      return property instanceof Date;
    default:
      return false;
  }
}

// Type Check Primative
function typeCheckPrimative(
  object,
  props,
  property,
  type,
  defaultValue,
  outputValue
) {
  try {
    if (
      Object.entries(props).find((prop) => prop[0] === property) === undefined
    ) {
      Object.defineProperty(object, property, {
        value: defaultValue,
        enumerable: true,
        writable: true,
      });
    } else if (
      validatePrimative(
        Object.entries(props).find((prop) => prop[0] === property)[1],
        type
      )
    ) {
      Object.defineProperty(object, property, {
        value: outputValue,
        enumerable: true,
        writable: true,
      });
    } else {
      Object.defineProperty(object, property, {
        value: defaultValue,
        enumerable: true,
        writable: true,
      });
      throw new TypeError(
        `${property} on ${object.constructor.name}.${property} is not a valid ${type} type.`
      );
    }
  } catch (e) {
    console.error(e);
  }
}

// Type Check Value function
function typeCheckValue(
  object,
  props,
  property,
  type,
  defaultValue,
  outputValue
) {
  try {
    if (
      Object.entries(props).find((prop) => prop[0] === property) === undefined
    ) {
      Object.defineProperty(object, property, {
        value: defaultValue,
        enumerable: true,
        writable: true,
      });
    } else if (
      Object.values(type).includes(
        Object.entries(props).find((prop) => prop[0] === property)[1]
      )
    ) {
      Object.defineProperty(object, property, {
        value: outputValue,
        enumerable: true,
        writable: true,
      });
    } else {
      Object.defineProperty(object, property, {
        value: defaultValue,
        enumerable: true,
        writable: true,
      });
      throw new TypeError(
        `${property} on ${object.constructor.name}.${property} is not a valid ${type} type.`
      );
    }
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  PRIMATIVES,
  typeCheckColor,
  typeCheckPrimative,
  typeCheckValue,
};
