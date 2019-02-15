/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Construcs a new sidebar for the given editor.
 */
function Sidebar(editorUi, container) {
  this.editorUi = editorUi;
  this.container = container;
  this.palettes = new Object();
  this.taglist = new Object();
  this.showTooltips = true;
  this.graph = editorUi.createTemporaryGraph(this.editorUi.editor.graph.getStylesheet());
  this.graph.cellRenderer.antiAlias = false;
  this.graph.foldingEnabled = false;

  // Workaround for blank output in IE11-
  if (!mxClient.IS_IE && !mxClient.IS_IE11) {
    this.graph.container.style.display = 'none';
  }

  document.body.appendChild(this.graph.container);

  this.pointerUpHandler = mxUtils.bind(this, function () {
    this.showTooltips = true;
  });

  mxEvent.addListener(document, (mxClient.IS_POINTER) ? 'pointerup' : 'mouseup', this.pointerUpHandler);

  this.pointerDownHandler = mxUtils.bind(this, function () {
    this.showTooltips = false;
    this.hideTooltip();
  });

  mxEvent.addListener(document, (mxClient.IS_POINTER) ? 'pointerdown' : 'mousedown', this.pointerDownHandler);

  this.pointerMoveHandler = mxUtils.bind(this, function (evt) {
    var src = mxEvent.getSource(evt);

    while (src != null) {
      if (src == this.currentElt) {
        return;
      }

      src = src.parentNode;
    }

    this.hideTooltip();
  });

  mxEvent.addListener(document, (mxClient.IS_POINTER) ? 'pointermove' : 'mousemove', this.pointerMoveHandler);

  // Handles mouse leaving the window
  this.pointerOutHandler = mxUtils.bind(this, function (evt) {
    if (evt.toElement == null && evt.relatedTarget == null) {
      this.hideTooltip();
    }
  });

  mxEvent.addListener(document, (mxClient.IS_POINTER) ? 'pointerout' : 'mouseout', this.pointerOutHandler);

  // Enables tooltips after scroll
  mxEvent.addListener(container, 'scroll', mxUtils.bind(this, function () {
    this.showTooltips = true;
  }));

  this.init();

  // Pre-fetches tooltip image
  if (!mxClient.IS_SVG) {
    new Image().src = IMAGE_PATH + '/tooltip.png';
  }
};

/**
 * Adds all palettes to the sidebar.
 */
Sidebar.prototype.init = function () {
  var dir = STENCIL_PATH;

  // this.addSearchPalette(true);
  this.addActionPalette(true);
  this.addListenPalette(true);

};

/**
 * Sets the default font size.
 */
Sidebar.prototype.collapsedImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/collapsed.gif' : 'data:image/gif;base64,R0lGODlhDQANAIABAJmZmf///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNUQyRTJFNjZGNUYxMUU1QjZEOThCNDYxMDQ2MzNCQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNUQyRTJFNzZGNUYxMUU1QjZEOThCNDYxMDQ2MzNCQiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjFERjc3MEUxNkY1RjExRTVCNkQ5OEI0NjEwNDYzM0JCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjFERjc3MEUyNkY1RjExRTVCNkQ5OEI0NjEwNDYzM0JCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEAQAAAQAsAAAAAA0ADQAAAhSMj6lrwAjcC1GyahV+dcZJgeIIFgA7';

/**
 * Sets the default font size.
 */
Sidebar.prototype.expandedImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/expanded.gif' : 'data:image/gif;base64,R0lGODlhDQANAIABAJmZmf///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxREY3NzBERjZGNUYxMUU1QjZEOThCNDYxMDQ2MzNCQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxREY3NzBFMDZGNUYxMUU1QjZEOThCNDYxMDQ2MzNCQiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjFERjc3MERENkY1RjExRTVCNkQ5OEI0NjEwNDYzM0JCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjFERjc3MERFNkY1RjExRTVCNkQ5OEI0NjEwNDYzM0JCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEAQAAAQAsAAAAAA0ADQAAAhGMj6nL3QAjVHIu6azbvPtWAAA7';

/**
 * Sets the default font size.
 */
Sidebar.prototype.tooltipImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/tooltip.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAbCAMAAAB7jU7LAAAACVBMVEX///+ZmZn///9Y2COLAAAAA3RSTlP//wDXyg1BAAAAOElEQVR42mXQMQ4AMAgDsWv//+iutcJmIQSk+9dJpVKpVCqVSqVSqZTdncWzF8/NeP7FkxWenPEDOnUBiL3jWx0AAAAASUVORK5CYII=';

/**
 *
 */
Sidebar.prototype.searchImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/search.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAEaSURBVHjabNGxS5VxFIfxz71XaWuQUJCG/gCHhgTD9VpEETg4aMOlQRp0EoezObgcd220KQiXmpretTAHQRBdojlQEJyukPdt+b1ywfvAGc7wnHP4nlZd1yKijQW8xzNc4Su+ZOYfQ3T6/f4YNvEJYzjELXp4VVXVz263+7cR2niBxAFeZ2YPi3iHR/gYERPDwhpOsd6sz8x/mfkNG3iOlWFhFj8y89J9KvzGXER0GuEaD42mgwHqUtoljbcRsTBCeINpfM/MgZLKPpaxFxGbOCqDXmILN7hoJrTKH+axhxmcYRxP0MIDnOBDZv5q1XUNIuJxifJp+UNV7t7BFM6xeic0RMQ4Bpl5W/ol7GISx/eEUUTECrbx+f8A8xhiZht9zsgAAAAASUVORK5CYII=';

/**
 * Specifies if tooltips should be visible. Default is true.
 */
Sidebar.prototype.enableTooltips = true;

/**
 * Specifies the delay for the tooltip. Default is 16 px.
 */
Sidebar.prototype.tooltipBorder = 16;

/**
 * Specifies the delay for the tooltip. Default is 300 ms.
 */
Sidebar.prototype.tooltipDelay = 300;

/**
 * Specifies the delay for the drop target icons. Default is 200 ms.
 */
Sidebar.prototype.dropTargetDelay = 200;

/**
 * Specifies the URL of the gear image.
 */
Sidebar.prototype.gearImage = STENCIL_PATH + '/clipart/Gear_128x128.png';

/**
 * Specifies the width of the thumbnails.
 */
Sidebar.prototype.thumbWidth = 36;

/**
 * Specifies the height of the thumbnails.
 */
Sidebar.prototype.thumbHeight = 36;

/**
 * Specifies the padding for the thumbnails. Default is 3.
 */
Sidebar.prototype.thumbPadding = (document.documentMode >= 5) ? 0 : 1;

/**
 * Specifies the delay for the tooltip. Default is 2 px.
 */
Sidebar.prototype.thumbBorder = 2;

/**
 * Specifies the size of the sidebar titles.
 */
Sidebar.prototype.sidebarTitleSize = 9;

/**
 * Specifies if titles in the sidebar should be enabled.
 */
Sidebar.prototype.sidebarTitles = false;

/**
 * Specifies if titles in the tooltips should be enabled.
 */
Sidebar.prototype.tooltipTitles = true;

/**
 * Specifies if titles in the tooltips should be enabled.
 */
Sidebar.prototype.maxTooltipWidth = 400;

/**
 * Specifies if titles in the tooltips should be enabled.
 */
Sidebar.prototype.maxTooltipHeight = 400;

/**
 * Specifies if stencil files should be loaded and added to the search index
 * when stencil palettes are added. If this is false then the stencil files
 * are lazy-loaded when the palette is shown.
 */
Sidebar.prototype.addStencilsToIndex = true;

/**
 * Specifies the width for clipart images. Default is 80.
 */
Sidebar.prototype.defaultImageWidth = 80;

/**
 * Specifies the height for clipart images. Default is 80.
 */
Sidebar.prototype.defaultImageHeight = 80;

/**
 * Adds all palettes to the sidebar.
 */
