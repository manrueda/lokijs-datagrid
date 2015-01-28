LokiJS Datagrid
=========

This is a fusion between the LokiJS ([techfort/LokiJS](https://github.com/techfort/LokiJS)) clien-side DB and a Bootstrap table.

## Installation

1. Run this commnad from your project root:

    ```shell
    bower install lokijs-datagrid
    ```

2. Import the JS and CSS files

    ```html
    <link rel="stylesheet" type="text/css" href="bower_components/bootstrap/dist/css/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="bower_components/lokijs-datagrid/dist/lokijs-datagrid.min.css">
    

    <script type="text/javascript" src="bower_components/jquery/dist/jquery.min.js"></script>
    <script type="text/javascript" src="bower_components/lokijs/build/lokijs.min.js"></script>
    <script type="text/javascript" src="bower_components/lokijs-datagrid/dist/lokijs-datagrid.min.js"></script>
    ```

3. Implement the plugin

    ```js
    $('div#grid').lokiGrid({
        schema: [
            {text: 'ID', name: 'id', type: lokiDataGrid.columnType.number, filter: false},
            {text: 'User', name: 'userName', type: lokiDataGrid.columnType.string, filter: true},
            {text: 'Name', name: 'name', type: lokiDataGrid.columnType.string},
            {text: 'Administrator', name: 'isAdmin', type: lokiDataGrid.columnType.boolean, isTrue: 'YESSS!!', isFalse: 'NUUUU!!', isNullOrUndefined: 'NO DATA'},
            {text: 'Date', name: 'date', type: lokiDataGrid.columnType.date}
        ],
        options: {
            hover: true,
            striped: false,
            bordered: true,
            condensed: true,
        },
        toolbar: [
            {
              name: 'refresh',
              text: 'Refresh'
            },
            {
              name: 'create',
              text: ' Create',
              class: 'custom-class',
              attr: {
                new: true
              },
              icon: 'glyphicon glyphicon-user'
            }
        ],
    });
    ```

4. Load the grid with data

    ```js
    // From an URL by AJAX
    $('div#grid').data('lokiGrid').load('MOCK_DATA.json');

    //OR

    // From a local JSON
    $('div#grid').data('lokiGrid').load({...});
    ```

## Options

When the grid is created with the command 'lokiGrid', an object must be passed as parameter. This object can have this properties.

#### schema
Array with the properties of each column

* text: Text to the HTML header of the table.
* name: Name of the field in the income data.
* type: Data type of the field
* isTrue: This string is going to be inserted in the cell if the value is true. Can be HTML (Only form boolean type data)
* isTrue: This string is going to be inserted in the cell if the value is false. Can be HTML (Only form boolean type data)
* isNullOrUndefined: This string is going to be inserted in the cell if the value is null or undefined. Can be HTML (Only form boolean type data)
* filter: Defines if the column is filterable or not

#### options
Object with a mix of properties

* hover: Set the bootstrap table hover class 
* striped: Set the bootstrap table striped class 
* bordered: Set the bootstrap table bordered class 
* condensed: Set the bootstrap table condensed class
* loadingIcon: Set the class for the span that is used when the AJAX is loading
* pageSize: Number of rows per page (default: 10)
* caseInsensitive: Defines if the search is made case insensitive or sensitive.

#### toolbar
Array with the properties of each button for the toolbar

* name: Internal name for the button (this class is going to be added as a class)
* text: Text for the button
* class: String of class names separated with spaces to be added to the button
* attr: Object with a key-value structure with attributes to be added to the button
* icon: Icon classes for the button icon

NOTE: The button with the name 'refresh' is a special one, this refresh the data and makes the AJAX call (if the data are remote) and you only can modify the text.

## Events

The events will be fired over the object with the 'lokiGrid' class

* rowChange: When the selected row changes.

## License
(The MIT License)

Copyright (c) 2015 Manuel Rueda <manuel.rueda.un@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR I