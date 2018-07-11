
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
<div class = "panel panel-info aa_trip_leg" rfq-id="" id="charter_leg">
  <div class="wrap estimator">
    <h3 class="widgettitle widget-title">WHERE DO YOU WANT TO GO?</h3>
    <div class="row">
          <div class="col-sm-3">
              <!-- where editor -->
              <input autocomplete="false" autocorrect="off" placeholder="From (airport or city)" type ="text" class="typeahead tt-query aa_airport_loc_input aa_airport_from_loc"  spellcheck="false" />
              <span style="vertical-align:-6%; display: inline-block;">
                  <button class="map_button from_map_button btn btn-info btn-xs active">map</button>
              </span>
          </div>
          <div class="col-sm-3">
            <input autocomplete="false" autocorrect="off" placeholder="To (airport or city)" type ="text" class="typeahead tt-query aa_airport_loc_input aa_airport_to_loc"  spellcheck="false" />
            <span style="vertical-align:-6%; display: inline-block;">
                <button class="map_button to_map_button btn btn-info btn-xs active">map</button>
            </span>
          </div>
          <div class="col-sm-3">
              <input class="aa_roundtrip" type="checkbox" id="roundtrip.0"/>
              <label for="roundtrip.0">Round Trip</label>
               <br/>

              <input class="aa_copilot" type="checkbox" id="copilot.0"/>
              <label for="copilot.0">Copilot required</label>
               <br/>
          </div>
          <div class="col-sm-3">
            <!-- make this button only active when the cookie has data or forms are filled -->
            <a href="<?php echo site_url(); ?>/firm-quote/"><button type="button" class="firmquote">Get Firm Quote</button></a>
          </div>
        </div>
    </div>
    <div class="est">
      <div class="row" id="estimate-results">
          <div class="collapse out aa_estimate_div col-sm-6"><span>Estimate: <label class="aa_estimate" ></label></span></div>
          <div class="collapse out aa_ft_div col-sm-6"><span>Flying time: <label class="aa_ft" ></label></span></div>
      </div>
    </div>
  </div>
</div>