Sidebar.prototype.showTooltip = function (elt, cells, w, h, title, showLabel) {
  if (this.enableTooltips && this.showTooltips) {
    if (this.currentElt != elt) {
      if (this.thread != null) {
        window.clearTimeout(this.thread);
        this.thread = null;
      }

      var show = mxUtils.bind(this, function () {
        // Lazy creation of the DOM nodes and graph instance
        if (this.tooltip == null) {
          this.tooltip = document.createElement('div');
          this.tooltip.className = 'geSidebarTooltip';
          this.tooltip.style.zIndex = mxPopupMenu.prototype.zIndex - 1;
          document.body.appendChild(this.tooltip);

          this.graph2 = new Graph(this.tooltip, null, null, this.editorUi.editor.graph.getStylesheet());
          this.graph2.resetViewOnRootChange = false;
          this.graph2.foldingEnabled = false;
          this.graph2.gridEnabled = false;
          this.graph2.autoScroll = false;
          this.graph2.setTooltips(false);
          this.graph2.setConnectable(false);
          this.graph2.setEnabled(false);

          if (!mxClient.IS_SVG) {
            this.graph2.view.canvas.style.position = 'relative';
          }

          this.tooltipImage = mxUtils.createImage(this.tooltipImage);
          this.tooltipImage.className = 'geSidebarTooltipImage';
          this.tooltipImage.style.zIndex = mxPopupMenu.prototype.zIndex - 1;
          this.tooltipImage.style.position = 'absolute';
          this.tooltipImage.style.width = '14px';
          this.tooltipImage.style.height = '27px';

          document.body.appendChild(this.tooltipImage);
        }

        this.graph2.model.clear();
        this.graph2.view.setTranslate(this.tooltipBorder, this.tooltipBorder);

        if (w > this.maxTooltipWidth || h > this.maxTooltipHeight) {
          this.graph2.view.scale = Math.round(Math.min(this.maxTooltipWidth / w, this.maxTooltipHeight / h) * 100) / 100;
        }
        else {
          this.graph2.view.scale = 1;
        }

        this.tooltip.style.display = 'block';
        this.graph2.labelsVisible = (showLabel == null || showLabel);
        var fo = mxClient.NO_FO;
        mxClient.NO_FO = Editor.prototype.originalNoForeignObject;
        this.graph2.addCells(cells);
        mxClient.NO_FO = fo;

        var bounds = this.graph2.getGraphBounds();
        var width = bounds.width + 2 * this.tooltipBorder + 4;
        var height = bounds.height + 2 * this.tooltipBorder;

        if (mxClient.IS_QUIRKS) {
          height += 4;
          this.tooltip.style.overflow = 'hidden';
        }
        else {
          this.tooltip.style.overflow = 'visible';
        }

        this.tooltipImage.style.visibility = 'visible';
        this.tooltip.style.width = width + 'px';

        // Adds title for entry
        if (this.tooltipTitles && title != null && title.length > 0) {
          if (this.tooltipTitle == null) {
            this.tooltipTitle = document.createElement('div');
            this.tooltipTitle.style.borderTop = '1px solid gray';
            this.tooltipTitle.style.textAlign = 'center';
            this.tooltipTitle.style.width = '100%';

            // Oversize titles are cut-off currently. Should make tooltip wider later.
            this.tooltipTitle.style.overflow = 'hidden';

            if (mxClient.IS_SVG) {
              this.tooltipTitle.style.paddingTop = '6px';
            }
            else {
              this.tooltipTitle.style.position = 'absolute';
              this.tooltipTitle.style.paddingTop = '6px';
            }

            this.tooltip.appendChild(this.tooltipTitle);
          }
          else {
            this.tooltipTitle.innerHTML = '';
          }

          this.tooltipTitle.style.display = '';
          mxUtils.write(this.tooltipTitle, title);

          var ddy = this.tooltipTitle.offsetHeight + 10;
          height += ddy;

          if (mxClient.IS_SVG) {
            this.tooltipTitle.style.marginTop = (2 - ddy) + 'px';
          }
          else {
            height -= 6;
            this.tooltipTitle.style.top = (height - ddy) + 'px';
          }
        }
        else if (this.tooltipTitle != null && this.tooltipTitle.parentNode != null) {
          this.tooltipTitle.style.display = 'none';
        }

        this.tooltip.style.height = height + 'px';
        var x0 = -Math.round(bounds.x - this.tooltipBorder);
        var y0 = -Math.round(bounds.y - this.tooltipBorder);

        var b = document.body;
        var d = document.documentElement;
        var bottom = Math.max(b.clientHeight || 0, d.clientHeight);

        var left = this.container.clientWidth + this.editorUi.splitSize + 3 + this.editorUi.container.offsetLeft;
        var top = Math.min(bottom - height - 20 /*status bar*/, Math.max(0, (this.editorUi.container.offsetTop +
          this.container.offsetTop + elt.offsetTop - this.container.scrollTop - height / 2 + 16)));

        if (mxClient.IS_SVG) {
          if (x0 != 0 || y0 != 0) {
            this.graph2.view.canvas.setAttribute('transform', 'translate(' + x0 + ',' + y0 + ')');
          }
          else {
            this.graph2.view.canvas.removeAttribute('transform');
          }
        }
        else {
          this.graph2.view.drawPane.style.left = x0 + 'px';
          this.graph2.view.drawPane.style.top = y0 + 'px';
        }

        // Workaround for ignored position CSS style in IE9
        // (changes to relative without the following line)
        this.tooltip.style.position = 'absolute';
        this.tooltip.style.left = left + 'px';
        this.tooltip.style.top = top + 'px';
        this.tooltipImage.style.left = (left - 13) + 'px';
        this.tooltipImage.style.top = (top + height / 2 - 13) + 'px';
      });

      if (this.tooltip != null && this.tooltip.style.display != 'none') {
        show();
      }
      else {
        this.thread = window.setTimeout(show, this.tooltipDelay);
      }

      this.currentElt = elt;
    }
  }
};

/**
 * Hides the current tooltip.
 */
Sidebar.prototype.hideTooltip = function () {
  if (this.thread != null) {
    window.clearTimeout(this.thread);
    this.thread = null;
  }

  if (this.tooltip != null) {
    this.tooltip.style.display = 'none';
    this.tooltipImage.style.visibility = 'hidden';
    this.currentElt = null;
  }
};

/**
 * Hides the current tooltip.
 */
Sidebar.prototype.addEntry = function (tags, fn) {
  if (this.taglist != null && tags != null && tags.length > 0) {
    // Replaces special characters
    var tmp = tags.toLowerCase().replace(/[\/\,\(\)]/g, ' ').split(' ');

    var doAddEntry = mxUtils.bind(this, function (tag) {
      if (tag.length > 1) {
        var entry = this.taglist[tag];

        if (typeof entry !== 'object') {
          entry = {entries: [], dict: new mxDictionary()};
          this.taglist[tag] = entry;
        }

        // Ignores duplicates
        if (entry.dict.get(fn) == null) {
          entry.dict.put(fn, fn);
          entry.entries.push(fn);
        }
      }
    });

    for (var i = 0; i < tmp.length; i++) {
      doAddEntry(tmp[i]);

      // Adds additional entry with removed trailing numbers
      var normalized = tmp[i].replace(/\.*\d*$/, '');

      if (normalized != tmp[i]) {
        doAddEntry(normalized);
      }
    }
  }

  return fn;
};

/**
 * Adds shape search UI.
 */
Sidebar.prototype.searchEntries = function (searchTerms, count, page, success, error) {
  if (this.taglist != null && searchTerms != null) {
    var tmp = searchTerms.toLowerCase().split(' ');
    var dict = new mxDictionary();
    var max = (page + 1) * count;
    var results = [];
    var index = 0;

    for (var i = 0; i < tmp.length; i++) {
      if (tmp[i].length > 0) {
        var entry = this.taglist[tmp[i]];
        var tmpDict = new mxDictionary();

        if (entry != null) {
          var arr = entry.entries;
          results = [];

          for (var j = 0; j < arr.length; j++) {
            var entry = arr[j];

            // NOTE Array does not contain duplicates
            if ((index == 0) == (dict.get(entry) == null)) {
              tmpDict.put(entry, entry);
              results.push(entry);

              if (i == tmp.length - 1 && results.length == max) {
                success(results.slice(page * count, max), max, true, tmp);

                return;
              }
            }
          }
        }
        else {
          results = [];
        }

        dict = tmpDict;
        index++;
      }
    }

    var len = results.length;
    success(results.slice(page * count, (page + 1) * count), len, false, tmp);
  }
  else {
    success([], null, null, tmp);
  }
};

/**
 * Adds shape search UI.
 */
Sidebar.prototype.filterTags = function (tags) {
  if (tags != null) {
    var arr = tags.split(' ');
    var result = [];
    var hash = {};

    // Ignores tags with leading numbers, strips trailing numbers
    for (var i = 0; i < arr.length; i++) {
      // Removes duplicates
      if (hash[arr[i]] == null) {
        hash[arr[i]] = '1';
        result.push(arr[i]);
      }
    }

    return result.join(' ');
  }

  return null;
};

/**
 * Adds the general palette to the sidebar.
 */
Sidebar.prototype.cloneCell = function (cell, value) {
  var clone = cell.clone();

  if (value != null) {
    clone.value = value;
  }

  return clone;
};

/**
 * Adds shape search UI.
 */
Sidebar.prototype.addSearchPalette = function (expand) {
  var elt = document.createElement('div');
  elt.style.visibility = 'hidden';
  this.container.appendChild(elt);

  var div = document.createElement('div');
  div.className = 'geSidebar';
  div.style.boxSizing = 'border-box';
  div.style.overflow = 'hidden';
  div.style.width = '100%';
  div.style.padding = '8px';
  div.style.paddingTop = '14px';
  div.style.paddingBottom = '0px';

  if (!expand) {
    div.style.display = 'none';
  }

  var inner = document.createElement('div');
  inner.style.whiteSpace = 'nowrap';
  inner.style.textOverflow = 'clip';
  inner.style.paddingBottom = '8px';
  inner.style.cursor = 'default';

  var input = document.createElement('input');
  input.setAttribute('placeholder', mxResources.get('searchShapes'));
  input.setAttribute('type', 'text');
  input.style.fontSize = '12px';
  input.style.overflow = 'hidden';
  input.style.boxSizing = 'border-box';
  input.style.border = 'solid 1px #d5d5d5';
  input.style.borderRadius = '4px';
  input.style.width = '100%';
  input.style.outline = 'none';
  input.style.padding = '6px';
  inner.appendChild(input);

  var cross = document.createElement('img');
  cross.setAttribute('src', Sidebar.prototype.searchImage);
  cross.setAttribute('title', mxResources.get('search'));
  cross.style.position = 'relative';
  cross.style.left = '-18px';

  if (mxClient.IS_QUIRKS) {
    input.style.height = '28px';
    cross.style.top = '-4px';
  }
  else {
    cross.style.top = '1px';
  }

  // Needed to block event transparency in IE
  cross.style.background = 'url(\'' + this.editorUi.editor.transparentImage + '\')';

  var find;

  inner.appendChild(cross);
  div.appendChild(inner);

  var center = document.createElement('center');
  var button = mxUtils.button(mxResources.get('moreResults'), function () {
    find();
  });
  button.style.display = 'none';

  // Workaround for inherited line-height in quirks mode
  button.style.lineHeight = 'normal';
  button.style.marginTop = '4px';
  button.style.marginBottom = '8px';
  center.style.paddingTop = '4px';
  center.style.paddingBottom = '8px';

  center.appendChild(button);
  div.appendChild(center);

  var searchTerm = '';
  var active = false;
  var complete = false;
  var page = 0;
  var hash = new Object();

  // Count is dynamically updated below
  var count = 12;

  var clearDiv = mxUtils.bind(this, function () {
    active = false;
    this.currentSearch = null;
    var child = div.firstChild;

    while (child != null) {
      var next = child.nextSibling;

      if (child != inner && child != center) {
        child.parentNode.removeChild(child);
      }

      child = next;
    }
  });

  mxEvent.addListener(cross, 'click', function () {
    if (cross.getAttribute('src') == Dialog.prototype.closeImage) {
      cross.setAttribute('src', Sidebar.prototype.searchImage);
      cross.setAttribute('title', mxResources.get('search'));
      button.style.display = 'none';
      input.value = '';
      searchTerm = '';
      clearDiv();
    }

    input.focus();
  });

  find = mxUtils.bind(this, function () {
    // Shows 4 rows (minimum 4 results)
    count = 4 * Math.max(1, Math.floor(this.container.clientWidth / (this.thumbWidth + 10)));
    this.hideTooltip();

    if (input.value != '') {
      if (center.parentNode != null) {
        if (searchTerm != input.value) {
          clearDiv();
          searchTerm = input.value;
          hash = new Object();
          complete = false;
          page = 0;
        }

        if (!active && !complete) {
          button.setAttribute('disabled', 'true');
          button.style.display = '';
          button.style.cursor = 'wait';
          button.innerHTML = mxResources.get('loading') + '...';
          active = true;

          // Ignores old results
          var current = new Object();
          this.currentSearch = current;

          this.searchEntries(searchTerm, count, page, mxUtils.bind(this, function (results, len, more, terms) {
            if (this.currentSearch == current) {
              results = (results != null) ? results : [];
              active = false;
              page++;
              center.parentNode.removeChild(center);
              this.insertSearchHint(div, searchTerm, count, page, results, len, more, terms);

              for (var i = 0; i < results.length; i++) {
                var elt = results[i]();

                // Avoids duplicates in results
                if (hash[elt.innerHTML] == null) {
                  hash[elt.innerHTML] = '1';
                  div.appendChild(results[i]());
                }
              }

              if (more) {
                button.removeAttribute('disabled');
                button.innerHTML = mxResources.get('moreResults');
              }
              else {
                button.innerHTML = mxResources.get('reset');
                button.style.display = 'none';
                complete = true;
              }

              button.style.cursor = '';
              div.appendChild(center);
            }
          }), mxUtils.bind(this, function () {
            // TODO: Error handling
            button.style.cursor = '';
          }));
        }
      }
    }
    else {
      clearDiv();
      input.value = '';
      searchTerm = '';
      hash = new Object();
      button.style.display = 'none';
      complete = false;
      input.focus();
    }
  });

  mxEvent.addListener(input, 'keydown', mxUtils.bind(this, function (evt) {
    if (evt.keyCode == 13 /* Enter */) {
      find();
    }
  }));

  mxEvent.addListener(input, 'focus', function () {
    input.style.paddingRight = '';
  });

  mxEvent.addListener(input, 'blur', function () {
    input.style.paddingRight = '20px';
  });

  input.style.paddingRight = '20px';

  mxEvent.addListener(input, 'keyup', mxUtils.bind(this, function (evt) {
    if (input.value == '') {
      cross.setAttribute('src', Sidebar.prototype.searchImage);
      cross.setAttribute('title', mxResources.get('search'));
    }
    else {
      cross.setAttribute('src', Dialog.prototype.closeImage);
      cross.setAttribute('title', mxResources.get('reset'));
    }

    if (input.value == '') {
      complete = true;
      button.style.display = 'none';
    }
    else if (input.value != searchTerm) {
      button.style.display = 'none';
      complete = false;
    }
    else if (!active) {
      if (complete) {
        button.style.display = 'none';
      }
      else {
        button.style.display = '';
      }
    }
  }));

  // Workaround for blocked text selection in Editor
  mxEvent.addListener(input, 'mousedown', function (evt) {
    if (evt.stopPropagation) {
      evt.stopPropagation();
    }

    evt.cancelBubble = true;
  });

  // Workaround for blocked text selection in Editor
  mxEvent.addListener(input, 'selectstart', function (evt) {
    if (evt.stopPropagation) {
      evt.stopPropagation();
    }

    evt.cancelBubble = true;
  });

  var outer = document.createElement('div');
  outer.appendChild(div);
  this.container.appendChild(outer);

  // Keeps references to the DOM nodes
  this.palettes['search'] = [elt, outer];
};

