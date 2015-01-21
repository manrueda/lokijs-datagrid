(function (window, document, $, Loki) {
  var K_EVENT_FETCHDATA = 'fetch';
  var K_EVENT_NAMESPACE = 'lokiGrid';

  var K_CONST_DATA_NAME = 'lokiGrid';
  var K_CONST_MASTERCLASS = 'lokiGrid';

  var K_CLASS_FOOTER   = 'lg-footer';
  var K_CLASS_TOOLBAR  = 'lg-toolbar';
  var K_CLASS_LOADING  = 'lg-loaging';
  var K_CLASS_SELECTED = 'lg-selected';
  var K_CLASS_FILTER   = 'lg-filter';

  var K_ATTR_DATAPAGE = 'data-page';

  var K_CLASS_BTN_REFRESH = 'lg-btn-refresh';

  var K_COLUMNS_TYPE = {
    string: 1,
    boolean: 2,
    number: 3,
    date: 4
  };


  var eventHandler = {
    footer: {
      pageClick: function pageClick(event){
        if ($(this).parents('li').hasClass('disabled')){
          return;
        }
        var data = $(this).parents('div.' + K_CONST_MASTERCLASS).data(K_CONST_DATA_NAME);
        switch($(this).attr(K_ATTR_DATAPAGE)){
          case '-1':
            data.dataSource.current.page = data.dataSource.current.page -1;
            break;
          case '+1':
            data.dataSource.current.page = data.dataSource.current.page + 1;
            break;
          default:
            data.dataSource.current.page = Number($(this).attr(K_ATTR_DATAPAGE));
            break;
        }
        data.refresh();
      }
    },
    header: {
      filterClick: function filterClick(event){
        var filed = $(this).attr('data-filter');
        var cont = true;
        $.each($(this).parents('thead').find('th:has(span.opened)'), function(index, item){
          $(item).width('auto');
          if ($(item).find('span.opened').attr('data-filter') === filed){
            cont = false;
          }
          $(item).find('span.opened').removeClass('opened');
          $(item).find('input').remove();
        });

        if (!cont){
          return false;
        }

        var input = $('<input></input>');
        var data = $(this).parents('.' + K_CONST_MASTERCLASS).data(K_CONST_DATA_NAME);
        $(this).parents('th').width($(this).parents('th').width());
        $(this).parents('th').append(input);
        if (data.dataSource.currentFilter[filed]){
          input.val(data.dataSource.currentFilter[filed]);
        }
        input.off('keyup', eventHandler.header.filterKeyup).on('keyup', eventHandler.header.filterKeyup);
        input.focus();
        $(this).addClass('opened');
      },
      filterKeyup: function filterKeyup(event){
        var data = $(this).parents('.' + K_CONST_MASTERCLASS).data(K_CONST_DATA_NAME);
        var icon = $(this).siblings('div').find('span.' + K_CLASS_FILTER);
        var filed = icon.attr('data-filter');
        var value = $(this).val();
        if (value === ''){
          icon.removeClass('filtered');
          delete data.dataSource.currentFilter[filed];
        }else{
          icon.addClass('filtered');
          data.dataSource.currentFilter[filed] = $(this).val();
        }
        data.dataSource.filter(data.dataSource.currentFilter);
      }
    },
    table: {
      rowClick: function rowClick(event){
        $(this).parents('div.' + K_CONST_MASTERCLASS).data(K_CONST_DATA_NAME).select($(this));
      }
    },
    toolbar: {
      btnClick: function btnClick(event){
        $(this).parents('.' + K_CONST_MASTERCLASS).data(K_CONST_DATA_NAME).reload();
      }
    }
  };

  var intFunction = {
    createHeader: function createHeader(tableData, opts){
      $.each(opts.schema, function each(index, col){
        var th = $(['<th><div>', col.text,'</div></th>'].join(''));
        var div = th.find('div');
        if (col.attr){
          $.each(col.attr, function each(index, attr){
            th.attr(Object.keys(attr)[0], attr[Object.keys(attr)[0]]);
          });
        }
        th.addClass(col.class);
        th.width(col.width);

        if (col.filter !== undefined ? col.filter : true){
          div.append($('<span></span>').addClass('glyphicon glyphicon-filter ' + K_CLASS_FILTER).attr('data-filter', col.name));
        }

        tableData.headers.find('tr').append(th);
      });
    },
    createDb: function createDb(tableData, opts){
      tableData.dataSource.db = new loki(tableData.wrapper.attr('id'));
      tableData.dataSource.collection = tableData.dataSource.db.addCollection(tableData.wrapper.attr('id'));
      tableData.dataSource.dynamicView = tableData.dataSource.collection.addDynamicView('gridView');
    },
    createFooter: function createFooter(tableData){
      var cur = tableData.dataSource.current;
      var foot = [];
      //Twitter Bootstrap;
      foot.push('<nav><ul class="pagination">');


      foot.push('<li class="' + (cur.page === 1 ? 'disabled':'') + '" ><a data-page="-1"><span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span></a></li>');


      var begin = (cur.page < 6 ? 1 : cur.page - 5);
      var stop = Math.ceil(cur.length / tableData.dataSource.pageSize);
      stop = (stop < 11 ? stop : 11) + begin;
      
      for(var i = begin; i <= stop && i <= Math.ceil(cur.length / tableData.dataSource.pageSize); i++){
        if (i === cur.page){
          //Twitter Bootstrap;
          foot.push(['<li class="active"><a ', K_ATTR_DATAPAGE, '="', i, '">', i, '</a></li>'].join(''));  
        } else {
          foot.push(['<li><a ', K_ATTR_DATAPAGE, '="', i, '">', i, '</a></li>'].join(''));  
        }
      }

      foot.push('<li class="' + (cur.page === Math.ceil(cur.length / tableData.dataSource.pageSize) ? 'disabled':'') + '" ><a data-page="+1"><span aria-hidden="true">&raquo;</span><span class="sr-only">Previous</span></a></li>');

      foot.push('</ul></nav>');

      tableData.footer.find('nav').remove();
      tableData.footer.append(foot.join(''));

      tableData.footer.find('a[data-page]').on('click.' + K_EVENT_NAMESPACE, eventHandler.footer.pageClick);
    },
    tableEvents: function(tableData){
      tableData.body.off('click.lokiJSrowClick').on('click.lokiJSrowClick', 'tr', eventHandler.table.rowClick);
      tableData.headers.find('span.' + K_CLASS_FILTER).off('click', eventHandler.header.filterClick).click(eventHandler.header.filterClick);
    },
    toolbarEvents: function(tableData){
      tableData.toolbarContainer.find('a.btn.' + K_CLASS_BTN_REFRESH).click(eventHandler.toolbar.btnClick);
    },
    createToolbar: function(tableData){
      var icon;
      var text;
      var btn;
      for (var i = 0; i < tableData.toolbar.length; i++){
        var tool = tableData.toolbar[i];
        icon = undefined;
        text = undefined;
        btn = undefined;
        if (tool.name === 'refresh'){
          icon = $('<span></span>').addClass('glyphicon glyphicon-refresh icon');
          if (tool.text){
            text = $('<span></span>').html(tool.text);
          }else{
            icon.addClass('iconFix');
          }
          btn = $('<a></a>').addClass('btn btn-primary ' + K_CLASS_BTN_REFRESH);
          btn.append(icon);
          btn.append(text);
          tableData.toolbarContainer.append(btn);
        }else{
          if (tool.icon){
            icon = $('<span></span>').addClass(tool.icon).addClass('icon');
          }
          if (tool.text){
            text = $('<span></span>').html(tool.text);
          }
          if (tool.icon && !tool.text){
            icon.addClass('iconFix');
          }
          btn = $('<a></a>').addClass('btn btn-primary ' + tool.name);
          btn.addClass(tool.class);
          if (tool.attr){
            for (var j = 0; j < Object.keys(tool.attr).length; j++){
              var subKey   = Object.keys(tool.attr)[j];
              var subValue = tool.attr[subKey];
              btn.attr(subKey, subValue);
            }
          }
          btn.append(icon);
          btn.append(text);

          tableData.toolbarContainer.append(btn);
        }
      }
      this.toolbarEvents(tableData);
    },
    generateUUID: function generateUUID() {
      var d = new Date().getTime();
      var uuid = 'xxx-xx-4xxx-yxx-xxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random()*16)%16 | 0;
          d = Math.floor(d/16);
          return (c==='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
    }
  };

  //Table DOM Manager
  var data = {
    load: function load(income){
      this.wrapper.one(K_EVENT_FETCHDATA, function K_EVENT_FETCHDATA(){
        $(this).data(K_CONST_DATA_NAME).refresh();
      });
      if (typeof income === 'object'){
        this.dataSource.load(income);
      }
      if (typeof income === 'string'){
        this.dataSource.remoteOrigin = income;
        this.dataSource.remoteLoad();
      }
      return this;
    },
    refresh: function refresh(){
      var that = this;
      that.body.find('tr').remove();
      $.each(this.dataSource.getView(), function each(index, item){
        var arr = [];
        item.dataUid = intFunction.generateUUID();

        arr.push('<tr ');
        arr.push('data-uid="' + item.dataUid + '" ');
        arr.push('>');

        $.each(that.schema, function each(index, col){
          var toInsert = '';
          switch(col.type){
            case K_COLUMNS_TYPE.string:
              toInsert = item[col.name];
              break;
            case K_COLUMNS_TYPE.number:
              toInsert = item[col.name].toString();
              break;
            case K_COLUMNS_TYPE.boolean:
              if (col.isTrue && col.isTrue){
                if (item[col.name]){
                  toInsert = col.isTrue.replace('#value', item[col.name]);
                }else{
                  toInsert = col.isFalse.replace('#value', item[col.name]);
                }
              }else{
                toInsert = item[col.name].toString();
              }
              break;
            case K_COLUMNS_TYPE.date:
              toInsert = item[col.name].toString();
              break;
          }

          arr.push(['<td class="', col.name ,'">', toInsert, '</td>'].join(''));
        });
        arr.push('</tr>');
        that.body.append(arr.join(''));
      });

      intFunction.createFooter(that);
      return this;
    },
    reload: function reload(){
      if (this.dataSource.remoteOrigin){
        this.load(this.dataSource.remoteOrigin);
      }else{
        this.refresh();
      }
    },
    select: function select(row){
      if (!row){
        row = this.table.find('tr.' + K_CLASS_SELECTED);
      }else{
        row.siblings().removeClass(K_CLASS_SELECTED);
        row.addClass(K_CLASS_SELECTED);
        this.wrapper.trigger(new $.Event('rowChange', {row: row}));
      }
      return row;
    },
    dataItem: function dataItem(row){
      if (!row){
        return this.dataSource.findByUID(this.select().attr('data-uid'));
      }else{
        return this.dataSource.findByUID(row.attr('data-uid'));
      }
    },
    getColumn: function getColumn(name){
      var result = this.schema.filter(function(e){return e.name === name;});
      if (result.length === 0){
        return undefined;
      }else{
        return result[0];
      }
    }
  };

  //Data Manager
  var dataSource = {
    current: {
      page:1,
      length: undefined
    },
    currentFilter: {},
    remoteOrigin: '',
    load: function load(data){
      this.current.length = data.length;
      this.collection.clear();
      this.collection.insert(data);
      this.wrapper.trigger(new $.Event(K_EVENT_FETCHDATA, {data: data}));
      return this;
    },
    remoteLoad: function remoteLoad(){
      var ds = this;
      ds.parent.loading.show();
      $.ajax(this.remoteOrigin).done(function done(data) {
        ds.load((typeof data === 'string' ? JSON.parse(data): data));
        ds.parent.loading.hide();
      });
      return this;
    },
    getView: function getView(){
      this.current.length = this.dynamicView.resultset.data().length;
      return this.dynamicView.resultset.offset(this.pageSize * (this.current.page - 1)).limit(this.pageSize).data();
    },
    findByUID: function findByUID(uid){
      if (!uid){
        return undefined;
      }
      return this.dynamicView.resultset.find({dataUid: uid})[0];
    },
    select: undefined,
    filter: function filter(filters){
      
      this.dynamicView.applyFind();
      if (filters){
        this.dynamicView.filterPipeline = [];
        for (var i = 0; i < Object.keys(filters).length; i++){
          var auxFilter = {};
          var filed   = Object.keys(filters)[i];
          var value = filters[filed];
          var schema = this.parent.getColumn(filed);
          if (schema.type === K_COLUMNS_TYPE.string || schema.type === K_COLUMNS_TYPE.date){
            auxFilter[filed] = {$contains: value};
          }else{
            auxFilter[filed] = {$eq: value};
          }
            
          this.dynamicView.applyFind(auxFilter);
        }
      }
      this.parent.refresh();
    },
    pageSize: 10
  };

  $.fn.lokiGrid = function lokiGrid(opts){
    //opts.schema = Columns structure
    //  text  -> text to the header
    //  name  -> name of the field
    //  attr  -> array with atributes to the TH
    //  class -> string with classes to the TH
    //  width -> width to the TH

    var wrapper = $(this);
    var tableData = data;

    wrapper.addClass(K_CONST_MASTERCLASS);

    tableData.table = $('<table></table>');
    if (opts.options === undefined){
      opts.options = {};
    }
    if (opts.toolbar === undefined){
      opts.toolbar = [];
    }
    //Twitter Bootstrap

    tableData.table.addClass('table table-hover');
    if ((opts.options.hover || true)){
      tableData.table.addClass('table-hover');
    }

    if ((opts.options.striped || true)){
      tableData.table.addClass('table-striped');
    }

    if ((opts.options.bordered || false)){
      tableData.table.addClass('table-bordered');
    }

    if ((opts.options.condensed || false)){
      tableData.table.addClass('table-condensed');
    }

    tableData.schema = opts.schema;
    tableData.toolbar = opts.toolbar;
    tableData.wrapper = wrapper;

    tableData.dataSource = dataSource;
    tableData.dataSource.wrapper = wrapper;
    tableData.dataSource.parent = tableData;

    tableData.dataSource.pageSize = opts.options.pageSize || tableData.dataSource.pageSize;

    tableData.headers = $('<thead></thead>');
    tableData.headers.append('<tr></tr>');

    tableData.body = $('<tbody></tbody>');
    tableData.footer = $('<div></div>').addClass(K_CLASS_FOOTER);
    tableData.toolbarContainer = $('<div></div>').addClass(K_CLASS_TOOLBAR);

    tableData.loading = $('<div class="overlay"><span class="' + (opts.options.loadingIcon || 'glyphicon glyphicon-refresh') + '"></span></div>');
    tableData.loading.hide();

    intFunction.createToolbar(tableData, opts);
    intFunction.createHeader(tableData, opts);
    intFunction.createDb(tableData, opts);

    tableData.table.append(tableData.headers);
    tableData.table.append(tableData.body);
    wrapper.append(tableData.toolbarContainer);
    wrapper.append(tableData.table);
    wrapper.append(tableData.footer);
    wrapper.prepend(tableData.loading);

    intFunction.tableEvents(tableData);


    wrapper.data(K_CONST_DATA_NAME, tableData);
    return this;
  };



  window.lokiDataGrid = {
    columnType: K_COLUMNS_TYPE
  };
  
})(window, document, jQuery, loki);
