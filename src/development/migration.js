const { Pool, Client } = require('pg');
const { 
	readFileSync, 
	writeFileSync, 
	readdirSync,
	existsSync,
} = require('fs');

// read database connection options
const databaseOptions = { };
const rawData = readFileSync('src/main/resources/database.properties', { encoding: 'utf-8' });
const rawDataArr = rawData.split('\r\n');
for (let i = 0, l = rawDataArr.length; i < l; i++) {
    const rawDataItem = rawDataArr[i].split('=');
    databaseOptions[rawDataItem[0]] = rawDataItem[1];
}
console.log('database parameters are ', JSON.stringify(databaseOptions));

// get migrations list
const migrationsList = readdirSync('src/migrations').sort((a, b) => {
	const ats = parseInt(a.split('_')[0], 10);
	const bts = parseInt(b.split('_')[0], 10);
	return (ats > bts) ? 1 : -1;
});
console.log('migrations are: ', migrationsList);

// get migration status
const isMigrationStatusExists = existsSync('.migrationStatus.txt');
let migrationStatus;
if (isMigrationStatusExists) {
	migrationStatus = parseInt(readFileSync('.migrationStatus.txt', { encoding: 'utf-8' }), 10);
} else {
	migrationStatus = 0;
}
console.log('migration status is: ', migrationStatus);

// connection initialize
const client = new Client({
	user: databaseOptions.user,
	host: databaseOptions.host,
	database: databaseOptions.database,
	password: databaseOptions.password,
	port: databaseOptions.port,
});
client.connect();

// end function
const end = () => {
	writeFileSync('.migrationStatus.txt', migrationStatus);
	client.end()
}

// iterate function
const applyMigration = () => {
	if (migrationsList.length > migrationStatus) {
		const migrationQuery = readFileSync('src/migrations/' + migrationsList[migrationStatus], { encoding: 'utf-8' });
		client.query(migrationQuery, (err, res) => {
			if (err) {
				console.warn(err);
				end();
			} else {
				console.log('Migration ' + migrationsList[migrationStatus] + ' applied!');
				migrationStatus++;
				applyMigration();
			}			
		});
	} else {
		end();
	}
}
applyMigration();