import type { NextPage } from "next";
import styles from "../styles/Home.module.scss";

import Meta from "../components/Meta";
import Meeseeks from "../components/Meeseeks";
import GitHubCorner from "../components/GitHubCorner";

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <Meta />

            <main className={styles.main}>
                <Meeseeks />
                <h1 className={styles.heading}>Welcome to Meeseeks!</h1>

                <p className={styles.description}>
                    Meeseeks are creatures who are created to serve a singular
                    purpose for which they will go to any length to fulfill.
                    After they serve their purpose, they expire and vanish into
                    the air.
                </p>
            </main>
            <GitHubCorner href={"https://github.com/ekqt"} />
        </div>
    );
};

export default Home;
