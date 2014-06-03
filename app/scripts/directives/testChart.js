'use strict';

angular.module('populationioApp')
    .directive('testChart', function () {
        return {
            restrict: 'A',
            link:     function (scope, element, attrs, ngModel) {
                var data, chart, radius, bubbleElement,
                    bottomCut = 100,
                    chartTable,
                    parentWidth = window.innerWidth - 100,
                    parentHeight = window.innerHeight - 100,
                    yAxis = d3.svg.axis(),
                    xAxis = d3.svg.axis(),
                    radiusRange = [3, 95];


                scope.$watch(function () {
                    if (scope.testChartData) {
                        data = _.sortBy(scope.testChartData, function (item) { return -item.deal_value });
                        buildNav();
                        buildChart();
                        buildChartTable();
                    }
                });

                function buildNav() {
                    var chartNavbar = d3.select(element[0]).append('div').attr('class', 'chart-navbar')
                    chartNavbar.html('<input id="revenue-toggle" name="chart-type"  type="radio" checked> <label for="revenue-toggle">Revenue</label> <input id="pipeline-toggle" name="chart-type" type="radio"> <label for="pipeline-toggle">Pipeline</label>')
                    var revenueToggle = d3.select('#revenue-toggle');
                    var pipelineToggle = d3.select('#pipeline-toggle');


                    revenueToggle.on('click', function () {
                        console.log('revenue')

                        var x = d3.scale.linear()
                            .domain([0, d3.max(data, function (d, i) { return d.ltd_velocity }) * 1.2])
                            .range([100, parentWidth - 500]);
                        var y = d3.scale.linear()
                            .domain([d3.max(data, function (d, i) { return d.ltd_conv_rate }) * 1.2, 0])
                            .range([100, parentHeight - 100 - bottomCut]);

                        radius = d3.scale.linear()
                            .domain([0, d3.max(data, function (d, i) { return d.deal_value })])
                            .range(radiusRange);

                        xAxis.scale(x)
                        chart.selectAll("g.x.axis")
                            .transition()
                            .call(xAxis);

                        yAxis.scale(y)
                        chart.selectAll("g.y.axis")
                            .transition()
                            .call(yAxis);


                        bubbleElement
                            .select('.bubble-circle')
                            .transition()
                            .attr('r', function (d, i) {return radius(d.deal_value)})
                            .attr('cx', function (d, i) {return x(d.ltd_velocity)})
                            .attr('cy', function (d, i) {return y(d.ltd_conv_rate)})

                        bubbleElement
                            .select('.shadow')
                            .transition()
                            .attr('r', function (d, i) { return radius(d.deal_value) })
                            .attr('cx', function (d, i) { return x(d.ltd_velocity) + 2 })
                            .attr('cy', function (d, i) { return y(d.ltd_conv_rate) + 2 })
                        chartTable.selectAll('.revenue-cell').style('display', 'table-cell');
                        chartTable.selectAll('.pipeline-cell').style('display', 'none');

                    });
                    pipelineToggle.on('click', function () {


                        var x = d3.scale.linear()
                            .domain([0, d3.max(data, function (d, i) { return d.lto_velocity }) * 1.2])
                            .range([100, parentWidth - 500]);
                        var y = d3.scale.linear()
                            .domain([d3.max(data, function (d, i) { return d.lto_conv_rate }) * 1.2, 0])
                            .range([100, parentHeight - 100 - bottomCut]);

                        radius = d3.scale.linear()
                            .domain([0, d3.max(data, function (d, i) { return d.pipeline_value })])
                            .range(radiusRange);


                        console.log('pipeline')

                        xAxis.scale(x)
                        chart.selectAll("g.x.axis")
                            .transition()
                            .call(xAxis);

                        yAxis.scale(y)
                        chart.selectAll("g.y.axis")
                            .transition()
                            .call(yAxis);

                        bubbleElement
                            .select('.bubble-circle')
                            .transition()
                            .attr('r', function (d, i) { return radius(d.pipeline_value) })
                            .attr('cx', function (d, i) { return x(d.lto_velocity) })
                            .attr('cy', function (d, i) { return y(d.lto_conv_rate) })

                        bubbleElement
                            .select('.shadow')
                            .transition()
                            .attr('r', function (d, i) { return radius(d.pipeline_value) })
                            .attr('cx', function (d, i) { return x(d.lto_velocity) + 2 })
                            .attr('cy', function (d, i) { return y(d.lto_conv_rate) + 2 })
                        chartTable.selectAll('.revenue-cell').style('display', 'none');
                        chartTable.selectAll('.pipeline-cell').style('display', 'table-cell');


                    })

                }

                function buildChart() {

                    var legendElementHeight = 50,
                        legend,
                        legendElement,
                        bubbles,
                        tooltip,
                        tooltipTitle,

                        tooltipVelocity,
                        tooltipConvRate,
                        tooltipValue,

                        tooltipVelocityValue,
                        tooltipConvRateValue,
                        tooltipValueValue
                        ;
                    var x = d3.scale.linear()
                        .domain([0, d3.max(data, function (d, i) { return d.ltd_velocity }) * 1.2])
                        .range([100, parentWidth - 500]);
                    var y = d3.scale.linear()
                        .domain([d3.max(data, function (d, i) { return d.ltd_conv_rate }) * 1.2, 0])
                        .range([100, parentHeight - 100 - bottomCut]);

                    radius = d3.scale.linear()
                        .domain([0, d3.max(data, function (d, i) { return d.deal_value })])
                        .range(radiusRange);

                    chart = d3.select(element[0])
                        .append('svg')
                        .attr('width', parentWidth)
                        .attr('height', parentHeight - bottomCut)
                        .append('g')
                        .attr('class', 'chart-area')
                        .attr('width', parentWidth)
                        .attr('height', parentHeight - bottomCut)
                        .attr('transform', 'translate(50,50)');
                    xAxis.scale(x)
                        .orient("bottom")
                    chart.append("g")
                        .call(xAxis)
                        .attr('class', 'x axis')
                        .attr("transform", "translate(0," + (parentHeight - 100 - bottomCut) + ")");

                    chart
                        .append('text')
                        .attr('class', 'x-label')
                        .text('Velocity')
                        .attr('transform', 'translate(100,' + (parentHeight - bottomCut - 60) + ')');
                    chart
                        .append('text')
                        .attr('class', 'y-label')
                        .text('Conversion Rate')
                        .attr('transform', 'translate(60,' + (parentHeight - bottomCut - 100) + ') rotate(-90)');


                    var formatter = d3.format(".0%");
                    yAxis.scale(y)
                        .orient("left")
                        .ticks(10)
                        .tickFormat(formatter);
                    var yAxisElement = chart.append("g")
                        .call(yAxis)
                        .attr('class', 'y axis')
                        .attr("transform", "translate(100,0)");


                    bubbles = chart
                        .append('g')
                        .attr('class', 'bubbles-area');
                    bubbleElement = bubbles
                        .selectAll('.bubble-element')
                        .data(data)
                        .enter()
                        .append('g')
                        .attr('class', 'bubble-element')
                        .on('mouseenter', function (d, i) {

                            var bubble = this;
                            var element = d3.select(bubble).select('circle.bubble-circle');
                            tooltip
                                .attr('transform', function (d, i) {
                                    var offset = 20;
                                    var tooltipWidth = d3.select(this).select('rect').attr('width');
                                    if (parentHeight - bottomCut - element.attr('cy') < 250) {
                                        offset = -160;
                                        tooltipPointerTop.attr('opacity', 0)
                                        tooltipPointerBottom.attr('opacity', 1)

                                    }
                                    else {
                                        offset = 20;
                                        tooltipPointerTop.attr('opacity', 1)
                                        tooltipPointerBottom.attr('opacity', 0)

                                    }

                                    return 'translate(' + (element.attr('cx') - tooltipWidth / 2) + ',' + (parseInt(element.attr('cy')) + offset) + ')'
                                })


                                .attr('opacity', 1);
                            element
                                .transition()
                                .style('fill', function (d, i) { return d3.rgb(d.color).brighter(0.7); })
                                .attr('r', function (d, i) {
                                    if (document.getElementById('revenue-toggle').checked)
                                        return radius(d.deal_value) + 10
                                    else {
                                        return radius(d.pipeline_value) + 10
                                    }
                                });

                            tooltipTitle
                                .text(function (d, i) { return d3.select(bubble).data()[0].channel })
                                .style('fill', function (d, i) { return d3.select(bubble).data()[0].color })

                            if (document.getElementById('revenue-toggle').checked) {
                                tooltipVelocity.text('LTD Velocity')
                                tooltipConvRate.text('LTD ConvRate')
                                tooltipValue.text('Deal Value')
                                tooltipVelocityValue
                                    .text(function (d, i) { return d3.select(bubble).data()[0].ltd_velocity })
                                tooltipConvRateValue
                                    .text(function (d, i) {
                                        var formatter = d3.format(".0%");
                                        return formatter(d3.select(bubble).data()[0].ltd_conv_rate)
                                    })
                                tooltipValueValue
                                    .text(function (d, i) { return '$' + d3.select(bubble).data()[0].deal_value })

                            }
                            else {
                                tooltipVelocity.text('LTO Velocity')
                                tooltipConvRate.text('LTO ConvRate')
                                tooltipValue.text('Pipeline Value')

                                tooltipVelocityValue
                                    .text(function (d, i) { return d3.select(bubble).data()[0].lto_velocity })
                                tooltipConvRateValue
                                    .text(function (d, i) {
                                        var formatter = d3.format(".0%");
                                        return formatter(d3.select(bubble).data()[0].lto_conv_rate)
                                    })
                                tooltipValueValue
                                    .text(function (d, i) { return '$' + d3.select(bubble).data()[0].pipeline_value })

                            }


                        })
                        .on('mousemove', function (d, i) {
                            var bubble = this;
                            var mouseCoords = d3.mouse(bubble);
                            var element = d3.select(bubble).select('circle.bubble-circle');
                            tooltip.attr('transform', function (d, i) {
                                var offset = 20;
                                var tooltipWidth = d3.select(this).select('rect').attr('width');
                                if (parentHeight - bottomCut - element.attr('cy') < 250) {
                                    offset = -160;
                                    tooltipPointerTop.attr('opacity', 0)
                                    tooltipPointerBottom.attr('opacity', 1)

                                }
                                else {
                                    offset = 40;
                                    tooltipPointerTop.attr('opacity', 1)
                                    tooltipPointerBottom.attr('opacity', 0)

                                }

                                return 'translate(' + (mouseCoords[0] - tooltipWidth / 2) + ',' + (parseInt(mouseCoords[1]) + offset) + ')'
                            })

                        })
                        .on('mouseleave', function (d, i) {
                            var bubble = this;
                            var element = d3.select(bubble).select('circle.bubble-circle');
                            element
                                .transition()
                                .style('fill', function (d, i) { return d.color })
                                .attr('r', function (d, i) {
                                    if (document.getElementById('revenue-toggle').checked)
                                        return radius(d.deal_value)
                                    else {
                                        return radius(d.pipeline_value)
                                    }

                                });

                            tooltip
                                .attr({opacity: 0, transform: 'translate(-400,-400)'})
                        })

                    bubbleElement
                        .append('circle')
                        .attr('class', 'shadow')
                        .style('fill', 'rgba(0,0,0,0.3)')
                        .attr('r', function (d, i) { return radius(d.deal_value); })
                        .attr('cx', function (d, i) { return x(d.ltd_velocity) + 2 })
                        .attr('cy', function (d, i) { return y(d.ltd_conv_rate) + 2 })
                        .attr('opacity', 0)
                        .transition()
                        .delay(function (d, i) { return 2000 + 50 * i })
                        .attr('opacity', 1)
                    bubbleElement
                        .append('circle')
                        .attr('class', 'bubble-circle')
                        .style('fill', function (d, i) { return d.color })
                        .attr('r', 0)
                        .attr('cx', function (d, i) { return x(d.ltd_velocity) })
                        .attr('cy', function (d, i) { return y(d.ltd_conv_rate) })
                        .attr('opacity', 0)

                        .transition()
                        .delay(function (d, i) { return 500 + 100 * i })
                        .attr('opacity', 1)
                        .attr('r', function (d, i) { return radius(d.deal_value); })


                    legend = chart
                        .append('g')
                        .attr('class', 'legend-area')
                        .attr('transform', 'translate(' + (parentWidth - 400) + ', ' + (parentHeight - 100 - bottomCut - legendElementHeight * data.length) / 2 + ')');

                    legendElement = legend
                        .selectAll('.legend-element')
                        .data(data)
                        .enter()
                        .append('g')
                        .attr('class', 'legend-element')
                        .attr('transform', function (d, i) {
                            return 'translate(0,' + 50 * i + ')'
                        })
                        .attr('opacity', 0)

                    legendElement
                        .append('text')
                        .attr('style', 'font-size: 18px; fill:#444;font-weight: 100')
                        .text(function (d, i) { return d.channel })
                        .attr('transform', function (d, i) { return 'translate(30, 32)' })
                    legendElement
                        .append('circle')
                        .style('fill', function (d, i) {
                            return d.color
                        })
                        .attr('r', 1)
                        .attr('cx', 12)
                        .attr('cy', 25)
                        .attr('opacity', 0)
                        .transition()
                        .delay(function (d, i) {
                            return 3000 + 100 * i;
                        })
                        .attr('opacity', 1)
                        .attr('r', 4)

                    legendElement
                        .transition()
                        .delay(function (d, i) {
                            return 2000 + 100 * i;
                        })
                        .attr('opacity', 1);


                    tooltip = chart
                        .append('g')
                        .data(data)
                        .attr({class: 'tooltip-area', opacity: 0, transform: 'translate(-400,-400)'});
                    tooltip.append('rect')
                        .attr('style', 'fill:rgba(0,0,0,0.3);')
                        .attr('width', 200)
                        .attr('height', 120)
                        .attr('transform', 'translate(4,4)')
                    tooltip.append('rect')
                        .attr('style', 'fill:white; stroke:#ddd; stroke-width:1px;')
                        .attr('width', 200)
                        .attr('height', 120)
                    var tooltipPointerTop = tooltip.append('polygon')
                        .attr('class', 'top-pointer')
                        .attr('style', 'fill:white; stroke:#ddd; stroke-width:1px;')
                        .attr('points', '100 -10, 110 0, 90,0')

                    var tooltipPointerBottom = tooltip.append('polygon')
                        .attr('class', 'bottom-pointer')
                        .attr('style', 'fill:white; stroke:#ddd; stroke-width:1px;')
                        .attr('points', '100 10, 110 0, 90,0')
                        .attr('transform', 'translate(0,120)')


                    tooltipTitle = tooltip.append('text')
                        .attr('class', 'tooltip-title')
                        .attr('transform', 'translate(100,30)')

                    tooltipVelocity = tooltip.append('text')
                        .attr('class', 'tooltip-velocity')
                        .attr('transform', 'translate(20,60)')

                    tooltipConvRate = tooltip.append('text')
                        .attr('class', 'tooltip-conv-rate')
                        .attr('transform', 'translate(20,80)')

                    tooltipValue = tooltip.append('text')
                        .attr('class', 'tooltip-value')
                        .attr('transform', 'translate(20,100)')


                    tooltipVelocityValue = tooltip.append('text')
                        .attr('class', 'tooltip-velocity')
                        .attr('transform', 'translate(110,60)')

                    tooltipConvRateValue = tooltip.append('text')
                        .attr('class', 'tooltip-conv-rate')
                        .attr('transform', 'translate(110,80)')

                    tooltipValueValue = tooltip.append('text')
                        .attr('class', 'tooltip-value')
                        .attr('transform', 'translate(110,100)')


                }

                function buildChartTable() {
                    var tableRow, tableHeader;
                    chartTable = d3.select(element[0])
                        .append('table')
                        .attr('class', 'bubble-chart-table')

                    tableHeader = chartTable.append('tr').attr('class', 'header-row');
                    tableHeader.append('th').html('Channel')

                    tableHeader.append('th').attr('class', 'pipeline-cell').style('display', 'none').html('LTO Velocity')
                    tableHeader.append('th').attr('class', 'pipeline-cell').style('display', 'none').html('LTO Conversion Rate')
                    tableHeader.append('th').attr('class', 'pipeline-cell').style('display', 'none').html('Pipeline Value')

                    tableHeader.append('th').attr('class', 'revenue-cell').html('LTD Velocity')
                    tableHeader.append('th').attr('class', 'revenue-cell').html('LTD Conversion Rate')
                    tableHeader.append('th').attr('class', 'revenue-cell').html('Deal Value')


                    tableRow = chartTable
                        .selectAll('tr.data-row')
                        .data(data)
                        .enter()
                        .append('tr')
                        .attr('class', 'data-row');


                    tableRow.append('td').html(function (d, i) { return d.channel });
                    tableRow.append('td').attr('class', 'revenue-cell').html(function (d, i) { return d.ltd_velocity });
                    tableRow.append('td').attr('class', 'revenue-cell').html(function (d, i) {
                        var formatter = d3.format(".0%");
                        return formatter(d.ltd_conv_rate)
                    });
                    tableRow.append('td').attr('class', 'revenue-cell').html(function (d, i) { return '$' + d.deal_value });
                    tableRow.append('td').attr('class', 'pipeline-cell').style('display', 'none').html(function (d, i) { return d.lto_velocity });
                    tableRow.append('td').attr('class', 'pipeline-cell').style('display', 'none').html(function (d, i) {
                        var formatter = d3.format(".0%");
                        return formatter(d.lto_conv_rate)
                    });
                    tableRow.append('td').attr('class', 'pipeline-cell').style('display', 'none').html(function (d, i) { return '$' + d.pipeline_value })


                }

            }
        };
    });

