function CalendarHeatmap() {
  // defaults
  var width = 300;
  var height = 1800;
  var legendWidth = 100;
  var selector = 'body';
  var CHART_PADDING = 20;
  var SQUARE_LENGTH = 30;
  var SQUARE_PADDING = 2;
  var MONTH_LABEL_PADDING = 5;
  var WEEK_LABEL_PADDING = 15;
  var NUM_LEGEND_GRIDS = 4;
  var now = moment().endOf('day').toDate();
  var yearAgo = moment().startOf('day').subtract(1, 'year').toDate();
  var startDate = null;
  var data = [];
  var max = null;
  var colorRange = ["#dcdcdc", "#52b947", "#f3ec19", "#f57e20", "#ed1f24", "#991b4f"];
  var colorBin = [0, 1, 10, 20, 30];
  var tooltipEnabled = true;
  var tooltipUnit = "report";
  var tooltipUnitPluralEnabled = true;
  var legendEnabled = true;
  var onClick = null;
  var weekStart = 0; //0 for Sunday, 1 for Monday
  var locale = {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    No: 'No',
    on: 'on',
    Less: 'Less',
    More: 'More'
  };

  // setters and getters
  chart.data = function (value) {
    if (!arguments.length) {
      return data;
    }
    data = value;
    return chart;
  };

  chart.max = function (value) {
    if (!arguments.length) {
      return max;
    }
    max = value;
    return chart;
  };

  chart.selector = function (value) {
    if (!arguments.length) {
      return selector;
    }
    selector = value;
    return chart;
  };

  chart.startDate = function (value) {
    if (!arguments.length) {
      return startDate;
    }
    yearAgo = value;
    //now = moment(value).endOf('day').add(1, 'year').toDate();
    return chart;
  };

  chart.colorRange = function (value) {
    if (!arguments.length) {
      return colorRange;
    }
    colorRange = value;
    return chart;
  };

  chart.colorBin = function (value) {
    if (!arguments.length) {
      return colorBin;
    }
    colorBin = value;
    return chart;
  };

  chart.tooltipUnitPluralEnabled = function (value) {
    if (!arguments.length) {
      return tooltipUnitPluralEnabled;
    }
    tooltipUnitPluralEnabled = value;
    return chart;
  };

  chart.tooltipEnabled = function (value) {
    if (!arguments.length) {
      return tooltipEnabled;
    }
    tooltipEnabled = value;
    return chart;
  };

  chart.tooltipUnit = function (value) {
    if (!arguments.length) {
      return tooltipUnit;
    }
    tooltipUnit = value;
    return chart;
  };

  chart.legendEnabled = function (value) {
    if (!arguments.length) {
      return legendEnabled;
    }
    legendEnabled = value;
    return chart;
  };

  chart.onClick = function (value) {
    if (!arguments.length) {
      return onClick();
    }
    onClick = value;
    return chart;
  };

  chart.locale = function (value) {
    if (!arguments.length) {
      return locale;
    }
    locale = value;
    return chart;
  };

  function chart() {

    d3.select(chart.selector()).selectAll('svg.calendar-heatmap').remove(); // remove the existing chart, if it exists

    var dateRange = d3.time.days(yearAgo, now); // generates an array of date objects within the specified range
    var monthRange = d3.time.months(moment(yearAgo).startOf('month').toDate(), now); // it ignores the first month if the 1st date is after the start of the month
    var firstDate = moment(dateRange[0]);
    if (max === null) {
      max = d3.max(chart.data(), function (d) {
        return d.count;
      });
    } // max data value

    // color range
    colorBin.push(max);
    var color = d3.scale.quantile()
      .range(chart.colorRange())
      .domain(colorBin);

    var tooltip;
    var dayRects;

    drawChart();

    function drawChart() {
      var svg = d3.select(chart.selector())
        .style('position', 'relative')
        .append('svg')
        .attr('width', width)
        .attr('class', 'calendar-heatmap')
        .attr('height', height)
        .style('padding', CHART_PADDING + 'px');

      dayRects = svg.selectAll('.day-cell')
        .data(dateRange);  //  array of days for the last yr

      dayRects.enter().append('rect')
        .attr('class', 'day-cell')
        .attr('width', SQUARE_LENGTH)
        .attr('height', SQUARE_LENGTH)
        .attr('fill', function (d) {
          return color(countForDate(d));
        })
        .attr('y', function (d, i) {
          var cellDate = moment(d);
          var result = cellDate.week() - firstDate.week() + (firstDate.weeksInYear() * (cellDate.weekYear() - firstDate.weekYear()));
          return result * (SQUARE_LENGTH + SQUARE_PADDING) + 22;
        })
        .attr('x', function (d, i) {
          return formatWeekday(d.getDay()) * (SQUARE_LENGTH + SQUARE_PADDING);
        });

      if (typeof onClick === 'function') {
        dayRects.on('click', function (d) {
          var count = countForDate(d);
          onClick({date: d, count: count});
        });
      }

      if (chart.tooltipEnabled()) {
        dayRects.on('mouseover', function (d, i) {
          tooltip = d3.select(chart.selector())
            .append('div')
            .attr('class', 'day-cell-tooltip')
            .html(tooltipHTMLForDate(d))
            .style('top', function () {
              return (Math.floor((firstDate.day() + i) / 7) - 0.2) * (SQUARE_LENGTH + SQUARE_PADDING) + 'px';
            })
            .style('left', function () {
              return formatWeekday(d.getDay()) * (SQUARE_LENGTH + SQUARE_PADDING) - 2 + 'px';
            });
        })
          .on('mouseout', function (d, i) {
            tooltip.remove();
          });
      }

      if (chart.legendEnabled()) {
        var colorRange = [color(0)];
        for (var i = NUM_LEGEND_GRIDS; i > 0; i--) {
          colorRange.push(color(max / i));
        }

        var legendGroup = svg.append('g');
        legendGroup.selectAll('.calendar-heatmap-legend')
          .data(colorRange)
          .enter()
          .append('rect')
          .attr('class', 'calendar-heatmap-legend')
          .attr('width', SQUARE_LENGTH)
          .attr('height', SQUARE_LENGTH)
          .attr('y', function (d, i) {
            return (width - legendWidth) + (i + 1) * (SQUARE_LENGTH + SQUARE_PADDING);
          })
          .attr('x', height + SQUARE_PADDING)
          .attr('fill', function (d) {
            return d;
          });

        legendGroup.append('text')
          .attr('class', 'calendar-heatmap-legend-text calendar-heatmap-legend-text-less')
          .attr('y', width - legendWidth - SQUARE_LENGTH)
          .attr('x', height + SQUARE_LENGTH)
          .text(locale.Less);

        legendGroup.append('text')
          .attr('class', 'calendar-heatmap-legend-text calendar-heatmap-legend-text-more')
          .attr('y', (width - legendWidth + SQUARE_PADDING) + (colorRange.length + 1) * (SQUARE_LENGTH + SQUARE_PADDING))
          .attr('x', height + SQUARE_LENGTH)
          .text(locale.More);
      }

      dayRects.exit().remove();
      var monthLabels = svg.selectAll('.month')
        .data(monthRange)
        .enter().append('text')
        .attr('class', 'month-name')
        .style()
        .text(function (d) {
          return locale.months[d.getMonth()];
        })
        .attr('y', function (d, i) {
          var matchIndex = 0;
          dateRange.find(function (element, index) {
            matchIndex = index;
            return moment(d).isSame(element, 'month') && moment(d).isSame(element, 'year');
          });
          return Math.floor(matchIndex / 7 + 1) * (SQUARE_LENGTH + SQUARE_PADDING) + 12;
        })
        .attr('x', (SQUARE_LENGTH + SQUARE_PADDING) * 7 + MONTH_LABEL_PADDING);  // fix these to the top

      locale.days.forEach(function (day, index) {
        index = formatWeekday(index);
        if (true) {
          svg.append('text')
            .attr('class', 'day-initial')
            .attr('x', (SQUARE_LENGTH + SQUARE_PADDING) * (index + 1) - 18)
            .style('text-anchor', 'middle')
            .attr('y', WEEK_LABEL_PADDING)
            .text(day);
        }
      });
    }

    function pluralizedTooltipUnit(count) {
      if ('string' === typeof tooltipUnit) {
        if (tooltipUnitPluralEnabled) {
          return (tooltipUnit + (count === 1 ? '' : 's'));
        } else {
          return tooltipUnit;
        }
      }
      for (var i in tooltipUnit) {
        var _rule = tooltipUnit[i];
        var _min = _rule.min;
        var _max = _rule.max || _rule.min;
        _max = _max === 'Infinity' ? Infinity : _max;
        if (count >= _min && count <= _max) {
          return _rule.unit;
        }
      }
    }

    function tooltipHTMLForDate(d) {
      var dateStr = moment(d).format('ddd, D MMM, YYYY');
      var count = countForDate(d);
      return '<span><strong>' + (count ? count : locale.No) + ' ' + pluralizedTooltipUnit(count) + '</strong> ' + locale.on + '<br>' + dateStr + '</span>';
    }

    function countForDate(d) {
      var count = 0;
      var match = chart.data().find(function (element, index) {
        return moment(element.date).isSame(d, 'day');
      });
      if (match) {
        count = match.count;
      }
      return count;
    }

    function formatWeekday(weekDay) {
      if (weekStart === 1) {
        if (weekDay === 0) {
          return 6;
        } else {
          return weekDay - 1;
        }
      }
      return weekDay;
    }

    var daysOfChart = chart.data().map(function (day) {
      return day.date.toDateString();
    });

    dayRects.filter(function (d) {
      return daysOfChart.indexOf(d.toDateString()) > -1;
    }).attr('fill', function (d, i) {
      return color(chart.data()[i].count);
    });
  }

  return chart;
}


// polyfill for Array.find() method
/* jshint ignore:start */
if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}
/* jshint ignore:end */
