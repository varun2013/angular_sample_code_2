## specification

module is build on Angular 8.X


## Module functionalities

This application is Related with "Events", we are importing different events form different "ticket Providers". Every ticket provider has different Data structure so we filter out the data, validate it and then import it in our server

In this module we are displaying millions of Artists data in list view with searching, sorting and different custom filter options. We can do different things here

1: We can select different artist by check box and then change there status

2: We can merge different duplicate Artist Data in single value data

3: Search Artist based on Artist name, providers,

4: filter artist list on state, status, is deleted options etc.

5: Display Duplicate Artist and compare there data


## Service File
admin-artist.service.ts

for different Api calls we are using this service file. Here "apiUrl" we are importing form our environment file