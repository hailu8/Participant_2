var year = 1988;
let url_GJD = new URL("http://localhost:8000/getjson-data");
url_GJD.search = new URLSearchParams({ "filename": "countries.json" }).toString();
let url_AIA = new URL("http://localhost:8000/allAthletesTORbyIncome");
url_AIA.search = new URLSearchParams({ "year": year.toString() }).toString();
let url_MCD = new URL("http://localhost:8000/allmedalistTORbyCountry");
url_MCD.search = new URLSearchParams({ "year": year.toString() }).toString();
let url_ACD = new URL("http://localhost:8000/allAthletesTORbyCountry");
url_ACD.search = new URLSearchParams({ "year": year.toString() }).toString();
let url_PID = new URL("http://localhost:8000/processed_income_data");
url_PID.search = new URLSearchParams({ "year": year.toString() }).toString();

Promise.all([
    fetch(url_GJD, { "credentials": "same-origin" }),
    fetch(url_AIA, { "credentials": "same-origin" }),
    fetch(url_MCD, { "credentials": "same-origin" }),
    fetch(url_ACD, { "credentials": "same-origin" }),
    fetch(url_PID, { "credentials": "same-origin" })
]).then(function(responses) {
    // Get a JSON object from each of the responses
    return Promise.all(responses.map(function(response) {
        return response.json();
    }));
}).then(function(data) {
    var json = data[0];
    var allIncomeData = data[1];
    var medalCountryData = data[2];
    var allCountryData = data[3];
    var incomeData = data[4];
    updateMap(json.features, incomeData, medalCountryData, allCountryData, year, 'all-athletes');
    plotTornado(allIncomeData, year, 'all-athletes');
});

selectBtn = document.querySelector('#yearDropdown');
selectBtn.addEventListener('change', function() {
    mapSelectAthlete = 'all-athletes';
    mapSelectAthlete2 = 'all-medalists';
    let year = selectBtn.value;
    //requesting data from backend based on year
    let url_GJD = new URL("http://localhost:8000/getjson-data");
    url_GJD.search = new URLSearchParams({ "filename": "countries.json" }).toString();
    let url_MID = new URL("http://localhost:8000/allmedalistTORbyIncome");
    url_MID.search = new URLSearchParams({ "year": year.toString() }).toString();
    let url_AIA = new URL("http://localhost:8000/allAthletesTORbyIncome");
    url_AIA.search = new URLSearchParams({ "year": year.toString() }).toString();
    let url_MCD = new URL("http://localhost:8000/allmedalistTORbyCountry");
    url_MCD.search = new URLSearchParams({ "year": year.toString() }).toString();
    let url_ACD = new URL("http://localhost:8000/allAthletesTORbyCountry");
    url_ACD.search = new URLSearchParams({ "year": year.toString() }).toString();
    let url_PID = new URL("http://localhost:8000/processed_income_data");
    url_PID.search = new URLSearchParams({ "year": year.toString() }).toString();

    Promise.all([
        fetch(url_GJD, { "credentials": "same-origin" }),
        fetch(url_MID, { "credentials": "same-origin" }),
        fetch(url_AIA, { "credentials": "same-origin" }),
        fetch(url_MCD, { "credentials": "same-origin" }),
        fetch(url_ACD, { "credentials": "same-origin" }),
        fetch(url_PID, { "credentials": "same-origin" })

        // (d3.json, 'data/countries.json')
    ]).then(function(responses) {
        // Get a JSON object from each of the responses
        return Promise.all(responses.map(function(response) {
            return response.json();
        }));
    }).then(function(data) {
        var json = data[0];
        var medalIncomeData = data[1];
        var allIncomeData = data[2];
        var medalCountryData = data[3];
        var allCountryData = data[4];
        var incomeData = data[5];
        updateMap(json.features, incomeData, medalCountryData, allCountryData, year, mapSelectAthlete);
        if (mapSelectAthlete === 'all-athletes') {
            plotTornado(allIncomeData, year, mapSelectAthlete);
        } else if (mapSelectAthlete2 === 'all-medalists') {
            plotTornado(medalIncomeData, year, mapSelectAthlete2);
        } else {
            console.log("not in here");
        }
    });
});


mapSelectAthleteBtn = document.querySelector("#athleteType").athleteTypeRadio;
//take the radio button value
var mapSelectYear = 1988;
for (var i = 0; i < mapSelectAthleteBtn.length; i++) {
    mapSelectAthleteBtn[i].addEventListener('change', function() {
        mapSelectAthlete = this.value;
        let url_MID = new URL("http://localhost:8000/allmedalistTORbyIncome");
        url_MID.search = new URLSearchParams({ "year": mapSelectYear.toString() }).toString();
        let url_AIA = new URL("http://localhost:8000/allAthletesTORbyIncome");
        url_AIA.search = new URLSearchParams({ "year": mapSelectYear.toString() }).toString();
        Promise.all([
            // fetch(url_GJD, { "credentials": "same-origin" }),
            fetch(url_MID, { "credentials": "same-origin" }),
            fetch(url_AIA, { "credentials": "same-origin" })
        ]).then(function(responses) {
            // Get a JSON object from each of the responses
            return Promise.all(responses.map(function(response) {
                return response.json();
            }));
        }).then(function(data) {
            // var json = data[0];
            var medalIncomeData = data[0];
            var allIncomeData = data[1];
            if (mapSelectAthlete === 'all-athletes') {
                plotTornado(allIncomeData, mapSelectYear, mapSelectAthlete);
            } else if (mapSelectAthlete === "all-medalists") {
                plotTornado(medalIncomeData, mapSelectYear, mapSelectAthlete);
            } else {
                console.log("not in here");
            }
        });
    });
}

function plotTornado(data, selectYear, selectMedal) {
    d3.selectAll(".tornado-svg").remove();
    var recieved = data['time']['Time_received_server'];
    var Total_time = data['time']['Total_query_time_AAI'];
    var execute_query_db = data['time']['execute_query_db'];
    var loop_query_db = data['time']['loop_query_db'];
    var finish_time = data['time']['Finish_time'];

    var Mrecieved = data['time']['Time_received_server'];
    var MTotal_time = data['time']['Total_query_time_AMI'];
    var Mexecute_query_db = data['time']['execute_query_db'];
    var Mloop_query_db = data['time']['loop_query_db'];
    var Mfinish_time = data['time']['Finish_time'];
    var time3 = Date.now();
    if (selectMedal === "all-athletes") {
        console.log("Person 2 in All-Athlete Tor function for year " + selectYear + ", the time requested is" + " " + time3 + ", the server got it at time " + recieved + ", server took " + Total_time + " total time" + ", the server returned at " + finish_time + " time," + " time taken to execute is" + " " + execute_query_db + ", to loop through all rows " + loop_query_db + " time was taken");
    } else if (selectMedal === "all-medalists") {
        console.log("Person 2 in All-Medalist Tor function for year " + selectYear + ", the time requested is" + " " + time3 + ", the server got it at time " + Mrecieved + ", server took " + MTotal_time + " total time" + ", the server returned at " + Mfinish_time + " time," + " time taken to execute is" + " " + Mexecute_query_db + " to loop through all rows " + Mloop_query_db + " time was taken");
    } else {
        console.log("not in here");
    }
    newdata = data['result'].filter(elem => elem.year === parseInt(selectYear));
    var age_group_ls = [];
    newdata.forEach(d => {
        age_group_ls.push(d.age);
    });
    var age_group = [...new Set(age_group_ls)].sort();
    //instead of using explicity ages, use range
    Array.range = (start, end) => Array.from({ length: (end - start) }, (v, k) => k + start);
    age_range = Array.range(Math.min.apply(null, age_group), Math.max.apply(null, age_group));
    income_ls = ["L", "LM", "UM", "H"];
    xScaleDict = { "L": null, "LM": null, "UM": null, "H": null };
    for (var i in income_ls) {
        levelData = newdata.filter(elem => (elem.income === income_ls[i]));
        var chart = tornadoChart(age_range, income_ls[i]);
        d3.select("#income-plot")
            .datum(levelData)
            .call(chart);
    }
}


