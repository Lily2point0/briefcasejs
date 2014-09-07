Briefcase.js
===========

JS/jquery library to use Google Spreadsheet as a database

##What?
--------
Retrieving data from a Google spreadsheet is easy when there are only 2 column. 
If the table is more complex, the data isn't formatted in an nice way.
Briefcase makes a call to your Google Spreadsheet and returns clean data; JSON or CSV(*coming soon*)

*See examples/getJSON for a quick start.*

##Setup
-------
1.Create your Google spreadsheet(or form, then > View Responses)
..*give a title to your columns, even the first one (this title will be used as a parameter)
2.Publish it.
..*Click File> Publish to the web
3.Get the id
..*The key that is in the URL when you publish it (i.e. *1nLQeSvCwV9EorcEvmqDEMz-cyJ6TpJsI*)

##Use
--------
***Note: At the moment, Briefcase.js requires jQuery (tested with 1.11.1).***

Include briefcase.js

You can then call either: 
..+**briefcase.getJSON()** > returns a clean JSON array with your data, 
..+**briefcase.getRawJSON()** > returns JSON without modification, 
..+**briefcase.getCSV()** (*coming soon*)
Each of these functions accept 2 parameters: **options** (an Object), and **callback** (your callback function).

Available options:
..+**id**: your spreadsheet id // mandatory
..+**type**: either "spreadsheet" or "form" //default is "spreadsheet", "form" is to be used if your spreadsheet is a Google Form responses spreadsheet.
..+**sheetNumber**: the sheet to use in your spreadsheet // default is 1
..+**leftColumnTitle**: the title of the column that contains the list of your items // default is "item", mandatory, cannot be left empty
..+**showTimestamp**: if you're using a form, whether to retrieve associated timestamp or not // default is false. 


##*TODO*
--------
+Get rid of jQuery
+Implement CSV option