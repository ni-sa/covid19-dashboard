$(function () {
    typewriter();
    tableUS();
    donutChartCA();
    barChartCA();
    bubbleChartWorld();
    cardTotalsWorld();
});

// -------------------- Typewriter --------------------
function typewriter() {
    new TypeIt("#typewriter", {
        strings: "COVID-19 Dashboard",
        speed: 50,
        waitUntilVisible: true
      }).go();
};

// -------------------- Table: United States --------------------
function tableUS() {
    $.ajax({
        url: "https://api.covidtracking.com/v1/states/current.json",
        type: "GET",
        dataType: "json",
        success: function (data) {
            // For loop
            $.each(data, function (key, value) {
                var html = "<tr>" +
                    "<td class='bg-light border-success'>" + value.state + "</td>" +
                    "<td>" + value.positive + "</td>" +
                    "<td>" + value.hospitalized + "</td>" +
                    "<td>" + value.death + "</td>" +
                    "</tr>";
                $("table > tbody").append(html);            
            });
            // Format numbers
            $("#tableUS > tbody td").each(function () {
                var num = $(this).text();
                var commaNum = numberWithCommas(num);
                $(this).text(commaNum);
            });  
            // Last Updated 
            $("#lastUpdatedUS").append(data[0].lastUpdateEt);
        },
        error: function (data) {
            console.log(data);
        }
    });
};

function numberWithCommas(number) {
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
};

// -------------------- Donut Chart: California --------------------
function donutChartCA() {
    $.ajax({
        url: "https://raw.githubusercontent.com/datadesk/california-coronavirus-data/master/cdph-population-race-ethnicity.csv",
        type: "GET",
        dataType: "text",
        success: function (data) {
            // Parse CSV
            Papa.parse(data, {
                header: true,
                complete: function(results) {
                    var dataItem = results.data[18];
                    // Chart
                    new Chart(document.getElementById("donutChartCA"), {
                        type: "doughnut",
                        data: {
                          labels: ["Asian", "Black", "Latino", "Multirace", "Native Hawaiian or Pacific Islander", "Other", "Unknown", "White"],
                          datasets: [
                            {
                              label: "Percentage",
                              backgroundColor: ["#3288bd", "#66c2a5","#abdda4","#e6f598","#fee08b", "#fdae61", "#f46d43", "#d53e4f"],
                              data: [dataItem.asian, dataItem.black, dataItem.latino, dataItem.multirace, dataItem.nhpi, dataItem.other, dataItem.unknown, dataItem.white]
                            }
                          ]
                        },
                        options: {
                          title: {
                            display: true,
                            text: "Los Angeles County: Population by Race and Ethnicity"
                          }
                        }
                    });
                }
            });
        },
        error: function (data) {
            console.log(data);
        }
    });
};

// -------------------- Bar Chart: California --------------------
function barChartCA() {
    $.ajax({
        url: "https://raw.githubusercontent.com/datadesk/california-coronavirus-data/master/cdph-state-totals.csv",
        type: "GET",
        dataType: "text",
        success: function (data) {
            // Parse CSV
            Papa.parse(data, {
                header: true,
                complete: function(results) {
                    var dataItem = results.data[0];
                    // Chart
                    new Chart(document.getElementById("barChartCA"), {
                        type: 'horizontalBar',
                        data: {
                          labels: ["Age 0-17", "Age 18-49", "Age 50-64", "Age 65 and Up"],
                          datasets: [
                            {
                              label: "Age",
                              backgroundColor: ["#2b83ba", "#abdda4","#fdae61","#d7191c"],
                              data: [dataItem.age_0_to_17, dataItem.age_18_to_49, dataItem.age_50_to_64, dataItem.age_65_and_up]
                            }
                          ]
                        },
                        options: {
                          legend: { display: false },
                          title: {
                            display: true,
                            text: "California: Latest Confirmed Cases by Age"
                          }
                        }
                    });
                }
            });
        },
        error: function (data) {
            console.log(data);
        }
    });
};