//here we use the same x and y axis to draw different income-level countries
function tornadoChart(age_group, income_label) {

    //the first figure
    if (income_label === 'L') {
        var margin = { top: 20, right: 10, bottom: 40, left: 50 }
    } else {
        var margin = { top: 20, right: 10, bottom: 40, left: 20 }
    }

    width = 183 - margin.left - margin.right,
        height = 470 - margin.top - margin.bottom;

    x = d3.scaleLinear()
        .range([0, width]);
    //save it
    xScaleDict[income_label] = x;

    y = d3.scaleBand()
        .range([0, height])
        .padding(0.1)
        .round(0.1);

    var xAxis = d3.axisBottom(x).tickFormat(function(d) {
        if (d < 0) {
            d = -d;
        };
        return d;
    });

    yAxis = d3.axisLeft(y)
        .tickSize(0);

    svg = d3.select("#income-plot").append("svg")
        .attr("class", "tornado-svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("id", income_label)
        // .attr("data-legend",function(d) { return d.Sex})
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var tooltip = d3.tip()
        .attr("class", "d3-tip-tornado")
        .html((EVENT, d) => d.sex === 'M' ? "<div style='background-color:#9BCCF5'>Year:" + d.year + "<br>Gender: " + d.sex + "<br>Age: " + d.age + "<br>Medals: " + Math.abs(d.records) + "</div>" :
            "<div style='background-color:pink'>Year:" + d.year + "<br>Gender: " + d.sex + "<br>Age: " + d.age + "<br>Medals: " + Math.abs(d.records) + "</div>");

    svg.call(tooltip);

    function chart(selection) {
        selection.each(function(data) {

            x.domain(d3.extent(data, function(d) { return d.records; })).nice();
            xAxisTicks = x.ticks(7)
                .filter(tick => Number.isInteger(tick));
            xAxis.tickValues(xAxisTicks);
            //y.domain(data.map(function(d) { return d.Age; }));
            //x.domain(medal_range);

            income_dict = { 'L': 'Low-income', 'LM': 'Low-middle income', 'UM': 'Upper-middle income', 'H': 'High-income' }
                //x label
            svg.append('text')
                .attr('class', 'label')
                .attr('transform', 'translate(16, -7)')
                .text(income_dict[income_label]);


            y.domain(age_range);

            var minRecords = Math.min.apply(Math, data.map(function(o) { return o.records; }))


            yAxis.tickPadding(Math.abs(x(minRecords) - x(0)) + 10);
            yAxis.tickFormat(function(d) {
                return d % 2 === 0 ? d : '';
            })


            var bar = svg.selectAll(".bar")
                .data(data)

            bar.enter().append("rect")
                .attr("class", function(d) { return "bar bar--" + (d.records < 0 ? "negative" : "positive"); })
                .attr("x", function(d) { return x(Math.min(0, d.records)); })
                .attr("y", function(d) { return y(d.age); })
                .attr("width", function(d) { return Math.abs(x(d.records) - x(0)); })
                .attr("height", y.bandwidth())
                .on('mouseover', (event, d) => {
                    tooltip.show(event, d);
                })
                .on("mouseout", tooltip.hide);

            svg.append("g")
                .attr("class", "tornado-x-axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "tornado-y-axis")
                .attr("transform", "translate(" + x(0) + ",0)")
                .call(yAxis);

            //x label
            svg.append('text')
                .attr('class', 'label')
                .attr('transform', 'translate(0, 450)')
                .text('Number of Athletes');

            //y label
            if (income_label === 'L') {
                svg.append('text')
                    .attr('class', 'label')
                    .attr('transform', 'translate(-30,200) rotate(270)')
                    .text('Age');

            }


        });


    }

    return chart;
}

//darker bars for selected country
function plotCountryBar(countryData, selectCountry, selectYear, selectMedal) {
    d3.selectAll(".newbar").remove();
    d3.selectAll(".newbar-tornado-y-axis").remove();
    newCountry = countryData['result'].filter(elem => (elem.years === parseInt(selectYear) && elem.team === selectCountry));
    if (newCountry.length === 0) {
        return (`Sorry, we don't have the Olympic data of ${selectCountry} at year ${selectYear}`);
    } else {
        var newbar = d3.select("#" + newCountry[0].income)
            .selectAll(".newbar")
            .data(newCountry);

        //tooltips for the new bar
        var newtooltip = d3.tip()
            .attr("class", "newbar-d3-tip-tornado")
            .html((EVENT, d) => d.sex === 'M' ? "<div style='background-color:steelblue; color:white'>Country: " + d.team + "<br>Year:" + d.years + "<br>Gender: " + d.sex + "<br>Age: " + d.age + "<br>Medals: " + Math.abs(d.records) + "</div>" :
                "<div style='background-color:brown; color:white'>Country: " + d.team + "<br>Year:" + d.years + "<br>Gender: " + d.sex + "<br>Age: " + d.age + "<br>Medals: " + Math.abs(d.records) + "</div>");

        svg.call(newtooltip);
        x = xScaleDict[newCountry[0].income];

        newbar.enter().append("rect")
            .attr("class", function(d) { return "newbar newbar--" + (d.records < 0 ? "negative" : "positive"); })
            .attr("x", function(d) { return x(Math.min(0, d.records)); })
            .attr("y", function(d) { return y(d.age); })
            .attr("width", function(d) { return Math.abs(x(d.records) - x(0)); })
            .attr("height", y.bandwidth())
            .on('mouseover', newtooltip.show)
            .on("mouseout", newtooltip.hide);

        //if don't call the axis again, bars will be connected

        purey = d3.scaleBand()
            .range([0, height])
            .padding(0.1)
            .round(0.1);

        pureyAxis = d3.axisLeft(purey)
            .tickSize(0);

        d3.select("#" + newCountry[0].income).append("g")
            .attr("class", "newbar-tornado-y-axis")
            .attr("transform", "translate(" + x(0) + ",0)")
            .call(pureyAxis);
        return true;
    }
}

function updateMap(jsonFeature, getData, medalCountryData, allCountryData, selectYear, selectMedal) {
    var recieved = getData['time']['Time_received_server'];
    var Total_time = getData['time']['Total_query_time_PID'];
    var execute_query_db = getData['time']['execute_query_db'];
    var loop_query_db = getData['time']['loop_query_db'];
    var finish_time = getData['time']['Finish_time'];

    var time = Date.now() / 1000;
    console.log("Person 2 in map(PID) function for year " + selectYear + " the time requested is" + " " + time + ", the server got it at time " + recieved + ", server took " + Total_time + " total time" + ", the server returned at " + finish_time + " time" + ", time taken to execute(sql) is" + " " + execute_query_db + ", to loop through all rows " + loop_query_db + " time was taken");

    d3.select("#mapsvg").remove();
    d3.selectAll(".legend").remove();
    //init
    var format = d3.format(",");
    // var margin = {top: 0, right: 0, bottom: 0, left: 0},
    var margin = { top: 0, right: 0, bottom: 0, left: 0 };
    width = 620 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;
    scale0 = (width - 1) / 2 / Math.PI, active = d3.select(null);
    var projection = d3.geoMercator()
        .translate([width / 2, height / 2])
        .center([0, 20])
        .scale(110);
    // .scale([100])
    //  .rotate([0,0]);

    var path = d3.geoPath().projection(projection);
    var subgroups = ["L", "LM", "UM", "H", "NA"];
    var numSubgroups = [0, 1, 2, 3, 4];
    var legendText = ["Low Income", "Low Middle", "Upper Middle", "High Income", "NA"];
    var colorMap = {};
    subgroups.forEach((key, i) => colorMap[key] = numSubgroups[i]);
    var colorTextMap = {};
    legendText.forEach((key, i) => colorTextMap[key] = numSubgroups[i]);
    var color = d3.scaleOrdinal()
        .domain(numSubgroups)
        .range(["#F8171B", "#FFC107", "#DCF39C", "#99CC32", "rgb(128,128,128)"]);
    // .range(["rgb(215, 25, 28)","rgb(253,174,97)","rgb(254,224,139)","rgb(171,221,164)" , "rgb(0,0,0)"]);
    //legend
    var legend = d3.select("#legends").append("svg")
        .attr("class", "legend")
        .attr("width", 120)
        .attr("height", 180)
        .selectAll("g")
        .data(legendText)
        .enter()
        .append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 25 + ")"; });
    legend.append("rect")
        .attr("width", 16)
        .attr("height", 16)
        .style("fill", function(d) { return color(colorTextMap[d]) });
    legend.append("text")
        .data(legendText)
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function(d) { return d; });

    //plot
    selectYear = parseInt(selectYear);
    // width = 600 - margin.left - margin.right,
    // height = 550- margin.top - margin.bottom;
    width = 750,
        height = 400;
    var svg = d3.select("#map")
        .append("svg")
        .attr("id", "mapsvg")
        .attr("width", width)
        .attr("height", height);


    var tip = d3.tip()
        .attr('class', 'd3-tip-map')
        .html((EVENT, d) => "<div style='background-color:black; color:white'>Country: " + d.properties.name + "</div>");
    // .offset([-5, 0]);
    //if no results
    var errortip = d3.tip()
        .attr('class', 'd3-tip-map')
        .offset([-109, 0])
        .html((EVENT, d) => "Sorry, we don't have Olympics data of " + d.properties.name);


    svg.call(tip);
    svg.call(errortip);

    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', (event) => {
            svg.selectAll('path').attr('transform', event.transform);
        });


    //recolor
    var Scheme = svg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(jsonFeature)
        .enter()
        .append("path")
        .attr('class', 'path')
        .attr("d", path)
        //.on("click", reset)
        .call(zoom)
        .style("stroke", "#fff")
        .style("stroke-width", "1");


    Scheme.attr("fill", function(d) {
            tmpData = [];
            //start from 1987
            tmpData = getData['result'][selectYear].filter(countries => countries.country === d.properties.name);
            //default color
            var nowColor = 'rgb(128,128,128)';
            //some countries have missing years
            if (tmpData.length !== 0) {
                nowColor = color(colorMap[tmpData[0].income]);
            }
            return nowColor;

        })
        .style('stroke', 'white')
        .style('stroke-width', 1.5)
        .style("opacity", 0.8)
        .style("stroke", "white")
        .style('stroke-width', 0.3)
        .on('mouseover', (event, d) => {
            d3.select(event.currentTarget)
                .style("opacity", 1)
                .style("stroke", "white")
                .style("stroke-width", 3)
                .style("left", d + "px");
            tip.show(event, d);

        });

    Scheme.on('click', (event, d) => {
            console.log("Person 2 looking at darker plot");
            if (selectMedal === 'all-athletes') {
                barorNot = plotCountryBar(allCountryData, d.properties.name, selectYear, selectMedal);
            } else {
                barorNot = plotCountryBar(medalCountryData, d.properties.name, selectYear, selectMedal);
            }
            if (barorNot !== true) {
                errortip.show(event, d);
                d3.select(event.currentTarget)
                    .style("opacity", 1)
                    .style("stroke", "white")
                    .style("stroke-width", 3);
            }
        })
        .on('mouseout', (event, d) => {
            errortip.hide(event, d);
            tip.hide(event, d);
            d3.select(event.currentTarget)
                .style("opacity", 0.8)
                .style("stroke", "white")
                .style("stroke-width", 0.3);
        });

    d3.select('#zoom-in').on('click', function() {
        // Smooth zooming
        console.log("Person 2 used zoom in");
        zoom.scaleBy(svg.transition().duration(750), 1.3);
    });

    d3.select('#zoom-out').on('click', function() {
        console.log("Person 2 used zoom out");
        // Ordinal zooming
        zoom.scaleBy(svg, 1 / 1.3);
    });

    d3.select('#resetMap').on('click', function() {
        console.log("Person 2 used reset button");
        active.classed("active", false);
        active = d3.select(null);
        svg.transition()
            .duration(300)
            // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
            .call(zoom.transform, d3.zoomIdentity); // updated for d3 v4  
    });

}