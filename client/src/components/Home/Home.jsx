import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Home.module.css'

const Home = () => {
    const year = new Date().getFullYear();

    return (
        <>
            <header className="d-flex justify-content-center align-items-center bg__primary">
                <nav className="navbar">
                    <div className={`${styles.heading} text-white my-1`}>Turn Your To-Dos Into Dones</div>
                </nav>
            </header>

            <section className="bg-light d-flex justify-content-center align-items-center text-center">
                <div className={styles.header}>
                    <h1 className="text-black">Organize Your Tasks Efficiently</h1>
                    <p className="text-black">Boost productivity with our intuitive and powerful To-Do List application.</p>
                    <Link to="/register" className="btn text-white btn__primary">Get Started Now</Link>
                </div>
            </section>

            <section className={styles.features}>
                <div className={`${styles.feature} bg__primary`}>
                    <i className="bi bi-card-checklist display-6 mb-3"></i>
                    <h2>Plan Your Day</h2>
                    <p>Create, organize, and prioritize tasks to achieve your daily goals.</p>
                </div>
                <div className={`${styles.feature} bg__primary`}>
                    <i className="bi bi-alarm display-6 mb-3"></i>
                    <h2>Set Reminders</h2>
                    <p>Never miss a task with customizable reminders and notifications.</p>
                </div>
                <div className={`${styles.feature} bg__primary`}>
                    <i className="bi bi-cloud-check display-6 mb-3"></i>
                    <h2>Access Anywhere</h2>
                    <p>Track and update your tasks on the go with our mobile-friendly app.</p>
                </div>
            </section>

            <footer className="text-center">
                <p>&copy; { year } To-Do List App. All rights reserved.</p>
            </footer>
        </>
    )
}

export default Home