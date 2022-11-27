/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  // throw new Error('Not implemented');

  this.width = width;
  this.height = height;
  this.getArea = function () {
    return this.width * this.height;
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  // throw new Error('Not implemented');
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  // throw new Error('Not implemented');
  const descriptor = JSON.parse(json);
  return Object.create(proto, Object.getOwnPropertyDescriptors(descriptor));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class BuilderClass {
  constructor() {
    this.string = '';
    this.elementSelect = [];
    this.idSelect = [];
    this.classSelect = [];
    this.attrSelect = [];
    this.pseudoClassSelect = [];
    this.pseudoElementSelect = [];
  }

  element(value) {
    if (this.elementSelect.length !== 0) throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    if (this.elementSelect.length !== 0
      || this.idSelect.length !== 0
      || this.classSelect.length !== 0
      || this.attrSelect.length !== 0
      || this.pseudoClassSelect.length !== 0
      || this.pseudoElementSelect.length !== 0) throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.string = `${this.string}${value}`;
    this.elementSelect.push(value);
    return this;
  }

  id(value) {
    if (this.idSelect.length !== 0) throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    if (this.classSelect.length !== 0
      || this.attrSelect.length !== 0
      || this.pseudoClassSelect.length !== 0
      || this.pseudoElementSelect.length !== 0) throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.string = `${this.string}#${value}`;
    this.idSelect.push(value);
    return this;
  }

  class(value) {
    if (this.attrSelect.length !== 0
      || this.pseudoClassSelect.length !== 0
      || this.pseudoElementSelect.length !== 0) throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.string = `${this.string}.${value}`;
    this.classSelect.push(value);
    return this;
  }

  attr(value) {
    if (this.pseudoClassSelect.length !== 0
      || this.pseudoElementSelect.length !== 0) throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.string = `${this.string}[${value}]`;
    this.attrSelect.push(value);
    return this;
  }

  pseudoClass(value) {
    if (this.pseudoElementSelect.length !== 0) throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.string = `${this.string}:${value}`;
    this.pseudoClassSelect.push(value);
    return this;
  }

  pseudoElement(value) {
    if (this.pseudoElementSelect.length !== 0) throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    this.string = `${this.string}::${value}`;
    this.pseudoElementSelect.push(value);
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.string = `${this.string}${selector1.string} ${combinator} ${selector2.string}`;
    return this;
  }

  stringify() {
    return this.string;
  }
}

const cssSelectorBuilder = {

  element(value) {
    return new BuilderClass().element(value);
  },

  id(value) {
    return new BuilderClass().id(value);
  },

  class(value) {
    return new BuilderClass().class(value);
  },

  attr(value) {
    return new BuilderClass().attr(value);
  },

  pseudoClass(value) {
    return new BuilderClass().pseudoClass(value);
  },

  pseudoElement(value) {
    return new BuilderClass().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new BuilderClass().combine(selector1, combinator, selector2);
  },

  stringify() {
    return new BuilderClass().stringify();
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