/**
 * Adds the general palette to the sidebar.
 */
Sidebar.prototype.insertSearchHint = function (div, searchTerm, count, page, results, len, more, terms) {
  if (results.length == 0 && page == 1) {
    var err = document.createElement('div');
    err.className = 'geTitle';
    err.style.cssText = 'background-color:transparent;border-color:transparent;' +
      'color:gray;padding:6px 0px 0px 0px !important;margin:4px 8px 4px 8px;' +
      'text-align:center;cursor:default !important';

    mxUtils.write(err, mxResources.get('noResultsFor', [searchTerm]));
    div.appendChild(err);
  }
};

Sidebar.prototype.getActionPalette = function (paleteeName) {
  var actionPalette = {
    'Whatssapp': this.createVertexTemplateEntry('text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;', 120, 60, '<div><img src="https://vignette.wikia.nocookie.net/logopedia/images/c/ce/WhatsApp_Icon.png/revision/latest?cb=20150305081843" style="height: 60px;width: 100px" title="Whatssap"></div>'
      , 'Whatssapp', null, null, 'Whatssapp', 'action'),
    'Email': this.createVertexTemplateEntry('text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;', 120, 60, '<div><img src="https://us.123rf.com/450wm/jovanas/jovanas1603/jovanas160300244/53038597-black-email-icon.jpg?ver=6" style="height: 60px;width: 100px" title="Email"></div>'
      , 'send_mail', null, null, 'send_mail', 'action'),
    'Send Weekly Tasks': this.createVertexTemplateEntry('text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;', 120, 60, '<div><img src="https://cdn4.iconfinder.com/data/icons/medical-icons-rounded-vector/1250/path_appointment-512.png" style="height: 60px;width: 100px" title="Send Weekly Tasks"></div>'
      , 'Send Weekly Tasks', null, null, 'Send Weekly Tasks', 'Send Weekly Tasks'),
  };

  return actionPalette[paleteeName];
};

Sidebar.prototype.getListenPalette = function (paleteeName) {
  var actionPalette = {
    'Whatssapp': this.createVertexTemplateEntry('text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;', 120, 60, '<div><img src="https://vignette.wikia.nocookie.net/logopedia/images/c/ce/WhatsApp_Icon.png/revision/latest?cb=20150305081843" style="height: 60px;width: 100px" title="Whatssap"></div>'
      , 'Whatssapp', null, null, 'Whatssapp', 'listen'),
    'Forum Message': this.createVertexTemplateEntry('text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;', 120, 60, '<div><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUs_xD2C26Ygv6bP5wHE58ThS5Tmr_AbUknarN9sOwQUVZIDI_2Q" style="height: 60px;width: 100px" title="Forum Message"></div>'
      , 'Forum Message', null, null, 'Forum Message', 'listen'),
    'Reception Hours': this.createVertexTemplateEntry('text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;', 120, 60, '<div><img src="https://cdn1.vectorstock.com/i/1000x1000/59/40/customer-service-desk-icon-reception-symbol-vector-21095940.jpg" style="height: 60px;width: 100px" title="Reception Hours"></div>'
      , 'Reception Hours', null, null, 'Reception Hours', 'listen'),
    'Email': this.createVertexTemplateEntry('text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;', 120, 60, '<div><img src="https://us.123rf.com/450wm/jovanas/jovanas1603/jovanas160300244/53038597-black-email-icon.jpg?ver=6" style="height: 60px;width: 100px" title="Email"></div>'
      , 'Email', null, null, 'Email', 'listen'),
    'Homework Checked': this.createVertexTemplateEntry('text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;', 120, 60, '<div><img src="https://cdn3.iconfinder.com/data/icons/education/512/Test-512.png" style="height: 60px;width: 100px" title="Homework Checked"></div>'
      , 'Homework Checked', null, null, 'Homework Checked', 'listen'),
    'Exam Checked': this.createVertexTemplateEntry('text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;', 120, 60, '<div><img src="https://png.icons8.com/metro/1600/exam.png" style="height: 60px;width: 100px" title="Exam Checked"></div>'
      , 'Exam Checked', null, null, 'Exam Checked', 'listen'),
    'File Upload': this.createVertexTemplateEntry('text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;', 120, 60, '<div><img src="https://cdn3.iconfinder.com/data/icons/web-document-icons/512/Upload_Document-512.png" style="height: 60px;width: 100px" title="File Upload"></div>'
      , 'File Upload', null, null, 'File Upload', 'listen'),
    'Video Upload': this.createVertexTemplateEntry('text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;', 120, 60, '<div><img src="https://static.thenounproject.com/png/381172-200.png" style="height: 60px;width: 100px" title="Video Upload"></div>'
      , 'Video Upload', null, null, 'Video Upload', 'listen'),
    'Task Upload': this.createVertexTemplateEntry('text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;', 120, 60, '<div><img src="https://www.freeiconspng.com/uploads/tasks-icon-14.png" style="height: 60px;width: 100px" title="Task Upload"></div>'
      , 'Task Upload', null, null, 'Task Upload', 'listen'),
    'Reached Date': this.createVertexTemplateEntry('text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;', 120, 60, '<div><img src="https://png.icons8.com/metro/1600/calendar-7.png" style="height: 60px;width: 100px" title="Reached Date"></div>'
      , 'Reached Date', null, null, 'Reached Date', 'listen'),
  };

  return actionPalette[paleteeName];
};

/**
 * Adds the action palette to the sidebar.
 */
Sidebar.prototype.addActionPalette = function (expand) {
  var fns = [
    this.getActionPalette('Whatssapp'),
    this.getActionPalette('Email'),
    this.getActionPalette('Send Weekly Tasks'),
  ];

  this.addPaletteFunctions('action', 'Action', (expand != null) ? expand : true, fns);
};

/**
 * Adds the action palette to the sidebar.
 */
Sidebar.prototype.addListenPalette = function (expand) {
  var fns = [
    this.getListenPalette('Whatssapp'),
    this.getListenPalette('Forum Message'),
    this.getListenPalette('Reception Hours'),
    this.getListenPalette('Email'),
    this.getListenPalette('Homework Checked'),
    this.getListenPalette('Exam Checked'),
    this.getListenPalette('File Upload'),
    this.getListenPalette('Video Upload'),
    this.getListenPalette('Task Upload'),
    this.getListenPalette('Reached Date'),
  ];

  this.addPaletteFunctions('listen', 'Listen', (expand != null) ? expand : true, fns);
};

/**
 * Creates and returns the given title element.
 */
Sidebar.prototype.createTitle = function (label) {
  var elt = document.createElement('a');
  elt.setAttribute('href', 'javascript:void(0);');
  elt.setAttribute('title', mxResources.get('sidebarTooltip'));
  elt.className = 'geTitle';
  mxUtils.write(elt, label);

  return elt;
};

/**
 * Creates a thumbnail for the given cells.
 */
