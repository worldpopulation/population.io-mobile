(function () {
    'use strict';

    angular.module('populationioApp')
      .service('Countries', function () {
          return [
      		    {
      		        "POPIO_NAME": "Afghanistan",
      		        "GMI_CNTRY": "AFG",
      		        "POPIO_NAME_ES": "Afganist\u0087n",
      		        "POINT_X": "66.008447",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "33.836267"
      		    },
      		    {
      		        "POPIO_NAME": "Albania",
      		        "GMI_CNTRY": "ALB",
      		        "POPIO_NAME_ES": "Albania",
      		        "POINT_X": "20.053989",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "41.142582"
      		    },
      		    {
      		        "POPIO_NAME": "Algeria",
      		        "GMI_CNTRY": "DZA",
      		        "POPIO_NAME_ES": "Algeria",
      		        "POINT_X": "2.617789",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "28.158463"
      		    },
      		    {
      		        "POPIO_NAME": "Angola",
      		        "GMI_CNTRY": "AGO",
      		        "POPIO_NAME_ES": "Angola",
      		        "POINT_X": "17.536458",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "-12.29118"
      		    },
      		    {
      		        "POPIO_NAME": "Antigua and Barbuda",
      		        "GMI_CNTRY": "ATG",
      		        "POPIO_NAME_ES": "Antigua y Barbuda",
      		        "POINT_X": "-61.790997",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "17.284294"
      		    },
      		    {
      		        "POPIO_NAME": "Arab Rep of Egypt",
      		        "GMI_CNTRY": "EGY",
      		        "POPIO_NAME_ES": "Egipto",
      		        "POINT_X": "29.861284",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "26.492376"
      		    },
      		    {
      		        "POPIO_NAME": "Argentina",
      		        "GMI_CNTRY": "ARG",
      		        "POPIO_NAME_ES": "Argentina",
      		        "POINT_X": "-65.178218",
      		        "CONTINENT": "South America",
      		        "POINT_Y": "-35.382696"
      		    },
      		    {
      		        "POPIO_NAME": "Armenia",
      		        "GMI_CNTRY": "ARM",
      		        "POPIO_NAME_ES": "Armenia",
      		        "POINT_X": "44.932301",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "40.288134"
      		    },
      		    {
      		        "POPIO_NAME": "Aruba",
      		        "GMI_CNTRY": "ABW",
      		        "POPIO_NAME_ES": "Aruba",
      		        "POINT_X": "-69.9756401428",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "12.515625723"
      		    },
      		    {
      		        "POPIO_NAME": "Australia",
      		        "GMI_CNTRY": "AUS",
      		        "POPIO_NAME_ES": "Australia",
      		        "POINT_X": "134.492572",
      		        "CONTINENT": "Oceania",
      		        "POINT_Y": "-25.732365"
      		    },
      		    {
      		        "POPIO_NAME": "Austria",
      		        "GMI_CNTRY": "AUT",
      		        "POPIO_NAME_ES": "Austria",
      		        "POINT_X": "14.130673",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "47.585657"
      		    },
      		    {
      		        "POPIO_NAME": "Azerbaijan",
      		        "GMI_CNTRY": "AZE",
      		        "POPIO_NAME_ES": "Azerbaiy\u0087n",
      		        "POINT_X": "47.542394",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "40.289044"
      		    },
      		    {
      		        "POPIO_NAME": "Bahrain",
      		        "GMI_CNTRY": "BHR",
      		        "POPIO_NAME_ES": "Bahrain",
      		        "POINT_X": "50.544356",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "26.048945"
      		    },
      		    {
      		        "POPIO_NAME": "Bangladesh",
      		        "GMI_CNTRY": "BGD",
      		        "POPIO_NAME_ES": "Bangladesh",
      		        "POINT_X": "90.24339",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "23.842846"
      		    },
      		    {
      		        "POPIO_NAME": "Barbados",
      		        "GMI_CNTRY": "BRB",
      		        "POPIO_NAME_ES": "Barbados",
      		        "POINT_X": "-59.560479",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "13.180864"
      		    },
      		    {
      		        "POPIO_NAME": "Belarus",
      		        "GMI_CNTRY": "BLR",
      		        "POPIO_NAME_ES": "Bielorrusia",
      		        "POINT_X": "28.033566",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "53.53188"
      		    },
      		    {
      		        "POPIO_NAME": "Belgium",
      		        "GMI_CNTRY": "BEL",
      		        "POPIO_NAME_ES": "B\u008elgica",
      		        "POINT_X": "4.640121",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "50.637406"
      		    },
      		    {
      		        "POPIO_NAME": "Belize",
      		        "GMI_CNTRY": "BLZ",
      		        "POPIO_NAME_ES": "Belice",
      		        "POINT_X": "-88.704835",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "17.200815"
      		    },
      		    {
      		        "POPIO_NAME": "Benin",
      		        "GMI_CNTRY": "BEN",
      		        "POPIO_NAME_ES": "Ben\u0092n",
      		        "POINT_X": "2.328738",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "9.641208"
      		    },
      		    {
      		        "POPIO_NAME": "Bhutan",
      		        "GMI_CNTRY": "BTN",
      		        "POPIO_NAME_ES": "But\u0087n",
      		        "POINT_X": "90.403948",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "27.410593"
      		    },
      		    {
      		        "POPIO_NAME": "Bolivia",
      		        "GMI_CNTRY": "BOL",
      		        "POPIO_NAME_ES": "Bolivia",
      		        "POINT_X": "-64.684754",
      		        "CONTINENT": "South America",
      		        "POINT_Y": "-16.706877"
      		    },
      		    {
      		        "POPIO_NAME": "Bosnia and Herzegovina",
      		        "GMI_CNTRY": "BIH",
      		        "POPIO_NAME_ES": "Bosnia-Herzegovina",
      		        "POINT_X": "17.773405",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "44.171739"
      		    },
      		    {
      		        "POPIO_NAME": "Botswana",
      		        "GMI_CNTRY": "BWA",
      		        "POPIO_NAME_ES": "Botswana",
      		        "POINT_X": "23.798987",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "-22.185772"
      		    },
      		    {
      		        "POPIO_NAME": "Brazil",
      		        "GMI_CNTRY": "BRA",
      		        "POPIO_NAME_ES": "Brasil",
      		        "POINT_X": "-53.093972",
      		        "CONTINENT": "South America",
      		        "POINT_Y": "-10.782781"
      		    },
      		    {
      		        "POPIO_NAME": "Brunei Darussalam",
      		        "GMI_CNTRY": "BRN",
      		        "POPIO_NAME_ES": "Brunei Darussalam",
      		        "POINT_X": "114.727354",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "4.516338"
      		    },
      		    {
      		        "POPIO_NAME": "Bulgaria",
      		        "GMI_CNTRY": "BGR",
      		        "POPIO_NAME_ES": "Bulgaria",
      		        "POINT_X": "25.217739",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "42.76854"
      		    },
      		    {
      		        "POPIO_NAME": "Burkina Faso",
      		        "GMI_CNTRY": "BFA",
      		        "POPIO_NAME_ES": "Burkina Faso",
      		        "POINT_X": "-1.755591",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "12.26956"
      		    },
      		    {
      		        "POPIO_NAME": "Burundi",
      		        "GMI_CNTRY": "BDI",
      		        "POPIO_NAME_ES": "Burundi",
      		        "POINT_X": "29.875083",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "-3.357425"
      		    },
      		    {
      		        "POPIO_NAME": "Cabo Verde",
      		        "GMI_CNTRY": "CPV",
      		        "POPIO_NAME_ES": "Cabo Verde",
      		        "POINT_X": "-23.966613",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "15.935902"
      		    },
      		    {
      		        "POPIO_NAME": "Cambodia",
      		        "GMI_CNTRY": "KHM",
      		        "POPIO_NAME_ES": "Camboya",
      		        "POINT_X": "104.90282",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "12.715572"
      		    },
      		    {
      		        "POPIO_NAME": "Cameroon",
      		        "GMI_CNTRY": "CMR",
      		        "POPIO_NAME_ES": "Camer\u009cn",
      		        "POINT_X": "12.737083",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "5.693128"
      		    },
      		    {
      		        "POPIO_NAME": "Canada",
      		        "GMI_CNTRY": "CAN",
      		        "POPIO_NAME_ES": "Canad\u0087",
      		        "POINT_X": "-98.316063",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "61.373126"
      		    },
      		    {
      		        "POPIO_NAME": "Central African Republic",
      		        "GMI_CNTRY": "CAF",
      		        "POPIO_NAME_ES": "Rep\u009cblica Centroafricana",
      		        "POINT_X": "20.464809",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "6.566321"
      		    },
      		    {
      		        "POPIO_NAME": "Chad",
      		        "GMI_CNTRY": "TCD",
      		        "POPIO_NAME_ES": "Chad",
      		        "POINT_X": "18.646251",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "15.333078"
      		    },
      		    {
      		        "POPIO_NAME": "Channel Islands",
      		        "GMI_CNTRY": "CHI",
      		        "POPIO_NAME_ES": "Channel Islands",
      		        "POINT_X": "NA",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "NA"
      		    },
      		    {
      		        "POPIO_NAME": "Chile",
      		        "GMI_CNTRY": "CHL",
      		        "POPIO_NAME_ES": "Chile",
      		        "POINT_X": "-71.355119",
      		        "CONTINENT": "South America",
      		        "POINT_Y": "-37.696072"
      		    },
      		    {
      		        "POPIO_NAME": "China",
      		        "GMI_CNTRY": "CHN",
      		        "POPIO_NAME_ES": "China",
      		        "POINT_X": "103.82491",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "36.561277"
      		    },
      		    {
      		        "POPIO_NAME": "Colombia",
      		        "GMI_CNTRY": "COL",
      		        "POPIO_NAME_ES": "Colombia",
      		        "POINT_X": "-73.080187",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "3.910956"
      		    },
      		    {
      		        "POPIO_NAME": "Comoros",
      		        "GMI_CNTRY": "COM",
      		        "POPIO_NAME_ES": "Comores",
      		        "POINT_X": "43.680788",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "-11.884401"
      		    },
      		    {
      		        "POPIO_NAME": "Congo",
      		        "GMI_CNTRY": "COG",
      		        "POPIO_NAME_ES": "Congo",
      		        "POINT_X": "15.2242939996",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "-0.84023182658"
      		    },
      		    {
      		        "POPIO_NAME": "Costa Rica",
      		        "GMI_CNTRY": "CRI",
      		        "POPIO_NAME_ES": "Costa Rica",
      		        "POINT_X": "-84.193238",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "9.973605"
      		    },
      		    {
      		        "POPIO_NAME": "Cote-d-Ivoire",
      		        "GMI_CNTRY": "CIV",
      		        "POPIO_NAME_ES": "Costa de Marfil",
      		        "POINT_X": "-5.569011",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "7.627839"
      		    },
      		    {
      		        "POPIO_NAME": "Croatia",
      		        "GMI_CNTRY": "HRV",
      		        "POPIO_NAME_ES": "Croacia",
      		        "POINT_X": "16.398662",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "45.06776"
      		    },
      		    {
      		        "POPIO_NAME": "Cuba",
      		        "GMI_CNTRY": "CUB",
      		        "POPIO_NAME_ES": "Cuba",
      		        "POINT_X": "-79.033303",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "21.624692"
      		    },
      		    {
      		        "POPIO_NAME": "Curacao",
      		        "GMI_CNTRY": "CUW",
      		        "POPIO_NAME_ES": "Curacao",
      		        "POINT_X": "NA",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "NA"
      		    },
      		    {
      		        "POPIO_NAME": "Cyprus",
      		        "GMI_CNTRY": "CYP",
      		        "POPIO_NAME_ES": "Chipre",
      		        "POINT_X": "32.990228",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "34.914998"
      		    },
      		    {
      		        "POPIO_NAME": "Czech Republic",
      		        "GMI_CNTRY": "CZE",
      		        "POPIO_NAME_ES": "Rep\u009cblica Checa",
      		        "POINT_X": "15.314103",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "49.732448"
      		    },
      		    {
      		        "POPIO_NAME": "Dem Peoples Rep of Korea",
      		        "GMI_CNTRY": "PRK",
      		        "POPIO_NAME_ES": "Corea del Norte",
      		        "POINT_X": "127.18767",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "40.170376"
      		    },
      		    {
      		        "POPIO_NAME": "Dem Rep of Congo",
      		        "GMI_CNTRY": "ZAR",
      		        "POPIO_NAME_ES": "Rep Dem del Congo",
      		        "POINT_X": "23.6550057054",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "-2.87623474498"
      		    },
      		    {
      		        "POPIO_NAME": "Denmark",
      		        "GMI_CNTRY": "DNK",
      		        "POPIO_NAME_ES": "Dinamarca",
      		        "POINT_X": "10.05067",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "55.964717"
      		    },
      		    {
      		        "POPIO_NAME": "Djibouti",
      		        "GMI_CNTRY": "DJI",
      		        "POPIO_NAME_ES": "Djibouti",
      		        "POINT_X": "42.56667",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "11.750209"
      		    },
      		    {
      		        "POPIO_NAME": "Dominican Republic",
      		        "GMI_CNTRY": "DOM",
      		        "POPIO_NAME_ES": "Rep\u009cblica Dominicana",
      		        "POINT_X": "-70.496272",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "18.896204"
      		    },
      		    {
      		        "POPIO_NAME": "Ecuador",
      		        "GMI_CNTRY": "ECU",
      		        "POPIO_NAME_ES": "Ecuador",
      		        "POINT_X": "-78.77323",
      		        "CONTINENT": "South America",
      		        "POINT_Y": "-1.424747"
      		    },
      		    {
      		        "POPIO_NAME": "El Salvador",
      		        "GMI_CNTRY": "SLV",
      		        "POPIO_NAME_ES": "El Salvador",
      		        "POINT_X": "-88.869261",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "13.736704"
      		    },
      		    {
      		        "POPIO_NAME": "Equatorial Guinea",
      		        "GMI_CNTRY": "GNQ",
      		        "POPIO_NAME_ES": "Guinea Ecuatorial",
      		        "POINT_X": "10.333171",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "1.706945"
      		    },
      		    {
      		        "POPIO_NAME": "Eritrea",
      		        "GMI_CNTRY": "ERI",
      		        "POPIO_NAME_ES": "Eritrea",
      		        "POINT_X": "38.853178",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "15.357538"
      		    },
      		    {
      		        "POPIO_NAME": "Estonia",
      		        "GMI_CNTRY": "EST",
      		        "POPIO_NAME_ES": "Estonia",
      		        "POINT_X": "25.535957",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "58.670837"
      		    },
      		    {
      		        "POPIO_NAME": "Ethiopia",
      		        "GMI_CNTRY": "ETH",
      		        "POPIO_NAME_ES": "Etiop\u0092a",
      		        "POINT_X": "39.600551",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "8.622952"
      		    },
      		    {
      		        "POPIO_NAME": "Federated States of Micronesia",
      		        "GMI_CNTRY": "FSM",
      		        "POPIO_NAME_ES": "Micronesia",
      		        "POINT_X": "155.247759",
      		        "CONTINENT": "Oceania",
      		        "POINT_Y": "7.115377"
      		    },
      		    {
      		        "POPIO_NAME": "Fiji",
      		        "GMI_CNTRY": "FJI",
      		        "POPIO_NAME_ES": "Fiji",
      		        "POINT_X": "163.698141",
      		        "CONTINENT": "Oceania",
      		        "POINT_Y": "-17.446659"
      		    },
      		    {
      		        "POPIO_NAME": "Finland",
      		        "GMI_CNTRY": "FIN",
      		        "POPIO_NAME_ES": "Finlandia",
      		        "POINT_X": "20.037148",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "60.207334"
      		    },
      		    {
      		        "POPIO_NAME": "France",
      		        "GMI_CNTRY": "FRA",
      		        "POPIO_NAME_ES": "Francia",
      		        "POINT_X": "68.991182",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "-49.062703"
      		    },
      		    {
      		        "POPIO_NAME": "French Guiana",
      		        "GMI_CNTRY": "GUF",
      		        "POPIO_NAME_ES": "Guayana Francesa",
      		        "POINT_X": "-53.2412236314",
      		        "CONTINENT": "South America",
      		        "POINT_Y": "3.92468841889"
      		    },
      		    {
      		        "POPIO_NAME": "French Polynesia",
      		        "GMI_CNTRY": "PYF",
      		        "POPIO_NAME_ES": "Polinesia Francesa",
      		        "POINT_X": "-149.417679134",
      		        "CONTINENT": "Oceania",
      		        "POINT_Y": "-17.6664919203"
      		    },
      		    {
      		        "POPIO_NAME": "FYR Macedonia",
      		        "GMI_CNTRY": "MKD",
      		        "POPIO_NAME_ES": "Macedonia",
      		        "POINT_X": "21.6974763152",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "41.5996829206"
      		    },
      		    {
      		        "POPIO_NAME": "Gabon",
      		        "GMI_CNTRY": "GAB",
      		        "POPIO_NAME_ES": "Gab\u0097n",
      		        "POINT_X": "11.792239",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "-0.587011"
      		    },
      		    {
      		        "POPIO_NAME": "Georgia",
      		        "GMI_CNTRY": "GEO",
      		        "POPIO_NAME_ES": "Georgia",
      		        "POINT_X": "43.507651",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "42.168816"
      		    },
      		    {
      		        "POPIO_NAME": "Germany",
      		        "GMI_CNTRY": "DEU",
      		        "POPIO_NAME_ES": "Alemania",
      		        "POINT_X": "10.381548",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "51.106213"
      		    },
      		    {
      		        "POPIO_NAME": "Ghana",
      		        "GMI_CNTRY": "GHA",
      		        "POPIO_NAME_ES": "Ghana",
      		        "POINT_X": "-1.216466",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "7.953797"
      		    },
      		    {
      		        "POPIO_NAME": "Greece",
      		        "GMI_CNTRY": "GRC",
      		        "POPIO_NAME_ES": "Grecia",
      		        "POINT_X": "22.97514",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "39.05122"
      		    },
      		    {
      		        "POPIO_NAME": "Grenada",
      		        "GMI_CNTRY": "GRD",
      		        "POPIO_NAME_ES": "Grenada",
      		        "POINT_X": "-61.655942",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "12.1129266563"
      		    },
      		    {
      		        "POPIO_NAME": "Guadeloupe",
      		        "GMI_CNTRY": "GLP",
      		        "POPIO_NAME_ES": "Guadalupe",
      		        "POINT_X": "-61.648470341",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "16.1414757987"
      		    },
      		    {
      		        "POPIO_NAME": "Guam",
      		        "GMI_CNTRY": "GUM",
      		        "POPIO_NAME_ES": "Guam",
      		        "POINT_X": "144.713942955",
      		        "CONTINENT": "Oceania",
      		        "POINT_Y": "13.3558122599"
      		    },
      		    {
      		        "POPIO_NAME": "Guatemala",
      		        "GMI_CNTRY": "GTM",
      		        "POPIO_NAME_ES": "Guatemala",
      		        "POINT_X": "-90.365058",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "15.693396"
      		    },
      		    {
      		        "POPIO_NAME": "Guinea",
      		        "GMI_CNTRY": "GIN",
      		        "POPIO_NAME_ES": "Guinea",
      		        "POINT_X": "-10.942917",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "10.434669"
      		    },
      		    {
      		        "POPIO_NAME": "Guinea-Bissau",
      		        "GMI_CNTRY": "GNB",
      		        "POPIO_NAME_ES": "Guinea-Bissau",
      		        "POINT_X": "-14.412361314",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "12.1241940674"
      		    },
      		    {
      		        "POPIO_NAME": "Guyana",
      		        "GMI_CNTRY": "GUY",
      		        "POPIO_NAME_ES": "Guyana",
      		        "POINT_X": "-58.979905",
      		        "CONTINENT": "South America",
      		        "POINT_Y": "4.795142"
      		    },
      		    {
      		        "POPIO_NAME": "Haiti",
      		        "GMI_CNTRY": "HTI",
      		        "POPIO_NAME_ES": "Hait\u0092",
      		        "POINT_X": "-72.690703",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "18.93814"
      		    },
      		    {
      		        "POPIO_NAME": "Honduras",
      		        "GMI_CNTRY": "HND",
      		        "POPIO_NAME_ES": "Honduras",
      		        "POINT_X": "-86.618416",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "14.824166"
      		    },
      		    {
      		        "POPIO_NAME": "Hong Kong SAR-China",
      		        "GMI_CNTRY": "HKG",
      		        "POPIO_NAME_ES": "Hong Kong SAR-China",
      		        "POINT_X": "NA",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "NA"
      		    },
      		    {
      		        "POPIO_NAME": "Hungary",
      		        "GMI_CNTRY": "HUN",
      		        "POPIO_NAME_ES": "Hungr\u0092a",
      		        "POINT_X": "19.396759",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "47.163244"
      		    },
      		    {
      		        "POPIO_NAME": "Iceland",
      		        "GMI_CNTRY": "ISL",
      		        "POPIO_NAME_ES": "Islandia",
      		        "POINT_X": "-18.595807",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "64.998012"
      		    },
      		    {
      		        "POPIO_NAME": "India",
      		        "GMI_CNTRY": "IND",
      		        "POPIO_NAME_ES": "India",
      		        "POINT_X": "79.612214",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "22.887366"
      		    },
      		    {
      		        "POPIO_NAME": "Indonesia",
      		        "GMI_CNTRY": "IDN",
      		        "POPIO_NAME_ES": "Indonesia",
      		        "POINT_X": "117.272105",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "-2.220831"
      		    },
      		    {
      		        "POPIO_NAME": "Iraq",
      		        "GMI_CNTRY": "IRQ",
      		        "POPIO_NAME_ES": "Iraq",
      		        "POINT_X": "43.744986",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "33.039797"
      		    },
      		    {
      		        "POPIO_NAME": "Ireland",
      		        "GMI_CNTRY": "IRL",
      		        "POPIO_NAME_ES": "Irelanda",
      		        "POINT_X": "-8.144426",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "53.177874"
      		    },
      		    {
      		        "POPIO_NAME": "Islamic Republic of Iran",
      		        "GMI_CNTRY": "IRN",
      		        "POPIO_NAME_ES": "Ir\u0087n",
      		        "POINT_X": "54.276286",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "32.572027"
      		    },
      		    {
      		        "POPIO_NAME": "Israel",
      		        "GMI_CNTRY": "ISR",
      		        "POPIO_NAME_ES": "Israel",
      		        "POINT_X": "34.9961",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "31.443548"
      		    },
      		    {
      		        "POPIO_NAME": "Italy",
      		        "GMI_CNTRY": "ITA",
      		        "POPIO_NAME_ES": "Italia",
      		        "POINT_X": "12.072137",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "42.786249"
      		    },
      		    {
      		        "POPIO_NAME": "Jamaica",
      		        "GMI_CNTRY": "JAM",
      		        "POPIO_NAME_ES": "Jamaica",
      		        "POINT_X": "-77.318535",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "18.154594"
      		    },
      		    {
      		        "POPIO_NAME": "Japan",
      		        "GMI_CNTRY": "JPN",
      		        "POPIO_NAME_ES": "Jap\u0097n",
      		        "POINT_X": "137.992535",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "37.555901"
      		    },
      		    {
      		        "POPIO_NAME": "Jordan",
      		        "GMI_CNTRY": "JOR",
      		        "POPIO_NAME_ES": "Jordania",
      		        "POINT_X": "36.770946",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "31.245598"
      		    },
      		    {
      		        "POPIO_NAME": "Kazakhstan",
      		        "GMI_CNTRY": "KAZ",
      		        "POPIO_NAME_ES": "Kazajst\u0087n",
      		        "POINT_X": "63.384062",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "45.978305"
      		    },
      		    {
      		        "POPIO_NAME": "Kenya",
      		        "GMI_CNTRY": "KEN",
      		        "POPIO_NAME_ES": "Kenia",
      		        "POINT_X": "37.796226",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "0.598081"
      		    },
      		    {
      		        "POPIO_NAME": "Kiribati",
      		        "GMI_CNTRY": "KIR",
      		        "POPIO_NAME_ES": "Kiribati",
      		        "POINT_X": "-55.32007",
      		        "CONTINENT": "Oceania",
      		        "POINT_Y": "0.79981"
      		    },
      		    {
      		        "POPIO_NAME": "Kuwait",
      		        "GMI_CNTRY": "KWT",
      		        "POPIO_NAME_ES": "Kuwait",
      		        "POINT_X": "47.59058",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "29.338788"
      		    },
      		    {
      		        "POPIO_NAME": "Kyrgyz Republic",
      		        "GMI_CNTRY": "KGZ",
      		        "POPIO_NAME_ES": "Kyrgyz Republic",
      		        "POINT_X": "74.541669",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "41.461919"
      		    },
      		    {
      		        "POPIO_NAME": "Lao PDR",
      		        "GMI_CNTRY": "LAO",
      		        "POPIO_NAME_ES": "Laos",
      		        "POINT_X": "103.737873",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "18.502298"
      		    },
      		    {
      		        "POPIO_NAME": "Latvia",
      		        "GMI_CNTRY": "LVA",
      		        "POPIO_NAME_ES": "Latvia",
      		        "POINT_X": "24.909128",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "56.851761"
      		    },
      		    {
      		        "POPIO_NAME": "Lebanon",
      		        "GMI_CNTRY": "LBN",
      		        "POPIO_NAME_ES": "L\u0092bano",
      		        "POINT_X": "35.880272",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "33.920398"
      		    },
      		    {
      		        "POPIO_NAME": "Lesotho",
      		        "GMI_CNTRY": "LSO",
      		        "POPIO_NAME_ES": "Lesotho",
      		        "POINT_X": "28.228623",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "-29.57973"
      		    },
      		    {
      		        "POPIO_NAME": "Liberia",
      		        "GMI_CNTRY": "LBR",
      		        "POPIO_NAME_ES": "Liberia",
      		        "POINT_X": "-9.319781",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "6.452318"
      		    },
      		    {
      		        "POPIO_NAME": "Libya",
      		        "GMI_CNTRY": "LBY",
      		        "POPIO_NAME_ES": "Libia",
      		        "POINT_X": "18.009583",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "27.030206"
      		    },
      		    {
      		        "POPIO_NAME": "Lithuania",
      		        "GMI_CNTRY": "LTU",
      		        "POPIO_NAME_ES": "Lituania",
      		        "POINT_X": "23.888369",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "55.327008"
      		    },
      		    {
      		        "POPIO_NAME": "Luxembourg",
      		        "GMI_CNTRY": "LUX",
      		        "POPIO_NAME_ES": "Luxamburgo",
      		        "POINT_X": "6.071764",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "49.766824"
      		    },
      		    {
      		        "POPIO_NAME": "Macao SAR China",
      		        "GMI_CNTRY": "MAC",
      		        "POPIO_NAME_ES": "Macao SAR China",
      		        "POINT_X": "NA",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "NA"
      		    },
      		    {
      		        "POPIO_NAME": "Madagascar",
      		        "GMI_CNTRY": "MDG",
      		        "POPIO_NAME_ES": "Madagascar",
      		        "POINT_X": "46.706458",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "-19.373254"
      		    },
      		    {
      		        "POPIO_NAME": "Malawi",
      		        "GMI_CNTRY": "MWI",
      		        "POPIO_NAME_ES": "Malawi",
      		        "POINT_X": "34.289908",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "-13.217226"
      		    },
      		    {
      		        "POPIO_NAME": "Malaysia",
      		        "GMI_CNTRY": "MYS",
      		        "POPIO_NAME_ES": "Malasia",
      		        "POINT_X": "109.697702",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "3.792397"
      		    },
      		    {
      		        "POPIO_NAME": "Maldives",
      		        "GMI_CNTRY": "MDV",
      		        "POPIO_NAME_ES": "Maldivas",
      		        "POINT_X": "73.331084",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "3.67978"
      		    },
      		    {
      		        "POPIO_NAME": "Mali",
      		        "GMI_CNTRY": "MLI",
      		        "POPIO_NAME_ES": "Mal\u0092",
      		        "POINT_X": "-3.539079",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "17.344163"
      		    },
      		    {
      		        "POPIO_NAME": "Malta",
      		        "GMI_CNTRY": "MLT",
      		        "POPIO_NAME_ES": "Malta",
      		        "POINT_X": "14.404245",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "35.920801"
      		    },
      		    {
      		        "POPIO_NAME": "Martinique",
      		        "GMI_CNTRY": "MTQ",
      		        "POPIO_NAME_ES": "Martinica",
      		        "POINT_X": "-61.0212878211",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "14.6525473278"
      		    },
      		    {
      		        "POPIO_NAME": "Mauritania",
      		        "GMI_CNTRY": "MRT",
      		        "POPIO_NAME_ES": "Mauritania",
      		        "POINT_X": "-10.342917",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "20.256307"
      		    },
      		    {
      		        "POPIO_NAME": "Mauritius",
      		        "GMI_CNTRY": "MUS",
      		        "POPIO_NAME_ES": "Mauricio",
      		        "POINT_X": "57.854617",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "-20.221512"
      		    },
      		    {
      		        "POPIO_NAME": "Mayotte",
      		        "GMI_CNTRY": "MYT",
      		        "POPIO_NAME_ES": "Mayotte",
      		        "POINT_X": "45.1351607431",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "-12.8197953643"
      		    },
      		    {
      		        "POPIO_NAME": "Mexico",
      		        "GMI_CNTRY": "MEX",
      		        "POPIO_NAME_ES": "M\u008exico",
      		        "POINT_X": "-102.52704",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "23.947546"
      		    },
      		    {
      		        "POPIO_NAME": "Moldova",
      		        "GMI_CNTRY": "MDA",
      		        "POPIO_NAME_ES": "Moldavia",
      		        "POINT_X": "28.461397",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "47.195101"
      		    },
      		    {
      		        "POPIO_NAME": "Mongolia",
      		        "GMI_CNTRY": "MNG",
      		        "POPIO_NAME_ES": "Mongolia",
      		        "POINT_X": "103.056287",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "46.825806"
      		    },
      		    {
      		        "POPIO_NAME": "Montenegro",
      		        "GMI_CNTRY": "MNE",
      		        "POPIO_NAME_ES": "Montenegro",
      		        "POINT_X": "19.238501",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "42.785856"
      		    },
      		    {
      		        "POPIO_NAME": "Morocco",
      		        "GMI_CNTRY": "MAR",
      		        "POPIO_NAME_ES": "Marruecos",
      		        "POINT_X": "-8.455533",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "29.834245"
      		    },
      		    {
      		        "POPIO_NAME": "Mozambique",
      		        "GMI_CNTRY": "MOZ",
      		        "POPIO_NAME_ES": "Mozambique",
      		        "POINT_X": "35.537526",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "-17.270376"
      		    },
      		    {
      		        "POPIO_NAME": "Myanmar",
      		        "GMI_CNTRY": "MMR",
      		        "POPIO_NAME_ES": "Myanmar",
      		        "POINT_X": "96.489186",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "21.169415"
      		    },
      		    {
      		        "POPIO_NAME": "Namibia",
      		        "GMI_CNTRY": "NAM",
      		        "POPIO_NAME_ES": "Namibia",
      		        "POINT_X": "17.210796",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "-22.128669"
      		    },
      		    {
      		        "POPIO_NAME": "Nepal",
      		        "GMI_CNTRY": "NPL",
      		        "POPIO_NAME_ES": "Nepal",
      		        "POINT_X": "83.916253",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "28.247922"
      		    },
      		    {
      		        "POPIO_NAME": "New Caledonia",
      		        "GMI_CNTRY": "NCL",
      		        "POPIO_NAME_ES": "Nueva Caledonia",
      		        "POINT_X": "165.505395242",
      		        "CONTINENT": "Oceania",
      		        "POINT_Y": "-21.4052049142"
      		    },
      		    {
      		        "POPIO_NAME": "New Zealand",
      		        "GMI_CNTRY": "NZL",
      		        "POPIO_NAME_ES": "Nueva Zelanda",
      		        "POINT_X": "-158.781437",
      		        "CONTINENT": "Oceania",
      		        "POINT_Y": "-19.818704"
      		    },
      		    {
      		        "POPIO_NAME": "Nicaragua",
      		        "GMI_CNTRY": "NIC",
      		        "POPIO_NAME_ES": "Nicaragua",
      		        "POINT_X": "-85.032836",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "12.845628"
      		    },
      		    {
      		        "POPIO_NAME": "Niger",
      		        "GMI_CNTRY": "NER",
      		        "POPIO_NAME_ES": "Niger",
      		        "POINT_X": "9.386034",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "17.418464"
      		    },
      		    {
      		        "POPIO_NAME": "Nigeria",
      		        "GMI_CNTRY": "NGA",
      		        "POPIO_NAME_ES": "Nigeria",
      		        "POINT_X": "8.091504",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "9.596968"
      		    },
      		    {
      		        "POPIO_NAME": "Norway",
      		        "GMI_CNTRY": "NOR",
      		        "POPIO_NAME_ES": "Noruega",
      		        "POINT_X": "15.41245",
      		        "CONTINENT": "Antarctica",
      		        "POINT_Y": "68.7964"
      		    },
      		    {
      		        "POPIO_NAME": "Norway",
      		        "GMI_CNTRY": "NOR",
      		        "POPIO_NAME_ES": "Noruega",
      		        "POINT_X": "15.41245",
      		        "CONTINENT": "Antarctica",
      		        "POINT_Y": "68.7964"
      		    },
      		    {
      		        "POPIO_NAME": "Norway",
      		        "GMI_CNTRY": "NOR",
      		        "POPIO_NAME_ES": "Noruega",
      		        "POINT_X": "15.41245",
      		        "CONTINENT": "Antarctica",
      		        "POINT_Y": "68.7964"
      		    },
      		    {
      		        "POPIO_NAME": "Norway",
      		        "GMI_CNTRY": "NOR",
      		        "POPIO_NAME_ES": "Noruega",
      		        "POINT_X": "15.41245",
      		        "CONTINENT": "Antarctica",
      		        "POINT_Y": "68.7964"
      		    },
      		    {
      		        "POPIO_NAME": "Oman",
      		        "GMI_CNTRY": "OMN",
      		        "POPIO_NAME_ES": "Om\u0087n",
      		        "POINT_X": "56.092799",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "20.600908"
      		    },
      		    {
      		        "POPIO_NAME": "Pakistan",
      		        "GMI_CNTRY": "PAK",
      		        "POPIO_NAME_ES": "Pakist\u0087n",
      		        "POINT_X": "69.341852",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "29.94883"
      		    },
      		    {
      		        "POPIO_NAME": "Panama",
      		        "GMI_CNTRY": "PAN",
      		        "POPIO_NAME_ES": "Panam\u0087",
      		        "POINT_X": "-80.123917",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "8.51045"
      		    },
      		    {
      		        "POPIO_NAME": "Papua New Guinea",
      		        "GMI_CNTRY": "PNG",
      		        "POPIO_NAME_ES": "Pap\u009ca Nueva Guinea",
      		        "POINT_X": "145.22793",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "-6.470358"
      		    },
      		    {
      		        "POPIO_NAME": "Paraguay",
      		        "GMI_CNTRY": "PRY",
      		        "POPIO_NAME_ES": "Paraguay",
      		        "POINT_X": "-58.398423",
      		        "CONTINENT": "South America",
      		        "POINT_Y": "-23.227519"
      		    },
      		    {
      		        "POPIO_NAME": "Peru",
      		        "GMI_CNTRY": "PER",
      		        "POPIO_NAME_ES": "Per\u009c",
      		        "POINT_X": "-74.381307",
      		        "CONTINENT": "South America",
      		        "POINT_Y": "-9.15354"
      		    },
      		    {
      		        "POPIO_NAME": "Philippines",
      		        "GMI_CNTRY": "PHL",
      		        "POPIO_NAME_ES": "Filipinas",
      		        "POINT_X": "122.874714",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "11.763383"
      		    },
      		    {
      		        "POPIO_NAME": "Poland",
      		        "GMI_CNTRY": "POL",
      		        "POPIO_NAME_ES": "Polonia",
      		        "POINT_X": "19.394451",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "52.124672"
      		    },
      		    {
      		        "POPIO_NAME": "Portugal",
      		        "GMI_CNTRY": "PRT",
      		        "POPIO_NAME_ES": "Portugal",
      		        "POINT_X": "-8.59209",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "39.58568"
      		    },
      		    {
      		        "POPIO_NAME": "Puerto Rico",
      		        "GMI_CNTRY": "PRI",
      		        "POPIO_NAME_ES": "Puerto Rico",
      		        "POINT_X": "-66.480993445",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "18.2231072003"
      		    },
      		    {
      		        "POPIO_NAME": "Qatar",
      		        "GMI_CNTRY": "QAT",
      		        "POPIO_NAME_ES": "Qatar",
      		        "POINT_X": "51.187565",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "25.312777"
      		    },
      		    {
      		        "POPIO_NAME": "RB-de-Venezuela",
      		        "GMI_CNTRY": "VEN",
      		        "POPIO_NAME_ES": "Venezuela",
      		        "POINT_X": "-66.176722",
      		        "CONTINENT": "South America",
      		        "POINT_Y": "7.125003"
      		    },
      		    {
      		        "POPIO_NAME": "Rep of Korea",
      		        "GMI_CNTRY": "KOR",
      		        "POPIO_NAME_ES": "Corea del Sur",
      		        "POINT_X": "127.832194",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "36.350473"
      		    },
      		    {
      		        "POPIO_NAME": "Rep of Yemen",
      		        "GMI_CNTRY": "YEM",
      		        "POPIO_NAME_ES": "Yemen",
      		        "POINT_X": "47.590931",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "15.905155"
      		    },
      		    {
      		        "POPIO_NAME": "Reunion",
      		        "GMI_CNTRY": "REU",
      		        "POPIO_NAME_ES": "Reuni\u0097n",
      		        "POINT_X": "55.5381806497",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "-21.1216615325"
      		    },
      		    {
      		        "POPIO_NAME": "Romania",
      		        "GMI_CNTRY": "ROM",
      		        "POPIO_NAME_ES": "Ruman\u0092a",
      		        "POINT_X": "24.973099",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "45.853413"
      		    },
      		    {
      		        "POPIO_NAME": "Russian Federation",
      		        "GMI_CNTRY": "RUS",
      		        "POPIO_NAME_ES": "Rusia",
      		        "POINT_X": "96.688981",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "61.983471"
      		    },
      		    {
      		        "POPIO_NAME": "Rwanda",
      		        "GMI_CNTRY": "RWA",
      		        "POPIO_NAME_ES": "Ruanda",
      		        "POINT_X": "29.919061",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "-1.99275"
      		    },
      		    {
      		        "POPIO_NAME": "Samoa",
      		        "GMI_CNTRY": "WSM",
      		        "POPIO_NAME_ES": "Samoa",
      		        "POINT_X": "-172.160278",
      		        "CONTINENT": "Oceania",
      		        "POINT_Y": "-13.754676"
      		    },
      		    {
      		        "POPIO_NAME": "Sao Tome and Principe",
      		        "GMI_CNTRY": "STP",
      		        "POPIO_NAME_ES": "Sao Tome y Principe",
      		        "POINT_X": "6.726958",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "0.444039"
      		    },
      		    {
      		        "POPIO_NAME": "Saudi Arabia",
      		        "GMI_CNTRY": "SAU",
      		        "POPIO_NAME_ES": "Arabia Saudita",
      		        "POINT_X": "44.537759",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "24.122444"
      		    },
      		    {
      		        "POPIO_NAME": "Senegal",
      		        "GMI_CNTRY": "SEN",
      		        "POPIO_NAME_ES": "Senegal",
      		        "POINT_X": "-14.47103",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "14.367794"
      		    },
      		    {
      		        "POPIO_NAME": "Serbia",
      		        "GMI_CNTRY": "SRB",
      		        "POPIO_NAME_ES": "Serbia",
      		        "POINT_X": "20.8054574559",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "44.0320458078"
      		    },
      		    {
      		        "POPIO_NAME": "Seychelles",
      		        "GMI_CNTRY": "SYC",
      		        "POPIO_NAME_ES": "Seychelles",
      		        "POINT_X": "51.882275",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "-6.590675"
      		    },
      		    {
      		        "POPIO_NAME": "Sierra Leone",
      		        "GMI_CNTRY": "SLE",
      		        "POPIO_NAME_ES": "Sierra Leone",
      		        "POINT_X": "-11.79483",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "8.563161"
      		    },
      		    {
      		        "POPIO_NAME": "Singapore",
      		        "GMI_CNTRY": "SGP",
      		        "POPIO_NAME_ES": "Singapur",
      		        "POINT_X": "103.813797",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "1.358791"
      		    },
      		    {
      		        "POPIO_NAME": "Slovak Republic",
      		        "GMI_CNTRY": "SVK",
      		        "POPIO_NAME_ES": "Eslovaquia",
      		        "POINT_X": "19.480383",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "48.704935"
      		    },
      		    {
      		        "POPIO_NAME": "Slovenia",
      		        "GMI_CNTRY": "SVN",
      		        "POPIO_NAME_ES": "Eslovenia",
      		        "POINT_X": "14.808139",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "46.116136"
      		    },
      		    {
      		        "POPIO_NAME": "Solomon Islands",
      		        "GMI_CNTRY": "SLB",
      		        "POPIO_NAME_ES": "Islas Salom\u0097n",
      		        "POINT_X": "159.616703",
      		        "CONTINENT": "Oceania",
      		        "POINT_Y": "-8.901954"
      		    },
      		    {
      		        "POPIO_NAME": "Somalia",
      		        "GMI_CNTRY": "SOM",
      		        "POPIO_NAME_ES": "Somalia",
      		        "POINT_X": "45.705311",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "4.747511"
      		    },
      		    {
      		        "POPIO_NAME": "South Africa",
      		        "GMI_CNTRY": "ZAF",
      		        "POPIO_NAME_ES": "Sud\u0087frica",
      		        "POINT_X": "25.087733",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "-29.001052"
      		    },
      		    {
      		        "POPIO_NAME": "South Sudan",
      		        "GMI_CNTRY": "SSD",
      		        "POPIO_NAME_ES": "South Sudan",
      		        "POINT_X": "30.251066",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "7.305706"
      		    },
      		    {
      		        "POPIO_NAME": "Spain",
      		        "GMI_CNTRY": "ESP",
      		        "POPIO_NAME_ES": "Espa\u0096a",
      		        "POINT_X": "-3.656802",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "40.236901"
      		    },
      		    {
      		        "POPIO_NAME": "Sri Lanka",
      		        "GMI_CNTRY": "LKA",
      		        "POPIO_NAME_ES": "Sri Lanka",
      		        "POINT_X": "80.70355",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "7.615738"
      		    },
      		    {
      		        "POPIO_NAME": "St-Lucia",
      		        "GMI_CNTRY": "LCA",
      		        "POPIO_NAME_ES": "St-Lucia",
      		        "POINT_X": "-60.969577",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "13.902485"
      		    },
      		    {
      		        "POPIO_NAME": "St-Vincent and the Grenadines",
      		        "GMI_CNTRY": "VCT",
      		        "POPIO_NAME_ES": "St-Vincent and the Grenadines",
      		        "POINT_X": "-61.202642",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "13.216083"
      		    },
      		    {
      		        "POPIO_NAME": "Sudan",
      		        "GMI_CNTRY": "SDN",
      		        "POPIO_NAME_ES": "Sud\u0087n",
      		        "POINT_X": "29.939383",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "15.986757"
      		    },
      		    {
      		        "POPIO_NAME": "Suriname",
      		        "GMI_CNTRY": "SUR",
      		        "POPIO_NAME_ES": "Surinam",
      		        "POINT_X": "-55.912136",
      		        "CONTINENT": "South America",
      		        "POINT_Y": "4.128481"
      		    },
      		    {
      		        "POPIO_NAME": "Swaziland",
      		        "GMI_CNTRY": "SWZ",
      		        "POPIO_NAME_ES": "Swazilandia",
      		        "POINT_X": "31.480024",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "-26.561914"
      		    },
      		    {
      		        "POPIO_NAME": "Sweden",
      		        "GMI_CNTRY": "SWE",
      		        "POPIO_NAME_ES": "Suecia",
      		        "POINT_X": "16.752894",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "62.789174"
      		    },
      		    {
      		        "POPIO_NAME": "Switzerland",
      		        "GMI_CNTRY": "CHE",
      		        "POPIO_NAME_ES": "Suiza",
      		        "POINT_X": "8.215383",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "46.799023"
      		    },
      		    {
      		        "POPIO_NAME": "Syrian Arab Rep",
      		        "GMI_CNTRY": "SYR",
      		        "POPIO_NAME_ES": "Siria",
      		        "POINT_X": "38.504649",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "35.022993"
      		    },
      		    {
      		        "POPIO_NAME": "Tajikistan",
      		        "GMI_CNTRY": "TJK",
      		        "POPIO_NAME_ES": "Tadjikist\u0087n",
      		        "POINT_X": "71.015822",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "38.52989"
      		    },
      		    {
      		        "POPIO_NAME": "Tanzania",
      		        "GMI_CNTRY": "TZA",
      		        "POPIO_NAME_ES": "Tanzania",
      		        "POINT_X": "34.8081818312",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "-6.27107287242"
      		    },
      		    {
      		        "POPIO_NAME": "Thailand",
      		        "GMI_CNTRY": "THA",
      		        "POPIO_NAME_ES": "Tailandia",
      		        "POINT_X": "101.003318",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "15.114082"
      		    },
      		    {
      		        "POPIO_NAME": "The Bahamas",
      		        "GMI_CNTRY": "BHS",
      		        "POPIO_NAME_ES": "Bahamas",
      		        "POINT_X": "-78.0406006091",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "24.7014500118"
      		    },
      		    {
      		        "POPIO_NAME": "The Gambia",
      		        "GMI_CNTRY": "GMB",
      		        "POPIO_NAME_ES": " Gambia",
      		        "POINT_X": "-15.397103",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "13.44978"
      		    },
      		    {
      		        "POPIO_NAME": "The Netherlands",
      		        "GMI_CNTRY": "NLD",
      		        "POPIO_NAME_ES": "Holanda",
      		        "POINT_X": "-69.973447",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "12.516778"
      		    },
      		    {
      		        "POPIO_NAME": "Timor-Leste",
      		        "GMI_CNTRY": "TMP",
      		        "POPIO_NAME_ES": "Timor-Leste",
      		        "POINT_X": "NA",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "NA"
      		    },
      		    {
      		        "POPIO_NAME": "Togo",
      		        "GMI_CNTRY": "TGO",
      		        "POPIO_NAME_ES": "Togo",
      		        "POINT_X": "0.962284",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "8.526721"
      		    },
      		    {
      		        "POPIO_NAME": "Tonga",
      		        "GMI_CNTRY": "TON",
      		        "POPIO_NAME_ES": "Tonga",
      		        "POINT_X": "-174.840713",
      		        "CONTINENT": "Oceania",
      		        "POINT_Y": "-19.968806"
      		    },
      		    {
      		        "POPIO_NAME": "Trinidad and Tobago",
      		        "GMI_CNTRY": "TTO",
      		        "POPIO_NAME_ES": "Trinidad y Tobago",
      		        "POINT_X": "-61.257718",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "10.46866"
      		    },
      		    {
      		        "POPIO_NAME": "Tunisia",
      		        "GMI_CNTRY": "TUN",
      		        "POPIO_NAME_ES": "T\u009cnez",
      		        "POINT_X": "9.551856",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "34.115909"
      		    },
      		    {
      		        "POPIO_NAME": "Turkey",
      		        "GMI_CNTRY": "TUR",
      		        "POPIO_NAME_ES": "Turqu\u0092a",
      		        "POINT_X": "35.167313",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "39.060958"
      		    },
      		    {
      		        "POPIO_NAME": "Turkmenistan",
      		        "GMI_CNTRY": "TKM",
      		        "POPIO_NAME_ES": "Turkmenistan",
      		        "POINT_X": "59.376143",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "39.115934"
      		    },
      		    {
      		        "POPIO_NAME": "Uganda",
      		        "GMI_CNTRY": "UGA",
      		        "POPIO_NAME_ES": "Uganda",
      		        "POINT_X": "32.36704",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "1.275691"
      		    },
      		    {
      		        "POPIO_NAME": "Ukraine",
      		        "GMI_CNTRY": "UKR",
      		        "POPIO_NAME_ES": "Ucrania",
      		        "POINT_X": "31.385855",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "48.99725"
      		    },
      		    {
      		        "POPIO_NAME": "United Arab Emirates",
      		        "GMI_CNTRY": "ARE",
      		        "POPIO_NAME_ES": "Emiratos \u00e7rabes Unidos",
      		        "POINT_X": "53.982495292",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "23.4335314986"
      		    },
      		    {
      		        "POPIO_NAME": "United Kingdom",
      		        "GMI_CNTRY": "GBR",
      		        "POPIO_NAME_ES": "Reino Unido",
      		        "POINT_X": "-0.24654563597",
      		        "CONTINENT": "Europe",
      		        "POINT_Y": "52.2497215527"
      		    },
      		    {
      		        "POPIO_NAME": "United States",
      		        "GMI_CNTRY": "USA",
      		        "POPIO_NAME_ES": "Estados  Unidos",
      		        "POINT_X": "-99.1288693544",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "39.5316721041"
      		    },
      		    {
      		        "POPIO_NAME": "Uruguay",
      		        "GMI_CNTRY": "URY",
      		        "POPIO_NAME_ES": "Uruguay",
      		        "POINT_X": "-56.01756",
      		        "CONTINENT": "South America",
      		        "POINT_Y": "-32.800173"
      		    },
      		    {
      		        "POPIO_NAME": "US Virgin Islands",
      		        "GMI_CNTRY": "VIR",
      		        "POPIO_NAME_ES": "Islas V\u0092rgenes",
      		        "POINT_X": "-64.7625851905",
      		        "CONTINENT": "North America",
      		        "POINT_Y": "17.7355380388"
      		    },
      		    {
      		        "POPIO_NAME": "Uzbekistan",
      		        "GMI_CNTRY": "UZB",
      		        "POPIO_NAME_ES": "Uzbekist\u0087n",
      		        "POINT_X": "63.139909",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "41.756036"
      		    },
      		    {
      		        "POPIO_NAME": "Vanuatu",
      		        "GMI_CNTRY": "VUT",
      		        "POPIO_NAME_ES": "Vanuatu",
      		        "POINT_X": "167.701058",
      		        "CONTINENT": "Oceania",
      		        "POINT_Y": "-16.201437"
      		    },
      		    {
      		        "POPIO_NAME": "Vietnam",
      		        "GMI_CNTRY": "VNM",
      		        "POPIO_NAME_ES": "Vietnam",
      		        "POINT_X": "106.301296",
      		        "CONTINENT": "Asia",
      		        "POINT_Y": "16.641606"
      		    },
      		    {
      		        "POPIO_NAME": "West Bank and Gaza",
      		        "GMI_CNTRY": "WBG",
      		        "POPIO_NAME_ES": "West Bank and Gaza",
      		        "POINT_X": "34.351906",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "31.389951"
      		    },
      		    {
      		        "POPIO_NAME": "Western Sahara",
      		        "GMI_CNTRY": "ESH",
      		        "POPIO_NAME_ES": "Sahara Occidental",
      		        "POINT_X": "-12.214726",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "24.232712"
      		    },
      		    {
      		        "POPIO_NAME": "Zambia",
      		        "GMI_CNTRY": "ZMB",
      		        "POPIO_NAME_ES": "Zambia",
      		        "POINT_X": "27.774212",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "-13.46011"
      		    },
      		    {
      		        "POPIO_NAME": "Zimbabwe",
      		        "GMI_CNTRY": "ZWE",
      		        "POPIO_NAME_ES": "Zimbabwe",
      		        "POINT_X": "29.851885",
      		        "CONTINENT": "Africa",
      		        "POINT_Y": "-19.002537"
      		    }
      		];
      });
}());
