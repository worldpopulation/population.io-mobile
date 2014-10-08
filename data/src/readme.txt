--- readme ---

country.shp 
created: 2014-09-07
by: Joey Lee


Datasets used:
Source: UCLA Mapshare (http://gis.ats.ucla.edu//Mapshare/Default.cfm)
World Continents
World Countries 2008

Data Processing:
	1. table join: cntry08 (by: GMI_cntry) with population.io_names.csv (by:world_bank_country_code)
	2. manually merge Svalbard with Norway
	3. Add data for Montenegro
	4. Derive polygon centroid from cntry08
	5. Add xy coordinates 
	6. spatial join: continents.shp  with cntry08 centroids
	7. spatial join: cntry08 + centroids/continents
	8. Final data


