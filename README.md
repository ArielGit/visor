Visor HistoricOSM
=================
   
*Fecha de actualización de los datos: 26/04/2014*

[http://sigdeletras.com/visor-historicosm/](http://sigdeletras.com/visor-historicosm/)
         
##Descripción
      
El siguiente visor es el resultado de un primer **análisis de la información geográfica de tipo patrimonial para España disponible en [OpenStreetMap](http://www.openstreetmap.org) bajo la clave [*historic*](http://wiki.openstreetmap.org/wiki/Key:historic)**. El total de puntos documentados a 26 de abril de 2014 ha sido de **8144**. En este número se incluye las entidades de tipo puntual y los centroides de las entidades de tipo área.

Una buena introducción al uso de la eiqueta *historic* puede encontrarse en la misma [wiki de OpenStreetMap](http://wiki.openstreetmap.org/wiki/Historic)

Con este trabajo se pretende examinar las posibilidades de uso por parte de particulares, administraciones o empresas que estén interesados, gestionen o quieran desarrollar proyectos patrimoniales basados en los datos de OpenStreetMap.

De igual modo, espero que la presentación de estos resultados **facilite la colaboración de más usuarios** con el objetivo de mejorar el volumen y calidad de la información existente. Como ejemplo  participativo, sirvan los trabajos de mejora de información geográfica sobre los Bienes de Interés Cultural de <a href="http://wiki.openstreetmap.org/wiki/ES:Bienes_de_Inter%C3%A9s_Cultural_en_Canarias" target="_blank">Canarias</a> o <a href="http://wiki.openstreetmap.org/wiki/ES:Bienes_de_Inter%C3%A9s_Cultural_de_C%C3%B3rdoba" target="_blank">Córdoba</a>

Los datos, generados por los colaborados de OpenStreetMap, han sido almacenados para su presentación en <a href="http://cartodb.com/">CartoDB</a> y se encuentran bajo licencia <a href="http://www.openstreetmap.org/copyright">CC-BY-SA y ODbL</a>. Pueden ser descargados en distintos formatos (csv, geojson, kml o shape o svg) desde este <a href="http://sigdeletras.cartodb.com/tables/historicosm/public" target="_blank">enlace</a>.

	
##Fases del trabajo

###Obtención de datos

Este ha sido uno de los pasos del proyecto que más tiempo ha requerido y creo que necesita mejorar. Se ha probado la descarga de toda la información con la clave *historic* usando wget desde las APIs de OSM y OverPass, pero los resultados no han sido satisfactorios. 

Al final se ha realizado la descarga de archivos en formato GeoJSON usando [OverPass Turbo](http://overpass-turbo.eu) construyendo una consulta por cada valor de *historic* como se puede apreciar en el ejemplo.

```
<osm-script output="json" timeout="25">
  <id-query {{nominatimArea:Cordoba}} into="area"/>
  <union>
  
    <query type="node">
      <has-kv k="historic" v="monument"/>
      <area-query from="area"/>
    </query>
    <query type="way">
      <has-kv k="historic" v="monument"/>
      <area-query from="area"/>
    </query>
    <query type="relation">
      <has-kv k="historic" v="monument"/>
      <area-query from="area"/>
    </query>
  </union>
  <print mode="body"/>
  <recurse type="down"/>
  <print mode="skeleton" order="quadtile"/>
</osm-script>
```

###Conversión y edición

Para cada uno de los archivos GeoJSON se ha generado tres ficheros según la geometría (punto, línea y área) en formato ESRI shape. Estos han sido unidos en tres únicos ficheros por geometría a los que se le ha añadido los atributos id, name y historic. Para estas operaciones se ha han creado dos *scripts* utilizando la librería [ogr2ogr](http://www.gdal.org/ogr2ogr.html). 

Los ficheros shape obtenidos han sido  incorporados en una base de datos geográfica en Postgres-PostGIS. Desde aquí se ha generado una nueva capa de puntos con los centroides de la capa de áreas que, junto a la capa puntual o de nodos, se ha convertido en nuestra capa de trabajo. 

Por último, y también utilizando funciones de PostGIS, se ha añadido la información de municipio y provincia por posición (ST_Intersect). Estos valores se han obtenido de la capa de límites administrativos de la web [Global Administrative Areas](http://www.gadm.org/) y su calidad depende lógicamente de las coordenadas del elemento, por lo que pueden existir errores en aquellos bienes localizados cerca de fronteras administrativas o en el mar.

###Diseño y visualización web de datos

Se ha utilizado [CartoDB](http://cartodb.com/) como servicio de almacenamiento y visualización "en la nube". CartoDB permite la subida de forma ágil de conjuntos de datos en distintos formatos. Una vez subidos los datos, se ha generado la simbología  utilizando CartoCSS con fondo de cartográfico basado en datos de OSM utilizando el servicio [MapBox](https://www.mapbox.com).

```
#historicosm {
   marker-opacity: 0.9;
   marker-line-color: #575757;
   marker-line-width: 1.5;
   marker-line-opacity: 0.5;
   marker-placement: point;
   marker-type: ellipse;
   marker-width: 10;
   marker-allow-overlap: true;
}
#historicosm [zoom <= 11]{
      marker-width: 8;
   
}

#historicosm [zoom <= 5]{
      marker-width: 5;
   
}

#historicosm[tipo="ruins"] {
   
  marker-fill: #E31A1C;
}
#historicosm[tipo="monument"] {
     marker-fill: #FF7F00;
}
...
```
*Ejemplo de definición de estilo en CartoDB usando CartoCSS*


Para la página HTML del visor se ha utilizado una [plantilla](https://github.com/CartoDB/cartodb-publishing-templates) de CartoDB con modificaciones mínimas a la que se le ha añadido la visualización de los datos utilizando la librería javascripts [cartoDB.js](http://developers.cartodb.com/documentation/cartodb-js.html).
       
Para desplazarse por el visor sólo hay que pinchar en la pantalla y mover el ratón. Pueden usarse el control de zoom para aumentar o disminuir la escala de visualización. La botonera con las iniciales "PI|IC" permite centrar la vista en la Península Ibérica o en las Islas Canarias.

Se ha incluido una herramienta de búsqueda básica, para centrar la vista, por ejemplo por municipio (ej. Córdoba, España o Burgos)

La información asociada a cada punto es: 

- Nombre. Procede de la etiqueta *name* de OSM. No siempre existe por lo que en algunos puntos este valor esta en blanco.
- Tipo. Valor de la clave <i>historic</i> (ej. *monument*)
- Municipio.
- Provincia.
- Enlace a OpenStreetMap según el <i>id </i>del elemento.
- Búsqueda en Wikipedia según el nombre y el municipio.
- Búsqueda en Flickr según el nombre y el municipio.  


##Análisis de resultados

###Puntos por valores de *historic*

| **Tag**           | **Total** |
|:--------------------|-------:|
| ruins               | 2284  |
| monument            | 1826  |
| archaeological_site | 1213  |
| castle              | 1082  |
| memorial            | 793   |
| wayside_cross       | 405   |
| wayside_shrine      | 200   |
| boundary_stone      | 178   |
| battlefield         | 53    |
| city_gate           | 37    |
| building            | 17    |
| citywalls           | 16    |
| manor               | 15    |
| fort                | 12    |
| ship                | 5     |
| cannon              | 4     |
| wreck               | 3     |
| tomb                | 1     |


###Uso de valores de *historic*

[**historic:ruins**](http://wiki.openstreetmap.org/wiki/Tag:historic%3Druins)

Con 2284 puntos, *ruins* es el valor más usado (28%) pero pensamos que su uso en gran medida es erróneo. Según la wiki, *ruins* la práctica correcta sería  usar este valor cuando nos encontramos con un bien inmueble y no podemos asignarle de forma clara un valor asignado a su función. 

Una revisión del valor de *name* relacionado con esta etiqueta, nos indican que  un porcentaje muy elevado de elementos podrían pasar a otras valores o incluso a subtipos (site_type=amphitheatre) mejor definidos como, monumento (iglesia, ermita, hospital), castillo (atalaya, torre, castillo, castello, castell, castello, castellot, fortaleza o alcázar) o yacimiento arqueológico (cueva, yacimiento (idiomas), arqueol?, anfiteatro, foro, forum, dolmen, villa,  domus, acueducto, circo, castro, *castrum*, termas). 

Pensamos que *historic:ruins* podría tener más utilidad si se usara de forma vinculada a otras etiquetas como *ruins=yes* orientando su uso al estado de conservación.

[**historic:monument**](http://wiki.openstreetmap.org/wiki/Tag:historic%3Dmonument)

El principal problema de este valor reside en su definición en inglés. En el wiki de OpenStreetMap se define como *"An object, especially large and made of stone, built to remember and show respect to a person or group of people. "* y se encuentra estrechamente vinculada a *memorial* del que se diferencia según su tamaño. Sin embargo, en España, la definición de monumento no incluye sólo bienes conmemorativos. En nuestro caso *monumento* está más relacionado con la definición que ofrece la [Wikipedia](http://es.wikipedia.org/wiki/Monumento), incluso en su versión en inglés indicando que este término *"...is often applied to buildings or structures that are considered examples of important architectural and/or cultural heritage"*. 

En bastantes ocasiones como hemos podido comprobar, por ejemplo con las iglesias (*amenity=place of worship*) o las torres (*man_made=tower*), el modelo de datos de OpenStreetMap incluye elementos que muchas veces podrían considerarse patrimoniales. Es un trabajo complicado, pero seguro que una revisión de la información ya existente podría aumentar el total de puntos llamémosle patrimoniales. 

Esta misma situación se dará con toda seguridad con otros bienes de patrimonio industrial (minas, castilletes, edificios industriales, estaciones de ferrocarril, presas, centrales eléctricas) o patrimonio etnográfico (molinos, aceñas, salinas, caleras, hornos) o arquitectura civil.

En esta revisión se podría también barajar el uso de *historic=building*.

    
[**historic:memorial**](http://wiki.openstreetmap.org/wiki/Tag:historic%3Dmemorial)

Bajo este atributo se encuentran principalmente elementos que en el lenguaje popular se conocen como "monumento a..." y están dedicados a la memoria o conmemoración de algún evento relevante o personas ilustres. También se pueden encontrar representados escudos, estatuas, bustos, monolitos, obeliscos o triunfos. Según la información asociada, pensamos que muchos de ellos no tienen por qué tener un valor histórico o patrimonial y podrían encajar mejor en [tourism=artwork](http://wiki.openstreetmap.org/wiki/Tag:tourism%3Dartwork).

[**historic:castle**](http://wiki.openstreetmap.org/wiki/Tag:historic%3Dcastle)

Los castillos y fortificaciones no poseen ninguna peculiaridad a destacar. Quedan perfectamente definidos e incluso tienen gran desarrollo en valores secundarios. Sólo añadir, como ya hemos comentado, que su número podría aumentar con una revisión de la etiqueta *ruins*.

[**historic:wayside_cross**](http://wiki.openstreetmap.org/wiki/Tag:historic%3Dwayside_cross)

Son por regla general cruces en caminos. Habría que mirar con detenimiento su valor patrimonial, aunque en algunas comunidades autónomas este tipo de hitos están siendo inventariados y catalogados como patrimonio etnográfico.

**Otras etiquetas de historic**

- [wayside_shrine](http://wiki.openstreetmap.org/wiki/Tag:historic%3Dwayside_shrine). Son ermitas, capillas, humilladeros o calvarios situados cercanos a vías.
- [boundary_stone](http://wiki.openstreetmap.org/wiki/Tag:historic%3Dboundary_stone). Hitos, mojones o indicadores de límites administrativos. No se ha encontrado su valor patrimonial aunque muchos de ellos pueda ser históricos.
- [battlefield](http://wiki.openstreetmap.org/wiki/Tag:historic%3Dbattlefield). Lugares donde tuvo lugar una batalla. Aunque los casos documentados pueden ser de interés, existen algunos ejemplos (refugios, cementerios, baterías, trincheras...) que pensamos no se identifican correctamente con su definición estricta, pero que habría que investigar ya que son de gran interés.
- [city_gate](http://wiki.openstreetmap.org/wiki/Tag:historic%3Dcity_gate). Puertas históricas de ciudades. Su uso es escaso pero es una etiqueta de gran interés, sobre todo si se relaciona con murallas (*citywalls*).
- building. De los 17 casos identificados, sólo 12 poseen nombre y se podrían asignar a otras categorías (iglesia, torre, casa). A pesar de ello, pensamos que el uso de esta etiqueta puede servir como valor de tipo general para cualquier edificio de carácter histórico.
- [citywalls](http://wiki.openstreetmap.org/wiki/Tag:historic%3Dcitywalls). El número de veces utilizado es mínimo. Eso se puede deber a que su representación gráfica está más asociada a un línea que a un polígono y que con toda seguridad será más común el uso de la etiqueta [*barrier=city_wall*](http://wiki.openstreetmap.org/wiki/Tag:historic%3Dcitywalls). Este dato debería tenerse en cuenta ya que desde 1949 en España y por declaración genérica los elementos defensivos como castillos, murallas o torreones son considerados BIC.
- [manor](http://wiki.openstreetmap.org/wiki/Tag:historic%3Dmanor). Se usa para identificar casas de campo o mansiones. En España, podrían recoger gran variedad de tipologías arquitectónicas desde palacios, pazos, casas de campo, cortijos,etc.
- [fort](http://wiki.openstreetmap.org/wiki/Fort). Según la wiki es mejor usar la combinación *historic=castle+castle_type=fortress*
- [ship](http://wiki.openstreetmap.org/wiki/Tag:historic%3Dship) y [cannon](http://wiki.openstreetmap.org/wiki/Tag:historic%3Dcannon). Pues eso, barcos y cañones.
- [wreck](http://wiki.openstreetmap.org/wiki/Tag:historic%3Dwreck). Indica naufragios. Quizás por su localización han escapado a la consulta, pero sin duda existe gran cantidad de restos de naufragios o incluso evidencias de barcos romanos (pecios) a lo largo de nuestras costas, que en muchas ocasiones tiene incluso su figura de protección.
- [historic=tomb](http://wiki.openstreetmap.org/wiki/Tag:historic%3Dtomb). Sólo un ejemplo. Podría ser muy utilizada dentro de cementerios. Habría que ver el uso de *tomb*.


### Etiquetados de cronología

En muy contadas ocasiones, quizás por ser un aspecto más especializado, se suele añadirse información cronológica a los datos. Esto hace imposible realizar consultas y análisis basados en aspectos temporales, a no ser que se haga una búsqueda del tipo *ibérico, romano, árabe, islámico, paleocristiano o visigodo* según la información incluida en del valor *name*.

Las etiquetas que se pueden utilizar son [historic:civilization](http://wiki.openstreetmap.org/wiki/Key:historic:civilization), [start_date](http://wiki.openstreetmap.org/wiki/Key:start_date) o [end_date](http://wiki.openstreetmap.org/wiki/Key:end_date).



### Información sobre protección.

Sin duda un trabajo de referencia sobre esta materia es el realizado para la identificación de los [Bienes de Interés Cultural en Canarias](http://wiki.openstreetmap.org/wiki/ES:Bienes_de_Inter%C3%A9s_Cultural_en_Canarias).
En este trabajo se recogen las etiquetas, que junto a las ya definidas en *historic*, completan la información sobre protección patrimonial de los BIC. Con la misma metodología se están desarrollando este trabajo para la provincia de Córdoba.

- [protection_title](http://wiki.openstreetmap.org/wiki/Key:protection_title). Bien de Interés Cultural
- protection_title:category.  Reflejar la categoría del BIC (Sitio Histórico, Monumento, Conjunto Histórico, etc.)
- ref:bic. Identificador del bien otorgado por el Ministerio de Cultura. Por ejemplo, RI-51-00041831. 
- [boundary=protected_area](http://wiki.openstreetmap.org/wiki/Tag:boundary%3Dprotected_area) y area=yes. Áreas de protección.
- protect_class=22 Correspondiente a "Cultural assets" (bienes culturales).

Aunque se encuentra en estado de propuesta, existe también la etiqueta [heritage](http://wiki.openstreetmap.org/wiki/Key:heritage) vincula a señalar el reconocimiento del valor patrimonial por parte de una institución como la UNESCO.

### Información turística 

En este caso consultar los valores de [tourism](http://wiki.openstreetmap.org/wiki/Key:tourism) como *attraction, information o yes*


###  Datos según límites administrativos.

De los 8144 puntos, 142 tiene información sobre el municipio al que pertenecen. Este dato depende de la localización del punto en relación al polígono de límites administrativos.De igual manera, existen errores de asignación a un determinado municipio de aquellas localizaciones cercanas a límites administrativos.

Los datos de las 10 provincias y municipios con mejores resultados son lo siguientes.


| **Provincia**  | **Total** |
|:-----------|------:|
| Las Palmas | 656   |
| Barcelona  | 587   |
| Burgos     | 426   |
| A Coruña   | 373   |
| Baleares   | 331   |
| Girona     | 264   |
| Madrid     | 262   |
| Murcia     | 251   |
| Cantabria  | 237   |
| Jaén       | 231   |



| **Municipio** | **Total** |
|:----------|------:|
| Madrid    | 130   |
| Cartagena | 127   |
| Burgos    | 126   |
| Córdoba   | 86    |
| Barcelona | 80    |
| Zaragoza  | 58    |
| Cáceres   | 57    |
| Mérida    | 57    |
| Ferrol    | 57    |
| Sevilla   | 55    |






