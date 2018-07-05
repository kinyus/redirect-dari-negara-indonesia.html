$userGeoData = getGeoIP(get_ip_address()); 

// echo "Kode Negara: " .$userGeoData->country_code."<br>";

// echo "Nama Negara: " .$userGeoData->country_name."<br>";

$kode_negara = $userGeoData->country_code;

if ($kode_negara == 'ID' || $kode_negara == "dan seterusnya" ) {
    header("HTTP/1.1 301 Moved Permanently");
    header("Location: //fb.com"); 
}