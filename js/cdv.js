var data = null;

d3.text('carnet.txt', (error, text) => {
    if (error) {
        alert('Impossible de trouver le carnet');
        return; 
    }

   data = d3.dsvFormat(';').parse(text, d => ({
        Date: d.Date,
        Site: d.Site,
        Durée: parseInt(d.Durée, 10),
        Commentaire: d.Commentaire
    }));

    displayFlights(data);
});


const displayFlights = data => {
    const table = d3.select('.content').append('table').classed('mdl-data-table', true);

	table.append('thead').append('tr').selectAll('th')
        .data(['Numéro'].concat(data.columns)).enter()
        .append('th')
        .classed('mdl-data-table__cell--non-numeric', true)
        .text(column => column);

	table.append('tbody').selectAll('tr')
        .data(data).enter().append('tr')
        .selectAll('td')
        .data((row, index) => [index + 1].concat(data.columns.map(column => row[column])))
        .enter()
        .append('td')
		.classed('mdl-data-table__cell--non-numeric', true)
	    .text(d => d);
};


const displayStats = data => {
    var totalHours = 0;
    var totalMinutes= 0;
    var siteFrequency = {}; 
    var siteDuration = {}; 
    var duration = 0;
    var sortDescending = false;

    data.forEach(d => {
        duration += d.Durée;
        siteFrequency[d.Site] ? siteFrequency[d.Site] += 1 : siteFrequency[d.Site] = 1;
        siteDuration[d.Site] ? siteDuration[d.Site] += d.Durée : siteDuration[d.Site] = d.Durée;
    });

    totalHours = Math.floor(duration/60);
    totalMinutes = duration - 60 * totalHours;
    
    const table = d3.select('.content').append('table').classed('mdl-data-table', true);

	table.append('thead').append('tr').selectAll('th')
        .data(['Site', 'Vols', 'Durée']).enter()
        .append('th')
        .classed('mdl-data-table__cell--non-numeric', true)
        .text(column => column)
        .on('click', d => {
            rows.sort((a, b) => sortDescending ? d3.descending(a[d], b[d]) : d3.ascending(a[d], b[d]));
            sortDescending = !sortDescending;
        });

	const rows = table.append('tbody').selectAll('tr')
        .data(Object.keys(siteFrequency).map(s => ({'Site': s, 'Vols': siteFrequency[s], 'Durée': siteDuration[s]})))
        .enter().append('tr')
        .sort((a, b) => d3.descending(a.Vols, b.Vols));

    rows.selectAll('td')
        .data(row => ['Site', 'Vols', 'Durée'].map(c => row[c]))
        .enter()
        .append('td')
		.classed('mdl-data-table__cell--non-numeric', true)
	    .text(d => d);
};


d3.selectAll('a').on('click', function() {
    const href = d3.select(this).attr('href');
    d3.select('.content').remove();
    d3.select('main').append('div').classed('content', true);
    if (href === '#stats') displayStats(data);
    else displayFlights(data);
});
