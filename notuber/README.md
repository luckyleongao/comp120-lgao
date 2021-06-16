### This lab creates a page that displays a Google Map of 6 vehicles with latitude and longitude. 

* The map takes up the entire page.
* A CSS file is required in order for the Google Map to even work.
* Use a separate file for the JavaScript.
* For now, the map shall be centered on latitude = 42.352271, longitude = -71.05524200000001. This location is South Station in Boston, MA.
* Each vehicle on the map shall be a marker with ths icon: ![car.png](car.png "car.png")

### Performance Comparison Table

| | requests  | transferred | Total resources  | Finish time | DOMContentLoaded time | Load time |
| ------------- |:-------------:| ------------- | ------------- |------------- |------------- |:-------------:|
| Before optimization | 67 | 10.8kB | 1.2MB | 1.45s | 25ms | 45ms |
| After optimization | 66 | 10.1kB  | 1.2MB | 1.25s | 20ms | 37ms |

### Performance Comparison Analysis

* The values in the above table may vary a little, but the overall result is that our optimizaiton steps work very well.  

* Specifically, the requests reduce by one because we put the javascript codes into the html. Thus we do not need to request the js file any more.  

* Besides, the transferred file also reduces because we minify the css and js codes.  

* Therefore, the finish time, DOMContentLoaded time and load time all decrease in some degree.

The piazza is really helpful for me to solve most of the problems.

I spent approximately 4 hours to complete this lab.