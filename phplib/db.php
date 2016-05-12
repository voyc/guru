<?php
require_once(dirname(__FILE__).'/../../config.php');

// Establish a connection to database 
function getConnection() {
	global $dbport, $dbname, $dbuser, $dbpassword;
	$conn = @pg_connect("port=$dbport dbname=$dbname user=$dbuser password=$dbpassword");
	if (!$conn) {
		jlog(LOG_CRIT,'Unable to connect to database.');
		return false;
	}
	return $conn;
}
?>