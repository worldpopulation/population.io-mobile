<?php
$dstart = $_GET['dstart'];
$dend = $_GET['dend'];
$dob = $_GET['dob'];
$dod = $_GET['dod'];
$dsum = $_GET['dsum'];
$url = $_GET['url'];
$country = $_GET['country'];

$description = 'According to your birthday '.$dob.' and the life expectancy in '.$country.' you will die on ' .$dod.'. http://population.io';

// iCal date format: yyyymmddThhiissZ
// PHP equiv format: Ymd\This
function dateToCal($timestamp) {
  return date('Ymd', strtotime($timestamp));
}
// Build the ics file
$ical = 'BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
CLASS:PUBLIC
DESCRIPTION:' . addslashes($description) . '
DTSTART;VALUE=DATE:' . dateToCal($dstart) . '
DTEND;VALUE=DATE:' . dateToCal($dend) . '
LOCATION:
SUMMARY;LANGUAGE=en-us:' . addslashes($dsum) . '
TRANSP:TRANSP
END:VEVENT
END:VCALENDAR';
//set correct content-type-header

header('Content-type: text/calendar; charset=utf-8');
header('Content-Disposition: attachment; filename=calendar.ics');
echo $ical;
?>
