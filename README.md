# fusioTable
Bootstrap table generator with pagination to be used with Fusio Project's SQL Table Adapter REST API 

requires JQuery and Bootstrap CSS, and of course Fusio Project over at https://fusio-project.org

Fusio Project is an awesome REST API management platform created with PHP. Among some of its cool features is being able to expose your chosen table via REST API without any coding. It also supports sorting, filtering and pagination out of the box. Seeing that it is a great tool, fusioTable is a JQuery Plugin that takes that API and build you a paginated table.

Currently fusioTable only supports pagination, and very poor buttons. But I plan to support columns sorting and also filtering later.

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
			$('#fusio-table-wrapper').fusioTable({
				url : 'http://api.mylocal.test/northwind/customer',
				count : 10, // default 10
				startIndex : 0, // default 0
				sortBy : 'customerid', // default null
				sortOrder : 'asc', // default null
				filterBy : 'customerid', // default null
				filterOp : 'M', // default null
				filterValue : 'startsWith', // default null
        token : null, // add JWT token is required
				columns : [ // default [] -- empty array
					{ label : 'Customer ID', name : 'customerid' },
					{ label : 'Company', name : 'companyname' },
					{ label : 'Contact', name : 'contactname' },
					{ label : 'Title', name : 'contacttitle' },
				]
			});
</script>
```

You can set some values to null and remove them all together and they will revert back to the default value. If you don't set a ```column``` array, all columns will be rendered.
