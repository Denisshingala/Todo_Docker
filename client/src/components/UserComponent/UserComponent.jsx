import React, { useContext, useEffect, useState } from 'react'
import styles from './UserComponent.module.css';
import $ from 'jquery';
import TaskComponent from '../TaskComponent/TaskComponent';
import axios from 'axios';
import Loading from '../Loading/Loading';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const UserComponent = () => {
    const { isAuthenticated } = useContext(AuthContext);

    // to-do form data
    const [newForm, fillNewForm] = useState({
        title: "",
        desc: ""
    });

    // to-do list data
    const [data, setData] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const getAllDetails = async () => {
            setLoading(true);
            const [taskListResponse, userDetailsResponse] = await axios.all([
                await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/get-todo-list`),
                await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/get-details`)
            ]).catch((error) => {
                console.error(error);
            }).finally(() => {
                setLoading(false);
            });

            if (taskListResponse.data.status === 200) {
                setData(taskListResponse.data.tasks);
            } else {
                console.error(taskListResponse.data.message);
            }

            if (userDetailsResponse.data.status === 200) {
                setUser(userDetailsResponse.data.user);
            } else {
                console.error(userDetailsResponse.data.message);
            }
        }

        if(isAuthenticated) {
            getAllDetails();
        }
    }, [isAuthenticated])

    // add new task
    const addTask = async (event) => {
        event.preventDefault();

        setIsSubmitted(true);
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/add-todo`, newForm)
            .then((response) => {
                if (response.data.status) {
                    closeModal();
                    setData((data) => ([...data, JSON.parse(response.data.task)]));
                } else {
                    console.log(response.data.message);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setIsSubmitted(false);
            });
    }

    // add new task
    const completeTask = async (id) => {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/change-status/${id}`)
            .then((response) => {
                if (response.data.status === 200) {
                    let task = JSON.parse(response.data.task);
                    setData((oldData) => oldData.map((data) => task.id === data.id ? { ...data, status: task.status } : data));
                } else {
                    console.log(response.data.message);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
            });
    }

    const removeTask = async (id) => {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/remove-todo/${id}`)
            .then((response) => {
                if (response.data.status === 200) {
                    setData((oldData) => oldData.filter((data) => id !== data.id));
                } else {
                    console.log(response.data.message);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
            });
    }

    // open model to fill the to-do form
    const openModal = () => {
        $("#newTaskModal").addClass(styles.active).show();
    }

    const closeModal = () => {
        fillNewForm({ title: "", desc: "" });
        $("#newTaskModal").removeClass(styles.active).hide();
    }
    const setValue = (e) => {
        const { name, value } = e.target;
        fillNewForm((newForm) => ({ ...newForm, [name]: value }));
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="bg-zinc-950 text-white min-h-screen">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="grid lg:grid-cols-8 gap-8">
                    <div className="lg:col-span-3">
                        <div className={`bg-zinc-800/45 rounded-xl p-6 shadow-lg border border-purple-500/20 ${styles.container}`}>
                            <div className="flex flex-col items-center">
                                <div
                                    className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                                    <img src="/images/coder.png"
                                        className="rounded-full bg-cover border-2 border-purple-400" alt='Profile pic' />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">
                                    Welcome, <span id="playerName" className="text-purple-400">{user.username ?? ""}</span>
                                </h2>

                                <Link to="/logout"
                                    className="bg-gradient-to-r w-full from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-center px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105">
                                    Log out
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className={`bg-[#111] rounded-xl p-4 lg:p-6 shadow-lg border border-purple-500/20 ${styles.container}`}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Active Quests</h2>
                                <button onClick={openModal}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105">
                                    <i className="fas fa-plus mr-2"></i> New Quest
                                </button>
                            </div>

                            <div id="taskList" className="space-y-4 h-[480px] max-h-full overflow-y-auto pr-2">
                                {
                                    data.length ?
                                        data.map((task, index) => <TaskComponent task={task} key={index} completeTask={completeTask} removeTask={removeTask} />) :
                                        <div className='text-center text-secondary w-100 h-100 d-flex justify-content-center align-items-center f-5-m'>No any list found!</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="newTaskModal" className={styles.modal}>
                <div className={`${styles.modalContent} bg-zinc-800`}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">New Quest</h3>
                        <button onClick={closeModal}
                            className="text-gray-400 hover:text-white transition-colors">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <form id="newTaskForm" onSubmit={addTask}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Quest Title</label>
                            <input type="text" id="taskTitle" name='title' value={newForm.title} onChange={setValue} required
                                className="w-full bg-zinc-700 rounded-lg p-2 text-white border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <textarea id="taskDescription" name='desc' value={newForm.desc} onChange={setValue} rows="3"
                                className="w-full bg-zinc-700 rounded-lg p-2 text-white border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300"></textarea>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button type="button" onClick={closeModal}
                                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-300">
                                Cancel
                            </button>
                            <button type="submit"
                                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105" disabled={isSubmitted ? true : undefined}>
                                Create Quest
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UserComponent