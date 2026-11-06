import ServiceManager from "../managers/ServiceManager.js"

const serviceManager = new ServiceManager('./src/data/services.json');

export const getServices = async(req, res) => {
    try {
        const services =  await serviceManager.readServices();

        return res.status(200).json({
            status: "success",
            payload: services
        })

    } catch(error) {
        return res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}

export const getServicesById = async(req, res) =>  {
    try {
        const service = await serviceManager.getServicesById(req.params.sid);

        return res.status(200).json({
            status: "success",
            payload: service
        })
        
    } catch(error) {
        return res.status(404).json({
            status: "error",
            message: error.message
        })
    }
    
}

export const createService = async(req, res) => {
    try {

        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            return res.status(400).json({ error: "El body debe ser un objeto JSON" });
          }

        const service = await serviceManager.createService(req.body);
        
        return res.status(201).json({
            status: "success",
            payload: service
        })

    } catch (error) {
        return res.status(404).json({
            status: "error",
            message: error.message
        })
    }
}

export const updateService = async(req, res) => {
    try {

        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            return res.status(400).json({ error: "El body debe ser un objeto JSON" });
          }

        const service = await serviceManager.updateService(req.params.sid, req.body)

        return res.status(200).json({
            status: "success",
            payload: service
        })

    } catch (error) {
        return res.status(404).json({
            status: "error",
            message: error.message
        })
    }

}

export const deleteService = async(req, res) => {
    try {
        const service = await serviceManager.deleteService(req.params.sid)

        return res.status(200).json({
            status: "success",
            payload: service
        })

    } catch(error) {
        return res.status(404).json({
            status: "error",
            message: error.message
        })
    }
}