Sidebar.prototype.createThumb = function (cells, width, height, parent, title, showLabel, showTitle, realWidth, realHeight) {
  this.graph.labelsVisible = (showLabel == null || showLabel);
  var fo = mxClient.NO_FO;
  mxClient.NO_FO = Editor.prototype.originalNoForeignObject;
  this.graph.view.scaleAndTranslate(1, 0, 0);
  this.graph.addCells(cells);
  var bounds = this.graph.getGraphBounds();
  var s = Math.floor(Math.min((width - 2 * this.thumbBorder) / bounds.width,
    (height - 2 * this.thumbBorder) / bounds.height) * 100) / 100;
  this.graph.view.scaleAndTranslate(s, Math.floor((width - bounds.width * s) / 2 / s - bounds.x),
    Math.floor((height - bounds.height * s) / 2 / s - bounds.y));

  var node = null;

  // For supporting HTML labels in IE9 standards mode the container is cloned instead
  if (this.graph.dialect == mxConstants.DIALECT_SVG && !mxClient.NO_FO) {
    node = this.graph.view.getCanvas().ownerSVGElement.cloneNode(true);
  }
  // LATER: Check if deep clone can be used for quirks if container in DOM
  else {
    node = this.graph.container.cloneNode(false);
    node.innerHTML = this.graph.container.innerHTML;
  }

  this.graph.getModel().clear();
  mxClient.NO_FO = fo;

  // Catch-all event handling
  if (mxClient.IS_IE6) {
    parent.style.backgroundImage = 'url(' + this.editorUi.editor.transparentImage + ')';
  }

  node.style.position = 'relative';
  node.style.overflow = 'hidden';
  node.style.cursor = 'move';
  node.style.left = this.thumbBorder + 'px';
  node.style.top = this.thumbBorder + 'px';
  node.style.width = width + 'px';
  node.style.height = height + 'px';
  node.style.visibility = '';
  node.style.minWidth = '';
  node.style.minHeight = '';

  parent.appendChild(node);

  // Adds title for sidebar entries
  if (this.sidebarTitles && title != null && showTitle != false) {
    var border = (mxClient.IS_QUIRKS) ? 2 * this.thumbPadding + 2 : 0;
    parent.style.height = (this.thumbHeight + border + this.sidebarTitleSize + 8) + 'px';

    var div = document.createElement('div');
    div.style.fontSize = this.sidebarTitleSize + 'px';
    div.style.color = '#303030';
    div.style.textAlign = 'center';
    div.style.whiteSpace = 'nowrap';

    if (mxClient.IS_IE) {
      div.style.height = (this.sidebarTitleSize + 12) + 'px';
    }

    div.style.paddingTop = '4px';
    mxUtils.write(div, title);
    parent.appendChild(div);
  }

  return bounds;
};

/**
 * Creates and returns a new palette item for the given image.
 */
Sidebar.prototype.createItem = function (cells, title, showLabel, showTitle, width, height, allowCellsInserted) {
  var elt = document.createElement('a');
  elt.setAttribute('href', 'javascript:void(0);');
  elt.className = 'geItem';
  elt.style.overflow = 'hidden';
  var border = (mxClient.IS_QUIRKS) ? 8 + 2 * this.thumbPadding : 2 * this.thumbBorder;
  elt.style.width = (this.thumbWidth + border) + 'px';
  elt.style.height = (this.thumbHeight + border) + 'px';
  elt.style.padding = this.thumbPadding + 'px';

  if (mxClient.IS_IE6) {
    elt.style.border = 'none';
  }

  // Blocks default click action
  mxEvent.addListener(elt, 'click', function (evt) {
    mxEvent.consume(evt);
  });

  this.createThumb(cells, this.thumbWidth, this.thumbHeight, elt, title, showLabel, showTitle, width, height);
  var bounds = new mxRectangle(0, 0, width, height);

  if (cells.length > 1 || cells[0].vertex) {
    var ds = this.createDragSource(elt, this.createDropHandler(cells, true, allowCellsInserted,
      bounds), this.createDragPreview(width, height), cells, bounds);
    this.addClickHandler(elt, ds, cells);

    // Uses guides for vertices only if enabled in graph
    ds.isGuidesEnabled = mxUtils.bind(this, function () {
      return this.editorUi.editor.graph.graphHandler.guidesEnabled;
    });
  }
  else if (cells[0] != null && cells[0].edge) {
    var ds = this.createDragSource(elt, this.createDropHandler(cells, false, allowCellsInserted,
      bounds), this.createDragPreview(width, height), cells, bounds);
    this.addClickHandler(elt, ds, cells);
  }

  // Shows a tooltip with the rendered cell
  if (!mxClient.IS_IOS) {
    mxEvent.addGestureListeners(elt, null, mxUtils.bind(this, function (evt) {
      if (mxEvent.isMouseEvent(evt)) {
        this.showTooltip(elt, cells, bounds.width, bounds.height, title, showLabel);
      }
    }));
  }

  return elt;
};

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.updateShapes = function (source, targets) {
  var graph = this.editorUi.editor.graph;
  var sourceCellStyle = graph.getCellStyle(source);
  var result = [];

  graph.model.beginUpdate();
  try {
    var cellStyle = graph.getModel().getStyle(source);

    // Lists the styles to carry over from the existing shape
    var styles = ['shadow', 'dashed', 'dashPattern', 'fontFamily', 'fontSize', 'fontColor', 'align', 'startFill',
      'startSize', 'endFill', 'endSize', 'strokeColor', 'strokeWidth', 'fillColor', 'gradientColor',
      'html', 'part', 'noEdgeStyle', 'edgeStyle', 'elbow', 'childLayout'];

    for (var i = 0; i < targets.length; i++) {
      var targetCell = targets[i];

      if ((graph.getModel().isVertex(targetCell) == graph.getModel().isVertex(source)) ||
        (graph.getModel().isEdge(targetCell) == graph.getModel().isEdge(source))) {
        var state = graph.view.getState(targetCell);
        var style = (state != null) ? state.style : graph.getCellStyle(targets[i]);
        graph.getModel().setStyle(targetCell, cellStyle);

        // Removes all children of composite cells
        if (state != null && mxUtils.getValue(state.style, 'composite', '0') == '1') {
          var childCount = graph.model.getChildCount(targetCell);

          for (var j = childCount; j >= 0; j--) {
            graph.model.remove(graph.model.getChildAt(targetCell, j));
          }
        }

        if (style != null) {
          // Replaces the participant style in the lifeline shape with the target shape
          if (style[mxConstants.STYLE_SHAPE] == 'umlLifeline' &&
            sourceCellStyle[mxConstants.STYLE_SHAPE] != 'umlLifeline') {
            graph.setCellStyles(mxConstants.STYLE_SHAPE, 'umlLifeline', [targetCell]);
            graph.setCellStyles('participant', sourceCellStyle[mxConstants.STYLE_SHAPE], [targetCell]);
          }

          for (var j = 0; j < styles.length; j++) {
            var value = style[styles[j]];

            if (value != null) {
              graph.setCellStyles(styles[j], value, [targetCell]);
            }
          }
        }

        result.push(targetCell);
      }
    }
  }
  finally {
    graph.model.endUpdate();
  }

  return result;
};

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createDropHandler = function (cells, allowSplit, allowCellsInserted, bounds) {
  allowCellsInserted = (allowCellsInserted != null) ? allowCellsInserted : true;

  return mxUtils.bind(this, function (graph, evt, target, x, y) {
    if (graph.isEnabled()) {
      cells = graph.getImportableCells(cells);

      if (cells.length > 0) {
        graph.stopEditing();

        // Holding alt while mouse is released ignores drop target
        var validDropTarget = (target != null && !mxEvent.isAltDown(evt)) ?
          graph.isValidDropTarget(target, cells, evt) : false;
        var select = null;

        if (target != null && !validDropTarget) {
          target = null;
        }

        if (!graph.isCellLocked(target || graph.getDefaultParent())) {
          graph.model.beginUpdate();
          try {
            x = Math.round(x);
            y = Math.round(y);

            // Splits the target edge or inserts into target group
            if (allowSplit && graph.isSplitTarget(target, cells, evt)) {
              var clones = graph.cloneCells(cells);
              graph.splitEdge(target, clones, null,
                x - bounds.width / 2, y - bounds.height / 2);
              select = clones;
            }
            else if (cells.length > 0) {
              select = graph.importCells(cells, x, y, target);
            }

            // Executes parent layout hooks for position/order
            if (graph.layoutManager != null) {
              var layout = graph.layoutManager.getLayout(target);

              if (layout != null) {
                var s = graph.view.scale;
                var tr = graph.view.translate;
                var tx = (x + tr.x) * s;
                var ty = (y + tr.y) * s;

                for (var i = 0; i < select.length; i++) {
                  layout.moveCell(select[i], tx, ty);
                }
              }
            }

            if (allowCellsInserted) {
              graph.fireEvent(new mxEventObject('cellsInserted', 'cells', select));
            }
          }
          finally {
            graph.model.endUpdate();
          }

          if (select != null && select.length > 0) {
            graph.scrollCellToVisible(select[0]);
            graph.setSelectionCells(select);
          }
        }
      }

      mxEvent.consume(evt);
    }
  });
};

/**
 * Creates and returns a preview element for the given width and height.
 */
Sidebar.prototype.createDragPreview = function (width, height) {
  var elt = document.createElement('div');
  elt.style.border = '1px dashed black';
  elt.style.width = width + 'px';
  elt.style.height = height + 'px';

  return elt;
};

/**
 * Creates a drag source for the given element.
 */
Sidebar.prototype.dropAndConnect = function (source, targets, direction, dropCellIndex) {
  var geo = this.getDropAndConnectGeometry(source, targets[dropCellIndex], direction, targets);

  // Targets without the new edge for selection
  var tmp = [];

  if (geo != null) {
    var graph = this.editorUi.editor.graph;

    graph.model.beginUpdate();
    try {
      var sourceGeo = graph.getCellGeometry(source);
      var geo2 = graph.getCellGeometry(targets[dropCellIndex]);

      // Handles special case where target should be ignored for stack layouts
      var targetParent = graph.model.getParent(source);
      var validLayout = true;

      // Ignores parent if it has a stack layout
      if (graph.layoutManager != null) {
        var layout = graph.layoutManager.getLayout(targetParent);

        // LATER: Use parent of parent if valid layout
        if (layout != null && layout.constructor == mxStackLayout) {
          validLayout = false;

          var tmp = graph.view.getState(targetParent);

          // Offsets by parent position
          if (tmp != null) {
            var offset = new mxPoint((tmp.x / graph.view.scale - graph.view.translate.x),
              (tmp.y / graph.view.scale - graph.view.translate.y));
            geo.x += offset.x;
            geo.y += offset.y;
            var pt = geo.getTerminalPoint(false);

            if (pt != null) {
              pt.x += offset.x;
              pt.y += offset.y;
            }
          }
        }
      }

      var dx = geo2.x;
      var dy = geo2.y;

      // Ignores geometry of edges
      if (graph.model.isEdge(targets[dropCellIndex])) {
        dx = 0;
        dy = 0;
      }

      var useParent = graph.model.isEdge(source) || (sourceGeo != null && !sourceGeo.relative && validLayout);
      targets = graph.importCells(targets, (geo.x - (useParent ? dx : 0)),
        (geo.y - (useParent ? dy : 0)), (useParent) ? targetParent : null);
      tmp = targets;

      if (graph.model.isEdge(source)) {
        // Adds new terminal to edge
        // LATER: Push new terminal out radially from edge start point
        graph.model.setTerminal(source, targets[dropCellIndex], direction == mxConstants.DIRECTION_NORTH);
      }
      else if (graph.model.isEdge(targets[dropCellIndex])) {
        // Adds new outgoing connection to vertex and clears points
        graph.model.setTerminal(targets[dropCellIndex], source, true);
        var geo3 = graph.getCellGeometry(targets[dropCellIndex]);
        geo3.points = null;

        if (geo3.getTerminalPoint(false) != null) {
          geo3.setTerminalPoint(geo.getTerminalPoint(false), false);
        }
        else if (useParent && graph.model.isVertex(targetParent)) {
          // Adds parent offset to other nodes
          var tmpState = graph.view.getState(targetParent);
          var offset = new mxPoint((tmpState.x / graph.view.scale - graph.view.translate.x),
            (tmpState.y / graph.view.scale - graph.view.translate.y));
          graph.cellsMoved(targets, offset.x, offset.y, null, null, true);
        }
      }
      else {
        geo2 = graph.getCellGeometry(targets[dropCellIndex]);
        dx = geo.x - Math.round(geo2.x);
        dy = geo.y - Math.round(geo2.y);
        geo.x = Math.round(geo2.x);
        geo.y = Math.round(geo2.y);
        graph.model.setGeometry(targets[dropCellIndex], geo);
        graph.cellsMoved(targets, dx, dy, null, null, true);
        tmp = targets.slice();
        targets.push(graph.insertEdge(null, null, '', source, targets[dropCellIndex],
          graph.createCurrentEdgeStyle()));
      }

      graph.fireEvent(new mxEventObject('cellsInserted', 'cells', targets));
    }
    finally {
      graph.model.endUpdate();
    }
  }

  return tmp;
};

