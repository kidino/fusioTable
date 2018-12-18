/*! 

Author : Iszuddin Ismail
Website : https://github.com/kidino/fusioTable 

fusioTable 
Table generator for Fusio Project SQL Table REST API

Requirement
- JQuery
- Bootstrap CSS

*/
(function ( $ ) {
 
    $.fn.fusioTable = function( options ) {
		var that = this;
 
        // This is the easiest way to have default options.
        var settings = $.extend({
			sortOrder : 'desc',
			sortBy : null,
			startIndex : 0,
			count : 10,
			filterBy : null,
			filterOp : null,
			filterValue : null,
			columns : [],
			url : null,
			token : null,
			table_id : 'fusioTable'
        }, options );
		
		var build_table = function(settings) {
			
			var ajax_option = { url: settings.url, data:settings, type: 'GET' };
			if (settings.token !== null) {
				ajax_option.headers = {"Authorization": 'Bearer '+settings.token};
			}
			
			$.when( $.ajax(ajax_option) ).then(function( data, textStatus, jqXHR ) {
				if( jqXHR.status == 200) {
					
					console.log(data);
					
					if (that.find('#'+settings.table_id).length < 1) {
						that.html('<table id="'+settings.table_id+'" class="table table-striped"><thead><tr></tr></thead><tbody></tbody></table><div class="buttons-wrapper"></div>');
					}
					
					if (that.find('#'+settings.table_id+' thead tr th').length < 1) { 
						fusio_build_thead(data, settings);
					}
					
					fusio_build_rows(data, settings.table_id, settings);
					
					fusio_build_buttons(data, settings);
				}
			});	

		}
		
		var fusio_build_thead = function (data, settings) {
			console.log('fusio_build_thead');
			var tid = '#'+settings.table_id;
			if (settings.columns.length < 1) {
				for(var x in data.entry[0]) {
					that.find(tid+' thead tr').append('<th data-col="'+x+'" class="sortable">'+x+'</th>');
				}
			} else {
				for(var x in settings.columns) {
					var col = settings.columns[x];
					var do_sortable = '';
					
					if (col.hasOwnProperty('custom')) {						
						that.find(tid+' thead tr').append('<th>'+col.label+'</th>');
					} else {
						if (col.hasOwnProperty('sortable') && col.sortable) { do_sortable = ' class="sortable"'; }						
						that.find(tid+' thead tr').append('<th data-col="'+col.name+'"'+do_sortable+'>'+col.label+'</th>');
					}					
				}
			}
			
			that.find(tid+' th.sortable').css('cursor','pointer');

		};
		
		var fusio_build_rows = function(data, table_id, settings){
			var tid = '#'+table_id;
			if (data.entry.length) {
				that.find(tid+' tbody').html('');
				for(var x in data.entry) {
					var trstr = '<tr>';
					
					if (settings.columns.length > 0) {
						for(var y in settings.columns) {
							var col = settings.columns[y];
							if (col.hasOwnProperty('custom')) {
								
								var colstr = col.custom;
								
								for(var u in data.entry[x]) {
									colstr = colstr.replaceAll('{'+u+'}', data.entry[x][u])
								}
								
								trstr += '<td>'+colstr+'</td>';
							} else {
								trstr += '<td>'+data.entry[x][col.name]+'</td>';
							}
						}
					} else {
						var entry = data.entry[x];
						for(var y in entry) {
							trstr += '<td>'+entry[y]+'</td>';
						}
					}					
					trstr += '</tr>';
					that.find(tid+' tbody:last').append(trstr);
				}
			}
		};
		
		var fusio_build_buttons = function(data, settings) {
			
			that.find('.buttons-wrapper').html('');
			
			var total_pages = Math.floor( data.totalResults / settings.count );
			var this_page = Math.floor( settings.startIndex / settings.count) + 1;
			var page = settings.count+1;
			if ((data.totalResults / settings.count) > 0) { total_pages++; }
			//console.log(total_pages);
			
			for(var i = 1; i <= total_pages; i++) {
				var active = '';
				if (i == this_page) {
					active = ' active';
				}
				
				that.find('.buttons-wrapper').append('<button class="btn btn-sm btn-secondary btn-page'+active+'" data-page="'+i+'">'+i+'</button> ');
			}
			
		}
 
		if (settings.url === null) {
			return false;
		}
		 
		build_table(settings);
				
		this.on('click', '.btn-page', function(){
			var page = $(this).attr('data-page');
			
			settings.startIndex = settings.count * (page-1);
			console.log('startIndex : '+ settings.startIndex);
			build_table(settings);
			
		});
		
		var sym = { 
			'asc' : '<span class="sort-icon float-right"> &mapstoup;</span>',
			'desc' : '<span class="sort-icon float-right"> &mapstodown;</span>'
		};
		
		this.on('click', 'th.sortable', function(){
			
			var col = $(this).attr('data-col');
			console.log(col);
			console.log(settings.sortBy);
			console.log(col == settings.sortBy);
			
			if (col == settings.sortBy) {
				if (settings.sortOrder == 'desc') { settings.sortOrder = 'asc'; }
				else { settings.sortOrder = 'desc'; }
			} else {
				settings.sortBy = col;
				settings.sortOrder = 'asc';
			}
			
			build_table(settings);
			
			$(this).parent().find('.sort-icon').remove();
			$(this).append( sym[settings.sortOrder] );
			
		});
				
    };
 
}( jQuery ));

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
