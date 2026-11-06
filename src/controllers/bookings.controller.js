import BookingManager from "../managers/BookingManager.js"
import ServiceManager from "../managers/ServiceManager.js"

const serviceManager = new ServiceManager("./src/data/services.json");
const bookingManager = new BookingManager('./src/data/bookings.json', serviceManager);

export const getBookingByID = async(req, res) => {
    try {
        const booking = await bookingManager.getBookingByID(req.params.bid);

        return res.status(200).json({
            status: "success",
            payload: booking
        })
        
    } catch(error) {
        return res.status(404).json({
            status: "error",
            message: error.message
        })
    }
}

export const createBooking = async(req, res) => {
    try {
        const booking = await bookingManager.createBooking(req.body);

        return res.status(200).json({
            status: "success",
            payload: booking
        })

    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: error.message
        })
    }
}

export const updateServiceForBooking = async(req, res) => {
    try {

        const booking = await bookingManager.updateServiceForBooking(req.params);

        return res.status(200).json({
            status: "success",
            payload: booking
        })
      
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: error.message
        })
    }

}