// -------------------- World Totals --------------------
function cardTotalsWorld() {
    $.ajax({
        url: "https://disease.sh/v3/covid-19/all",
        type: "GET",
        dataType: "json",
        success: function (data) {
            var cases = data.cases;
            var deaths = data.deaths;
            var recovered = data.recovered;
            // Append
            $("#casesWorld").append(cases);
            $("#deathsWorld").append(deaths);
            $("#recoveredWorld").append(recovered);
            // Format numbers
            $("#casesWorld, #deathsWorld, #recoveredWorld").each(function () {
                var num = $(this).text();
                var commaNum = numberWithCommas(num);
                $(this).text(commaNum);
            });  
        },
        error: function (data) {
            console.log(data);
        }
    });

}

// -------------------- Bubble Chart --------------------
function bubbleChartWorld() {
    $.ajax({
        url: "https://disease.sh/v3/covid-19/continents",
        type: "GET",
        dataType: "json",
        success: function (data) {
            var northAmerica = data[0];
            var asia = data[1];
            var southAmerica = data[2];
            var europe = data[3];
            var africa = data[4];
            var australiaOceania = data[5];
            // Chart
            new Chart(document.getElementById("bubbleChartWorld"), {
                type: "bubble",
                data: {
                    labels: "Continents",
                    datasets: [
                        {
                            label: ["North America"],
                            backgroundColor: "rgba(50,136,189,0.25)",
                            borderColor: "rgba(50,136,189,1)",
                            data: [{
                                x: northAmerica.casesPerOneMillion,
                                y: northAmerica.testsPerOneMillion,
                                r: northAmerica.deathsPerOneMillion/10
                            }]
                        }, {
                            label: ["South America"],
                            backgroundColor: "rgba(153,213,148,0.25)",
                            borderColor: "rgba(153,213,148,1)",
                            data: [{
                                x: southAmerica.casesPerOneMillion,
                                y: southAmerica.testsPerOneMillion,
                                r: southAmerica.deathsPerOneMillion/10
                            }]
                        }, {
                            label: ["Europe"],
                            backgroundColor: "rgba(254,224,139,0.25)",
                            borderColor: "rgba(254,224,139,1)",
                            data: [{
                                x: europe.casesPerOneMillion,
                                y: europe.testsPerOneMillion,
                                r: europe.deathsPerOneMillion/10
                            }]
                        }, {
                            label: ["Asia"],
                            backgroundColor: "rgba(253,174,97,0.25)",
                            borderColor: "rgba(253,174,97,1)",
                            data: [{
                                x: asia.casesPerOneMillion,
                                y: asia.testsPerOneMillion,
                                r: asia.deathsPerOneMillion/10
                            }]
                        }, {
                            label: ["Africa"],
                            backgroundColor: "rgba(244,109,67,0.25)",
                            borderColor: "rgba(244,109,67,1)",
                            data: [{
                                x: africa.casesPerOneMillion,
                                y: africa.testsPerOneMillion,
                                r: africa.deathsPerOneMillion/10
                            }]
                        }, {
                            label: ["Australia/Oceania"],
                            backgroundColor: "rgba(213,62,79,0.25)",
                            borderColor: "rgba(213,62,79,1)",
                            data: [{
                                x: australiaOceania.casesPerOneMillion,
                                y: australiaOceania.testsPerOneMillion,
                                r: australiaOceania.deathsPerOneMillion/10
                            }]
                        }
                    ]
                },
                options: {
                    title: {
                        display: true,
                        text: "Totals for All Continents (Per One Million)"
                    }, scales: {
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: "Tests"
                            }
                        }],
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: "Deaths"
                            }
                        }]
                    }
                }
            });
        },
        error: function (data) {
            console.log(data);
        }
    });
};