jQuery(document).ready(function( $ ) {

    var AIRPORTS_LIST = Object.keys(AIRPORTS_MAP);

    var blank_rfq = {"copilot":false, "notes":"",
    "from":"", "faa_from":"",
    "to":"", "faa_to":"", "round_trip":false,};

    virgin = true;
    //var json_repr = blank_rfq;

    var modal_lat = null;
    var modal_lng = null;
    var modal_origin = "";




        $('#map-modal').on('shown.bs.modal', function() {
            $("#map-canvas").empty();
            initialize_map(modal_lat, modal_lng, modal_origin);
        });

        $('#search-origin').typeahead({
            hint: true,
            minLength: 3,
            highlight: true,
        },
        {
            name: 'my-dataset',
            displayKey: 'value',
            source: substringMatcher(),
        });

        $("#charter_leg").find(".aa_airport_loc_input").typeahead({
            hint: true,
            minLength: 3,
            highlight: true,
        },
        {
            name: 'my-dataset',
            displayKey: 'value',
            source: substringMatcher(),
        });

        apply_leg_callbacks();

        $("#search-go").button().click( function(event) {
            search_box_go(event);
        });

        $("#search-back").button().click( function(event) {
            $("#map-modal").modal("hide");
        });


        $("#search-origin").keydown( function(event) {
            if (event.keyCode == 13) {
                search_box_go(event);
            }
        });

        $("#search-origin").click(function() {
            $(this).select();
        });


    //     $("#next_button").button();
    //
    //     $("#next_button").button().click(function(event) {
    //         //event.preventDefault();
    //         generate_estimate();
    //     });



    var substringMatcher = function() {
        return function findMatches(q, cb) {
            var matches, substrRegex;

            strs = AIRPORTS_LIST;

            // an array that will be populated with substring matches
            matches = [];

            // regex used to determine if a string contains the substring `q`
            substrRegex = new RegExp(q, 'i');
            kregx = null;

            if ((q[0] == 'k' || q[0] == 'K') && q.length == 4) {
                kregx = new RegExp('^' + q.substring(1), 'i');
            }


            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function(i, str) {
                if (substrRegex.test(str)) {
                    // the typeahead jQuery plugin expects suggestions to a
                    // JavaScript object, refer to typeahead docs for more info
                    matches.push({ value: str });
                }
                if (kregx != null) {
                    if (kregx.test(str)) {
                        // the typeahead jQuery plugin expects suggestions to a
                        // JavaScript object, refer to typeahead docs for more info
                        matches.push({ value: str });
                    }
                }
            });

            cb(matches);
        };
    };

    function get_air_speed(distance) {
        if (distance <= 50.0) {
            return 85.0;
        }
        else if (distance <= 100.0) {
            return 120.0;
        }
        else if (distance <= 200.0) {
            return 140.0;
        }
        else if (distance <= 350.0) {
            return 155.0;
        }
        else return 165.0;
    };

    function process_leg(leg_data) {
        // check for data
        from = leg_data['from'];
        to = leg_data['to'];
        dep_date = leg_data['date'];
        dep_time = leg_data['time'];
        from_ok = false;
        to_ok = false;
        date_ok = false;
        if (from != "" && from in AIRPORTS_MAP) {
            from_ok = true;
        }
        if (to != "" && to in AIRPORTS_MAP) {
            to_ok = true;
        }

        leg_result = { 'from_ok': from_ok, 'to_ok': to_ok, 'date_ok': date_ok };

        // if data ok, compute FT, ETA
        if (from_ok && to_ok) {
            leg_result['ft_out'] = compute_flight_time(from, to);
        }

        return leg_result;
    };

    function compute_flight_time(from, to) {
        from_airport = AIRPORTS_MAP[from];
        to_airport = AIRPORTS_MAP[to];
        from_lat = from_airport['lat'];
        from_long = from_airport['lng'];
        to_lat = to_airport['lat'];
        to_long = to_airport['lng'];
        distance = great_circle_distance(from_lat, from_long, to_lat, to_long);

        airspeed = get_air_speed(distance);
        time = distance/airspeed;
        return time;
    }

    // function compute_eta(from, to, dep_datetime) {
    //     time = compute_flight_time(from, to);
    //     diff = time * 60.0 * 60.0 * 1000.0;
    //     arr_datetime = dep_datetime + diff;
    //     return new Date(arr_datetime);
    // }

    function search_box_go(event) {
        origin_loc = $("#search-origin").val();
        if (origin_loc in AIRPORTS_MAP) {
            origin_rec = AIRPORTS_MAP[origin_loc];
            $("#map-canvas").empty();
            initialize_map(origin_rec['lat'], origin_rec['lng'], origin_loc);
        }
        else {
            // do a google geocoding call
            geocoder = new google.maps.Geocoder();
            geocoder.geocode( { 'address': origin_loc}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    $("#map-canvas").empty();
                    initialize_map(results[0].geometry.location.lat(),
                        results[0].geometry.location.lng(),
                        results[0].formatted_address);

                } else {
                    alert("Google Maps could not locate " + origin_loc + " (" + status + ")");
                }
            });
        }

    }

    function create_map(lat, lng, origin) {
        modal_lat = lat;
        modal_lng = lng;
        modal_origin = origin;
        $("#map-modal").modal("show");
    //     initialize_map(modal_lat, modal_lng, modal_origin);
    }




    function get_airport_symbol(key_string) {
        record = get_airport_record(key_string);
        if (record != null) {
            return record['faa']
        }
        return null;
    }

    function collect_leg_data(leg_elem) {
        leg_data = {};
    //     leg_data['id'] = leg_elem.attr('id');
    //     locations = leg_elem.find(".aa_airport_loc_input");
        leg_data['from'] = leg_elem.find(".aa_airport_from_loc.tt-input")[0].value;
        leg_data['to'] = leg_elem.find(".aa_airport_to_loc.tt-input")[0].value;
        leg_data['faa_from'] = get_airport_symbol(leg_data['from']);
        leg_data['faa_to'] = get_airport_symbol(leg_data['to']);
        leg_data['copilot'] = leg_elem.find(".aa_copilot")[0].checked;
        leg_data['roundtrip'] = leg_elem.find(".aa_roundtrip")[0].checked;
        console.log("leg_data", leg_data);
        return leg_data;
    }

    function apply_leg_callbacks() {

        $(".map_button").click( function(event) {
            trip_leg = $(this).closest(".aa_trip_leg");
            if ($(this).hasClass("from_map_button")) {
                loc_input = trip_leg.find(".aa_airport_from_loc.tt-input");
            }
            else {
                loc_input = trip_leg.find(".aa_airport_to_loc.tt-input");
            }
            display_selection_map(loc_input[0]);
    //         g_airport_loc_input = loc_input[0];
        });

        $(".aa_airport_loc_input").blur( function(e, ui) {
            check_airport_loc_input($(this));
        });

        $(".aa_airport_loc_input").keydown( function(event) {
            if (event.keyCode == 13) {
                value = this.value;
                if (value in AIRPORTS_MAP) {
                    $(this).blur();
                }
                else {
                    display_selection_map(this);
                }
            }
        });

        $(".aa_airport_loc_input").click(function() {
            $(this).select();
        });

        $(".aa_copilot").change(function(event) {
            leg_div = $(".aa_trip_leg");
            try_to_set_eta(collect_leg_data(leg_div), leg_div);
        });

        $(".aa_roundtrip").change(function() {
            leg_div = $(".aa_trip_leg");
            try_to_set_eta(collect_leg_data(leg_div), leg_div);
        });

        // retrieve the cookie, if there is one, and set the data
        leg_data = get_cookie_rfq();
        leg_div = $(".aa_trip_leg");

        leg_div.find(".aa_roundtrip").prop('checked', leg_data['roundtrip']);
        leg_div.find(".aa_copilot").prop('checked', leg_data['copilot']);

        leg_div.find(".aa_airport_to_loc").val(leg_data['to']);
        leg_div.find(".aa_airport_from_loc").val(leg_data['from']);

        try_to_set_eta(leg_data, leg_div);
    }


    function get_airport_record(loc_name) {
        if (loc_name.length > 0) {
            sym = loc_name;
            if (sym in AIRPORTS_MAP) {
                return AIRPORTS_MAP[loc_name];
            }
            else {
                cap_sym = null;
                // if it's 3 characters, look for the IATA symbol
                if (loc_name.length == 3) {
                    cap_sym = loc_name.toUpperCase();
                }
                else if (loc_name.length == 4 && (loc_name[0] == 'k' || loc_name[0] == 'K')) {
                    cap_sym = loc_name.substring(1,4).toUpperCase();
                }
                if (cap_sym != null) {
                    for (akey in AIRPORTS_MAP) {
                        if (cap_sym == akey.substring(0,3)) {
                            return AIRPORTS_MAP[akey];
                        }
                    }
                }
            }
            return null;
        }
    }

    function check_all_inputs() {
        leg_divs = $(".aa_trip_leg");
        ok = true;
        for (i=0; i<leg_divs.length; i++) {
            leg_div = $(leg_divs[i]);
            from_location = leg_div.find(".aa_airport_from_loc");
            to_location = leg_div.find(".aa_airport_to_loc");
            ok = check_airport_loc_input(from_location) && ok;
            ok = check_airport_loc_input(to_location) && ok ;
        }
        return ok;
    }

    function check_airport_loc_input(loc_input_element) {
        var location = "";
        leg_div = loc_input_element.closest(".aa_trip_leg");
        leg_data = collect_leg_data(leg_div);
        result = false;
        if (loc_input_element.hasClass("aa_airport_from_loc")) {
            location = leg_data['from'];
        }
        else if (loc_input_element.hasClass("aa_airport_to_loc")) {
            location = leg_data['to'];
        }
        else return result;

        airport_record = get_airport_record(location);
        if (airport_record != null) {

            loc_input_element.removeClass("input_err");
            loc_input_element.addClass("input_ok");
            loc_input_element.val(airport_record['faa'] + ': ' + airport_record['name'])
            leg_data = collect_leg_data(leg_div);
            result = true;
        }
        else { //if (location != "") {
            loc_input_element.removeClass("input_ok");
            loc_input_element.addClass("input_err");
        }
        try_to_set_eta(leg_data, leg_div);
        return result;
    }

    function set_cookie(leg_data) {
        json = JSON.stringify(leg_data, null, 4);
        $.cookie("temp_rfq", json, {path:'/'});
    }

    function get_cookie_rfq() {
        var temp_rfq = {}
        temp_rfq_json = $.cookie("temp_rfq");
        console.log("temp_rfq:", temp_rfq_json);
        if (temp_rfq_json == null || temp_rfq_json == "") {
            temp_rfq = blank_rfq;
            $.cookie("temp_rfq", JSON.stringify(temp_rfq, null, 4), {path:'/'} );
        }
        else {
            temp_rfq = JSON.parse(temp_rfq_json);
        }
        return temp_rfq;
    }

    function try_to_set_eta(leg_data, leg_div) {
        leg_result = process_leg(leg_data);

        ft_elem = $($(leg_div).find(".aa_ft")[0]);
        ft_div = $($(leg_div).find(".aa_ft_div")[0]);
        estimate_elem = $($(leg_div).find(".aa_estimate")[0]);
        estimate_div = $($(leg_div).find(".aa_estimate_div")[0]);
        if ('ft_out' in leg_result) {
            ft = leg_result['ft_out'];
            ipart = Math.floor(ft);
            fpart = ft - ipart;
            mins = Math.floor(fpart * 60);
            if (mins < 10) {
                ft_str = ipart.toString() + ":0" + mins.toString();
            } else {
                ft_str = ipart.toString() + ':' + mins.toString();
            }
            ft_elem.addClass('ui-state-highlight');
            ft_div.removeClass('out');
            ft_div.addClass('in');
            ft_elem[0].innerText = ft_str;

            // do the estimate_map
            estimate_elem.addClass('ui-state-highlight');
            estimate_div.removeClass('out');
            estimate_div.addClass('in');
            estimate_elem[0].innerText = generate_estimate(leg_data);

            ed = $("#estimate-results");
            ed.effect("shake");
        }
        else {
            estimate_elem.removeClass('ui-state-highlight');
            estimate_div.removeClass('in');
            estimate_div.addClass('out');
            estimate_elem[0].innerText = "";

            ft_elem.removeClass('ui-state-highlight');
            ft_div.removeClass('in');
            ft_div.addClass('out');
            ft_elem[0].innerText = "";

        }
        // every time an attempt is made to calculate
        // an estimate, save the cookie
        set_cookie(leg_data);
    }

    function display_selection_map(location_input_elem) {
        g_airport_loc_input = location_input_elem;

        loc_input = location_input_elem.value;
        $("#search-origin")[0].value = loc_input;
        lat = "";
        lng = "";
        if (loc_input == "") {
            create_map(lat, lng, loc_input);
        }
        else if (loc_input in AIRPORTS_MAP) {
            airport_rec = AIRPORTS_MAP[loc_input];
            lat = airport_rec['lat'];
            lng = airport_rec['lng'];
            create_map(lat, lng, loc_input);
        }
        else {
            // do a google geocoding call
            geocoder = new google.maps.Geocoder();
            geocoder.geocode( { 'address': loc_input}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    lat = results[0].geometry.location.lat();
                    lng = results[0].geometry.location.lng();
                    create_map(lat, lng, results[0].formatted_address);
                } else {
                    alert("Google Maps could not locate " + loc_input + " (" + status + ")");
                }
            });
        }
    };


    function initialize_map(lat, lng, origin_text) {
        if (origin_text == "") {
            lat = "41.330056";
            lng = "-72.045139";
            origin_text = "GON:GROTON-NEW LONDON";
        }

        center = new google.maps.LatLng(lat, lng);
        var mapOptions = {
            zoom: 9,
            center: center,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        canvas = document.getElementById('map-canvas');
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        map.setCenter(center);

        //url = 'http://24.147.33.205:5000/radius/' + lat + '/' + lng + '/40';
        var originMarker = new google.maps.Marker({
            map: map,
            position: center,
            title: origin_text
        });
        oiwtext = '<p class="small">' + origin_text + '</p><p class="small">GROTON, CT</p>';
        originInfoWindow = new google.maps.InfoWindow({content:oiwtext});
        //originInfoWindow.open(map, originMarker);
        google.maps.event.addListener(originMarker, 'click', function() {
            originInfoWindow.open(map, originMarker);
        });

        airport_keys = AIRPORTS_LIST; //find_airports_within_radius(lat, lng, 800);
        image = '/static/images/Airport-Blue-icon-xsmall.png';
        for (var i = 0; i < airport_keys.length; i++) {
            var airport_key = airport_keys[i];
            var airport = AIRPORTS_MAP[airport_key];
            var myLatLng = new google.maps.LatLng(airport['lat'], airport['lng']);
            marker_title = airport_key;
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                icon: image,
                title: marker_title,
            });

            //console.log("map airport:", airport);

            info_content = '<div id="content" class="airport_info">' +
            '<p class="marker_title">' + marker.getTitle() + '<br/>' + airport['city'] + ', ' + airport['state'] + '</p>' +
            '<p> <button class="airport_marker_select">Select Airport</button></div></p>';

            infoWindow = new google.maps.InfoWindow({content:info_content});
            attach_info(marker, infoWindow);
        }


    };

    // airport info input control to receive selected airport name
    var g_airport_loc_input = null;

    function attach_info(marker, infoWindow) {
        google.maps.event.addListener(marker, 'click', function() {
            infoWindow.open(marker.get('map'), marker);
            buttons = $(".airport_marker_select");
            buttons.button().click( function(event) {
                // ai = $(this).closest(".airport_info");
                // mt = ai.find(".marker_title");
                // mt0 = mt[0];
                // selected = mt0.innerText;
                $(g_airport_loc_input).val(marker.title);
                $("#map-modal").modal("hide");
                check_airport_loc_input($(g_airport_loc_input));
            });
        });
    }


    // generate estimate
    function generate_estimate() {
        leg_elem = $(".aa_trip_leg");

        estimate_map = compute_estimate(collect_leg_data(leg_elem));
        s = '$' +  Math.floor(estimate_map['low']).toString() + ' to: $' + Math.floor(estimate_map['high']).toString();
        return s;
    }

    var operator = {
        "mileage_rate": 4.40,
        "copilot_fee": 400,
        "off_hours_rate": 100,
        "wait_time_rate": 100,
        "home_airport": "GON: GROTON-NEW LONDON",
        "max_range": 650,
        "name":"Action Airlines",
        "start_hours": "08:00",
        "end_hours": "20:00",
        "estimation_factor": 1.3,
        "turnaround_time_mins": 30,
        "min_air_mileage_charge": 800,
        "set_fares": [
            { "a": "GON", "b": "0B8", "fare": 500.00 },
            { "a": "GON", "b": "HTO", "fare": 750.00 },
            { "a": "GON", "b": "BID", "fare": 750.00 },
            { "a": "GON", "b": "MTP", "fare": 750.00 },
            { "a": "MTP", "b": "BID", "fare": 750.00 },
            { "a": "0B8", "b": "HTO", "fare": 750.00 },
            { "a": "0B8", "b": "MTP", "fare": 750.00 },
            { "a": "WST", "b": "MTP", "fare": 750.00 },
            { "a": "HTO", "b": "BID", "fare": 750.00 },
            { "a": "HTO", "b": "WST", "fare": 750.00 }
        ]
    }

    function flat_rate_charge(from_code, to_code, op) {
        set_fares = op['set_fares'];
        for (sf in set_fares) {
            if ( (from_code == sf['a'] && to_code == sf['b'])
             || (from_code == sf['b'] && to_code == sf['a']) ) {
                return sf['fare'];
            }
        }
        return 0.0;
    }

    function st_miles(to_airport, from_airport) {
        return knots_to_miles * great_circle_distance(to_airport['lat'],
                                                    to_airport['lng'],
                                                    from_airport['lat'],
                                                    from_airport['lng']);
    }

    function round_to_10(a) {
        if (a % 10.0 > 0.0) {
            return a - (a % 10.0) + 10.0;
        }
        return a;
    }

    function compute_estimate(leg) {

        mileage_rate = operator['mileage_rate'];
        copilot_fee = 0;
        if (leg["copilot"]) {
            copilot_fee = operator['copilot_fee'];
        }
        roundtrip = leg['roundtrip'];
        off_hours_rate = operator['off_hours_rate'];
        wait_time_rate = operator['wait_time_rate'];
        home_airport = operator['home_airport'];
        max_range = operator['max_range'];
        turnaround_time = operator['turnaround_time_mins'];

        total_smi = 0.0;
        total_mileage_fees = 0.0;
        total_landing_fees = 0.0;
        total_copilot_fees = 0.0;

        in_range = true;

        line_items = [];
        result = {};
        result['line_items'] = line_items;
        home = AIRPORTS_MAP[operator['home_airport']];
        leg_mileage_fee = 0.0;
        leg_landing_fees = 0.0;

        leg_items = {'cycles':[]};

        // a 'cycle' is one take-off to landing
        // a leg may consist of multiple cycles if the origin
        // is not the operator's "home" airport.
        // home to 'from' airport
        // 'from' to 'to' airport
        // 'to' to home airport
        if (leg['from'] != home_airport) {
            // home to origin cycle
            cycle_smi = st_miles(home, AIRPORTS_MAP[leg['from']]);
            if (cycle_smi > max_range) {
                in_range = false;
            }
            total_smi += cycle_smi;
            cycle_mileage_fee = cycle_smi * mileage_rate;
            leg_mileage_fee += cycle_mileage_fee;

        }

        // now the origin -> destination
        cycle_smi = st_miles(AIRPORTS_MAP[leg['from']], AIRPORTS_MAP[leg['to']]);
        if (cycle_smi > max_range) {
            in_range = false ;
        }
        total_smi += cycle_smi;
        cycle_mileage_fee = cycle_smi * mileage_rate;
        leg_mileage_fee += cycle_mileage_fee;
        from_ap = AIRPORTS_MAP[leg['from']];
        to_ap = AIRPORTS_MAP[leg['to']];
        landing_fees = from_ap['fees'] + to_ap['fees'];

        // now 'to' -> 'home' if necessary
        if (leg['to'] != home_airport) {
            // home to origin cycle
            cycle_smi = st_miles(home, AIRPORTS_MAP[leg['to']]);
            if (cycle_smi > max_range) {
                in_range = false ;
            }
            total_smi += cycle_smi;
            cycle_mileage_fee = cycle_smi * mileage_rate;
            leg_mileage_fee += cycle_mileage_fee;

        }

        // check for minimum charge
        if (leg_mileage_fee < operator['min_air_mileage_charge']) {
            leg_mileage_fee = operator['min_air_mileage_charge'];
        }

        flat_rate = flat_rate_charge(leg['from_faa'], leg['to_faa'], operator);

        // check for flat rate
        if ( flat_rate > 0.0) {
            leg_mileage_fee = flat_rate;
            landing_fees = 0.0;
        }

        low = round_to_10(leg_mileage_fee + landing_fees + copilot_fee);
        high = round_to_10((leg_mileage_fee * operator['estimation_factor']) + landing_fees + copilot_fee);

        if (roundtrip) {
            low = low * 2.0;
            high = high * 2.0;
        }

        return {"low": low, "high": high};

    }
});