/**
 * Creates a drag source for the given element.
 */
Sidebar.prototype.getDropAndConnectGeometry = function (source, target, direction, targets) {
  var graph = this.editorUi.editor.graph;
  var view = graph.view;
  var keepSize = targets.length > 1;
  var geo = graph.getCellGeometry(source);
  var geo2 = graph.getCellGeometry(target);

  if (geo != null && geo2 != null) {
    geo2 = geo2.clone();

    if (graph.model.isEdge(source)) {
      var state = graph.view.getState(source);
      var pts = state.absolutePoints;
      var p0 = pts[0];
      var pe = pts[pts.length - 1];

      if (direction == mxConstants.DIRECTION_NORTH) {
        geo2.x = p0.x / view.scale - view.translate.x - geo2.width / 2;
        geo2.y = p0.y / view.scale - view.translate.y - geo2.height / 2;
      }
      else {
        geo2.x = pe.x / view.scale - view.translate.x - geo2.width / 2;
        geo2.y = pe.y / view.scale - view.translate.y - geo2.height / 2;
      }
    }
    else {
      if (geo.relative) {
        var state = graph.view.getState(source);
        geo = geo.clone();
        geo.x = (state.x - view.translate.x) / view.scale;
        geo.y = (state.y - view.translate.y) / view.scale;
      }

      var length = graph.defaultEdgeLength;

      // Maintains edge length
      if (graph.model.isEdge(target) && geo2.getTerminalPoint(true) != null && geo2.getTerminalPoint(false) != null) {
        var p0 = geo2.getTerminalPoint(true);
        var pe = geo2.getTerminalPoint(false);
        var dx = pe.x - p0.x;
        var dy = pe.y - p0.y;

        length = Math.sqrt(dx * dx + dy * dy);

        geo2.x = geo.getCenterX();
        geo2.y = geo.getCenterY();
        geo2.width = 1;
        geo2.height = 1;

        if (direction == mxConstants.DIRECTION_NORTH) {
          geo2.height = length
          geo2.y = geo.y - length;
          geo2.setTerminalPoint(new mxPoint(geo2.x, geo2.y), false);
        }
        else if (direction == mxConstants.DIRECTION_EAST) {
          geo2.width = length
          geo2.x = geo.x + geo.width;
          geo2.setTerminalPoint(new mxPoint(geo2.x + geo2.width, geo2.y), false);
        }
        else if (direction == mxConstants.DIRECTION_SOUTH) {
          geo2.height = length
          geo2.y = geo.y + geo.height;
          geo2.setTerminalPoint(new mxPoint(geo2.x, geo2.y + geo2.height), false);
        }
        else if (direction == mxConstants.DIRECTION_WEST) {
          geo2.width = length
          geo2.x = geo.x - length;
          geo2.setTerminalPoint(new mxPoint(geo2.x, geo2.y), false);
        }
      }
      else {
        // Try match size or ignore if width or height < 45 which
        // is considered special enough to be ignored here
        if (!keepSize && geo2.width > 45 && geo2.height > 45 &&
          geo.width > 45 && geo.height > 45) {
          geo2.width = geo2.width * (geo.height / geo2.height);
          geo2.height = geo.height;
        }

        geo2.x = geo.x + geo.width / 2 - geo2.width / 2;
        geo2.y = geo.y + geo.height / 2 - geo2.height / 2;

        if (direction == mxConstants.DIRECTION_NORTH) {
          geo2.y = geo2.y - geo.height / 2 - geo2.height / 2 - length;
        }
        else if (direction == mxConstants.DIRECTION_EAST) {
          geo2.x = geo2.x + geo.width / 2 + geo2.width / 2 + length;
        }
        else if (direction == mxConstants.DIRECTION_SOUTH) {
          geo2.y = geo2.y + geo.height / 2 + geo2.height / 2 + length;
        }
        else if (direction == mxConstants.DIRECTION_WEST) {
          geo2.x = geo2.x - geo.width / 2 - geo2.width / 2 - length;
        }

        // Adds offset to match cells without connecting edge
        if (graph.model.isEdge(target) && geo2.getTerminalPoint(true) != null && target.getTerminal(false) != null) {
          var targetGeo = graph.getCellGeometry(target.getTerminal(false));

          if (targetGeo != null) {
            if (direction == mxConstants.DIRECTION_NORTH) {
              geo2.x -= targetGeo.getCenterX();
              geo2.y -= targetGeo.getCenterY() + targetGeo.height / 2;
            }
            else if (direction == mxConstants.DIRECTION_EAST) {
              geo2.x -= targetGeo.getCenterX() - targetGeo.width / 2;
              geo2.y -= targetGeo.getCenterY();
            }
            else if (direction == mxConstants.DIRECTION_SOUTH) {
              geo2.x -= targetGeo.getCenterX();
              geo2.y -= targetGeo.getCenterY() - targetGeo.height / 2;
            }
            else if (direction == mxConstants.DIRECTION_WEST) {
              geo2.x -= targetGeo.getCenterX() + targetGeo.width / 2;
              geo2.y -= targetGeo.getCenterY();
            }
          }
        }
      }
    }
  }

  return geo2;
};

/**
 * Creates a drag source for the given element.
 */
