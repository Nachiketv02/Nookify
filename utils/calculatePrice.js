// utils/calculatePrice.js

function calculateTotalPrice(pricePerNight, checkInDate, checkOutDate) {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkOut <= checkIn) {
        throw new Error("Check-out date must be after check-in date");
    }

    const nights = (checkOut - checkIn) / (1000 * 60 * 60 * 24); // Calculate the number of nights
    return nights * pricePerNight; // Total price
}

module.exports = calculateTotalPrice;
