import axios from 'axios';

const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;
const mapElement = document.getElementById('map')!;

type GoogleGeocodingResponse = {
    results: { geometry: { location: { lat: number, lng: number } } }[];
    status: 'OK' | 'ZERO_RESULTS';
}

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const googleMapsScript = document.createElement("script");
googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}`;
googleMapsScript.type = "text/javascript";
document.body.appendChild(googleMapsScript);

async function searchAddressHandler(event: Event) {
    event.preventDefault();
    const enteredAddress = addressInput.value;

    try {
        const response = await axios.get<GoogleGeocodingResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`);

        if (response.data.status !== 'OK') {
            throw new Error('Could not fetch location');
        }

        const coords = response.data.results[0].geometry.location;

        const map = new google.maps.Map(mapElement, {
            center: coords,
            zoom: 8
        });

        new google.maps.Marker({ position: coords, map });
    } catch (error) {
        console.log(error);
    }


}

form.addEventListener('submit', searchAddressHandler);
