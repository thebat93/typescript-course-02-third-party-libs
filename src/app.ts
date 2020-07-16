import axios from 'axios';

const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;

type GoogleGeocodingResponse = {
    results: { geometry: { location: { lat: number, lng: number } } }[];
    status: 'OK' | 'ZERO_RESULTS';
}

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

async function searchAddressHandler(event: Event) {
    event.preventDefault();
    const enteredAddress = addressInput.value;

    try {
        const response = await axios.get<GoogleGeocodingResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`);

        if (response.data.status !== 'OK') {
            throw new Error('Could not fetch location');
        }

        const coords = response.data.results[0].geometry.location;
    } catch (error) {
        console.log(error);
    }


}

form.addEventListener('submit', searchAddressHandler);
