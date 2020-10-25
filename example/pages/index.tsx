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
     * If the cold value is already set return the value and subscribe for changes
     *
     */
    const githubUsers = useColdOrLoad(placeholderService.getUsers());

    /**
     * Subscribe to the observable that contains the posts.
     *
     * Return the cold value and subscribe for any changes
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
                        {(() => (githubUsers || []).map((user: any) => (
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

    await services.placeholderService.getPosts().toPromise();

    return {};
};

export default Home;