Sidebar.prototype.createDragSource = function (elt, dropHandler, preview, cells, bounds) {
  // Checks if the cells contain any vertices
  var ui = this.editorUi;
  var graph = ui.editor.graph;
  var freeSourceEdge = null;
  var firstVertex = null;
  var sidebar = this;

  for (var i = 0; i < cells.length; i++) {
    if (firstVertex == null && this.editorUi.editor.graph.model.isVertex(cells[i])) {
      firstVertex = i;
    }
    else if (freeSourceEdge == null && this.editorUi.editor.graph.model.isEdge(cells[i]) &&
      this.editorUi.editor.graph.model.getTerminal(cells[i], true) == null) {
      freeSourceEdge = i;
    }

    if (firstVertex != null && freeSourceEdge != null) {
      break;
    }
  }

  var dragSource = mxUtils.makeDraggable(elt, this.editorUi.editor.graph, mxUtils.bind(this, function (graph, evt, target, x, y) {
      if (this.updateThread != null) {
        window.clearTimeout(this.updateThread);
      }

      if (cells != null && currentStyleTarget != null && activeArrow == styleTarget) {
        var tmp = graph.isCellSelected(currentStyleTarget.cell) ? graph.getSelectionCells() : [currentStyleTarget.cell];
        var updatedCells = this.updateShapes((graph.model.isEdge(currentStyleTarget.cell)) ? cells[0] : cells[firstVertex], tmp);
        graph.setSelectionCells(updatedCells);
      }
      else if (cells != null && activeArrow != null && currentTargetState != null && activeArrow != styleTarget) {
        var index = (graph.model.isEdge(currentTargetState.cell) || freeSourceEdge == null) ? firstVertex : freeSourceEdge;
        graph.setSelectionCells(this.dropAndConnect(currentTargetState.cell, cells, direction, index));
      }
      else {
        dropHandler.apply(this, arguments);
      }

      if (this.editorUi.hoverIcons != null) {
        this.editorUi.hoverIcons.update(graph.view.getState(graph.getSelectionCell()));
      }
    }),
    preview, 0, 0, this.editorUi.editor.graph.autoscroll, true, true);

  // Stops dragging if cancel is pressed
  this.editorUi.editor.graph.addListener(mxEvent.ESCAPE, function (sender, evt) {
    if (dragSource.isActive()) {
      dragSource.reset();
    }
  });

  // Overrides mouseDown to ignore popup triggers
  var mouseDown = dragSource.mouseDown;

  dragSource.mouseDown = function (evt) {
    if (!mxEvent.isPopupTrigger(evt) && !mxEvent.isMultiTouchEvent(evt)) {
      graph.stopEditing();
      mouseDown.apply(this, arguments);
    }
  };

  // Workaround for event redirection via image tag in quirks and IE8
  function createArrow(img, tooltip) {
    var arrow = null;

    if (mxClient.IS_IE && !mxClient.IS_SVG) {
      // Workaround for PNG images in IE6
      if (mxClient.IS_IE6 && document.compatMode != 'CSS1Compat') {
        arrow = document.createElement(mxClient.VML_PREFIX + ':image');
        arrow.setAttribute('src', img.src);
        arrow.style.borderStyle = 'none';
      }
      else {
        arrow = document.createElement('div');
        arrow.style.backgroundImage = 'url(' + img.src + ')';
        arrow.style.backgroundPosition = 'center';
        arrow.style.backgroundRepeat = 'no-repeat';
      }

      arrow.style.width = (img.width + 4) + 'px';
      arrow.style.height = (img.height + 4) + 'px';
      arrow.style.display = (mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
    }
    else {
      arrow = mxUtils.createImage(img.src);
      arrow.style.width = img.width + 'px';
      arrow.style.height = img.height + 'px';
    }

    if (tooltip != null) {
      arrow.setAttribute('title', tooltip);
    }

    mxUtils.setOpacity(arrow, (img == this.refreshTarget) ? 30 : 20);
    arrow.style.position = 'absolute';
    arrow.style.cursor = 'crosshair';

    return arrow;
  };

  var currentTargetState = null;
  var currentStateHandle = null;
  var currentStyleTarget = null;
  var activeTarget = false;

  var arrowUp = createArrow(this.triangleUp, mxResources.get('connect'));
  var arrowRight = createArrow(this.triangleRight, mxResources.get('connect'));
  var arrowDown = createArrow(this.triangleDown, mxResources.get('connect'));
  var arrowLeft = createArrow(this.triangleLeft, mxResources.get('connect'));
  var styleTarget = createArrow(this.refreshTarget, mxResources.get('replace'));
  // Workaround for actual parentNode not being updated in old IE
  var styleTargetParent = null;
  var roundSource = createArrow(this.roundDrop);
  var roundTarget = createArrow(this.roundDrop);
  var direction = mxConstants.DIRECTION_NORTH;
  var activeArrow = null;

  function checkArrow(x, y, bounds, arrow) {
    if (arrow.parentNode != null) {
      if (mxUtils.contains(bounds, x, y)) {
        mxUtils.setOpacity(arrow, 100);
        activeArrow = arrow;
      }
      else {
        mxUtils.setOpacity(arrow, (arrow == styleTarget) ? 30 : 20);
      }
    }

    return bounds;
  };

  // Hides guides and preview if target is active
  var dsCreatePreviewElement = dragSource.createPreviewElement;

  // Stores initial size of preview element
  dragSource.createPreviewElement = function (graph) {
    var elt = dsCreatePreviewElement.apply(this, arguments);

    // Pass-through events required to tooltip on replace shape
    if (mxClient.IS_SVG) {
      elt.style.pointerEvents = 'none';
    }

    this.previewElementWidth = elt.style.width;
    this.previewElementHeight = elt.style.height;

    return elt;
  };

  // Shows/hides hover icons
  var dragEnter = dragSource.dragEnter;
  dragSource.dragEnter = function (graph, evt) {
    if (ui.hoverIcons != null) {
      ui.hoverIcons.setDisplay('none');
    }

    dragEnter.apply(this, arguments);
  };

  var dragExit = dragSource.dragExit;
  dragSource.dragExit = function (graph, evt) {
    if (ui.hoverIcons != null) {
      ui.hoverIcons.setDisplay('');
    }

    dragExit.apply(this, arguments);
  };

  dragSource.dragOver = function (graph, evt) {
    mxDragSource.prototype.dragOver.apply(this, arguments);

    if (this.currentGuide != null && activeArrow != null) {
      this.currentGuide.hide();
    }

    if (this.previewElement != null) {
      var view = graph.view;

      if (currentStyleTarget != null && activeArrow == styleTarget) {
        this.previewElement.style.display = (graph.model.isEdge(currentStyleTarget.cell)) ? 'none' : '';

        this.previewElement.style.left = currentStyleTarget.x + 'px';
        this.previewElement.style.top = currentStyleTarget.y + 'px';
        this.previewElement.style.width = currentStyleTarget.width + 'px';
        this.previewElement.style.height = currentStyleTarget.height + 'px';
      }
      else if (currentTargetState != null && activeArrow != null) {
        var index = (graph.model.isEdge(currentTargetState.cell) || freeSourceEdge == null) ? firstVertex : freeSourceEdge;
        var geo = sidebar.getDropAndConnectGeometry(currentTargetState.cell, cells[index], direction, cells);
        var geo2 = (!graph.model.isEdge(currentTargetState.cell)) ? graph.getCellGeometry(currentTargetState.cell) : null;
        var geo3 = graph.getCellGeometry(cells[index]);
        var parent = graph.model.getParent(currentTargetState.cell);
        var dx = view.translate.x * view.scale;
        var dy = view.translate.y * view.scale;

        if (geo2 != null && !geo2.relative && graph.model.isVertex(parent)) {
          var pState = view.getState(parent);
          dx = pState.x;
          dy = pState.y;
        }

        var dx2 = geo3.x;
        var dy2 = geo3.y;

        // Ignores geometry of edges
        if (graph.model.isEdge(cells[index])) {
          dx2 = 0;
          dy2 = 0;
        }

        // Shows preview at drop location
        this.previewElement.style.left = ((geo.x - dx2) * view.scale + dx) + 'px';
        this.previewElement.style.top = ((geo.y - dy2) * view.scale + dy) + 'px';

        if (cells.length == 1) {
          this.previewElement.style.width = (geo.width * view.scale) + 'px';
          this.previewElement.style.height = (geo.height * view.scale) + 'px';
        }

        this.previewElement.style.display = '';
      }
      else if (dragSource.currentHighlight.state != null &&
        graph.model.isEdge(dragSource.currentHighlight.state.cell)) {
        // Centers drop cells when splitting edges
        this.previewElement.style.left = Math.round(parseInt(this.previewElement.style.left) -
          bounds.width * view.scale / 2) + 'px';
        this.previewElement.style.top = Math.round(parseInt(this.previewElement.style.top) -
          bounds.height * view.scale / 2) + 'px';
      }
      else {
        this.previewElement.style.width = this.previewElementWidth;
        this.previewElement.style.height = this.previewElementHeight;
        this.previewElement.style.display = '';
      }
    }
  };

  var startTime = new Date().getTime();
  var timeOnTarget = 0;
  var prev = null;

  // Gets source cell style to compare shape below
  var sourceCellStyle = this.editorUi.editor.graph.getCellStyle(cells[0]);

  // Allows drop into cell only if target is a valid root
  dragSource.getDropTarget = mxUtils.bind(this, function (graph, x, y, evt) {
    // Alt means no targets at all
    // LATER: Show preview where result will go
    var cell = (!mxEvent.isAltDown(evt) && cells != null) ? graph.getCellAt(x, y) : null;

    // Uses connectable parent vertex if one exists
    if (cell != null && !this.graph.isCellConnectable(cell)) {
      var parent = this.graph.getModel().getParent(cell);

      if (this.graph.getModel().isVertex(parent) && this.graph.isCellConnectable(parent)) {
        cell = parent;
      }
    }

    // Ignores locked cells
    if (graph.isCellLocked(cell)) {
      cell = null;
    }

    var state = graph.view.getState(cell);
    activeArrow = null;
    var bbox = null;

    // Time on target
    if (prev != state) {
      prev = state;
      startTime = new Date().getTime();
      timeOnTarget = 0;

      if (this.updateThread != null) {
        window.clearTimeout(this.updateThread);
      }

      if (state != null) {
        this.updateThread = window.setTimeout(function () {
          if (activeArrow == null) {
            prev = state;
            dragSource.getDropTarget(graph, x, y, evt);
          }
        }, this.dropTargetDelay + 10);
      }
    }
    else {
      timeOnTarget = new Date().getTime() - startTime;
    }

    // Shift means disabled, delayed on cells with children, shows after this.dropTargetDelay, hides after 2500ms
    if (timeOnTarget < 2500 && state != null && !mxEvent.isShiftDown(evt) &&
      // If shape is equal or target has no stroke then add long delay except for images
      (((mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE) != mxUtils.getValue(sourceCellStyle, mxConstants.STYLE_SHAPE) &&
        mxUtils.getValue(state.style, mxConstants.STYLE_STROKECOLOR, mxConstants.NONE) != mxConstants.NONE) ||
        mxUtils.getValue(sourceCellStyle, mxConstants.STYLE_SHAPE) == 'image') ||
        timeOnTarget > 1500 || graph.model.isEdge(state.cell)) && (timeOnTarget > this.dropTargetDelay) &&
      ((graph.model.isVertex(state.cell) && firstVertex != null) ||
        (graph.model.isEdge(state.cell) && graph.model.isEdge(cells[0])))) {
      currentStyleTarget = state;
      var tmp = (graph.model.isEdge(state.cell)) ? graph.view.getPoint(state) :
        new mxPoint(state.getCenterX(), state.getCenterY());
      tmp = new mxRectangle(tmp.x - this.refreshTarget.width / 2, tmp.y - this.refreshTarget.height / 2,
        this.refreshTarget.width, this.refreshTarget.height);

      styleTarget.style.left = Math.floor(tmp.x) + 'px';
      styleTarget.style.top = Math.floor(tmp.y) + 'px';

      if (styleTargetParent == null) {
        graph.container.appendChild(styleTarget);
        styleTargetParent = styleTarget.parentNode;
      }

      checkArrow(x, y, tmp, styleTarget);
    }
    // Does not reset on ignored edges
    else if (currentStyleTarget == null || !mxUtils.contains(currentStyleTarget, x, y) ||
      (timeOnTarget > 1500 && !mxEvent.isShiftDown(evt))) {
      currentStyleTarget = null;

      if (styleTargetParent != null) {
        styleTarget.parentNode.removeChild(styleTarget);
        styleTargetParent = null;
      }
    }
    else if (currentStyleTarget != null && styleTargetParent != null) {
      // Sets active Arrow as side effect
      var tmp = (graph.model.isEdge(currentStyleTarget.cell)) ? graph.view.getPoint(currentStyleTarget) : new mxPoint(currentStyleTarget.getCenterX(), currentStyleTarget.getCenterY());
      tmp = new mxRectangle(tmp.x - this.refreshTarget.width / 2, tmp.y - this.refreshTarget.height / 2,
        this.refreshTarget.width, this.refreshTarget.height);
      checkArrow(x, y, tmp, styleTarget);
    }

    // Checks if inside bounds
    if (activeTarget && currentTargetState != null && !mxEvent.isAltDown(evt) && activeArrow == null) {
      // LATER: Use hit-detection for edges
      bbox = mxRectangle.fromRectangle(currentTargetState);

      if (graph.model.isEdge(currentTargetState.cell)) {
        var pts = currentTargetState.absolutePoints;

        if (roundSource.parentNode != null) {
          var p0 = pts[0];
          bbox.add(checkArrow(x, y, new mxRectangle(p0.x - this.roundDrop.width / 2,
            p0.y - this.roundDrop.height / 2, this.roundDrop.width, this.roundDrop.height), roundSource));
        }

        if (roundTarget.parentNode != null) {
          var pe = pts[pts.length - 1];
          bbox.add(checkArrow(x, y, new mxRectangle(pe.x - this.roundDrop.width / 2,
            pe.y - this.roundDrop.height / 2,
            this.roundDrop.width, this.roundDrop.height), roundTarget));
        }
      }
      else {
        var bds = mxRectangle.fromRectangle(currentTargetState);

        // Uses outer bounding box to take rotation into account
        if (currentTargetState.shape != null && currentTargetState.shape.boundingBox != null) {
          bds = mxRectangle.fromRectangle(currentTargetState.shape.boundingBox);
        }

        bds.grow(this.graph.tolerance);
        bds.grow(HoverIcons.prototype.arrowSpacing);

        var handler = this.graph.selectionCellsHandler.getHandler(currentTargetState.cell);

        if (handler != null) {
          bds.x -= handler.horizontalOffset / 2;
          bds.y -= handler.verticalOffset / 2;
          bds.width += handler.horizontalOffset;
          bds.height += handler.verticalOffset;

          // Adds bounding box of rotation handle to avoid overlap
          if (handler.rotationShape != null && handler.rotationShape.node != null &&
            handler.rotationShape.node.style.visibility != 'hidden' &&
            handler.rotationShape.node.style.display != 'none' &&
            handler.rotationShape.boundingBox != null) {
            bds.add(handler.rotationShape.boundingBox);
          }
        }

        bbox.add(checkArrow(x, y, new mxRectangle(currentTargetState.getCenterX() - this.triangleUp.width / 2,
          bds.y - this.triangleUp.height, this.triangleUp.width, this.triangleUp.height), arrowUp));
        bbox.add(checkArrow(x, y, new mxRectangle(bds.x + bds.width,
          currentTargetState.getCenterY() - this.triangleRight.height / 2,
          this.triangleRight.width, this.triangleRight.height), arrowRight));
        bbox.add(checkArrow(x, y, new mxRectangle(currentTargetState.getCenterX() - this.triangleDown.width / 2,
          bds.y + bds.height, this.triangleDown.width, this.triangleDown.height), arrowDown));
        bbox.add(checkArrow(x, y, new mxRectangle(bds.x - this.triangleLeft.width,
          currentTargetState.getCenterY() - this.triangleLeft.height / 2,
          this.triangleLeft.width, this.triangleLeft.height), arrowLeft));
      }

      // Adds tolerance
      if (bbox != null) {
        bbox.grow(10);
      }
    }

    direction = mxConstants.DIRECTION_NORTH;

    if (activeArrow == arrowRight) {
      direction = mxConstants.DIRECTION_EAST;
    }
    else if (activeArrow == arrowDown || activeArrow == roundTarget) {
      direction = mxConstants.DIRECTION_SOUTH;
    }
    else if (activeArrow == arrowLeft) {
      direction = mxConstants.DIRECTION_WEST;
    }

    if (currentStyleTarget != null && activeArrow == styleTarget) {
      state = currentStyleTarget;
    }

    var validTarget = (firstVertex == null || graph.isCellConnectable(cells[firstVertex])) &&
      ((graph.model.isEdge(cell) && firstVertex != null) ||
        (graph.model.isVertex(cell) && graph.isCellConnectable(cell)));

    // Drop arrows shown after this.dropTargetDelay, hidden after 5 secs, switches arrows after 500ms
    if ((currentTargetState != null && timeOnTarget >= 5000) ||
      (currentTargetState != state &&
        (bbox == null || !mxUtils.contains(bbox, x, y) ||
          (timeOnTarget > 500 && activeArrow == null && validTarget)))) {
      activeTarget = false;
      currentTargetState = ((timeOnTarget < 5000 && timeOnTarget > this.dropTargetDelay) || graph.model.isEdge(cell)) ? state : null;

      if (currentTargetState != null && validTarget) {
        var elts = [roundSource, roundTarget, arrowUp, arrowRight, arrowDown, arrowLeft];

        for (var i = 0; i < elts.length; i++) {
          if (elts[i].parentNode != null) {
            elts[i].parentNode.removeChild(elts[i]);
          }
        }

        if (graph.model.isEdge(cell)) {
          var pts = state.absolutePoints;

          if (pts != null) {
            var p0 = pts[0];
            var pe = pts[pts.length - 1];
            var tol = graph.tolerance;
            var box = new mxRectangle(x - tol, y - tol, 2 * tol, 2 * tol);

            roundSource.style.left = Math.floor(p0.x - this.roundDrop.width / 2) + 'px';
            roundSource.style.top = Math.floor(p0.y - this.roundDrop.height / 2) + 'px';

            roundTarget.style.left = Math.floor(pe.x - this.roundDrop.width / 2) + 'px';
            roundTarget.style.top = Math.floor(pe.y - this.roundDrop.height / 2) + 'px';

            if (graph.model.getTerminal(cell, true) == null) {
              graph.container.appendChild(roundSource);
            }

            if (graph.model.getTerminal(cell, false) == null) {
              graph.container.appendChild(roundTarget);
            }
          }
        }
        else {
          var bds = mxRectangle.fromRectangle(state);

          // Uses outer bounding box to take rotation into account
          if (state.shape != null && state.shape.boundingBox != null) {
            bds = mxRectangle.fromRectangle(state.shape.boundingBox);
          }

          bds.grow(this.graph.tolerance);
          bds.grow(HoverIcons.prototype.arrowSpacing);

          var handler = this.graph.selectionCellsHandler.getHandler(state.cell);

          if (handler != null) {
            bds.x -= handler.horizontalOffset / 2;
            bds.y -= handler.verticalOffset / 2;
            bds.width += handler.horizontalOffset;
            bds.height += handler.verticalOffset;

            // Adds bounding box of rotation handle to avoid overlap
            if (handler.rotationShape != null && handler.rotationShape.node != null &&
              handler.rotationShape.node.style.visibility != 'hidden' &&
              handler.rotationShape.node.style.display != 'none' &&
              handler.rotationShape.boundingBox != null) {
              bds.add(handler.rotationShape.boundingBox);
            }
          }

          arrowUp.style.left = Math.floor(state.getCenterX() - this.triangleUp.width / 2) + 'px';
          arrowUp.style.top = Math.floor(bds.y - this.triangleUp.height) + 'px';

          arrowRight.style.left = Math.floor(bds.x + bds.width) + 'px';
          arrowRight.style.top = Math.floor(state.getCenterY() - this.triangleRight.height / 2) + 'px';

          arrowDown.style.left = arrowUp.style.left
          arrowDown.style.top = Math.floor(bds.y + bds.height) + 'px';

          arrowLeft.style.left = Math.floor(bds.x - this.triangleLeft.width) + 'px';
          arrowLeft.style.top = arrowRight.style.top;

          if (state.style['portConstraint'] != 'eastwest') {
            graph.container.appendChild(arrowUp);
            graph.container.appendChild(arrowDown);
          }

          graph.container.appendChild(arrowRight);
          graph.container.appendChild(arrowLeft);
        }

        // Hides handle for cell under mouse
        if (state != null) {
          currentStateHandle = graph.selectionCellsHandler.getHandler(state.cell);

          if (currentStateHandle != null && currentStateHandle.setHandlesVisible != null) {
            currentStateHandle.setHandlesVisible(false);
          }
        }

        activeTarget = true;
      }
      else {
        var elts = [roundSource, roundTarget, arrowUp, arrowRight, arrowDown, arrowLeft];

        for (var i = 0; i < elts.length; i++) {
          if (elts[i].parentNode != null) {
            elts[i].parentNode.removeChild(elts[i]);
          }
        }
      }
    }

    if (!activeTarget && currentStateHandle != null) {
      currentStateHandle.setHandlesVisible(true);
    }

    // Handles drop target
    var target = ((!mxEvent.isAltDown(evt) || mxEvent.isShiftDown(evt)) &&
      !(currentStyleTarget != null && activeArrow == styleTarget)) ?
      mxDragSource.prototype.getDropTarget.apply(this, arguments) : null;
    var model = graph.getModel();

    if (target != null) {
      if (activeArrow != null || !graph.isSplitTarget(target, cells, evt)) {
        // Selects parent group as drop target
        while (target != null && !graph.isValidDropTarget(target, cells, evt) && model.isVertex(model.getParent(target))) {
          target = model.getParent(target);
        }

        if (graph.view.currentRoot == target || (!graph.isValidRoot(target) &&
          graph.getModel().getChildCount(target) == 0) ||
          graph.isCellLocked(target) || model.isEdge(target)) {
          target = null;
        }
      }
    }

    return target;
  });

  dragSource.stopDrag = function () {
    mxDragSource.prototype.stopDrag.apply(this, arguments);

    var elts = [roundSource, roundTarget, styleTarget, arrowUp, arrowRight, arrowDown, arrowLeft];

    for (var i = 0; i < elts.length; i++) {
      if (elts[i].parentNode != null) {
        elts[i].parentNode.removeChild(elts[i]);
      }
    }

    if (currentTargetState != null && currentStateHandle != null) {
      currentStateHandle.reset();
    }

    currentStateHandle = null;
    currentTargetState = null;
    currentStyleTarget = null;
    styleTargetParent = null;
    activeArrow = null;
  };

  return dragSource;
};

