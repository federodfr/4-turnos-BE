import crypto from "crypto";
import {promises as fs} from "fs";

class ServiceManager {

    constructor(path) {
        this.path = path;
    }

    async readServices() {
        try {
            const data = await fs.readFile(this.path, "utf-8");

            if (!data || data.trim() === "") {
                throw new Error("Servicios no encontrados");
            }

            console.log(data)
            return JSON.parse(data);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async writeServices(services) {
        try {
            await fs.writeFile(this.path, JSON.stringify(services, null, 2));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getServices() {
        try {
            const services = await this.readServices();

            if(!services || services.length === 0) {
                throw new Error("No se han agregado servicios")
            }

            return services
        } catch(error) {
            console.error(error);
            throw error;
        }
    }

    async getServicesById(id) {
        try {
            const services = await this.readServices();
            const service =  services?.find(service => service.id === id);

            if(!service) {
                throw new Error("Servicio no encontrado");
            }

            return service;
        } catch(error) {
            console.log(error)
            throw error
        }
        
    }

    async createService({name, description, duration, price, category, available}) {
        try {
            console.log("Data: " + name + description + duration + price + category + available)

            if(!name || !description || !duration || !price || !category || !available) {
                throw new Error("Todos los campos son requeridos");
            }

            const services = await this.readServices();

            const newService = {
                id: crypto.randomUUID(),
                name,
                description,
                duration,
                price,
                category,
                available
            };

            services.push(newService);
            await this.writeServices(services);
            return newService;
        } catch (error) {
            console.log("entra error: ", error)
            throw error;
        }
    }

    async updateService(id, data) {
        try {

            const services = await this.readServices();
            const idx = services.findIndex(service => service.id === id)

            if (idx === -1) { 
                throw new Error("Servicio no encontrado");
            }

            if(JSON.stringify(data) === '{}' || !data){
                throw new Error("Se debe setear al menos un valor");
            }

            if(data.id) {
                throw new Error("El ID no puede ser modificado")
            }

            services[idx] = {
                ...services[idx],
                ...data
            }

            await this.writeServices(services)
            return services[idx]
        } catch (error) {
            console.error(error);
            throw error;
        }

    }

    async deleteService(id) {
        try {
            const services = await this.readServices()
            const idx = services.findIndex(service => service.id === id)

            if (idx === -1) { 
                throw new Error("Servicio no encontrado"); 
            }

            const deletedService = services.splice(idx,1)[0]
            await this.writeServices(services)
            return deletedService
        } catch(error) {
            console.log(error);
            throw error
        }
    }
}

export default ServiceManager;