import { DEV_MODE, Storage, STORAGE_KEYS, API, Utils } from './utils.js';

// Favorites management class (exported as named class so callers can `new Favorites()`)
class Favorites {
    constructor() {
        // noop for now; instance methods will use Storage/API
    }

    // Get favorite items
    async getFavorites() {
        try {
            if (DEV_MODE) {
                const stored = Storage.get(STORAGE_KEYS.FAVORITES, []);
                if (!Array.isArray(stored) || stored.length === 0) {
                    const mockFavorites = [
                        { name: 'Stirred Egg', price: 8.99, image: 'media/egeswithbrade-maindish-menu.png', category: 'Main Dishes' }
                    ];
                    Storage.set(STORAGE_KEYS.FAVORITES, mockFavorites);
                    return mockFavorites;
                }
                return stored;
            }

            const favorites = await API.getFavorites();
            return Array.isArray(favorites) ? favorites : [];
        } catch (error) {
            console.error('Error fetching favorites:', error);
            Utils.showNotification('Failed to load favorites', 'error');
            return [];
        }
    }

    // Add item to favorites
    async addToFavorites(name, price, image) {
        try {
            if (DEV_MODE) {
                const favorites = Storage.get(STORAGE_KEYS.FAVORITES, []);
                if (!favorites.some(item => item.name === name)) {
                    favorites.push({ name, price: parseFloat(price), image, category: 'Menu' });
                    Storage.set(STORAGE_KEYS.FAVORITES, favorites);
                }
            } else {
                await API.addFavorite({ name, price, image });
            }
            Utils.showNotification('Added to favorites', 'success');
            return true;
        } catch (error) {
            console.error('addToFavorites error', error);
            Utils.showNotification('Failed to add to favorites', 'error');
            return false;
        }
    }

    // Remove item from favorites
    async removeFromFavorites(name) {
        try {
            if (DEV_MODE) {
                const favorites = Storage.get(STORAGE_KEYS.FAVORITES, []);
                const updatedFavorites = favorites.filter(item => item.name !== name);
                Storage.set(STORAGE_KEYS.FAVORITES, updatedFavorites);
            } else {
                await API.removeFavorite(name);
            }
            Utils.showNotification('Removed from favorites', 'success');
            return true;
        } catch (error) {
            console.error('removeFromFavorites error', error);
            Utils.showNotification('Failed to remove from favorites', 'error');
            return false;
        }
    }

    // Check if item is in favorites
    async isFavorite(name) {
        const favorites = await this.getFavorites();
        return favorites.some(item => item.name === name);
    }

    // Toggle favorite status
    async toggleFavorite(name, price, image) {
        const isFav = await this.isFavorite(name);
        if (isFav) {
            return await this.removeFromFavorites(name);
        } else {
            return await this.addToFavorites(name, price, image);
        }
    }
}

export { Favorites };
