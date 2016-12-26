$(document).ready(function() {
  var 
    $cities    = $("#city"),
    $regions   = $("#region"),
    $button    = $(".js-filter"),
    globalData = {};

  $.ajax({
      method: "GET",
      url: "./assets/data/data.json",
      dataType: "json",
      error: function () {
        console.log( "При выполнении запроса произошла ошибка" ); 
      },
      success: function (data) {
      
        globalData = data;
        $cities.attr('disabled', true);

        $.each(data, function(key, val) { // Filling Region Select
          $regions.append('<option value="' + val.regionCode + '">' + val.regionName + '</option>');
        })
      }
  });
  
  
  
  $('body').on('change', '#region', function(event) {
    selectChange(globalData, event)
  })

  $('body').on('click', '.js-filter', function(event) {
    filterSubmit(globalData, event)
  })
    

  /* Filtering chosen regions and cities */

  function filterSubmit(data){
    var $table       = $('.table'),
        $regions     = $("#region"),
        $cities      = $("#city"),
        $cityId      = $cities.val(),
        $regionId = $regions.val();

    $('.table tr:gt(0)').remove() // Clearing table data

    if($regionId == "all") {      // If chosen all regions
      $.each(data, function(key, val) {
        var regionName = val.regionName;
        $.each(val.regionCities, function(key, val) {
        (val.shops == "") ? $table.append('<tr><td>' + regionName + '</td><td>' + val.cityName + '</td><td class="absent">Торговые сети отсутствуют</td></tr>')
                : $table.append('<tr><td>' + regionName + '</td><td>' + val.cityName + '</td><td>' + val.shops.join('</br>') + '</td></tr>');
        })
      })
    } else if($cityId == "all") {      // If chosen all cities of one region
      $.each(data[$regionId - 1].regionCities, function(key, val) {
        (val.shops == "") ? $table.append('<tr><td>' + data[$regionId - 1].regionName + '</td><td>' + val.cityName + '</td><td class="absent">Торговые сети отсутствуют</td></tr>')
                : $table.append('<tr><td>' + data[$regionId - 1].regionName + '</td><td>' + val.cityName + '</td><td>' + val.shops.join('</br>') + '</td></tr>');
      })
      
    } else if(($regionId != "all") && ($cityId != "all")) {     // If chosen region and city
      $.each(data[$regionId - 1].regionCities, function(key, val) {
        if (val.cityCode == $cityId) {
          (val.shops == "") ? $table.append('<tr><td>' + data[$regionId - 1].regionName + '</td><td>' + val.cityName + '</td><td class="absent">Торговые сети отсутствуют</td></tr>')
                : $table.append('<tr><td>' + data[$regionId - 1].regionName + '</td><td>' + val.cityName + '</td><td>' + val.shops.join('</br>') + '</td></tr>');
        }
      })
    }  
  }



  /*Selects changing*/

  function selectChange(data, event) {
    var $this        = $(event.target),
        $regionIndex = $this.val();

    $cities.html('<option value="all">Все</option>');

    if($regionIndex == "all") {
      $cities.attr('disabled', true);
    } else {
      $cities.attr('disabled', false);
      $.each(data[$regionIndex - 1].regionCities, function(key, val) {
        $cities.append('<option value="' + val.cityCode + '">' + val.cityName + '</option>');
      })
    }
  }
});
