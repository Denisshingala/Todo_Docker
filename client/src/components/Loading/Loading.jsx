import React from 'react'
import styles from './Loading.module.css';

const Loading = () => {
    return (
        <div className={styles.loaderContainer}>
            <div className={styles.wrapper}>
                <div className={styles.loaderOuter}>
                    <div className={styles.loaderInner}>
                        <i className="bi bi-three-dots"></i>
                    </div>
                </div>
                <h1><span>LOADING</span></h1>
            </div>
        </div>
    )
}

export default Loading