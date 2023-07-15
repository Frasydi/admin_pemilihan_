export default function getLocation(callback, cbErr) {
    if (navigator.permissions && navigator.geolocation) {
        navigator.permissions
            .query({ name: 'geolocation' }).then(result => {
                console.log(result);
                if (result.state == "denied") {
                    return cbErr()
                }
                navigator.geolocation.getCurrentPosition((position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                    callback({latitude, longitude})
                }, () => {
                    console.log("Cant find location")
                    return cbErr()
                }, { enableHighAccuracy: true });
            })

    } else {
        console.log("Geolocation not supported");
        throw(new Error('Geo Location is required'))
    }
}