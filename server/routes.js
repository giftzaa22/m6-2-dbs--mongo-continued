
const router = require("express").Router();
const { getSeats, updateSeats, updateBookedSeats } = require("./handlers");

const NUM_OF_ROWS = 8;
const SEATS_PER_ROW = 12;

// Code that is generating the seats.
// ----------------------------------
defaultSeats = {};
const row = ["A", "B", "C", "D", "E", "F", "G", "H"];
for (let r = 0; r < row.length; r++) {
  for (let s = 1; s < 13; s++) {
defaultSeats[`${row[r]}-${s}`] = {
      _id: `${row[r]}-${s}`,    
      price: 225,
      isBooked: false,
    };
  }
}
// updateSeats(Object.values(defaultSeats));

// ----------------------------------
//////// HELPERS
function getBookedSeats(seats) {
  return Object.assign(
    ...Object.values(seats).map((seat) => ({ [seat._id]: seat.isBooked }))
  );
}
let state;
router.get("/api/seat-availability", async (req, res) => {
  let seats = await getSeats();
  if (!state) {
    state = {
      bookedSeats: getBookedSeats(seats),
    };
  }
  console.log(seats);
 

  return res.json({
    seats: seats,
    bookedSeats: state.bookedSeats,
    numOfRows: 8,
    seatsPerRow: 12,
  });
});

// let lastBookingAttemptSucceeded = false;

router.post("/api/book-seat", async (req, res) => {
  const { seatId, creditCard, expiration, fullName ,email } = req.body;

  let seats = await getSeats();
  if (!state) {
    state = {
      bookedSeats: getBookedSeats(seats),
    };
  }

  const isAlreadyBooked = !!state.bookedSeats[seatId];
  if (isAlreadyBooked) {
    return res.status(400).json({
      message: "This seat has already been booked!",
    });
  }

  if (!creditCard || !expiration) {
    return res.status(400).json({
      status: 400,
      message: "Please provide credit card information!",
    });
  }

  // if (lastBookingAttemptSucceeded) {
  //   lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded;

  //   return res.status(500).json({
  //     message: "An unknown error has occurred. Please try your request again.",
  //   });
  // }

  // lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded;

  state.bookedSeats[seatId] = true;
  updateBookedSeats(seatId, fullName ,email);

  return res.status(200).json({
    status: 200,
    success: true,
  });
});

module.exports = router;
