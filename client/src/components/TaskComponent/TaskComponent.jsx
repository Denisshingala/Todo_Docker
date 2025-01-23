import React from 'react'
import styles from './TaskComponent.module.css'

const TaskComponent = ({ task, completeTask, removeTask }) => {
    return (
        <div className="flex flex-col lg:flex-row md:flex-row justify-between items-start" id={`task-${task.id}`}>
            <div className={styles.taskBody}>
                <h5 className={`font-bold ${task.status === -1 ? "line-through" : ""}`}>{task.title}</h5>
                <p className={`text-sm text-gray-400 w-100 text-wrap ${task.status === -1 ? "line-through" : ""}`}>{task.description}</p>
            </div>
            <div className="flex mt-1 lg:m-0 md:m-0 items-center space-x-2">
                <button onClick={() => completeTask(task.id)} className="px-2 py-1 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-colors duration-300">
                    <i className={task.status === -1 ? "fa-solid fa-minus" : "fas fa-check"}></i>
                </button>
                <button onClick={() => removeTask(task.id)} className="px-2 py-1 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors duration-300">
                    <i className="fas fa-trash"></i>
                </button>
            </div>
        </div>
    )
}

export default TaskComponent