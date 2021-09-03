# 23-Final_Project


 ![Flowchart](/Flowchart.png)

### Lion's Den

<b>Members:</b> Andrew Bly, Drew Davis, Marc Leslie, and Steve Walker
<br>

**Efforts**<br>
Andrew: Exploratory Data Analysis, Process Chart, and ML modeling<br>
Drew: Data Retrieval, Tableau <br>
Marc: Data Retrieval, ETL <br>
Steve: Repo, Readme, and ML Coding <br>
<br>
**Data**<br> 
[Los Angeles Zip Codes/geo coordinates](https://data.lacounty.gov/GIS-Data/ZIP-Codes-and-Postal-Cities/c3xr-3jw2/data) <br>
[Sacramento Zip Codes/geo coordinates](https://www.unitedstateszipcodes.org/zip-code-database/) <br>
[Gallup Poll](https://news.gallup.com/poll/284135/percentage-americans-smoke-marijuana.aspx) <br>
[Census Data, Tables S0101, S1101, S1901, ACS 5-Year Estimates for 2019](https://data.census.gov/cedsci/) <br>
[Sacramento Dispensaries]( https://www.cityofsacramento.org/City-Manager/Divisions-Programs/Cannabis-Management/business-information/dispensaries) <br>
<br>
**ETL Census Data**<br>
•	Removed zip codes that did not return data or missing significant amounts of data <br>
• Broke median household income into quintiles per zip code per city <br>
<br>
**ETL: Dispensary Data** <br>
•	Contains **420** dispensaries located in Los Angeles City and **39** dispensaries in Sacramento City <br>
•	Deleted _known_ non-commercial retail facilities (i.e., cultivation locations) <br>
•	Deleted businesses missing location coordinates <br>
•	Manually examined data for locations with matching addresses or coordinates <br>
•	Dispensary data correlates with Choropleth maps to exclude non-Los Angeles City locations <br>
<br>
**Programs/Libraries Used** <br>
•	Pandas <br>
•	Java Script <br>
•	HTML/CSS <br>
•	Plotly <br>
•	GeoPandas <br>
•	GeoJSON <br>
•	Bootstrap <br>
•	K-means <br>
•	Tableau <br>
