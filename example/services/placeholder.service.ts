import {ApiServiceInterface, StoreServiceInterface} from "react-miniverse";

export default class PlaceholderService {

    constructor(
        private api: ApiServiceInterface,
        private store: StoreServiceInterface,
    ) {
    }

    public getUsers() {
        return this.store.cache('github', 'users', undefined, this.api.get('https://jsonplaceholder.typicode.com/users'));
    }

    public getPosts() {
        return this.store.cache('github', 'posts', undefined, this.api.get('https://jsonplaceholder.typicode.com/posts'));
    }
}