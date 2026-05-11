import {chefDAO} from '../dao/chef.dao';
import {ListChefsInput, ChefAvailabilityInput} from '../schemas/chef.schema';

export class ChefService {

    async listChefs(filters: ListChefsInput) {
        return chefDAO.findAll(filters);
    }

    async getChef(chefId: string) {
        const chef = await chefDAO.findById(chefId);
        if (!chef) throw {statusCode: 404, code: 'not_found', message: 'Chef no encontrado'};
        return chef;
    }

    async getAvailability(chefId: string, filters: ChefAvailabilityInput) {
        const chef = await chefDAO.findById(chefId);
        if (!chef) throw {statusCode: 404, code: 'not_found', message: 'Chef no encontrado'};
        return chefDAO.getAvailability(chefId, filters.fecha);
    }
}

export const chefService = new ChefService();