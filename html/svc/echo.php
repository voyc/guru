<?php
header("Access-Control-Allow-Origin: *");

// parse the inputs out of $_POST
$taint_stress = (isset($_POST['stress'])) ? $_POST['stress'] : '0';
$taint_data = (isset($_POST['data'])) ? $_POST['data'] : '';

// validate the inputs
$stress = validateStress($taint_stress);
$data = validateData($taint_data);
if (is_null($stress) || $data === false) {
	exit;
}

// if stress test requested, kill or delay the response
if ($stress) {
	$r = rand(1, 20000);
	if ($r >= 15000) {
		exit;  // 25% of the time, die
	}
	usleep( $r); // delay for n microseconds, up to 15 seconds
}
	
// return the input data
$a = array(
	'ok' => 1,
	'echo' => $data
);
echo json_encode($a);
return;  // finished

// stress must be zero or one
function validateStress($taint) {
	$clean = NULL;
	if ($taint == '1') {
		$clean = true;
	}
	else if ($taint == '0') {
		$clean = false;
	}
	return $clean;
}

// data must be innocuous string, length < 100
function validateData($taint) {
	$clean = false;
 	$ok = preg_match('/^[a-zA-Z0-9@& #$%]{1,100}$/', $taint);
	if ($ok) {
		$clean = $taint;
	}
	return $clean;
}
?>