/**
 * Adds a handler for inserting the cell with a single click.
 */
Sidebar.prototype.itemClicked = function (cells, ds, evt, elt) {
  var graph = this.editorUi.editor.graph;

  // Alt+Click inserts and connects
  if (mxEvent.isAltDown(evt)) {
    if (graph.getSelectionCount() == 1 && graph.model.isVertex(graph.getSelectionCell())) {
      var firstVertex = null;

      for (var i = 0; i < cells.length && firstVertex == null; i++) {
        if (graph.model.isVertex(cells[i])) {
          firstVertex = i;
        }
      }

      if (firstVertex != null) {
        graph.setSelectionCells(this.dropAndConnect(graph.getSelectionCell(), cells, (mxEvent.isMetaDown(evt) || mxEvent.isControlDown(evt)) ?
          (mxEvent.isShiftDown(evt) ? mxConstants.DIRECTION_WEST : mxConstants.DIRECTION_NORTH) :
          (mxEvent.isShiftDown(evt) ? mxConstants.DIRECTION_EAST : mxConstants.DIRECTION_SOUTH), firstVertex));
        graph.scrollCellToVisible(graph.getSelectionCell());
      }
    }
  }
  // Shift+Click updates shape
  else if (mxEvent.isShiftDown(evt)) {
    if (!graph.isSelectionEmpty()) {
      this.updateShapes(cells[0], graph.getSelectionCells());
      graph.scrollCellToVisible(graph.getSelectionCell());
    }
  }
  else {
    var pt = graph.getFreeInsertPoint();
    ds.drop(graph, evt, null, pt.x, pt.y);

    if (this.editorUi.hoverIcons != null && mxEvent.isTouchEvent(evt)) {
      this.editorUi.hoverIcons.update(graph.view.getState(graph.getSelectionCell()));
    }
  }
};

/**
 * Adds a handler for inserting the cell with a single click.
 */
