<?php
require_once(dirname(__FILE__).'/../../config.php');
require_once('jlog.php');
require_once('db.php');
openjlog(basename(__FILE__));

/**
	svc/getwisdom service entry point
	quote, work, author
	returned as json string
**/
function getwisdom() {
	jlog(LOG_INFO, "getwisdom requested.");
	$a = doGetWisdom();
	echo json_encode($a);
	jlog(LOG_INFO, "getwisdom completed.");
}

function doGetWisdom() {
	$a = array(
		'ok' => 0, // boolean
		'q' => 'content',
		'w' => 'name',
		'a' => 'author'
	);

	$conn = getConnection();
	if (!$conn) {
		return $a;
	}
	
	$name = 'getquote';
	$sql = 'select * from guru.quote q, guru.work w where q.workid = w.id and q.id = $1';
	$result = @pg_prepare($conn, $name, $sql);
	if (!$result) {
		jlog(LOG_ERR, $name.' prepare error. '.pg_last_error($conn));
		return $a;
	}
	
	$highkey = 540;
	$r = intval((rand(1, 100) * $highkey) / 100);
	$result = @pg_execute($conn, $name, array($r));
	if (!$result) {
		jlog(LOG_ERR, $name . ' execute error. '.pg_last_error($conn)); 
		return $a;
	}

	$numrows = pg_num_rows($result);
	if ($numrows < 1) {
		jlog(LOG_WARNING, 'No quotes found. '.pg_last_error($conn));
		return $a;
	}

	$arr = array();
	$row = pg_fetch_array($result, 0, PGSQL_ASSOC);
	$a['q'] = $row['content'];
	$a['w'] = $row['name'];
	$a['a'] = $row['author'];

	$a['ok'] = 1;
	return $a;	
}
