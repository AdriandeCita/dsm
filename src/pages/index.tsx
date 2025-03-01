import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { DSMProvider } from "../context/dsmEditor";
import ComponentsList from "../components/componentList";
import SortingKeysList from "../components/sortingKeysList";
import Matrix from "../components/matrix";
import MatrixControls from "../components/matrixControls";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
      <Head>
        <title>DSM (Design Structure Matrix) online editor</title>
        <meta name="description" content="Create, modify, play with your DSM online!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}>
        <header>DSM editor</header>
        <main className={styles.main}>
          <DSMProvider>
            <MatrixControls />
            <div
              className="dsmContainer"
              style={{
                display: "flex",
              }}
            >
              {/* <SortingKeysList /> */}
              <ComponentsList />
              <Matrix />
            </div>
          </DSMProvider>
        </main>
        <footer className={styles.footer}>
          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
            Learn
          </a>
        </footer>
      </div>
    </>
  );
}