Sidebar.prototype.addClickHandler = function (elt, ds, cells) {
  var graph = this.editorUi.editor.graph;
  var oldMouseUp = ds.mouseUp;
  var first = null;

  mxEvent.addGestureListeners(elt, function (evt) {
    first = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));
  });

  ds.mouseUp = mxUtils.bind(this, function (evt) {
    if (!mxEvent.isPopupTrigger(evt) && this.currentGraph == null && first != null) {
      var tol = graph.tolerance;

      if (Math.abs(first.x - mxEvent.getClientX(evt)) <= tol &&
        Math.abs(first.y - mxEvent.getClientY(evt)) <= tol) {
        this.itemClicked(cells, ds, evt, elt);
      }
    }

    oldMouseUp.apply(ds, arguments);
    first = null;

    // Blocks tooltips on this element after single click
    this.currentElt = elt;
  });
};

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createVertexTemplateEntry = function (style, width, height, value, title, showLabel, showTitle, tags, type) {
  tags = (tags != null && tags.length > 0) ? tags : title.toLowerCase();

  return this.addEntry(tags, mxUtils.bind(this, function () {
    return this.createVertexTemplate(style, width, height, value, title, showLabel, showTitle, null, type);
  }));
}

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createVertexTemplate = function (style, width, height, value, title, showLabel, showTitle, allowCellsInserted, type) {
  var cells = [new mxCell((value != null) ? value : '', new mxGeometry(0, 0, width, height), style)];
  cells[0].vertex = true;
  cells[0].title = title;
  cells[0].type = type;

  return this.createVertexTemplateFromCells(cells, width, height, title, showLabel, showTitle, allowCellsInserted);
};

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createVertexTemplateFromCells = function (cells, width, height, title, showLabel, showTitle, allowCellsInserted) {
  return this.createItem(cells, title, showLabel, showTitle, width, height, allowCellsInserted);
};

/**
 *
 */
Sidebar.prototype.createEdgeTemplateEntry = function (style, width, height, value, title, showLabel, tags, allowCellsInserted) {
  tags = (tags != null && tags.length > 0) ? tags : title.toLowerCase();

  return this.addEntry(tags, mxUtils.bind(this, function () {
    return this.createEdgeTemplate(style, width, height, value, title, showLabel, allowCellsInserted);
  }));
};

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createEdgeTemplate = function (style, width, height, value, title, showLabel, allowCellsInserted) {
  var cell = new mxCell((value != null) ? value : '', new mxGeometry(0, 0, width, height), style);
  cell.geometry.setTerminalPoint(new mxPoint(0, height), true);
  cell.geometry.setTerminalPoint(new mxPoint(width, 0), false);
  cell.geometry.relative = true;
  cell.edge = true;

  return this.createEdgeTemplateFromCells([cell], width, height, title, showLabel, allowCellsInserted);
};

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createEdgeTemplateFromCells = function (cells, width, height, title, showLabel, allowCellsInserted) {
  return this.createItem(cells, title, showLabel, true, width, height, allowCellsInserted);
};

/**
 * Adds the given palette.
 */
Sidebar.prototype.addPaletteFunctions = function (id, title, expanded, fns) {
  this.addPalette(id, title, expanded, mxUtils.bind(this, function (content) {
    for (var i = 0; i < fns.length; i++) {
      content.appendChild(fns[i](content));
    }
  }));
};

/**
 * Adds the given palette.
 */
Sidebar.prototype.addPalette = function (id, title, expanded, onInit) {
  var elt = this.createTitle(title);
  this.container.appendChild(elt);

  var div = document.createElement('div');
  div.className = 'geSidebar';

  // Disables built-in pan and zoom in IE10 and later
  if (mxClient.IS_POINTER) {
    div.style.touchAction = 'none';
  }

  // Shows tooltip if mouse over background
  mxEvent.addListener(div, 'mousemove', mxUtils.bind(this, function (evt) {
    if (mxEvent.getSource(evt) == div) {
      div.setAttribute('title', mxResources.get('sidebarTooltip'));
    }
    else {
      div.removeAttribute('title');
    }
  }));

  if (expanded) {
    onInit(div);
    onInit = null;
  }
  else {
    div.style.display = 'none';
  }

  this.addFoldingHandler(elt, div, onInit);

  var outer = document.createElement('div');
  outer.appendChild(div);
  this.container.appendChild(outer);

  // Keeps references to the DOM nodes
  if (id != null) {
    this.palettes[id] = [elt, outer];
  }

  return div;
};

/**
 * Create the given title element.
 */
Sidebar.prototype.addFoldingHandler = function (title, content, funct) {
  var initialized = false;

  // Avoids mixed content warning in IE6-8
  if (!mxClient.IS_IE || document.documentMode >= 8) {
    title.style.backgroundImage = (content.style.display == 'none') ?
      'url(\'' + this.collapsedImage + '\')' : 'url(\'' + this.expandedImage + '\')';
  }

  title.style.backgroundRepeat = 'no-repeat';
  title.style.backgroundPosition = '0% 50%';

  mxEvent.addListener(title, 'click', mxUtils.bind(this, function (evt) {
    if (content.style.display == 'none') {
      if (!initialized) {
        initialized = true;

        if (funct != null) {
          // Wait cursor does not show up on Mac
          title.style.cursor = 'wait';
          var prev = title.innerHTML;
          title.innerHTML = mxResources.get('loading') + '...';

          window.setTimeout(function () {
            var fo = mxClient.NO_FO;
            mxClient.NO_FO = Editor.prototype.originalNoForeignObject;
            funct(content);
            mxClient.NO_FO = fo;
            content.style.display = 'block';
            title.style.cursor = '';
            title.innerHTML = prev;
          }, 0);
        }
        else {
          content.style.display = 'block';
        }
      }
      else {
        content.style.display = 'block';
      }

      title.style.backgroundImage = 'url(\'' + this.expandedImage + '\')';
    }
    else {
      title.style.backgroundImage = 'url(\'' + this.collapsedImage + '\')';
      content.style.display = 'none';
    }

    mxEvent.consume(evt);
  }));
};

/**
 * Removes the palette for the given ID.
 */
Sidebar.prototype.removePalette = function (id) {
  var elts = this.palettes[id];

  if (elts != null) {
    this.palettes[id] = null;

    for (var i = 0; i < elts.length; i++) {
      this.container.removeChild(elts[i]);
    }

    return true;
  }

  return false;
};

/**
 * Adds the given image palette.
 */
Sidebar.prototype.addImagePalette = function (id, title, prefix, postfix, items, titles, tags) {
  var showTitles = titles != null;
  var fns = [];

  for (var i = 0; i < items.length; i++) {
    (mxUtils.bind(this, function (item, title, tmpTags) {
      if (tmpTags == null) {
        var slash = item.lastIndexOf('/');
        var dot = item.lastIndexOf('.');
        tmpTags = item.substring((slash >= 0) ? slash + 1 : 0, (dot >= 0) ? dot : item.length).replace(/[-_]/g, ' ');
      }

      fns.push(this.createVertexTemplateEntry('image;html=1;labelBackgroundColor=#ffffff;image=' + prefix + item + postfix,
        this.defaultImageWidth, this.defaultImageHeight, '', title, title != null, null, this.filterTags(tmpTags)));
    }))(items[i], (titles != null) ? titles[i] : null, (tags != null) ? tags[items[i]] : null);
  }

  this.addPaletteFunctions(id, title, false, fns);
};

/**
 * Creates the array of tags for the given stencil. Duplicates are allowed and will be filtered out later.
 */
Sidebar.prototype.getTagsForStencil = function (packageName, stencilName, moreTags) {
  var tags = packageName.split('.');

  for (var i = 1; i < tags.length; i++) {
    tags[i] = tags[i].replace(/_/g, ' ')
  }

  tags.push(stencilName.replace(/_/g, ' '));

  if (moreTags != null) {
    tags.push(moreTags);
  }

  return tags.slice(1, tags.length);
};

/**
 * Adds the given stencil palette.
 */
Sidebar.prototype.addStencilPalette = function (id, title, stencilFile, style, ignore, onInit, scale, tags, customFns) {
  scale = (scale != null) ? scale : 1;

  if (this.addStencilsToIndex) {
    // LATER: Handle asynchronous loading dependency
    var fns = [];

    if (customFns != null) {
      for (var i = 0; i < customFns.length; i++) {
        fns.push(customFns[i]);
      }
    }

    mxStencilRegistry.loadStencilSet(stencilFile, mxUtils.bind(this, function (packageName, stencilName, displayName, w, h) {
      if (ignore == null || mxUtils.indexOf(ignore, stencilName) < 0) {
        var tmp = this.getTagsForStencil(packageName, stencilName);
        var tmpTags = (tags != null) ? tags[stencilName] : null;

        if (tmpTags != null) {
          tmp.push(tmpTags);
        }

        fns.push(this.createVertexTemplateEntry('shape=' + packageName + stencilName.toLowerCase() + style,
          Math.round(w * scale), Math.round(h * scale), '', stencilName.replace(/_/g, ' '), null, null,
          this.filterTags(tmp.join(' '))));
      }
    }), true, true);

    this.addPaletteFunctions(id, title, false, fns);
  }
  else {
    this.addPalette(id, title, false, mxUtils.bind(this, function (content) {
      if (style == null) {
        style = '';
      }

      if (onInit != null) {
        onInit.call(this, content);
      }

      if (customFns != null) {
        for (var i = 0; i < customFns.length; i++) {
          customFns[i](content);
        }
      }

      mxStencilRegistry.loadStencilSet(stencilFile, mxUtils.bind(this, function (packageName, stencilName, displayName, w, h) {
        if (ignore == null || mxUtils.indexOf(ignore, stencilName) < 0) {
          content.appendChild(this.createVertexTemplate('shape=' + packageName + stencilName.toLowerCase() + style,
            Math.round(w * scale), Math.round(h * scale), '', stencilName.replace(/_/g, ' '), true));
        }
      }), true);
    }));
  }
};

/**
 * Adds the given stencil palette.
 */
Sidebar.prototype.destroy = function () {
  if (this.graph != null) {
    if (this.graph.container != null && this.graph.container.parentNode != null) {
      this.graph.container.parentNode.removeChild(this.graph.container);
    }

    this.graph.destroy();
    this.graph = null;
  }

  if (this.pointerUpHandler != null) {
    mxEvent.removeListener(document, (mxClient.IS_POINTER) ? 'pointerup' : 'mouseup', this.pointerUpHandler);
    this.pointerUpHandler = null;
  }

  if (this.pointerDownHandler != null) {
    mxEvent.removeListener(document, (mxClient.IS_POINTER) ? 'pointerdown' : 'mousedown', this.pointerDownHandler);
    this.pointerDownHandler = null;
  }

  if (this.pointerMoveHandler != null) {
    mxEvent.removeListener(document, (mxClient.IS_POINTER) ? 'pointermove' : 'mousemove', this.pointerMoveHandler);
    this.pointerMoveHandler = null;
  }

  if (this.pointerOutHandler != null) {
    mxEvent.removeListener(document, (mxClient.IS_POINTER) ? 'pointerout' : 'mouseout', this.pointerOutHandler);
    this.pointerOutHandler = null;
  }
};
