window.addEventListener('load', function(){
    var timeframe = document.querySelector('#idx_dashboard_widget #timeframeswitch');
    var leadsOverviewButton = document.querySelector('#idx_dashboard_widget .leads');
    var listingsOverviewButton = document.querySelector('#idx_dashboard_widget .listings');
    var loader = document.querySelector('.idx-loader');
    var leadsOverviewContainer = document.querySelector('#idx_dashboard_widget .leads-overview');
    var listingsOverviewContainer = document.querySelector('#idx_dashboard_widget .listings-overview');

    function getTimeframe(){
        var value = timeframe.checked;
        if(value === true){
            return 'month';
        } else {
            return 'day';
        }
    }

    function leadsChart(){
        //show loader
        loader.style.display = 'block';
        document.querySelector('#idx_dashboard_widget .week-day-label').innerHTML = 'Day';
        listingsOverviewContainer.style.display = 'none';
        leadsOverviewContainer.style.display = 'block';
        leadsOverviewContainer.style.opacity = 0;
        //load json data
        jQuery.post(
            ajaxurl, {
                'action': 'idx_dashboard_leads',
                'timeframe' : getTimeframe()
        }).done(function(jsonData){
            //handle error
            if(jsonData === 'No Leads Returned'){
                loader.style.display = 'none';
                leadsOverviewContainer.style.opacity = 1;
                return leadsOverviewContainer.innerHTML = jsonData;
            }
            var data = google.visualization.arrayToDataTable(JSON.parse(jsonData));

            var options = {
                title: 'Lead Statistics',
                hAxis: {title: 'Date',  titleTextStyle: {color: '#333'}},
                //no negative values, no repeat or decimals
                vAxis: {minValue: 0, maxValue: 4, format: '#'},
                legend: {position: 'in'},
                axisTitlesPosition: 'out',
                theme: 'maximized',
                //show animation
                animation: {
                    startup: true,
                    duration: 500
                }
            };

            var chart = new google.visualization.AreaChart(document.querySelector('.leads-overview'));
            chart.draw(data, options);

            leadsOverviewContainer.style.display = 'block';
            leadsOverviewContainer.style.opacity = 1;
            return loader.style.display = 'none';
        }); 
    }

    function listingsChart(){
        //show loader
        loader.style.display = 'block';
        document.querySelector('#idx_dashboard_widget .week-day-label').innerHTML = 'Week';
        leadsOverviewContainer.style.display = 'none';
        listingsOverviewContainer.style.display = 'block';
        listingsOverviewContainer.style.opacity = 0;
        //load json data
        jQuery.post(
            ajaxurl, {
                'action': 'idx_dashboard_listings',
                'timeframe' : getTimeframe()
        }).done(function(jsonData){
            //handle error
            if(jsonData === 'No Listings Returned'){
                loader.style.display = 'none';
                listingsOverviewContainer.style.opacity = 1;
                return document.querySelector('.listings-overview').innerHTML = jsonData;
            }
            var data = google.visualization.arrayToDataTable(JSON.parse(jsonData));

            var options = {
                title: 'Listing Statistics',
                pieHole: 0.4,
                //show animation
                animation: {
                    startup: true,
                    duration: 500
                }
            };

            var chart = new google.visualization.PieChart(document.querySelector('.listings-overview'));
            chart.draw(data, options);

            listingsOverviewContainer.style.display = 'block';
            listingsOverviewContainer.style.opacity = 1;

            return loader.style.display = 'none';
        }); 
 
    }

    function getLeads(){
        google.charts.setOnLoadCallback(leadsChart);
    }

    function getListings(){
        google.charts.setOnLoadCallback(listingsChart);
    }

    function initialLoad(){
        //load Leads Chart
        google.charts.load('current', {'packages':['corechart']});
        listenToButtons();
        //load chart on page load
        getLeads();
    }

    function listingOverview(event){
        event.preventDefault();
        listingsOverviewButton.classList.remove('button-primary');
        listingsOverviewButton.disabled = true;
        leadsOverviewButton.disabled = false;
        leadsOverviewButton.classList.add('button-primary');
        getListings();
    }

    function leadOverview(event){
        event.preventDefault();
        leadsOverviewButton.classList.remove('button-primary');
        leadsOverviewButton.disabled = true;
        listingsOverviewButton.disabled = false;
        listingsOverviewButton.classList.add('button-primary');
        getLeads();
    }

    function timeframeChange(){
        if(leadsOverviewButton.disabled === true){
            getLeads();
        } else {
            getListings();
        }
    }

    function listenToButtons(){
        //reload chart when timeframe is changed
        timeframe.addEventListener('change', timeframeChange);
        //change view when listing
        listingsOverviewButton.addEventListener('click', listingOverview);
        leadsOverviewButton.addEventListener('click', leadOverview);
    }

    initialLoad();
});
