# fusioTable
Bootstrap table generator with pagination to be used with Fusio Project's SQL Table Adapter REST API 

requires JQuery and Bootstrap CSS, and of course Fusio Project over at https://fusio-project.org

Fusio Project is an awesome REST API management platform created with PHP. Among some of its cool features is being able to expose your chosen table via REST API without any coding. It also supports sorting, filtering and pagination out of the box. Seeing that it is a great tool, fusioTable is a JQuery Plugin that takes that API and build you a paginated table.

Currently fusioTable only supports :

* column sorting 
* pagination with (very ugly buttons)
* custom columns

Future plans to support column filtering.

## How to use

Load Bootstrap, JQuery and fusioTable. Below is an example, depending on where you have the files stored.

```
		<link rel="stylesheet" type="text/css" href="css/bootstrap.css">
		<script src="js/jquery.js"></script>
		<script src="js/fusioTable.js"></script>
```

Create an empty `<div>` with a unique id parameter.

```
		<div id="fusio-table-wrapper"></div>
```

Create another ```<script>``` for your JQuery

```
<script>
	$(document).ready(function(){
		$('#fusio-table-wrapper').fusioTable({
			url : 'http://api.mylocal.test/northwind/customer',
			count : 10, // default 10
			startIndex : 0, // default 0
			sortBy : 'customerid', // default null
			sortOrder : 'asc', // default null
			filterBy : 'customerid', // default null
			filterOp : 'M', // default null
			filterValue : 'startsWith', // default null
			token : null, // add JWT token if required
			table_id : 'fusioTable', // optional table ID
			columns : [ // default [] -- empty array
				{ label : 'Customer ID', name : 'customerid', sortable : true },
				{ label : 'Company', name : 'companyname' },
				{ label : 'Contact', name : 'contactname', sortable : true },
				{ label : 'Title', name : 'contacttitle' },
				{ label : 'Action', // to add custom columns
					custom: function(cols) { 
						if (cols == null) return; 
						// Some how browser will run this the first time when
						// API not loaded yet and cols is null. Will break with
						// JS error. This prevents that. cols will return the 
						// entry columns from API call for your manipulation.
						
						return "<button data-id='"+cols.customerid+"' class='btn btn-sm btn-warning edit-customer'>EDIT</button> "
							+ "<button data-id='"+cols.customerid+"' class='btn btn-sm btn-danger delete-customer'>DELETE</button>";
					} 
				} 
			]
		});
	
		// sample for assigning event triggers to your buttons in custom column
		$('#fusio-table-wrapper').on('click','.edit-customer', function(){
			var customerid = $(this).attr('data-id');
			window.location.href = 'edit_customer.php?id='+customerid;
		});
	
		$('#fusio-table-wrapper').on('click','.delete-customer', function(){
			var customerid = $(this).attr('data-id');
			window.location.href = 'delete_customer.php?id='+customerid;
		});
	
	});

</script>
```

You can set some values to null and remove them all together and they will revert back to the default value. If you don't set a ```column``` array, all columns will be rendered.
