class NodeUtils {
  /**
   * Get the XPath of a node within its hierarchy
   * 
   * @static
   * @param {Object} node - node to process within its owner document
   * @returns {string} xpath of node, or empty string if no tests could be identified
   * @memberof RangeUtils
   */
  static path(node) {
    let tests = []

    for (; node && (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE); node = node.parentNode) {
      let predicates = []

      let test = (() => {
        switch (node.nodeType) {
          case Node.ELEMENT_NODE:
            return node.nodeName.toLowerCase()
          case Node.TEXT_NODE:
            return 'text()'
        }
      })()

      if (node.nodeType === Node.ELEMENT_NODE && node.id.length > 0) {
        if (node.ownerDocument.querySelectorAll(`#${node.id}`).length === 1) {
          tests.unshift(`/${test}[@id="${node.id}"]`)
          break
        }

        if (node.parentElement && !Array.prototype.slice
          .call(node.parentElement.children)
          .some(sibling => sibling !== node && sibling.id === node.id)) {
          predicates.push(`@id="${node.id}"`)
        }
      }

      if (predicates.length === 0) {
        let index = 1

        for (let sibling = node.previousSibling; sibling; sibling = sibling.previousSibling) {
          if (sibling.nodeType === Node.DOCUMENT_TYPE_NODE ||
            node.nodeType !== sibling.nodeType ||
            sibling.nodeName !== node.nodeName) {
            continue
          }

          index++
        }

        if (index > 1) {
          predicates.push(`${index}`)
        }
      }

      tests.unshift(test + predicates.map(p => `[${p}]`).join(''))
    }

    return tests.length === 0 ? "" : `/${tests.join('/')}`
  }
}

class RangeUtils {
  /**
   * Convert a Range object to a XRange object
   * 
   * @static
   * @param {Range} range range to process
   * @returns {Object} as `Range`, but container identified by XPath
   * @memberof RangeUtils
   */
  static toObject(range) {
    return {
      startContainerPath: NodeUtils.path(range.startContainer),
      startOffset: range.startOffset,
      endContainerPath: NodeUtils.path(range.endContainer),
      endOffset: range.endOffset,
      collapsed: range.collapsed,
    }
  }

  /**
   * Convert XRange object into a Range object in a document
   * 
   * @static
   * @param {Object} object - XRange object to parse
   * @param {Object} [document=window.document] - document from which to create the Range
   * @returns {Range} - Parsed range object, or null on error
   * @memberof RangeUtils
   */
  static toRange(object, document = window.document) {
    let endContainer, endOffset
    const evaluator = new XPathEvaluator()

    const startContainer = evaluator.evaluate(
      object.startContainerPath,
      document.documentElement,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    )

    if (!startContainer.singleNodeValue) {
      return null
    }

    if (object.collapsed || !object.endContainerPath) {
      endContainer = startContainer
      endOffset = object.startOffset
    } else {
      endContainer = evaluator.evaluate(
        object.endContainerPath,
        document.documentElement,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      )

      if (!endContainer.singleNodeValue) {
        return null
      }

      endOffset = object.endOffset
    }

    const range = document.createRange()

    range.setStart(startContainer.singleNodeValue, object.startOffset)
    range.setEnd(endContainer.singleNodeValue, endOffset)

    return range
  }
}