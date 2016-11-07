
var custom = (function() {

  /**
   * Classes which our JS hooks into. Add more class names as necessary.
   * @enum
   * @private
   */
  var elementClass_ = {
    item: 'js-item',
    itemName: 'js-item-name',
    itemPrice: 'js-item-price',
    itemSalePrice: 'js-item-saleprice',
    itemRegularPrice: 'js-item-regularprice',
    itemImg: 'js-item-img',
    itemBg: 'js-item-bg'
  };

  var ITEM_BORDER_COLOR_DEFAULT = '#BDBDBD';

  /**
   * Initialization. Must be called from handleAdInitialized on each page.
   */
  function init() {
    utils.log('custom.init()');
    var data = common.getAdData();
    if (!data) return;

    // If you're not using the swipe gallery to display feed items.
    initItemsWithoutGallery_();
  }

  /**
   * Find all items used outside the gallery and initialize custom behavior.
   * @private
   */
  function initItemsWithoutGallery_() {
    // Apply settings to each item
    var items = document.querySelectorAll('.' + elementClass_.item);
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      initItemDisplay_(item);
    }
  }

  /**
   * Set the display settings for each item.
   * Add any custom functionality you need applied on load.
   * @param {Element} item Item element.
   * @private
   */
  function initItemDisplay_(item) {

    // if you're using sales prices.
    //setSalePricesDisplay_(item);

    // Set mouseout.
    itemMouseOut(item);
  }

  /**
   * Sets the 3 price elements to display correctly when using sales price.
   * Find your price elements and set into common functionality.
   * @param {Element} item Item element.
   * @private
   */
  function setSalePricesDisplay_(item) {
    // Get reference to each price element.
    var itemPrice = item.querySelector('.' + elementClass_.itemPrice);
    var itemSalePrice = item.querySelector('.' + elementClass_.itemSalePrice);
    var itemRegularPrice = item.querySelector('.' + elementClass_.itemRegularPrice);

    // Sets each item to display correct prices.
    common.displayCorrectPrices(itemPrice, itemSalePrice, itemRegularPrice);
  }

  /**
   * Custom Item Mouse Interactions. Add your own behavior.
   */

  /**
   * Custom Mouseover interaction functionality.
   * @param {Element} item
   */
  function itemMouseOver(item) {
    var adData = common.getAdData();
    var itemBg = item.querySelector('.' + elementClass_.itemBg);
    itemBg.style.borderColor = window.Formatter.toHex(adData.Design.borderColor);
  }

  /**
   * Custom Mouseout interaction functionality.
   * @param {Element} item
   */
  function itemMouseOut(item) {
    var itemBg = item.querySelector('.' + elementClass_.itemBg);
    itemBg.style.borderColor = ITEM_BORDER_COLOR_DEFAULT;
  }

  // Add any methods here which you want to be accessible from your html.
  return {
    init: init,
    itemMouseOver: itemMouseOver,
    itemMouseOut: itemMouseOut
  };

})();
