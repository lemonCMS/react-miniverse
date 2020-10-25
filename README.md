# react-miniverse

What is ``react-miniverse``? It is a simple state manager. 
It can be used to fetch data, cache the data and update all components that are subscribed to the resource.

You can also use ``react-miniverse`` to share the state between components.

Works great with ``nextjs`` share state between the server and client.

21K minified or only 5.4K gzipped.

#Why did you create this?
After setting up Nextjs with redux and redux-saga i was really not looking forward creating the stores and sagas.
Most of the time a state manager is overkill for just fetching and displaying a resource and forget all about it.
The work in setting up all those stores over and over again.

I wanted something simple as in "Hey give me that data" and not having to think about the state of said data.
 - Not loaded? I will load it for you and will keep updated with new data. 
 This is very useful for remembering and sharing login state.
- Is loaded? I will give you what i got and will keep you updated with new data.
- Share state between Server and Client? No problem.

#Installation

npm
``npm install react-miniverse``

yarn
``yarn add react-miniverse``

## nextjs

Take a look at the example folder. 
The example contains loading clientside only and loading of data trough the server or client.


#step 1

Inject the services into our application. We will use context to make the services available throughout the site.

Create a file called ```AppContext.tsx```.  This file contains a simple setup to create the context

```tsx
import * as React from 'react';
import {
    ApiServiceInterface,
    CookiesServiceInterface,
    StoreServiceInterface
} from "react-miniverse";
import PlaceholderService from "../services/github.service";

export interface AppContextInterface {
    // ApiService uses Axios, 
    // You can build your own apiService class 
    // containing your favorite HTTP request library
    apiInstance: ApiServiceInterface;
    // Only need when you are using cookies
    cookiesService: CookiesServiceInterface;
    // Where the "magic" happens, not really.
    storeService: StoreServiceInterface;
    // Below you can put the interfaces for you services
    githubService: PlaceholderService;

    [key: string]: any;
}

const AppContext = React.createContext<any>({});

// Decorator to pass context as props to you class
export function withAppContext<T>(Component: React.ComponentType<T>) {
    return (props: any) => {
        return (<AppContext.Consumer>{(context) => (<Component context={context} {...props} />)}</AppContext.Consumer>);
    };
}

export const AppProvider = AppContext.Provider;
export default AppContext;
```

### Create your service.

```src/services/placeholder.service```

```ts
import {ApiServiceInterface, StoreServiceInterface} from "react-miniverse";

export default class PlaceholderService {

    constructor(
        private api: ApiServiceInterface,
        private store: StoreServiceInterface,
    ) {
    }

    public getUsers() {
        return this.store.cache(
            'placeholder', // name of the service e.g. 
            'users', // name of the resource e.g. users
            undefined, // parameters e.q. {page: 1}
            // Observable of the request, with a pipe(map(result) => result.data) to return only the json response.
            this.api.get('https://jsonplaceholder.typicode.com/users') 
        );
    }

    public getPosts() {
        return this.store.cache(
            'placeholder', // name of the service e.g. 
            'posts', // name of the resource e.g. users
            undefined, // parameters e.q. {page: 1}
            // Observable of the request, with a pipe(map(result) => result.data) to return only the json response.
            this.api.get('https://jsonplaceholder.typicode.com/posts') 
        );
    }
}
```

Now that the service is created lets put the all together.


Open up ``./src/pages/_app.tsx``. Here we will construct the services export data from the store and import it for the client re-hydration.

```tsx
import '../styles/globals.css'
import {ApiService, CookiesService, StoreService} from "react-miniverse";
import PlaceholderService from "../services/placeholder.service";
import React from 'react';
import {AppProvider} from "../Components/AppContext";

/**
* Create a function that can be called construction all necessary services.
* Because nodejs keeps the application in memory you need to be really careful
* not sharing state between different instances of the application.
*/
function initServices() {
    const cookiesService = new CookiesService();
    const apiService = new ApiService(cookiesService);
    const storeService = new StoreService();
    const placeholderService = new PlaceholderService(apiService, storeService);

    return {
        cookiesService,
        apiService,
        storeService,
        placeholderService
    }
}

/*
* This will be calles only once first time the application loads on the serverside.
* Every client get its own new globalServices.
* 
* When rendering on the server, initServices() will get called every request 
* to make sure everybody gets its own services.
*/
let globalServices = initServices();


function MyApp({Component, pageProps, _store}: any) {
    
    /*
    * We are running in the browser so now we can import the store,
    * The import function will check if the store has had been loaded.
    * If so it will not load again preventing loss of state when navigation between pages.
    */
    if (typeof window !== 'undefined') {
        globalServices.storeService.import(_store);
    }

    /**
    *  Wrap the app with the AppProvider containing the services.
    **/ 
    return (
        <AppProvider value={{...globalServices}}>
            <Component {...pageProps} />
        </AppProvider>
    );
}

MyApp.getInitialProps = async ({Component, ctx}: any) => {

    const {req} = ctx;

    /**
    * Within getInitialProps on the server make sure a clean service is used.
    * In the browser use the existing one.
    */
    let services;
    if (req) {
        // Create a new services.
        services = initServices();
        // Load the cookiesService with the request object.
        services.cookiesService.withReq(req);
        // Set globalServices this way it can be provided to the AppContext with the cookies from the request.
        // Not perse necessary when you don't use cookies.
        globalServices = services;
    } else {
        // On the client just use the existing object.
        services = globalServices;
    }

    // Run the getInitialProps from the page.
    // Pass the service to the Component so they can be used in the pages.
    let pageProps = {};
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps({...ctx, services});
    }

    // After getInitialProps has finished export the store so it can get passed to the client. 
    let _store = {};
    await services.storeService.export().then((data) => _store = data);

    return {_store, pageProps};

}

export default MyApp
```

### index.tsx
Open up your ``index.tsx`` or any other page and start loading some data.

```tsx
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {useColdOrHot, useColdOrLoad} from "react-miniverse";
import {useContext} from "react";
import AppContext, {AppContextInterface} from "../Components/AppContext";

function Home() {
    const {placeholderService} = useContext<AppContextInterface>(AppContext);

    /**
     * Subscribe to the observable that contains the users.
     *
     * Return the cold value if that value is undefined load the resource
     * If the cold value is already set return that value and subscribe for future changes
     *
     */
    const users = useColdOrLoad(placeholderService.getUsers());

    /**
     * Subscribe to the observable that contains the posts.
     *
     * Return the cold value and subscribe for future changes
     *
     */
    const posts = useColdOrHot(placeholderService.getPosts());


    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Welcome to
                    <a href="https://github.com/lemoncms/react-miniverse">ReactMiniverse.js!</a>
                </h1>

                <div>
                    <h2>Load Client side only:</h2>
                    <table>
                        <thead>
                            <th>Username</th>
                        </thead>
                        {(() => (users || []).map((user: any) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                            </tr>
                        )))()}
                    </table>
                </div>

                <div>
                    <h2>Load on client and server:</h2>
                    <table>
                        <thead>
                            <th>Title</th>
                        </thead>
                        {(() => (posts || []).map((post: any) => (
                            <tr key={post.id}>
                                <td>{post.title}</td>
                            </tr>
                        )))()}
                    </table>
                </div>
            </main>
        </div>
    )
}

Home.getInitialProps = async ({services}: { services: AppContextInterface }) => {
    // Servcerside data loading 
    await services.githubService.getPosts().toPromise();

    return {};
};

export default Home;

```


# Done
You are all setup. There is much more to it so please take a look at the sourcecode.

#Contributing
Please do, merge request are welcome.

- Update Readme
- Create tests


Happy coding!




