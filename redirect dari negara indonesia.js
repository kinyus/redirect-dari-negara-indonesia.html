<?php
function getGeoIP($ip = null, $jsonArray = false) {
    try {
        // If no IP is provided use the current users IP
        if($ip == null) {
            $ip   = filter_input(INPUT_SERVER, 'REMOTE_ADDR');
        }
        // If the IP is equal to 127.0.0.1 (IPv4) or ::1 (IPv6) then cancel, won't work on localhost
        if($ip == "127.0.0.1" || $ip == "::1") {
            throw new Exception('You are on a local sever, this script won\'t work right.');
        }
        // Make sure IP provided is valid
        if(!filter_var($ip, FILTER_VALIDATE_IP)) {
            throw new Exception('Invalid IP address "' . $ip . '".');
        }
        if(!is_bool($jsonArray)) {
            throw new Exception('The second parameter must be a boolean - true (return array) or false (return JSON object); default is false.');
        }
        // Fetch JSON data with the IP provided
        $url  = "http://freegeoip.net/json/" . $ip;
        // Return the contents, supress errors because we will check in a bit
        $json = @file_get_contents($url);
        // Did we manage to get data?
        if($json === false) {
            return false;
        }
        // Decode JSON
        $json = json_decode($json, $jsonArray);
        // If an error happens we can assume the JSON is bad or invalid IP
        if($json === null) {
            // Return false
            return false;
        } else {
            // Otherwise return JSON data
            return $json;
        }
    } catch(Exception $e) {
        return $e->getMessage();
    }
}
function get_ip_address() {
    $ip_keys = array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR');
    foreach ($ip_keys as $key) {
        if (array_key_exists($key, $_SERVER) === true) {
            foreach (explode(',', $_SERVER[$key]) as $ip) {
                // trim for safety measures
                $ip = trim($ip);
                // attempt to validate IP
                if (validate_ip($ip)) {
                    return $ip;
                }
            }
        }
    }

    return isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : false;
}
function validate_ip($ip)
{
    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 | FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
        return false;
    }
    return true;
}

//https://sedotcode.blogspot.com/2017/09/redirect-visitor-by-country.html
$ip = get_ip_address();
$userGeoData = getGeoIP($ip); 

echo "IP: " .$ip."<br>";

echo "Kode Negara: " .$userGeoData->country_code."<br>";

echo "Nama Negara: " .$userGeoData->country_name."<br>";

echo "Kota: " .$userGeoData->city."<br>";


$userGeoData = getGeoIP(get_ip_address()); 

// echo "Kode Negara: " .$userGeoData->country_code."<br>";

// echo "Nama Negara: " .$userGeoData->country_name."<br>";

$kode_negara = $userGeoData->country_code;

if ($kode_negara == 'ID' || $kode_negara == "dan seterusnya" ) {
    header("HTTP/1.1 301 Moved Permanently");
    header("Location: //fb.com"); 
}
