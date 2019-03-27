<?php
/**
	jlog(severity, message)
	Emulate syslog.  (Webfaction does not support syslog.)
	
	jlog wraps native php error_log()
	error_log $message_type
		0, to apache errorlog, or echoed to console
		1, to designated email
		2, not used
		3, to designated file
		4, to SAPI handler
**/

// syslog severity levels
$a = array(
	LOG_EMERG => 'emerg',    // 0
	LOG_ALERT => 'alert',    // 1
	LOG_CRIT => 'crit',      // 2
	LOG_ERR => 'err',        // 3
	LOG_WARNING => 'warning',// 4
	LOG_NOTICE => 'notice',  // 5
	LOG_INFO => 'info',      // 6
	LOG_DEBUG => 'debug',    // 7
);

$jlog_sourcefile = 'filename.php';	// filename of calling source code file

function openjlog($sourcefile) {
	global $jlog_sourcefile;
	$jlog_sourcefile = $sourcefile;
}

function jlog($severity, $msg) {
	global $jlog_sourcefile;
	global $jlog_logfile, $jlog_email;
	global $a;

	// format the message
	$m = date(DATE_RFC2822) . ' ' . $a[$severity] . ',' . $jlog_sourcefile . ' ' . $msg . "\n";

	// write the message to log
	error_log($m, 3, $jlog_logfile);

	// write severe errors to email
	if ($severity <= LOG_WARNING) {
		error_log($m, 1, $jlog_email);  // to email
	}
}
?>
