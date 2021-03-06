Briefcase.js
===========

Javascript library to use Google Spreadsheet as a database

## What?
Retrieving data from a Google spreadsheet is easy when there are only 2 columns. 
If the table is more complex, the data isn't formatted in an nice way, and therefore not easily usable.
Briefcase makes a call to your Google Spreadsheet and returns clean data; JSON or CSV (and now even XML, just in case someone still uses it).

*See examples/getJSON for a quick start.*

**Note: Using Google Spreadsheet as a database is not recommended for production work; but can be useful for quick prototypes and local applications**

## Setup
1. Create your Google spreadsheet(or form, then > View Responses)
  * give a title to your columns, even the first one (this title will be used as a parameter)
2. Publish it.
  * Click File> Publish to the web
3. Get the id
  * The key that is in the URL when you publish it (i.e. *1nLQeSvCwV9EorcEvmqDEMz-cyJ6TpJsI*)

For more detailed instructions, see [this blog post](http://lilydev.wordpress.com/2014/10/03/using-google-drive-as-your-database/)  

## Use

Include briefcase.js

You can then call either: 
- **briefcase.getJSON()** > returns a clean JSON array with your data, 
- **briefcase.getRawJSON()** > returns JSON without modification, 
- **briefcase.getCSV()** > returns string of comma separated values
- **briefcase.getXML()** > returns data in a structured XML.

Each of these functions accepts 2 parameters: **options** (an Object), and **callback** (your callback function).

Available options:
- **id**: your spreadsheet id // mandatory
- **type**: either "spreadsheet" or "form" //default is "spreadsheet", "form" is to be used if your spreadsheet is a Google Form responses spreadsheet.
- **sheetNumber**: the sheet to use in your spreadsheet // default is 1
- **leftColumnTitle**: the title of the column that contains the list of your items // default is "item", mandatory, cannot be left empty
- **showTimeStamp**: if you're using a form, whether to retrieve associated timestamp or not // default is false. 
- **download**: whether to download a JSON or CSV file from the spreadsheet  // default is false. Please note this option is only available in Chrome, Firefox and Opera.


### *TODO*
- [x] Get rid of jQuery
- [x] Implement CSV option
- [x] Add file download option
- [x] Add XML option (?)
- [x] Add response when error