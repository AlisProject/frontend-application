/* eslint-disable */

;(function($, window, document, undefined) {
  'use strict'

  /** Default values */
  var pluginName = 'mediumInsert',
    addonName = 'Part', // first char is uppercase
    defaults = {
      label: '<span class="fa fa-ellipsis-h"></span>'
    }

  /**
   * Custom Addon object
   *
   * Sets options, variables and calls init() function
   *
   * @constructor
   * @param {DOM} el - DOM element to init the plugin on
   * @param {object} options - Options to override defaults
   * @return {void}
   */

  function CustomAddon(el, options) {
    this.el = el
    this.$el = $(el)
    this.templates = window.MediumInsert.Templates
    this.core = this.$el.data('plugin_' + pluginName)

    this.options = $.extend(true, {}, defaults, options)

    this._defaults = defaults
    this._name = pluginName

    this.init()
  }

  /**
   * Initialization
   *
   * @return {void}
   */

  CustomAddon.prototype.init = function() {
    this.events()
  }

  /**
   * Event listeners
   *
   * @return {void}
   */

  CustomAddon.prototype.events = function() {
    this.$el.on('click', `[data-addon="${addonName}"]`, () => {
      document.execCommand('insertHTML', false, '<hr><br>')
      this.core.toggleAddons()
      const $buttons = $('.medium-insert-buttons')
      const top = parseFloat($buttons.css('top'))
      $buttons.css('top', `${top + 20}px`)
    })
  }

  /**
   * Get the Core object
   *
   * @return {object} Core object
   */
  CustomAddon.prototype.getCore = function() {
    return this.core
  }

  /**
   * Add custom content
   *
   * This function is called when user click on the addon's icon
   *
   * @return {void}
   */

  CustomAddon.prototype.add = function() {}

  /** Addon initialization */

  $.fn[pluginName + addonName] = function(options) {
    return this.each(function() {
      if (!$.data(this, 'plugin_' + pluginName + addonName)) {
        $.data(this, 'plugin_' + pluginName + addonName, new CustomAddon(this, options))
      }
    })
  }
})(jQuery, window, document)
