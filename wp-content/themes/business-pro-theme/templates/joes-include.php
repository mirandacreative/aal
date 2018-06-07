

<!-- map div -->
<div id="map-modal" class="modal">
    <div class="modal-dialog map-dialog modal-lg" data-backdrop="false" id='selection_map'>
        <div class="modal-content" >
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title">Choose an Airport</h4>
            </div>
            <div class="modal-body">
                    <div id="map-controls" >
                        <p>
                            <button style="vertical-align:-10%;" id='search-back' class="btn btn-default btn-xs"><span class="glyphicon glyphicon-chevron-left"></span> Back</button>
                            <input type='text' id='search-origin' autocorrect="off" style='width:180px;' placeholder="Enter a city to search near..." title="Enter an airport code, e.g., PVD, or a city/town and state. e.g., Worcester, MA"></input>
                            <button style="vertical-align:-10%;" id='search-go'class="btn btn-default btn-xs"><span class="glyphicon glyphicon-search"></span> Search</button>
                        </p>
                    </div>
                    <div id="map-canvas"></div>
            </div> <!-- end body -->
        </div>
    </div>
</div>

<!-- Main content container -->
<div class ="container" id="all-content">

    <div class="row">
        <div class="col-xs-12 col-sm-6 col-md-4">
            <!-- destinations and dates -->
            <div class = "panel panel-info aa_trip_leg" rfq-id="" id="charter_leg">
                    <input class="aa_roundtrip" type="checkbox" id="roundtrip.0"/>
                    <label for="roundtrip.0">Round Trip</label>
                     <br/>

                    <input class="aa_copilot" type="checkbox" id="copilot.0"/>
                    <label for="copilot.0">Copilot required</label>
                     <br/>

                    <!-- where editor -->
                    <input autocomplete="false" autocorrect="off" placeholder="From (airport or city)" type ="text" class="typeahead tt-query aa_airport_loc_input aa_airport_from_loc"  spellcheck="false" />
                    <span style="vertical-align:-20%; display: inline-block;">
                        <button class="map_button from_map_button btn btn-info btn-xs active">map</button>
                    </span>
                    <br/>

                    <input autocomplete="false" autocorrect="off" placeholder="To (airport or city)" type ="text" class="typeahead tt-query aa_airport_loc_input aa_airport_to_loc"  spellcheck="false" />
                    <span style="vertical-align:-20%; display: inline-block;">
                        <button class="map_button to_map_button btn btn-info btn-xs active">map</button>
                    </span>

                    <div id="estimate-results">
                        <div class="collapse out aa_ft_div"><span>Flying time: <label class="aa_ft" ></label></span></div>
                        <div class="collapse out aa_estimate_div"><span>Estimate: <label class="aa_estimate" ></label></span></div>
                    </div>
                    <br/>
                    <a href="http://aal.staging.mirandacreative.com/firm-quote/"><button id='next_button' class="btn btn-success btn-block">Get a Firm Quote</button></a>

                </div>
            </div>
        </div>
    </div>
</div>
