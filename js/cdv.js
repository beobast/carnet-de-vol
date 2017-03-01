d3.text('carnet.txt', (error, text) => {
    if (error) {
        alert(error);
        return;
    }

    const columns = ['Date', 'Site', 'Durée', 'Commentaire'];
    const data = d3.dsvFormat(';').parse(text);
    const table = d3.select('body').append('table');

	// append the header row
	table.append('thead').append('tr')
	  .selectAll('th')
	  .data(columns).enter()
	  .append('th')
	    .text(column => column);

	// create a row for each object in the data
	const rows = table.append('tbody').selectAll('tr')
	  .data(data)
	  .enter()
	  .append('tr');

	// create a cell in each row for each column
	rows.selectAll('td')
	  .data(row => columns.map(column => ({column: column, value: row[column]})))
	  .enter()
	  .append('td')
	    .text(d => d.value);
});
