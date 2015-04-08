/*
*	Briefcase.js
*	author: Lily Madar
*	created: 7 Sept 2014
*
*	source: https://github.com/Lily2point0/briefcasejs
*/
!function(){
	var briefcase = {
		version: "1.0.0",
		getRawJSON: function(options, callback){
			format = 'raw';
			init(compareOptions(options), callback);
		},
		getJSON: function(options, callback) {
			format = 'json';
			init(compareOptions(options), callback);
		},
		getCSV:function(options, callback) {
			format = 'csv';
			init(compareOptions(options), callback);
		},
		getXML:function(options, callback) {
			format = 'xml';
			init(compareOptions(options), callback);
		}
	},
	config = {
		id: "",
		type: "spreadsheet",
		sheetNumber: 1,
		leftColumnTitle:"item",
		showTimeStamp: false,
		download: false
	},
	format;

	function init(config, callback) {
		var path = 'https://spreadsheets.google.com/feeds/list/'+config.id+'/'+config.sheetNumber+'/public/values?alt=json';
		getData(path, callback);
	}

	function compareOptions(options) {
		Object.keys(config).forEach(function(i){
			if(options.hasOwnProperty(i)) {
				config[i] = options[i];
			}
		});
		
		return config;
	}

	function getData(path, callback){
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
				if(xmlhttp.status == 200) {
					formatData(JSON.parse(xmlhttp.responseText), format, callback);
				} else {
					var div = document.createElement("div");
    				div.innerHTML = xmlhttp.responseText;

					var error_msg = {
						"responseType":"error", 
						"responseStatus":xmlhttp.status, 
						"responseMessage": div.innerText
					};


					formatData(error_msg, "error", callback);
				}	
			}
		}
		xmlhttp.open("GET", path, true);
		xmlhttp.send();
	}

	function formatData(data, format, callback) {
		var d = data;
		switch(format) {
			case 'raw':
				callback(d);
				if(config.download) {
		        	createDownloadFile(d, 'application/json');
		        }
			break;

			case 'json':
				callback(formatJSON(d.feed.entry));
			break;

			case 'csv':
				callback(formatCSV(d.feed.entry));
			break;

			case 'xml':
				callback(formatXML(d.feed.entry));
			break;

			case 'error':
				callback(data);
			break;	

			default:
				callback(d.feed.entry);
			break;
		}
	}

	function formatJSON(entry) {
		var items = [];

        for(var i = 0; i<entry.length; i++) {
            var values = [];
            var ts = "";

            Object.keys(entry[i]).forEach(function (key) {

                if(key.toString().substring(0,4) == "gsx$") {
                    var item = {};
                    var value = {};

                    var category = key.toString().substring(4, key.toString().length);
                    var entry_value = entry[i][key].$t;
                    
                    if(config.type == "form") {
						if(category == config.leftColumnTitle) {
							item.title = entry_value;
							items.push(item);
						} else {
							if(category != "timestamp") {
								value.name = category.toString();
								value.value = entry_value;
								values.push(value);
							} else {
								ts = entry_value;
							}
						}
					} else {
						if(category == config.leftColumnTitle) {
							item.title = entry_value;
							items.push(item);
						} else {
							value.name = category.toString();
							value.value = entry_value;
							values.push(value);
						}
					}
				}
            });

            items[i].categories = values;
            if(config.type == "form" && config.showTimeStamp) items[i].timestamp = ts;
        }

        if(config.download) {
        	createDownloadFile(items, 'application/json');
        }
        return items;
	}

	function formatCSV(entry) {
		var items = [];

		for(var i = 0; i<entry.length; i++) {
			var titles = [];
            var values = [];
            Object.keys(entry[i]).forEach(function (key) {

				if(key.toString().substring(0,4) == "gsx$") {
                    var value = [];

                    var category = key.toString().substring(4, key.toString().length);
                    var entry_value = entry[i][key].$t;

                    if(config.type == "form" && !config.showTimeStamp) {
                    	if(category != "timestamp") {
                    		titles.push(category);
                    		values.push(entry_value);
                    	}
                    } else {
                    	titles.push(category);
                    	values.push(entry_value);
                    }
                }
            });

            items.push(values);
        }

        items.splice(0, 0, titles);

        var csvRows = [];

		for(var j=0; j < items.length; j++){
			csvRows.push(items[j].join(','));
		}

		var csvString = csvRows.join("\n");

		if(config.download) {
        	createDownloadFile(csvString, 'text/csv');
        }
		
		return csvString;
	}

	function formatXML(entry) {
		var xmlText = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<data>\n";
		var items = "";
		var categories = "";
		var ts =""

        for(var i = 0; i<entry.length; i++) {
            var values = [];
            var item = "\t<item>\n";
            var cat = "";

            Object.keys(entry[i]).forEach(function (key) {

                if(key.toString().substring(0,4) == "gsx$") {

                    var category = key.toString().substring(4, key.toString().length);
                    var entry_value = entry[i][key].$t;
                    
                    if(config.type == "form") {
						if(category == config.leftColumnTitle) {
							item += "\t\t<title>" + entry_value + "</title>\n";
						} else {
							if(category != "timestamp") {
								cat += "\t\t\t<category name=\""  + category.toString() + "\">" + entry_value + "</category>\n";
							} else {
								ts = "\t\t<timestamp>"+ entry_value + "</timestamp>\n";
							}
						}
					} else {
						if(category == config.leftColumnTitle) {
							item += "\t\t<title>" + entry_value + "</title>\n";
						} else {
							cat += "\t\t\t<category name=\""  + category.toString() + "\">" + entry_value + "</category>\n";
						}


					}
				}
				categories = "\t\t<categories>\n"+cat+"\t\t</categories>\n";	

				if(config.type == "form" && config.showTimeStamp) {
					items = item + ts + categories + "\t</item>\n";
				} else {
					items = item + categories + "\t</item>\n";
				}
            });			
			
			xmlText+= items;
        }

        xmlText += "</data>"

        if(config.download) {
        	createDownloadFile(xmlText, 'text/xml');
        }

        return xmlText;
	}

	function createDownloadFile(data, mime) {
		var file, fileformat;

		if(format == 'json' || format == 'raw') {
			file = [JSON.stringify(data, null, "\t")];	
			fileformat = 'json';
		} else if (format == 'csv') {
			file = [data];
			fileformat = 'csv';
		} else {
			file = [data];
			fileformat = 'xml';
		}
		var blobForFile = new Blob(file, {type : mime});
		var downloadLink = window.URL.createObjectURL(blobForFile);

		var download = document.createElement("a");
		download.setAttribute('href', downloadLink);
		download.setAttribute('download', "briefcaseData."+fileformat);
		download.click();		
	}

	this.briefcase = briefcase;
}();